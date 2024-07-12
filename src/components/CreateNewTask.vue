<template>
  <div v-if="isOpen" class="minimalist-overlay" @click="closeDialog">
    <div class="minimalist-dialog" @click.stop>
      <h2 class="minimalist-dialog-title">Add New Task</h2>
      <form @submit.prevent="addTodo" class="minimalist-form">
        <div class="minimalist-form-group">
          <label for="title">Title</label>
          <input
            v-model="newTodo.title"
            id="title"
            required
            class="minimalist-input"
            placeholder="Task title"
          />
        </div>

        <div class="minimalist-form-group">
          <label for="description">Description</label>
          <textarea
            v-model="newTodo.description"
            id="description"
            class="minimalist-input minimalist-textarea"
            placeholder="Description (optional)"
          ></textarea>
        </div>

        <div class="minimalist-form-group">
          <label>Color</label>
          <div class="minimalist-color-picker">
            <button
              v-for="color in colors"
              :key="color.value"
              type="button"
              :class="['minimalist-color-option', { selected: newTodo.color === color.value }]"
              :style="{ backgroundColor: color.hex }"
              @click="newTodo.color = color.value"
            ></button>
          </div>
        </div>

        <div class="minimalist-form-group">
          <label for="reminder">Reminder</label>
          <input
            v-model="newTodo.reminder"
            id="reminder"
            type="datetime-local"
            class="minimalist-input"
          />
        </div>

        <div class="minimalist-form-actions">
          <button type="button" @click="closeDialog" class="minimalist-button secondary">
            Cancel
          </button>
          <button type="submit" class="minimalist-button primary">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</template>

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

<style scoped>
.minimalist-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.minimalist-dialog {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.minimalist-dialog-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.minimalist-form-group {
  margin-bottom: 1.5rem;
}

.minimalist-textarea {
  min-height: 100px;
  resize: vertical;
}

.minimalist-color-picker {
  display: flex;
  gap: 0.5rem;
}

.minimalist-color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.minimalist-color-option:hover {
  transform: scale(1.1);
}

.minimalist-color-option.selected {
  border-color: #4285f4;
}

.minimalist-checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
}

.minimalist-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.minimalist-checkmark {
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.minimalist-checkbox-container:hover input ~ .minimalist-checkmark {
  background-color: #ccc;
}

.minimalist-checkbox-container input:checked ~ .minimalist-checkmark {
  background-color: #4285f4;
}

.minimalist-checkmark:after {
  content: '';
  display: none;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.minimalist-checkbox-container input:checked ~ .minimalist-checkmark:after {
  display: block;
}

.minimalist-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.minimalist-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.minimalist-button.primary {
  background-color: #4285f4;
  color: white;
}

.minimalist-button.secondary {
  background-color: #e0e0e0;
  color: #333;
}

.minimalist-button:hover {
  opacity: 0.9;
}
</style>
