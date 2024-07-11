<template>
  <div class="neobrut-edit-todo-item">
    <form @submit.prevent="saveTodo" class="neobrut-edit-form">
      <h3 class="neobrut-edit-title">Edit Todo</h3>

      <div class="neobrut-form-group">
        <label for="edit-title" class="neobrut-label">Title</label>
        <input
          id="edit-title"
          v-model="editedTodo.title"
          class="neobrut-input"
          placeholder="Todo title"
          required
        />
      </div>

      <div class="neobrut-form-group">
        <label for="edit-description" class="neobrut-label">Description</label>
        <textarea
          id="edit-description"
          v-model="editedTodo.description"
          class="neobrut-input neobrut-textarea"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="neobrut-form-group">
        <label class="neobrut-label">Color</label>
        <div class="neobrut-color-picker">
          <button
            v-for="color in colors"
            :key="color.value"
            type="button"
            :class="['neobrut-color-option', { selected: editedTodo.color === color.value }]"
            :style="{ backgroundColor: color.hex }"
            @click="editedTodo.color = color.value"
          >
            {{ color.value === editedTodo.color ? '✓' : '' }}
          </button>
        </div>
      </div>

      <div class="neobrut-form-group">
        <label for="edit-reminder" class="neobrut-label">Reminder</label>
        <input
          id="edit-reminder"
          v-model="editedTodo.reminder"
          type="datetime-local"
          class="neobrut-input"
        />
      </div>

      <div class="neobrut-form-actions">
        <button type="button" @click="cancelEdit" class="neobrut-btn neobrut-btn-secondary">
          Cancel
        </button>
        <button type="submit" class="neobrut-btn neobrut-btn-primary">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'EditTodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const colors = [
      { value: 'default', hex: '#ffffff' },
      { value: 'red', hex: '#ff0000' },
      { value: 'purple', hex: '#800080' },
      { value: 'blue', hex: '#0000ff' },
      { value: 'green', hex: '#008000' },
      { value: 'yellow', hex: '#ffff00' }
    ]

    const editedTodo = ref({ ...props.todo })

    const saveTodo = () => {
      emit('save', editedTodo.value)
    }

    const cancelEdit = () => {
      emit('cancel')
    }

    return {
      editedTodo,
      colors,
      saveTodo,
      cancelEdit
    }
  }
})
</script>

<style scoped>
.neobrut-edit-todo-item {
  background-color: #ffffff;
  border: 6px solid #000;
  box-shadow: 12px 12px 0 #000;
  padding: 2rem;
  margin-bottom: 2rem;
}

.neobrut-edit-title {
  font-size: 2rem;
  text-transform: uppercase;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.neobrut-form-group {
  margin-bottom: 1.5rem;
}

.neobrut-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  color: #000;
  text-transform: uppercase;
}

.neobrut-input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 4px solid #000;
  background-color: #fff;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
  box-sizing: border-box;
}

.neobrut-input:focus {
  outline: none;
  transform: translate(-4px, -4px);
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

.neobrut-form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.neobrut-btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 4px solid #000;
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.neobrut-btn:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 0 #000;
}

.neobrut-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
}

.neobrut-btn-primary {
  background-color: #ff6b6b;
  color: #000;
}

.neobrut-btn-secondary {
  background-color: #ccc;
  color: #000;
}
</style>
