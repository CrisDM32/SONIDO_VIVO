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
    echo 'DOCKERHUB_USER=tu-usuario-dockerhub'
    echo 'IMAGE_TAG=v1'
    echo 'BACKEND_PRIVATE_IP=10.0.1.25'
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

Espera a que `db` indique `healthy` y Spring registre `Started`. Prueba `curl -i http://10.0.1.25:8080/api/v1/productos` sustituyendo la IP por la real. Debes obtener HTTP 200 con una lista JSON, que puede estar vacía. PostgreSQL guarda sus datos en un volumen de Docker en esta EC2. Si necesitas datos de tu PC, tendrás que exportarlos e importarlos por separado.

## 7. Arrancar el frontend y comprobar la aplicación

En la terminal AWS del **frontend**, crea este archivo con el mismo usuario y etiqueta de Docker Hub. Usa la **IP privada del backend** que anotaste en el paso 1.

```bash
cd ~
cat > sonidovivo.env <<'EOF'
DOCKERHUB_USER=cristiandm32
IMAGE_TAG=v1
BACKEND_PRIVATE_IP=10.0.1.25
EOF
```

Si la terminal muestra `>` después de pegar las variables, escribe `EOF` solo en una línea, sin espacios, y pulsa Enter. Antes de continuar, comprueba con `head -n 1 sonidovivo.yaml` que estás en la EC2 del frontend y aparece `name: sonidovivo-web`.

```bash
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml pull &&
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml up -d
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml ps -a
curl --max-time 10 -I http://127.0.0.1/
curl --max-time 10 -i http://127.0.0.1/api/v1/productos
```

Espera HTTP 200 en ambas peticiones y JSON en la segunda. Si la página carga pero la API devuelve 502 o 504, desde la terminal del **frontend** prueba directamente `curl --connect-timeout 5 http://10.0.1.25:8080/api/v1/productos` con la IP real. Si falla, revisa la regla 8080, la IP y los logs del backend.

Las dos respuestas HTTP 200 permiten comprobar el despliegue desde la terminal. Para probar el inicio de sesión desde tu PC, configura el acceso HTTPS del paso 8 y abre tu dominio en el navegador. En una base nueva, la cuenta es `admin@sonidovivo.cl`. Su contraseña es el valor de `ADMIN_CLAVE` guardado en `~/sonidovivo.env` del backend. Puedes consultarlo allí con `grep '^ADMIN_CLAVE=' ~/sonidovivo.env` en una terminal privada. La aplicación conserva la contraseña de una cuenta ya creada.

## 8. Publicar con dominio y HTTPS

El navegador se conectará por HTTPS al balanceador público. El balanceador enviará HTTP al puerto 80 del frontend y Nginx seguirá enviando las llamadas de la API al backend. Puedes utilizar tus imágenes actuales.

### 8.1. Elegir el dominio y revisar la red

Elige un nombre dentro de un dominio cuyos registros DNS puedas editar. Los ejemplos usan `tienda.ejemplo.cl`; sustitúyelo por tu nombre real. Si solo quieres ver la página por la IP pública para una prueba, puedes continuar con el acceso HTTP del frontend. Para el despliegue con HTTPS de esta sección necesitarás el dominio. El balanceador tiene cargos mientras esté aprovisionado. [Precios de Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/pricing/)

En **EC2 → Instancias**, selecciona el frontend y anota región, VPC, zona de disponibilidad e ID de instancia. Para el balanceador necesitas dos subredes públicas de esa VPC en zonas distintas, incluida la zona del frontend. En **VPC → Subredes → Tabla de enrutamiento**, verifica en cada una la ruta `0.0.0.0/0` hacia un Internet Gateway. AWS pide al menos una subred /27 o mayor en cada zona y ocho direcciones libres por subred. [Subredes de un ALB](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#subnets-load-balancer)

### 8.2. Solicitar el certificado

1. Abre **AWS Certificate Manager (ACM)** en la misma región donde crearás el balanceador.
2. Elige **Solicitar certificado → Certificado público**. Escribe el dominio completo, por ejemplo `tienda.ejemplo.cl`, selecciona **Validación DNS** y solicita el certificado.
3. Abre el certificado. En **Dominios** verás un registro **CNAME** con un nombre y un valor de validación. Si Route 53 administra tu DNS público, usa **Crear registros en Route 53**. Si lo administra otro proveedor, copia allí el CNAME. Algunos proveedores agregan el dominio al nombre automáticamente. Comprueba que el nombre final coincida con el de ACM.
4. Espera el estado **Issued / Emitido**. Conserva el registro de validación para las renovaciones. [Validación DNS en ACM](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html)

### 8.3. Preparar los grupos de seguridad

En **EC2 → Grupos de seguridad**, crea `sg-sonidovivo-alb` en la VPC del frontend. Configura estas reglas. Para agregar el grupo como origen o destino, selecciona su ID `sg-...` en la consola.

| Grupo | Dirección | Puerto TCP | Origen o destino |
| --- | --- | --- | --- |
| Balanceador | Entrada | 443 | `0.0.0.0/0` para HTTPS público por IPv4 |
| Balanceador | Entrada | 80 | `0.0.0.0/0` si configurarás la redirección HTTP |
| Frontend | Entrada | 80 | Grupo del balanceador |
| Balanceador | Salida | 80 | Grupo del frontend, si restringiste la salida |

El acceso del frontend al backend continúa por TCP 8080 usando la regla del paso 1. Si habilitaste HTTP directo para tu IP durante las pruebas, puedes retirar esa regla después de verificar HTTPS. Conserva la regla de entrada desde el grupo del balanceador.

### 8.4. Crear el grupo de destino

1. En **EC2 → Grupos de destino (Target Groups) → Crear grupo**, selecciona **Instancias**.
2. Usa el nombre `tg-sonidovivo-front`, protocolo **HTTP**, puerto **80** y la VPC del frontend.
3. En la comprobación de estado usa **HTTP**, ruta `/`, puerto de tráfico y código de éxito **200**.
4. Pulsa **Siguiente**, selecciona la instancia del **frontend**, confirma puerto **80**, pulsa **Incluir como pendiente** y luego **Crear grupo de destino**. El balanceador usará este grupo para llegar a Nginx.

### 8.5. Crear el balanceador público

1. En **EC2 → Balanceadores de carga → Crear**, elige **Application Load Balancer**. Usa el nombre `alb-sonidovivo`, esquema **Internet-facing** y tipo de dirección **IPv4**.
2. En **Network mapping** selecciona la VPC y las dos subredes públicas del paso 8.1. En **Security groups** selecciona `sg-sonidovivo-alb`.
3. Configura el listener **HTTPS 443**. Como acción predeterminada selecciona **Forward to** y el grupo `tg-sonidovivo-front`. En **Default SSL/TLS certificate**, selecciona el certificado emitido por ACM para tu dominio.
4. Para redirigir visitas HTTP, configura también un listener **HTTP 80**. Selecciona **Redirect to URL**, protocolo **HTTPS**, puerto **443**, código **301**, conservando host, ruta y consulta. Puedes hacerlo después de crear el balanceador desde **Listeners and rules**.
5. Crea el balanceador. Espera a que muestre **Active** y copia su **DNS name**. En **Target Groups → tg-sonidovivo-front → Targets**, espera el estado **Healthy**. Si figura **Unhealthy**, revisa la regla 80 desde el grupo del balanceador y ejecuta `curl -I http://127.0.0.1/` en el frontend. [Crear un Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html)

### 8.6. Apuntar el dominio al balanceador

En el proveedor que administra el DNS público de tu dominio, crea el registro que dirigirá las visitas al sitio. Este registro es adicional al CNAME de validación de ACM.

- **Con Route 53:** abre **Zonas alojadas → tu zona pública → Crear registro**. Para el ejemplo, nombre `tienda`, tipo **A**, activa **Alias**, elige **Alias to Application and Classic Load Balancer**, selecciona la región y el ALB creado.
- **Con otro proveedor DNS:** para el subdominio `tienda`, crea un **CNAME** cuyo destino sea el **DNS name del balanceador**, sin protocolo ni ruta. Si usas el dominio raíz, utiliza un alias de raíz compatible con tu proveedor o utiliza un subdominio.

Desde PowerShell comprueba la resolución con `Resolve-DnsName tienda.ejemplo.cl`. [Enrutar un dominio al balanceador](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html)

### 8.7. Configurar la URL pública en el backend

En la terminal AWS de la **EC2 backend**, abre `cd ~` y luego `nano sonidovivo.env` (o `vi sonidovivo.env`). Cambia únicamente la línea `WEB_ORIGIN` al origen HTTPS exacto del navegador, sin ruta ni barra final.

```dotenv
WEB_ORIGIN=https://tienda.ejemplo.cl
```

En nano guarda con **Ctrl+O**, **Enter** y sal con **Ctrl+X**. Aplica el cambio:

```bash
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml up -d backend
sudo docker compose --env-file sonidovivo.env -f sonidovivo.yaml ps
```

### 8.8. Probar desde tu PC

En PowerShell sustituye el dominio y ejecuta:

```powershell
curl.exe -I https://tienda.ejemplo.cl/
curl.exe -i https://tienda.ejemplo.cl/api/v1/productos
```

Espera **200** para la página y **200** con JSON para el catálogo. Si activaste la redirección, `curl.exe -I http://tienda.ejemplo.cl/` debe devolver **301** con la dirección HTTPS. Abre el dominio en el navegador, entra al catálogo e inicia sesión. Si el certificado da error, verifica que el nombre que abres coincide con el certificado del listener 443.

## Actualizaciones posteriores

Para actualizar, publica las imágenes con una etiqueta nueva, cambia `IMAGE_TAG` en cada EC2 y repite `pull` y `up -d`, empezando por el backend. Conserva los secretos y haz una copia de PostgreSQL antes de actualizar.
