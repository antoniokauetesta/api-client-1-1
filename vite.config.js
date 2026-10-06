import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  server: {
    port: 5173,
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url === "/") {
          response.writeHead(302, { Location: "/clientes" });
          response.end();
          return;
        }

        next();
      });
    },
    proxy: {
      "/pessoas": "http://localhost:3000",
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
