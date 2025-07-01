import { ref, watch } from 'vue'

export function useLocalStorage() {
  // 保存表单数据到本地存储
  const saveFormData = (key, data) => {
    try {
      localStorage.setItem(`lx_zhaopin_${key}`, JSON.stringify(data))
    } catch (error) {
      console.error('保存表单数据失败:', error)
    }
  }

  // 从本地存储加载表单数据
  const loadFormData = (key, defaultData = {}) => {
    try {
      const saved = localStorage.getItem(`lx_zhaopin_${key}`)
      if (saved) {
        return { ...defaultData, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('加载表单数据失败:', error)
    }
    return defaultData
  }

  // 清除表单数据
  const clearFormData = (key) => {
    try {
      localStorage.removeItem(`lx_zhaopin_${key}`)
    } catch (error) {
      console.error('清除表单数据失败:', error)
    }
  }

  // 创建响应式表单数据
  const createPersistentForm = (key, defaultData = {}) => {
    const formData = ref(loadFormData(key, defaultData))

    // 监听表单数据变化，自动保存
    watch(
      formData,
      (newData) => {
        saveFormData(key, newData)
      },
      { deep: true }
    )

    return {
      formData,
      clearForm: () => {
        formData.value = { ...defaultData }
        clearFormData(key)
      }
    }
  }

  return {
    saveFormData,
    loadFormData,
    clearFormData,
    createPersistentForm
  }
} 