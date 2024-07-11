<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.initializeAuth()
    })

    return {}
  }
})
</script>
