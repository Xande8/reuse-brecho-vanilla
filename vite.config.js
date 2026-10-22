import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Template Vanilla: sem React, Vue ou Angular.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(root, 'index.html'),
        catalogo: resolve(root, 'catalogo.html'),
        admin: resolve(root, 'admin.html'),
      },
    },
  },
});
