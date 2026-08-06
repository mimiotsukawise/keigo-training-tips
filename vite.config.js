import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // Web Preview はルートで表示し、公開ビルドでは GitHub Pages のパスを使う。
  base: command === "serve" ? "/" : "/keigo-training-tips/",
  plugins: [react()],
}));
