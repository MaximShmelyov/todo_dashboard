import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json-summary", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: ["tests/**", "**/*.test.{ts,tsx}", "**/*.d.ts", ".next/**", "next-env.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
