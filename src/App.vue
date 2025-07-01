<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

// 初始化认证状态
const { initAuth } = useAuth()

onMounted(async () => {
  try {
    await initAuth()
    console.log('认证状态初始化完成')
  } catch (error) {
    console.error('认证初始化失败:', error)
  }
})
</script>

<style>
/* Global styles can go here */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* The background is now controlled by the body element */
}
</style>
