import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      'import.meta.env.API_BASE': JSON.stringify(env.API_BASE || '/api'),
      'import.meta.env.CHARGILY_WEBHOOK_URL': JSON.stringify(env.CHARGILY_WEBHOOK_URL || ''),
      'import.meta.env.GROQ_KEY': JSON.stringify(env.GROQ_KEY || ''),
    },
    server: {
      port: 5000,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
      },
    },
  }
})
