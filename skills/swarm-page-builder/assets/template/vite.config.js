import { defineConfig } from "vite";

// JSX由Vite内置转换器处理；入口依赖只来自src和npm包。
export default defineConfig({
  base: "./",
  server: { host: "127.0.0.1", port: 8000, strictPort: true },
  preview: { host: "127.0.0.1", port: 8000, strictPort: true },
});
