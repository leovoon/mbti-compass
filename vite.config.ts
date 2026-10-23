import { defineConfig } from "vite-plus";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  build: {
    target: "es2022",
    outDir: "dist",
    assetsInlineLimit: 0,
    // One HTML entry per page so each page's CSS is linked in <head> at build
    // time. Choosing the page with a dynamic import() hid the CSS in a lazy
    // chunk and the page flashed unstyled until JS loaded.
    rollupOptions: {
      input: { main: "index.html", arena: "arena.html" },
    },
  },
});
