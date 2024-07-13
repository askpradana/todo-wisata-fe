<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/tasklist'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import AddTodoDialog from '@/components/CreateNewTask.vue'
import UpdateTask from '@/components/UpdateTask.vue'
import ConfirmDialog from '@/components/DeleteTask.vue'

export default defineComponent({
  name: 'LoggedinHomeView',
  components: {
    AddTodoDialog,
    UpdateTask,
    ConfirmDialog
  },
  methods: {
    getBorderColor(color) {
      const colorMap = {
        red: 'border-red-500',
        purple: 'border-purple-500',
        blue: 'border-blue-500',
        green: 'border-green-500',
        yellow: 'border-yellow-500',
        default: 'border-transparent'
      }
      return colorMap[color] || colorMap.default
    }
  },
  setup() {
    const todoStore = useTodoStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const { todos, username, isLoading, error } = storeToRefs(todoStore)
    const isAddTodoDialogOpen = ref(false)
    const editingTodoId = ref(null)
    const hideCompleted = ref(true)
    const isConfirmDialogOpen = ref(false)

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
      hideCompleted,
      toggleHideCompleted,
      emptyListMessage,
      goToMyDay,
      isConfirmDialogOpen
    }
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-8 font-sans mt-12">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-medium">{{ username }}'s Tasks</h1>
      <div class="space-x-2">
        <button
          @click="goToMyDay"
          class="px-4 py-2 text-sm rounded bg-transparent hover:bg-gray-300 transition-colors duration-300"
        >
          My Day
        </button>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </header>

    <main>
      <div v-if="isLoading" class="text-center py-8">Loading tasks...</div>
      <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-medium">Tasks</h2>
          <button
            @click="toggleHideCompleted"
            class="px-4 py-2 text-sm rounded bg-transparent hover:bg-gray-300 transition-colors duration-300"
          >
            {{ hideCompleted ? 'Show Completed' : 'Hide Completed' }}
          </button>
        </div>

        <ul v-if="filteredTodos.length > 0" class="space-y-2">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="bg-white border border-gray-200 rounded-md transition-shadow duration-300 hover:shadow-md"
            :class="[`border-l-4`, getBorderColor(todo.color)]"
          >
            <div v-if="editingTodoId === todo.id" class="p-4">
              <UpdateTask :todo="todo" @save="saveTodo" @cancel="cancelEdit" />
            </div>
            <div v-else class="flex items-center p-4">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodoCompletion(todo.id)"
                class="mr-4 h-5 w-5"
              />
              <div class="flex-grow">
                <h3
                  :class="{ 'line-through text-gray-500': todo.completed }"
                  class="text-lg font-medium"
                >
                  {{ todo.title }}
                </h3>
                <p v-if="todo.description" class="text-sm text-gray-600 mt-1">
                  {{ todo.description }}
                </p>
                <p v-if="todo.reminder" class="text-sm text-gray-600 mt-1">
                  {{ new Date(todo.reminder).toLocaleString() }}
                </p>
              </div>
              <div class="space-x-2">
                <button @click="startEditing(todo.id)" class="text-blue-500 hover:text-blue-600">
                  Edit
                </button>
                <button @click="openConfirmDialog(todo.id)" class="text-red-500 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="text-center py-8 bg-gray-100 rounded-md text-gray-600">
          <p>{{ emptyListMessage }}</p>
        </div>
      </div>
    </main>

    <button
      @click="openAddTodoDialog"
      class="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl shadow-md hover:bg-blue-600 transition-colors duration-300"
    >
      +
    </button>
    <AddTodoDialog
      :is-open="isAddTodoDialogOpen"
      @close="closeAddTodoDialog"
      @add-todo="addNewTodo"
    />

    <ConfirmDialog
      :is-open="isConfirmDialogOpen"
      title="Confirm Deletion"
      message="Are you sure you want to delete this task?"
      @confirm="confirmDelete"
      @cancel="closeConfirmDialog"
    />
  </div>
</template>
