<template>
  <div class="neobrut-container">
    <div class="neobrut-header">
      <h1 class="neobrut-title">Welcome, {{ username }}!</h1>
      <div class="between">
        <button @click="goToMyDay" class="neobrut-button neobrut-myday-button">My Day</button>
        <button @click="handleLogout" class="neobrut-button neobrut-logout-button">Logout</button>
      </div>
    </div>
    <div v-if="isLoading" class="neobrut-loading">Loading...</div>
    <div v-else-if="error" class="neobrut-error">{{ error }}</div>
    <div v-else>
      <div class="neobrut-todo-header">
        <h2 class="neobrut-subtitle">Your Todos</h2>
        <button @click="toggleHideCompleted" class="neobrut-button neobrut-toggle-button">
          {{ hideCompleted ? 'Show Completed' : 'Hide Completed' }}
        </button>
      </div>
      <div v-if="filteredTodos.length > 0" class="neobrut-todo-list">
        <div v-for="todo in filteredTodos" :key="todo.id" class="neobrut-todo-item-wrapper">
          <EditTodoItem
            v-if="editingTodo === todo.id"
            :todo="todo"
            @save="saveTodo"
            @cancel="cancelEdit"
          />
          <div v-else class="neobrut-todo-item" :class="[`neobrut-todo-color-${todo.color}`]">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodoCompletion(todo.id)"
              class="neobrut-checkbox"
            />
            <div class="neobrut-todo-content" @click="startEditing(todo.id)">
              <span :class="{ completed: todo.completed }" class="neobrut-todo-title">
                {{ todo.title }}
              </span>
              <span class="neobrut-todo-description">{{ todo.description }}</span>
              <span v-if="todo.reminder" class="neobrut-todo-reminder">
                Reminder: {{ new Date(todo.reminder).toLocaleString() }}
              </span>
            </div>
            <button @click="deleteTodo(todo.id)" class="neobrut-delete-btn">🗑️</button>
          </div>
        </div>
      </div>
      <div v-else class="neobrut-empty-list">
        <p>{{ emptyListMessage }}</p>
        <span class="neobrut-empty-icon">📝</span>
      </div>
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
import EditTodoItem from '@/components/UpdateTask.vue'

export default defineComponent({
  name: 'LoggedinHomeView',
  components: {
    AddTodoDialog,
    EditTodoItem
  },
  setup() {
    const todoStore = useTodoStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const { todos, username, isLoading, error } = storeToRefs(todoStore)
    const isAddTodoDialogOpen = ref(false)
    const editingTodo = ref(null)
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
      router.push({ path: '/' })
    }

    const openAddTodoDialog = () => {
      isAddTodoDialogOpen.value = true
    }

    const closeAddTodoDialog = () => {
      isAddTodoDialogOpen.value = false
    }

    const startEditing = (id) => {
      editingTodo.value = id
    }

    const saveTodo = async (updatedTodo) => {
      await todoStore.updateTodo(updatedTodo)
      editingTodo.value = null
    }

    const cancelEdit = () => {
      editingTodo.value = null
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
      editingTodo,
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

<style>
.between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.neobrut-title {
  font-size: 2.5rem;
  color: #000;
  text-transform: uppercase;
  margin: 0;
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

.neobrut-button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 3px solid #000;
  background-color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-logout-button {
  background-color: #ff4757;
  color: #fff;
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
  cursor: pointer;
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

.neobrut-delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.neobrut-delete-btn:hover {
  transform: scale(1.2);
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

.neobrut-empty-list {
  text-align: center;
  padding: 40px;
  background-color: #f0f0f0;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  margin-top: 20px;
}

.neobrut-empty-icon {
  font-size: 48px;
  display: block;
  margin-top: 20px;
}

.neobrut-todo-color-red {
  border-color: #ff0000;
}
.neobrut-todo-color-purple {
  border-color: #800080;
}
.neobrut-todo-color-blue {
  border-color: #0000ff;
}
.neobrut-todo-color-green {
  border-color: #008000;
}
.neobrut-todo-color-yellow {
  border-color: #ffff00;
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

.neobrut-todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.neobrut-toggle-button {
  font-size: 0.9rem;
  padding: 8px 16px;
  background-color: #f0f0f0;
}
</style>
