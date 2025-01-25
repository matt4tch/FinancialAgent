import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(),
            tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: './public/popup.html',
        content: './src/content.js',
        background: './src/background.js'
      },
      output: {
        entryFileNames: '[name].js', // Prevent hashed filenames
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
