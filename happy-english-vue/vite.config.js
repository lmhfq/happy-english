import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' 让打包产物可直接用静态服务器或任意路径打开，方便手机/平板访问
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'],
      manifest: {
        name: '快乐英语乐园',
        short_name: '快乐英语',
        description: '人教版新起点 1-3 年级趣味英语 · 听音闯关与口语对话',
        theme_color: '#4DA8FF',
        background_color: '#FFF7E6',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // 预缓存全部构建资源 + 376 条发音 mp3，实现断网可用
        globPatterns: ['**/*.{js,css,html,png,svg,mp3,ico}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024
      },
      devOptions: { enabled: false }
    })
  ],
  server: {
    host: true, // 允许同一局域网下手机/平板访问
    port: 5173
  },
  build: {
    outDir: '../deploy',
    emptyOutDir: true
  }
})
