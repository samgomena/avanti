import { defineConfig } from "vitest/config";
// @ts-expect-error - No types for @vitejs/plugin-react?? This happened after bumping to 5.1.1
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["tests/**/*", "node_modules/**/*"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    alias: {
      "@/": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
