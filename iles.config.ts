import { defineConfig } from "iles";
import elmPlugin from "vite-plugin-elm";
// @ts-ignore
import content from "@originjs/vite-plugin-content";

export default defineConfig({
  vite: {
    plugins: [elmPlugin(), content()],
  },
});
