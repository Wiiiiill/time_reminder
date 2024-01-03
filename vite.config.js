import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, "src"),
      // "@pages": resolve(__dirname, "src", "pages"),
      // "@components": resolve(__dirname, "src", "components"),
      // "@stores": resolve(__dirname, "src", "stores"),
      // "@services": resolve(__dirname, "src", "services"),
      // "@utils": resolve(__dirname, "src", "utils"),
    }
  },
  build: {
    //移除生产环境log
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    }
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dev-bms.xinyinhao.net",
        changeOrigin: true,
        ws: true, rewrite: (path) => path.replace(/^\/api/, ''),
      },
      "/db": {
        target: 'http://localhost:5000',
        rewrite: (path) => path.replace(/^\/db/, ''),
      },
    },
  },
}) 