import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import inputPlugin from "@macropygia/vite-plugin-glob-input";
import suidPlugin from "@suid/vite-plugin";

// @ts-expect-error
import handlebars from "vite-plugin-handlebars";
import { resolve } from "node:path";

export default defineConfig({
  root: "./",
  publicDir: "public",
  assetsInclude: ["public/**/*"],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  plugins: [
    solid(),
    suidPlugin(),
    inputPlugin({
      patterns: ["./src/templates/**/*.html","./src/partials/**/*.html"],
    }),
    handlebars({
      partialDirectory: resolve(__dirname, "./src/components"),
    }),
  ],
  css: {
    modules: {
      localsConvention: "dashes",
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
});
