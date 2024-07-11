<template>
  <div v-if="isOpen" class="neobrut-dialog-overlay" @click="closeDialog">
    <div class="neobrut-dialog" @click.stop>
      <h2 class="neobrut-dialog-title">Add New Todo</h2>
      <form @submit.prevent="addTodo" class="neobrut-form">
        <div class="neobrut-input-group">
          <label for="title" class="neobrut-label">Title</label>
          <input
            id="title"
            v-model="newTodo.title"
            placeholder="What needs to be done?"
            required
            class="neobrut-input"
          />
        </div>
        <div class="neobrut-input-group">
          <label for="description" class="neobrut-label">Description</label>
          <textarea
            id="description"
            v-model="newTodo.description"
            placeholder="Add some details..."
            class="neobrut-input neobrut-textarea"
          ></textarea>
        </div>
        <div class="neobrut-input-group">
          <label for="color" class="neobrut-label">Color</label>
          <div class="neobrut-color-picker">
            <button
              v-for="color in colors"
              :key="color.value"
              type="button"
              :class="['neobrut-color-option', { selected: newTodo.color === color.value }]"
              :style="{ backgroundColor: color.hex }"
              @click="newTodo.color = color.value"
            >
              {{ color.value === newTodo.color ? '✓' : '' }}
            </button>
          </div>
        </div>
        <div class="neobrut-input-group">
          <label for="reminder" class="neobrut-label">Reminder</label>
          <input
            id="reminder"
            v-model="newTodo.reminder"
            type="datetime-local"
            class="neobrut-input"
          />
        </div>
        <div class="neobrut-dialog-actions">
          <button
            type="button"
            @click="closeDialog"
            class="neobrut-button neobrut-button-secondary"
          >
            Cancel
          </button>
          <button type="submit" class="neobrut-button neobrut-button-primary">Add Todo</button>
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
.neobrut-dialog-overlay {
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

.neobrut-dialog {
  background-color: #fff;
  border: 4px solid #000;
  box-shadow: 12px 12px 0 #000;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  animation: pop-in 0.3s ease-out;
}

@keyframes pop-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.neobrut-dialog-title {
  font-size: 2rem;
  color: #000;
  margin-bottom: 30px;
  text-transform: uppercase;
  border-bottom: 4px solid #000;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.neobrut-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.neobrut-input-group {
  display: flex;
  flex-direction: column;
}

.neobrut-label {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.neobrut-input,
.neobrut-textarea {
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #000;
  background-color: #fff;
  transition: box-shadow 0.2s;
}

.neobrut-input:focus,
.neobrut-textarea:focus {
  outline: none;
  box-shadow: 4px 4px 0 #000;
}

.neobrut-textarea {
  min-height: 100px;
  resize: vertical;
}

.neobrut-color-picker {
  display: flex;
  gap: 10px;
}

.neobrut-color-option {
  width: 40px;
  height: 40px;
  border: 3px solid #000;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #000;
  transition: transform 0.2s;
}

.neobrut-color-option:hover,
.neobrut-color-option.selected {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.neobrut-button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 3px solid #000;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.neobrut-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-button-secondary {
  background-color: #ccc;
  color: #000;
}

.neobrut-button-primary {
  background-color: #ff6b6b;
  color: #000;
}
</style>
