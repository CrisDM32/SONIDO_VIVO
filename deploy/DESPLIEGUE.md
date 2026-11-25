# Publicar Sonido Vivo en dos EC2 con Amazon Linux 2023

Construirás dos imágenes en tu PC y las publicarás en Docker Hub. La EC2 del frontend descargará la imagen de React con Nginx. La EC2 del backend descargará la de Spring Boot y la imagen oficial de PostgreSQL 16. El navegador usará una sola dirección. Nginx enviará las peticiones a `/api/v1/` hacia la IP privada del backend en el puerto 8080.

## 1. Preparar las EC2 existentes

En **AWS → EC2 → Instancias**, anota el DNS público del frontend y la IPv4 privada del backend. Comprueba que ambas se comuniquen por la VPC y tengan salida para descargar imágenes de Docker Hub. Una instancia en subred privada necesita una ruta de salida, por ejemplo mediante NAT.

Revisa los grupos de seguridad asociados a las instancias. Usa un grupo distinto para cada máquina. [Reglas de grupos de seguridad de EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html)

| Instancia | Entrada TCP | Origen |
| --- | --- | --- |
| Cada EC2 con acceso público por EC2 Instance Connect | 22 (SSH) | Lista de prefijos de AWS `com.amazonaws.REGION.ec2-instance-connect` para su región |
| Backend | 8080 (API) | El ID del grupo de seguridad del frontend |

Para la primera prueba usaremos la terminal del navegador. PostgreSQL queda accesible dentro de la red Docker del backend. El acceso público por HTTPS se explica en el paso 8.

## 2. Abrir una terminal por instancia desde la consola AWS

Si ya tienes abierta la terminal donde consultaste `PRETTY_NAME`, puedes seguir desde allí. Para abrir otra, entra en **EC2 → Instancias**, selecciona la máquina y pulsa **Conectar**.

- Con IPv4 pública y una ruta al Internet Gateway, selecciona **EC2 Instance Connect**, elige conexión por IP pública y usa el usuario `ec2-user`. AWS envía una clave temporal. Comprueba la regla 22 del paso 1 y que tu identidad IAM tenga permiso para usar Instance Connect. [Requisitos de EC2 Instance Connect](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-prerequisites.html)
- Si la máquina es privada, usa **Session Manager** si figura conectada. Requiere SSM Agent activo, permisos de Systems Manager para la instancia, conectividad HTTPS al servicio y permisos para iniciar sesión. Este método funciona sin abrir el puerto 22. Otra posibilidad es elegir **EC2 Instance Connect Endpoint** si tu VPC ya dispone de uno con permisos y conectividad hacia la máquina. [Acceso mediante Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html)

Abre una pestaña para el backend y otra para el frontend. Si usas Session Manager y la terminal es `sh`, ejecuta `bash` antes de seguir los bloques de la guía.

## 3. Instalar Docker en ambas EC2

Ejecuta el bloque en **cada terminal de AWS**. Anota por separado el resultado de `uname -m`. Cuando Docker esté activo, `sudo docker version` mostrará tanto el cliente como el servidor. [Docker en Amazon Linux 2023](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/install-docker.html)

```bash
uname -m
sudo dnf install -y docker &&
sudo systemctl enable --now docker &&
sudo docker version
```

Comprueba Compose con el siguiente bloque en ambas EC2. Si falta, descargará el plugin oficial para la arquitectura de esa máquina. Este paso requiere salida HTTPS hacia GitHub. [Instalación del plugin Compose](https://docs.docker.com/compose/install/linux/)

```bash
if ! sudo docker compose version; then
  (
    set -e
    tmp=$(mktemp)
    trap 'rm -f "$tmp"' EXIT
    curl -fL "https://github.com/docker/compose/releases/download/v5.6.0/docker-compose-linux-$(uname -m)" -o "$tmp"
    sudo install -D -m 0755 "$tmp" /usr/local/lib/docker/cli-plugins/docker-compose
  )
fi
sudo docker compose version
```

## 4. Crear y publicar las imágenes desde Windows

En Docker Hub entra a **My Hub → Repositories → Create repository**. Elige tu cuenta u organización y crea `sonidovivo-frontend` y `sonidovivo-backend`. Puedes hacerlos privados. La cuenta que utilices desde tu PC necesita permiso de escritura. [Crear un repositorio en Docker Hub](https://docs.docker.com/docker-hub/repos/create/)

Abre Docker Desktop en modo de contenedores Linux. En una **terminal PowerShell local**, configura el nombre de tu cuenta y una etiqueta para esta versión. Si una EC2 devolvió `x86_64`, usa `linux/amd64` para su imagen. Si devolvió `aarch64`, usa `linux/arm64`. [Plataformas de compilación](https://docs.docker.com/build/building/multi-platform/)

```powershell
cd "$env:USERPROFILE\Desktop\SONIDO_VIVO"
$hub = "tu-usuario-dockerhub"
$tag = "v1"
$frontPlatform = "linux/amd64"
$backPlatform = "linux/amd64"
docker login
docker buildx build --platform $frontPlatform --tag "${hub}/sonidovivo-frontend:${tag}" --push ./frontend
docker buildx build --platform $backPlatform --tag "${hub}/sonidovivo-backend:${tag}" --push ./backend
```

Espera a que ambos comandos terminen correctamente. Comprueba en Docker Hub, en **Tags** de cada repositorio, que aparece `v1`. El frontend usa la ruta relativa `/api/v1` desde el navegador. La dirección del backend se configura al arrancar Nginx.

## 5. Copiar la configuración de despliegue

En PowerShell, desde la raíz del proyecto, copia al portapapeles el Compose del frontend.

```powershell
Get-Content -Raw ./deploy/frontend/compose.yaml | Set-Clipboard
```

En la **terminal AWS del frontend**, ejecuta `cd ~`, luego `cat > sonidovivo.yaml`. Pega el contenido, pulsa **Enter** y después **Ctrl+D** para guardar. Comprueba con `head sonidovivo.yaml` que aparece `name: sonidovivo-web`.

En PowerShell copia ahora el archivo del backend.

```powershell
Get-Content -Raw ./deploy/backend/compose.yaml | Set-Clipboard
```

Repite la operación en la **terminal AWS del backend**. Compara las primeras líneas con el original. Trabaja con el mismo usuario en cada instancia para encontrar los archivos en su directorio personal.

Si elegiste repositorios privados, ejecuta `sudo docker login -u TU_USUARIO_DOCKERHUB` en **ambas EC2**. Introduce un token de lectura cuando lo solicite. Los comandos siguientes usan `sudo` para acceder al mismo contexto de Docker.

## 6. Arrancar PostgreSQL y la API en la EC2 del backend

En la terminal AWS del **backend**, sustituye el usuario de Docker Hub, la etiqueta y la IP privada del backend. Ejecuta este bloque una vez para generar las credenciales. El archivo queda con permisos de lectura y escritura para tu usuario. Guarda una copia protegida. PostgreSQL y la cuenta administradora usan esos valores al inicializar sus datos.

```bash
cd ~
(
  set -eC
  umask 077
  {
    echo 'DOCKERHUB_USER=cristiandm32'
    echo 'IMAGE_TAG=v1'
    echo 'BACKEND_PRIVATE_IP=10.0.143.131'
    echo 'WEB_ORIGIN=http://localhost:8888'
    for key in DB_PASSWORD JWT_SECRETO ADMIN_CLAVE; do
      value=$(openssl rand -hex 32)
      echo "$key=$value"
    done
  } > sonidovivo.env
)
```

Descarga e inicia los contenedores. Usa este Compose de despliegue, que descarga tu imagen publicada.

```bash
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml pull &&
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml up -d
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml ps
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml logs --tail=60 backend
```

Espera a que `db` indique `healthy` y Spring registre `Started`. Prueba `curl -i http://10.0.143.131:8080/api/v1/productos` sustituyendo la IP por la real. Debes obtener HTTP 200 con una lista JSON, que puede estar vacía. PostgreSQL guarda sus datos en un volumen de Docker en esta EC2. Si necesitas datos de tu PC, tendrás que exportarlos e importarlos por separado.

## 7. Arrancar el frontend y comprobar la aplicación

En la terminal AWS del **frontend**, crea este archivo con el mismo usuario y etiqueta de Docker Hub. Usa la **IP privada del backend** que anotaste en el paso 1.

```bash
cd ~
cat > sonidovivo.env <<'EOF'
DOCKERHUB_USER=cristiandm32
IMAGE_TAG=v1
BACKEND_PRIVATE_IP=10.0.143.131
EOF
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml pull &&
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml up -d
curl -I http://localhost/
curl -i http://localhost/api/v1/productos
```

Espera HTTP 200 en ambas peticiones y JSON en la segunda. Si la página carga pero la API devuelve 502 o 504, desde la terminal del **frontend** prueba directamente `curl --connect-timeout 5 http://10.0.1.25:8080/api/v1/productos` con la IP real. Si falla, revisa la regla 8080, la IP y los logs del backend.

Las dos respuestas HTTP 200 permiten comprobar el despliegue desde la terminal. Para probar el inicio de sesión desde tu PC, configura el acceso HTTPS del paso 8 y abre tu dominio en el navegador. En una base nueva, la cuenta es `admin@sonidovivo.cl`. Su contraseña es el valor de `ADMIN_CLAVE` guardado en `~/sonidovivo.env` del backend. Puedes consultarlo allí con `grep '^ADMIN_CLAVE=' ~/sonidovivo.env` en una terminal privada. La aplicación conserva la contraseña de una cuenta ya creada.

## 8. Publicar con dominio y HTTPS

Para abrir la aplicación desde el navegador, una opción en AWS es crear un Application Load Balancer público. Configura un certificado de ACM para tu dominio, un listener HTTPS 443 y un grupo de destino HTTP 80 que registre la EC2 frontend. Usa `/` como ruta de comprobación. Permite TCP 443 hacia el balanceador y TCP 80 desde el grupo de seguridad del balanceador hacia la EC2 frontend. Apunta el DNS del dominio al balanceador. En `~/sonidovivo.env` del backend cambia `WEB_ORIGIN` al origen exacto, por ejemplo `https://tienda.ejemplo.cl`, y repite el comando `up -d` del paso 6. Comprueba el catálogo y el login en el dominio. [Listener HTTPS en AWS](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html)

Para actualizar, publica las imágenes con una etiqueta nueva, cambia `IMAGE_TAG` en cada EC2 y repite `pull` y `up -d`, empezando por el backend. Conserva los secretos y haz una copia de PostgreSQL antes de actualizar.
