import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "mbti-compass",
    compatibilityDate: "2026-10-16",
    observability: { enabled: true },
    assets: {
      notFoundHandling: "single-page-application",
    },
  },
});
