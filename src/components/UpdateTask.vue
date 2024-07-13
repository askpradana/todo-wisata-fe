<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'UpdateTask',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const editedTodo = ref({ ...props.todo })

    watch(
      () => props.todo,
      (newTodo) => {
        editedTodo.value = { ...newTodo }
      },
      { deep: true }
    )

    const saveTodo = () => {
      emit('save', editedTodo.value)
    }

    const cancelEdit = () => {
      emit('cancel')
    }

    return {
      editedTodo,
      saveTodo,
      cancelEdit
    }
  }
})
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <h3 class="text-xl font-semibold mb-4">Edit Task</h3>
    <form @submit.prevent="saveTodo" class="space-y-4">
      <div>
        <label for="title" class="block mb-1 font-medium">Title</label>
        <input
          v-model="editedTodo.title"
          id="title"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="description" class="block mb-1 font-medium">Description</label>
        <textarea
          v-model="editedTodo.description"
          id="description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
        ></textarea>
      </div>
      <div>
        <label for="color" class="block mb-1 font-medium">Color</label>
        <select
          v-model="editedTodo.color"
          id="color"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
      <div>
        <label for="reminder" class="block mb-1 font-medium">Reminder</label>
        <input
          v-model="editedTodo.reminder"
          id="reminder"
          type="datetime-local"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent0 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>
