import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 25000, // Set the global timeout to 10 seconds
    environment: "jsdom", // Set the test environment to 'jsdom'
  },
});
