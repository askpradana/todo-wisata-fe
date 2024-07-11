<template>
  <div class="neobrut-container">
    <div class="neobrut-header">
      <h1 class="neobrut-title">My Day</h1>
      <button @click="goBack" class="neobrut-button neobrut-back-button">Back</button>
    </div>
    <div v-if="isLoading" class="neobrut-loading">Loading your day...</div>
    <div v-else-if="error" class="neobrut-error">{{ error }}</div>
    <div v-else class="neobrut-myday-content">
      <h2 class="neobrut-greeting">Hello, {{ username }}!</h2>
      <div v-if="todayTasks.length > 0" class="neobrut-myday-tasks">
        <div v-for="(task, index) in todayTasks" :key="task.id" class="neobrut-myday-task">
          <p class="neobrut-myday-time">
            {{ index === 0 ? 'Today' : 'Then' }} at {{ formatTime(task.reminder) }} you have:
          </p>
          <div
            @click="toggleDescription(task.id)"
            class="neobrut-myday-title"
            :class="{ 'neobrut-myday-completed': task.completed }"
          >
            {{ task.title }}
          </div>
          <div
            v-if="task.description && expandedTasks.includes(task.id)"
            class="neobrut-myday-description"
          >
            {{ task.description }}
          </div>
        </div>
      </div>
      <div v-else class="neobrut-myday-empty">
        <p>You have no tasks scheduled for today. Enjoy your free time!</p>
        <span class="neobrut-empty-icon">🌴</span>
      </div>
    </div>
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
.neobrut-myday-content {
  max-width: 600px;
  margin: 0 auto;
}

.neobrut-greeting {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.neobrut-myday-tasks {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.neobrut-myday-task {
  background-color: #fff;
  border: 3px solid #000;
  padding: 1rem;
  box-shadow: 5px 5px 0 #000;
}

.neobrut-myday-time {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.neobrut-myday-title {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border: 2px solid #000;
  transition: transform 0.2s;
}

.neobrut-myday-title:hover {
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 0 #000;
}

.neobrut-myday-completed {
  text-decoration: line-through;
  color: #888;
}

.neobrut-myday-description {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border: 2px solid #000;
}

.neobrut-myday-empty {
  text-align: center;
  padding: 2rem;
  background-color: #f0f0f0;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
}

.neobrut-back-button {
  background-color: #f0f0f0;
}
</style>
