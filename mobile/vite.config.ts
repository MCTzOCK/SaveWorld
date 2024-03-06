import { fileURLToPath, URL } from "node:url";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@saveworld/api-js": fileURLToPath(
        new URL("./src/api-js-embedded/src", import.meta.url),
      ),
    },
  },
});
