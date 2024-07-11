<template>
  <div v-if="isOpen" class="neobrut-dialog-overlay" @click="closeDialog">
    <div class="neobrut-dialog" @click.stop>
      <h2 class="neobrut-dialog-title">Add New Todo</h2>
      <form @submit.prevent="addTodo" class="neobrut-form">
        <input v-model="newTodo.title" placeholder="Title" required class="neobrut-input" />
        <input v-model="newTodo.description" placeholder="Description" class="neobrut-input" />
        <select v-model="newTodo.color" class="neobrut-select">
          <option value="default">Default</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
        <input v-model="newTodo.reminder" type="datetime-local" class="neobrut-input" />
        <div class="neobrut-dialog-actions">
          <button
            type="button"
            @click="closeDialog"
            class="neobrut-button neobrut-button-secondary"
          >
            Cancel
          </button>
          <button type="submit" class="neobrut-button">Add Todo</button>
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
      closeDialog
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
  box-shadow: 8px 8px 0 #000;
  padding: 20px;
  width: 90%;
  max-width: 500px;
}

.neobrut-dialog-title {
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 20px;
  text-transform: uppercase;
  border-bottom: 4px solid #000;
  display: inline-block;
}

.neobrut-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.neobrut-button-secondary {
  background-color: #ccc;
}

/* ... (rest of the styles from the previous component) ... */
</style>
