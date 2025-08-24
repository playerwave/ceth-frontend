// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });
// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";
// export default defineConfig({ plugins: [tailwindcss()], base: "/myapp" });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // ✅ กำหนด environment variables
    __DEV__: JSON.stringify(mode === 'development'),
    __PROD__: JSON.stringify(mode === 'production'),
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
}))