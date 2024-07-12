<!-- src/views/loggedin/LoggedinHomeView.vue -->
<template>
  <div class="minimalist-container">
    <header class="minimalist-header">
      <h1 class="minimalist-title">{{ username }}'s Tasks</h1>
      <div class="header-actions">
        <button @click="goToMyDay" class="minimalist-button">My Day</button>
        <button @click="handleLogout" class="minimalist-button logout-button">Logout</button>
      </div>
    </header>

    <main class="minimalist-main">
      <div v-if="isLoading" class="minimalist-loading">Loading tasks...</div>
      <div v-else-if="error" class="minimalist-error">{{ error }}</div>
      <div v-else>
        <div class="minimalist-todo-header">
          <h2 class="minimalist-subtitle">Tasks</h2>
          <button @click="toggleHideCompleted" class="minimalist-button toggle-button">
            {{ hideCompleted ? 'Show Completed' : 'Hide Completed' }}
          </button>
        </div>

        <ul v-if="filteredTodos.length > 0" class="minimalist-todo-list">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="minimalist-todo-item"
            :class="[`todo-color-${todo.color}`]"
          >
            <div v-if="editingTodoId === todo.id" class="minimalist-edit-wrapper">
              <UpdateTask :todo="todo" @save="saveTodo" @cancel="cancelEdit" />
            </div>
            <div v-else class="minimalist-todo-content">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodoCompletion(todo.id)"
                class="minimalist-checkbox"
              />
              <div class="minimalist-todo-text">
                <h3 :class="{ completed: todo.completed }" class="minimalist-todo-title">
                  {{ todo.title }}
                </h3>
                <p v-if="todo.description" class="minimalist-todo-description">
                  {{ todo.description }}
                </p>
                <p v-if="todo.reminder" class="minimalist-todo-reminder">
                  {{ new Date(todo.reminder).toLocaleString() }}
                </p>
              </div>
              <div class="minimalist-todo-actions">
                <button @click="startEditing(todo.id)" class="minimalist-action-btn edit-btn">
                  Edit
                </button>
                <button @click="deleteTodo(todo.id)" class="minimalist-action-btn delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="minimalist-empty-list">
          <p>{{ emptyListMessage }}</p>
        </div>
      </div>
    </main>

    <button @click="openAddTodoDialog" class="minimalist-fab">+</button>
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
import UpdateTask from '@/components/UpdateTask.vue'

export default defineComponent({
  name: 'LoggedinHomeView',
  components: {
    AddTodoDialog,
    UpdateTask
  },
  setup() {
    const todoStore = useTodoStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const { todos, username, isLoading, error } = storeToRefs(todoStore)
    const isAddTodoDialogOpen = ref(false)
    const editingTodoId = ref(null)
    const hideCompleted = ref(true)

    const filteredTodos = computed(() => {
      let filtered = [...todos.value]
      if (hideCompleted.value) {
        filtered = filtered.filter((todo) => !todo.completed)
      }
      return filtered.sort((a, b) => {
        if (a.completed === b.completed) return 0
        return a.completed ? 1 : -1
      })
    })

    const emptyListMessage = computed(() => {
      if (hideCompleted.value && todos.value.some((todo) => todo.completed)) {
        return "All visible tasks are completed. Uncheck 'Hide Completed' to view them."
      }
      return "Your todo list is empty. Click the '+' button to add a new task!"
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

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/')
    }

    const openAddTodoDialog = () => {
      isAddTodoDialogOpen.value = true
    }

    const closeAddTodoDialog = () => {
      isAddTodoDialogOpen.value = false
    }

    const startEditing = (id) => {
      editingTodoId.value = id
    }

    const saveTodo = async (updatedTodo) => {
      await todoStore.updateTodo(updatedTodo)
      editingTodoId.value = null
    }

    const cancelEdit = () => {
      editingTodoId.value = null
    }

    const deleteTodo = async (id) => {
      if (confirm('Are you sure you want to delete this todo?')) {
        await todoStore.deleteTodo(id)
      }
    }

    const toggleHideCompleted = () => {
      hideCompleted.value = !hideCompleted.value
    }

    const goToMyDay = () => {
      router.push('/myday')
    }

    return {
      filteredTodos,
      username,
      isLoading,
      error,
      addNewTodo,
      toggleTodoCompletion,
      handleLogout,
      isAddTodoDialogOpen,
      openAddTodoDialog,
      closeAddTodoDialog,
      editingTodoId,
      startEditing,
      saveTodo,
      cancelEdit,
      deleteTodo,
      hideCompleted,
      toggleHideCompleted,
      emptyListMessage,
      goToMyDay
    }
  }
})
</script>

<style scoped>
.minimalist-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
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

.minimalist-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button {
  background-color: #ff4757;
  color: white;
}

.minimalist-todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.minimalist-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
}

.minimalist-todo-list {
  list-style-type: none;
  padding: 0;
}

.minimalist-todo-item {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.3s ease;
}

.minimalist-todo-content {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.minimalist-checkbox {
  margin-right: 1rem;
}

.minimalist-todo-text {
  flex-grow: 1;
}

.minimalist-todo-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.minimalist-todo-description,
.minimalist-todo-reminder {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.minimalist-action-btn {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #4285f4;
}

.delete-btn {
  color: #ff4757;
}

.minimalist-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  font-size: 1.5rem;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.minimalist-empty-list {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #666;
}

.todo-color-red {
  border-left: 4px solid #ff4757;
}
.todo-color-purple {
  border-left: 4px solid #9c27b0;
}
.todo-color-blue {
  border-left: 4px solid #4285f4;
}
.todo-color-green {
  border-left: 4px solid #4caf50;
}
.todo-color-yellow {
  border-left: 4px solid #ffeb3b;
}
.todo-color-default {
  border-left: 4px solid transparent;
}
</style>
