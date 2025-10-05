import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  server: {
    proxy: {
      '/api/pagos': {
        target: 'http://localhost:3002',
        rewrite: path => path.replace(/^\/api\/pagos/, '/payments'),
        changeOrigin: true
      }
    }
  }
}
