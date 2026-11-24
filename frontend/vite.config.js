import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El proxy redirige las llamadas que el frontend hace a rutas que empiezan
// con "/api/..." hacia el microservicio Spring Boot correspondiente, como
// si ambos vivieran en el mismo servidor. Gracias a esto, los componentes
// React llaman simplemente a fetch("/api/productos") sin necesitar saber
// la URL ni el puerto real del backend, y no hace falta configurar CORS
// para el desarrollo local.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/auth": "http://localhost:8081",
      "/api/usuarios": "http://localhost:8081",
      "/api/productos": "http://localhost:8082",
    },
  },
});
