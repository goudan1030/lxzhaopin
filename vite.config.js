import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  root: '.', // 项目根目录
  publicDir: false, // 禁用publicDir避免与outDir冲突
  build: {
    // 构建输出到public目录
    outDir: 'public',
    emptyDir: true, // 构建前清空目录
  },
  server: {
    // 开发时的代理配置，代理API请求到后端
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
