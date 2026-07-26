import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Enables React Fast Refresh (HMR that preserves component state),
    // the automatic JSX runtime, and Babel-based transforms for React.
    react(),
  ],

  resolve: {
    alias: {
      // Maps `@/` to `./src/` — must match `paths` in tsconfig.json.
      // Example: import { Button } from '@/components/ui/button'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // Vite default port. Intentionally different from the Express server (5000)
    // so both can run simultaneously in development.
    port: 5173,
    // Proxy all /api/* requests to the Express server.
    // This lets the browser make requests to one origin (localhost:5173) while
    // the Express server handles the actual API work on port 5000.
    // Benefits: no CORS configuration needed during development, and the setup
    // mirrors production where a reverse proxy (Nginx/Caddy) handles routing.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Report bundle size warnings above 500KB.
    // This keeps us aware of accidental large dependencies before they ship.
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor code (node_modules) into a separate chunk.
        // Browsers can cache this separately — vendor code rarely changes
        // between deployments, so users don't re-download it unnecessarily.
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
