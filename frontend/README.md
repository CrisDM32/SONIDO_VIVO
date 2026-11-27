# Sonido Vivo · Frontend

Interfaz de la tienda y del panel de administración, desarrollada con React y Vite. Ejecuta los comandos de este archivo desde la carpeta `frontend`.

## Desarrollo local

1. Levanta la API y PostgreSQL siguiendo el [README del backend](../backend/README.md). Comprueba que [el catálogo de la API](http://localhost:8080/api/v1/productos) devuelva una lista JSON.
2. Instala Node.js **24.15 o posterior de la serie 24**, con npm. Comprueba las versiones con `node -v` y `npm -v`.
3. Instala las versiones del archivo de bloqueo e inicia Vite:

   ```sh
   npm ci
   npm run dev -- --port 5173 --strictPort
   ```

4. Abre [el catálogo](http://localhost:5173/productos). Al guardar cambios en React, Vite actualiza la página. Para detenerlo, pulsa Ctrl+C.

En PowerShell puedes escribir `npm.cmd` en lugar de `npm`. Si ninguno se reconoce después de instalar Node, vuelve a abrir la terminal de VS Code. La siguiente opción permite probar la tienda con Docker Desktop.

Por defecto, Vite consulta `http://localhost:8080/api/v1`. Para usar otra API, crea `.env.local` en esta carpeta, define `VITE_API_URL` con la dirección completa, incluido `/api/v1`, y reinicia Vite. El backend debe permitir el origen del navegador en su configuración CORS.

## Vista previa con Docker

Con Docker Desktop en modo de contenedores Linux y el backend iniciado con el proyecto Compose `backend`, ejecuta:

```sh
docker build -t sonidovivo-frontend:local .
docker run --rm --name sonidovivo-web-local --network backend_default -p 127.0.0.1:4173:80 -e BACKEND_PRIVATE_IP=backend sonidovivo-frontend:local
```

Abre [la tienda compilada](http://localhost:4173/productos). Nginx sirve React y reenvía las llamadas a `/api/v1` al servicio `backend`. Puedes comprobar ambas partes abriendo [la API a través de Nginx](http://localhost:4173/api/v1/productos). Pulsa Ctrl+C para detener esta vista previa. Tras editar el código, repite los dos comandos para ver la nueva compilación.

## Pruebas y compilación

Después de `npm ci`, ejecuta cada comando por separado:

```sh
npm test
npm run build
```

Vitest muestra el resultado de cada prueba. Las pruebas de páginas simulan las respuestas HTTP y pueden ejecutarse con la API apagada. Vite genera la compilación en `dist/`. Para el despliegue del frontend y el backend en EC2, consulta la [guía de despliegue](../deploy/DESPLIEGUE.md).
