<!-- src/components/UpdateTask.vue -->
<template>
  <div class="update-task">
    <h3 class="update-task-title">Edit Task</h3>
    <form @submit.prevent="saveTodo" class="update-task-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="editedTodo.title" id="title" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="editedTodo.description" id="description" class="form-input"></textarea>
      </div>
      <div class="form-group">
        <label for="color">Color</label>
        <select v-model="editedTodo.color" id="color" class="form-input">
          <option value="default">Default</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
      <div class="form-group">
        <label for="reminder">Reminder</label>
        <input
          v-model="editedTodo.reminder"
          id="reminder"
          type="datetime-local"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  </div>
</template>

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

<style scoped>
.update-task {
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
}

.update-task-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.update-task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #4285f4;
  color: white;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}
</style>
