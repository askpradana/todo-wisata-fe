<template>
  <div class="neobrut-container">
    <div class="neobrut-header">
      <h1 class="neobrut-title">Welcome, {{ username }}!</h1>
      <button @click="handleLogout" class="neobrut-button neobrut-logout-button">Logout</button>
    </div>
    <div v-if="isLoading" class="neobrut-loading">Loading...</div>
    <div v-else-if="error" class="neobrut-error">{{ error }}</div>
    <div v-else>
      <h2 class="neobrut-subtitle">Your Todos</h2>
      <TransitionGroup name="todo-list" tag="div" class="neobrut-todo-list">
        <div
          v-for="todo in sortedTodos"
          :key="todo.id"
          class="neobrut-todo-item"
          :style="{ borderColor: todo.colorHex }"
        >
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodoCompletion(todo.id)"
            class="neobrut-checkbox"
          />
          <div class="neobrut-todo-content">
            <span :class="{ completed: todo.completed }" class="neobrut-todo-title">{{
              todo.title
            }}</span>
            <span class="neobrut-todo-description">{{ todo.description }}</span>
            <span v-if="todo.reminder" class="neobrut-todo-reminder">
              Reminder: {{ new Date(todo.reminder).toLocaleString() }}
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <button @click="openAddTodoDialog" class="neobrut-fab">+</button>
    <AddTodoDialog
      :is-open="isAddTodoDialogOpen"
      @close="closeAddTodoDialog"
      @add-todo="addNewTodo"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/tasklist'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import AddTodoDialog from '@/components/CreateNewTask.vue'

export default defineComponent({
  name: 'LoggedinHomeView',
  components: {
    AddTodoDialog
  },
  setup() {
    const todoStore = useTodoStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const { todos, username, isLoading, error } = storeToRefs(todoStore)
    const isAddTodoDialogOpen = ref(false)

    const sortedTodos = computed(() => {
      return [...todos.value].sort((a, b) => {
        if (a.completed === b.completed) return 0
        return a.completed ? 1 : -1
      })
    })

    onMounted(() => {
      todoStore.fetchTodos()
    })

    const addNewTodo = async (newTodo) => {
      await todoStore.addTodo(newTodo)
    }

    const toggleTodoCompletion = async (id) => {
      await todoStore.toggleTodoCompletion(id)
    }

    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }

    const openAddTodoDialog = () => {
      isAddTodoDialogOpen.value = true
    }

    const closeAddTodoDialog = () => {
      isAddTodoDialogOpen.value = false
    }

    return {
      sortedTodos,
      username,
      isLoading,
      error,
      addNewTodo,
      toggleTodoCompletion,
      handleLogout,
      isAddTodoDialogOpen,
      openAddTodoDialog,
      closeAddTodoDialog
    }
  }
})
</script>

<style scoped>
.neobrut-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 20px;
  background-color: #f0f0f0;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
}

.neobrut-title {
  font-size: 2.5rem;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 3px 3px 0 #ff6b6b;
}

.neobrut-subtitle {
  font-size: 1.8rem;
  color: #000;
  margin-top: 30px;
  margin-bottom: 15px;
  text-transform: uppercase;
  border-bottom: 4px solid #000;
  display: inline-block;
}

.neobrut-todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.neobrut-todo-item {
  background-color: #fff;
  border: 3px solid #000;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  box-shadow: 5px 5px 0 #000;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-todo-item:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 #000;
}

.neobrut-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  appearance: none;
  cursor: pointer;
  position: relative;
}

.neobrut-checkbox:checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #000;
}

.neobrut-todo-content {
  flex-grow: 1;
}

.neobrut-todo-title {
  font-size: 1.2rem;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.neobrut-todo-description {
  font-size: 0.9rem;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

.neobrut-todo-reminder {
  font-size: 0.8rem;
  color: #007bff;
  display: block;
}

.neobrut-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
}

.neobrut-input,
.neobrut-select {
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #000;
  background-color: #fff;
}

.neobrut-input:focus,
.neobrut-select:focus {
  outline: none;
  box-shadow: 3px 3px 0 #ff6b6b;
}

.neobrut-button {
  align-self: flex-start;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #ff6b6b;
  color: #000;
  border: 2px solid #000;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.neobrut-logout-button {
  background-color: #ff4757;
  color: #fff;
  border: 3px solid #000;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-logout-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-loading,
.neobrut-error {
  font-size: 1.2rem;
  padding: 20px;
  background-color: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  margin-top: 20px;
}

.neobrut-error {
  color: #ff0000;
}

.neobrut-fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: #fff;
  font-size: 2rem;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-fab:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 #000;
}

.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.5s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-list-leave-active {
  position: absolute;
}
</style>
