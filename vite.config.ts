import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyKey = env.LLM_API_KEY || env.ANT_LING_API_KEY
  const rawUpstream = env.LLM_UPSTREAM_BASE_URL || env.VITE_LLM_UPSTREAM_BASE_URL || 'https://api.ant-ling.com'
  const proxyTarget = rawUpstream.replace(/\/+$/, '').replace(/\/v1$/i, '')

  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      proxy: {
        '/api/llm': {
          target: proxyTarget,
          changeOrigin: true,
          headers: proxyKey ? { Authorization: `Bearer ${proxyKey}` } : undefined,
          rewrite: (path) => path.replace(/^\/api\/llm/, ''),
        },
      },
    },
  }
})