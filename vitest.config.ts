import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      "**/__tests__/*.{test,spec}.?(c|m)[jt]s?(x)",
      "__tests__/*.{test,spec}.?(c|m)[jt]s?(x)",
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    alias: {
      "@/": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
