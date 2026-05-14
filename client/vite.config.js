// client/vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const GOOGLE_SCRIPT_PATH =
  "/macros/s/AKfycbzzZeLAnePVGOqKZQKQ3f3Ah0I-k-TK07ClpPR4VBxAh5ikGRPaAHsQWZKVNZwLMqe5/exec";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/google": {
        target: "https://script.google.com",
        changeOrigin: true,
        secure: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api\/google/, GOOGLE_SCRIPT_PATH),
      },
    },
  },
});