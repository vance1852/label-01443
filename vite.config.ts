import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => ({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@nexa-ui": resolve(__dirname, "src/components"),
    },
  },
  build:
    mode === "lib"
      ? {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "NexaUI",
            fileName: "nexa-ui",
          },
          rollupOptions: {
            external: ["vue"],
            output: {
              globals: { vue: "Vue" },
            },
          },
        }
      : {},
}));
