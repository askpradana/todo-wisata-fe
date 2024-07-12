<!-- src/views/MyDayView.vue -->
<template>
  <div class="minimalist-container">
    <header class="minimalist-header">
      <h1 class="minimalist-title">My Day</h1>
      <button @click="goBack" class="minimalist-button">Back</button>
    </header>
    <main class="minimalist-main">
      <div v-if="isLoading" class="minimalist-loading">Loading your day...</div>
      <div v-else-if="error" class="minimalist-error">{{ error }}</div>
      <div v-else>
        <h2 class="minimalist-greeting">Hello, {{ username }}!</h2>
        <div v-if="todayTasks.length > 0" class="minimalist-tasks">
          <div v-for="(task, index) in todayTasks" :key="task.id" class="minimalist-task">
            <p class="minimalist-task-time">
              {{ index === 0 ? 'Today' : 'Then' }} at {{ formatTime(task.reminder) }}:
            </p>
            <div
              @click="toggleDescription(task.id)"
              class="minimalist-task-content"
              :class="{ 'minimalist-task-completed': task.completed }"
            >
              <h3 class="minimalist-task-title">{{ task.title }}</h3>
              <p
                v-if="task.description && expandedTasks.includes(task.id)"
                class="minimalist-task-description"
              >
                {{ task.description }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="minimalist-empty-day">
          <p>You have no tasks scheduled for today. Enjoy your free time!</p>
        </div>
      </div>
    </main>
  </div>
</template>

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

<style scoped>
.minimalist-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.minimalist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.minimalist-title {
  font-size: 1.5rem;
  font-weight: 500;
}

.minimalist-greeting {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.minimalist-tasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.minimalist-task {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
}

.minimalist-task-time {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.minimalist-task-content {
  cursor: pointer;
}

.minimalist-task-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.minimalist-task-completed .minimalist-task-title {
  text-decoration: line-through;
  color: #888;
}

.minimalist-task-description {
  font-size: 0.9rem;
  color: #666;
}

.minimalist-empty-day {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
