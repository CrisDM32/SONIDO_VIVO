# Sonido Vivo · Backend

API REST de catálogo, autenticación y administración de usuarios y productos. Utiliza Spring Boot, Java 21 y PostgreSQL 16. Ejecuta los comandos de este archivo desde la carpeta `backend`.

## Levantar la API y la base de datos

Con Docker Desktop en modo de contenedores Linux, o Docker Engine con Compose en Linux, ejecuta:

```sh
docker compose -p backend up -d --build
docker compose -p backend ps
```

Los puertos locales 8080 (API) y 5432 (PostgreSQL) deben estar libres. Espera a que los servicios `db` y `backend` aparezcan como `healthy`. Si el arranque falla, consulta los mensajes con `docker compose -p backend logs --tail=100 backend db`.

- Abre [el catálogo](http://localhost:8080/api/v1/productos) para comprobar la conexión con PostgreSQL. La API debe devolver HTTP 200 con una lista JSON.
- Abre [Swagger UI](http://localhost:8080/swagger-ui/index.html) para explorar las operaciones. La especificación está en [OpenAPI](http://localhost:8080/v3/api-docs).
- Para probar una ruta protegida, inicia sesión en `POST /api/v1/auth/login`. En **Authorize**, pega el valor de `token` y ejecuta `GET /api/v1/admin/usuarios` con una cuenta administradora.

En una base local nueva se crea la cuenta `admin@sonidovivo.cl`. La contraseña inicial se toma de `ADMIN_CLAVE` y el valor predeterminado de desarrollo es `admin`. Puedes definir `ADMIN_CLAVE` y `JWT_SECRETO` en el entorno antes del primer arranque. La contraseña de una cuenta existente se conserva en la base. El Compose local admite los orígenes `http://localhost:5173` y `http://localhost:4173` para el frontend.

Para detener los servicios y conservar los datos:

```sh
docker compose -p backend stop
```

## Ejecutar las pruebas con Maven Wrapper

Instala un **JDK 21** y comprueba que `java -version` y `javac -version` muestran la versión esperada. Si utilizas `JAVA_HOME`, debe apuntar al directorio del JDK. El wrapper descarga Maven la primera vez. La descarga de Maven y de las dependencias requiere acceso a internet. Las pruebas utilizan H2 en memoria y pueden ejecutarse con los contenedores apagados.

**Windows · PowerShell**

```powershell
.\mvnw.cmd -v
.\mvnw.cmd test
```

**Linux y macOS**

```sh
./mvnw -v
./mvnw test
```

El wrapper lee la versión de Maven desde `.mvn/wrapper/maven-wrapper.properties`. Al terminar, consulta el resumen de pruebas de Maven o los informes en `target/surefire-reports/`.

Para iniciar la interfaz, sigue el [README del frontend](../frontend/README.md). Para publicar en EC2 con los secretos y el origen web del despliegue, utiliza la [guía de despliegue](../deploy/DESPLIEGUE.md).
