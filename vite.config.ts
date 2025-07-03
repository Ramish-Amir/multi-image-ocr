import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   allowedHosts: [
  //     "9364-2605-8d80-6a28-794a-2014-bdae-7dcb-9961.ngrok-free.app",
  //   ],
  // },
});
