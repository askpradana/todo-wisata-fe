<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AddTodoDialog',
  props: {
    isOpen: Boolean
  },
  emits: ['close', 'add-todo'],
  setup(props, { emit }) {
    const colors = [
      { value: 'default', hex: '#ffffff' },
      { value: 'red', hex: '#ff0000' },
      { value: 'purple', hex: '#800080' },
      { value: 'blue', hex: '#0000ff' },
      { value: 'green', hex: '#008000' },
      { value: 'yellow', hex: '#ffff00' }
    ]

    const newTodo = ref({
      title: '',
      description: '',
      color: 'default',
      reminder: null
    })

    const addTodo = () => {
      emit('add-todo', { ...newTodo.value })
      newTodo.value = { title: '', description: '', color: 'default', reminder: null }
      closeDialog()
    }

    const closeDialog = () => {
      emit('close')
    }

    return {
      newTodo,
      addTodo,
      closeDialog,
      colors
    }
  }
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click="closeDialog"
  >
    <div class="bg-white rounded-lg p-8 w-full max-w-md" @click.stop>
      <h2 class="text-2xl font-semibold mb-6 text-center">Add New Task</h2>
      <form @submit.prevent="addTodo" class="space-y-6">
        <div>
          <label for="title" class="block mb-1 font-medium">Title</label>
          <input
            v-model="newTodo.title"
            id="title"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
          />
        </div>

        <div>
          <label for="description" class="block mb-1 font-medium">Description</label>
          <textarea
            v-model="newTodo.description"
            id="description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            placeholder="Description (optional)"
          ></textarea>
        </div>

        <div>
          <label class="block mb-1 font-medium">Color</label>
          <div class="flex space-x-2">
            <button
              v-for="color in colors"
              :key="color.value"
              type="button"
              class="w-6 h-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="{ 'ring-2 ring-blue-500 ring-offset-2': newTodo.color === color.value }"
              :style="{ backgroundColor: color.hex }"
              @click="newTodo.color = color.value"
            ></button>
          </div>
        </div>

        <div>
          <label for="reminder" class="block mb-1 font-medium">Reminder</label>
          <input
            v-model="newTodo.reminder"
            id="reminder"
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="closeDialog"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
