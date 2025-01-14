import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@shadcn/ui': '/node_modules/@shadcn/ui/dist/index.js'

    },
  },
  server: {
    port: 3000,  // Change this to the port you want
  },
   
});
