import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import inputPlugin from "@macropygia/vite-plugin-glob-input";
import suidPlugin from "@suid/vite-plugin";
import { resolve } from "node:path";
// @ts-expect-error
import handlebars from "vite-plugin-handlebars";

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
			patterns: ["./src/templates/**/*.html", "./src/components/**/*.html"],
		}),
		handlebars({
			partialDirectory: resolve(__dirname, "./src/partials"),
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
			"@partial": resolve(__dirname, "./src/partials"),
		},
	},
});
