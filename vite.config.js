import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  
  // Build optimizations for better performance
  build: {
    // Code splitting for better loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['styled-components'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': ['dayjs', 'react-hot-toast']
        }
      }
    },
    // Minification and optimization
    minify: 'esbuild', // Faster than terser
    target: 'esnext',
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    cssCodeSplit: true, // Split CSS into separate files
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Asset optimization
    assetsInlineLimit: 4096 // Inline assets smaller than 4kb
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'styled-components',
      '@supabase/supabase-js'
    ],
    exclude: [
      // Exclude large dependencies that should be loaded on-demand
    ]
  },
  
  // Development server optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay in development
    },
    host: true, // Allow external connections
    port: 3000
  },
  
  // CSS optimization
  css: {
    devSourcemap: false, // Disable CSS sourcemaps in development
    preprocessorOptions: {
      scss: {
        // If you use SCSS, add optimizations here
      }
    }
  },
  
  // Preview server settings (for production preview)
  preview: {
    port: 4173,
    host: true
  }
});