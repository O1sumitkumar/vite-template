import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173, // Change if needed
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@redux": "/src/redux",
      "@pages": "/src/pages",
      "@layouts": "/src/layouts",
      "@services": "/src/services",
      "@utils": "/src",
      "@assets": "/src/assets",
      "@hooks": "/src/hooks",
      "@styles": "/src/styles",
      "@config": "/src/config",
      "@constants": "/src/constants",
      "@types": "/src/types",
      "@contexts": "/src/contexts",
      "@api": "/src/api",
    },
  },
});
