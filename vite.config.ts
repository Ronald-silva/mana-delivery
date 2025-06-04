import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Gerar timestamp para versão do build
const timestamp = new Date().toISOString().replace(/[^\d]/g, "").slice(0, 14);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT || '8080'),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: 'terser',
    // Configuração especial para Vercel
    sourcemap: process.env.VERCEL ? false : true,
    // Adiciona timestamp como parte do nome dos arquivos para evitar problemas de cache
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${timestamp}.[hash].js`,
        chunkFileNames: `assets/[name]-${timestamp}.[hash].js`,
        assetFileNames: `assets/[name]-${timestamp}.[hash].[ext]`,
        manualChunks(id) {
          // Dividir as bibliotecas do node_modules em um chunk separado para melhor cache
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));
