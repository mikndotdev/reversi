import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      '@': '/src',
      ".prisma/client/":"./node_modules/.prisma/client/index.js",
      ".prisma/client/default": "./node_modules/.prisma/client/default.js"
    },
  }
});
