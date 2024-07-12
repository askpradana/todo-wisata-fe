<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/tasklist'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'MyDayView',
  setup() {
    const todoStore = useTodoStore()
    const router = useRouter()
    const { todos, username, isLoading, error } = storeToRefs(todoStore)
    const expandedTasks = ref([])

    const todayTasks = computed(() => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return todos.value
        .filter((todo) => {
          const todoDate = new Date(todo.reminder)
          return todoDate >= today && todoDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        })
        .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))
    })

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const toggleDescription = (taskId) => {
      const index = expandedTasks.value.indexOf(taskId)
      if (index === -1) {
        expandedTasks.value.push(taskId)
      } else {
        expandedTasks.value.splice(index, 1)
      }
    }

    const goBack = () => {
      router.replace('/home')
    }

    onMounted(() => {
      todoStore.fetchTodos()
    })

    return {
      username,
      isLoading,
      error,
      todayTasks,
      expandedTasks,
      formatTime,
      toggleDescription,
      goBack
    }
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-8 py-8 font-sans">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-medium">My Day</h1>
      <button
        @click="goBack"
        class="px-4 py-2 text-sm rounded bg-transparent hover:bg-gray-300 transition-colors duration-300"
      >
        Back
      </button>
    </header>
    <main>
      <div v-if="isLoading" class="text-center py-8">Loading your day...</div>
      <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
      <div v-else>
        <h2 class="text-xl mb-6">Hello, {{ username }}!</h2>
        <div v-if="todayTasks.length > 0" class="space-y-4">
          <div
            v-for="(task, index) in todayTasks"
            :key="task.id"
            class="bg-white border border-gray-200 rounded-md p-4"
          >
            <p class="text-sm text-gray-600 mb-2">
              {{ index === 0 ? 'Today' : 'Then' }} at {{ formatTime(task.reminder) }}:
            </p>
            <div
              @click="toggleDescription(task.id)"
              class="cursor-pointer"
              :class="{ 'opacity-50': task.completed }"
            >
              <h3 class="text-lg font-medium mb-2" :class="{ 'line-through': task.completed }">
                {{ task.title }}
              </h3>
              <p
                v-if="task.description && expandedTasks.includes(task.id)"
                class="text-sm text-gray-600"
              >
                {{ task.description }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 bg-gray-100 rounded-md">
          <p>You have no tasks scheduled for today. Enjoy your free time!</p>
        </div>
      </div>
    </main>
  </div>
</template>
