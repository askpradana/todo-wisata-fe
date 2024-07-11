<!-- src/components/TodoForm.vue -->
<template>
  <form @submit.prevent="submitTodo" class="todo-form">
    <input v-model="newTodo.title" placeholder="New todo" required />
    <input type="date" v-model="newTodo.due_date" required />
    <select v-model="newTodo.label_color">
      <option value="">No Label</option>
      <option value="#ff0000">Red</option>
      <option value="#00ff00">Green</option>
      <option value="#0000ff">Blue</option>
      <option value="#ffff00">Yellow</option>
    </select>
    <button type="submit">Add Todo</button>
  </form>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TodoForm',
  data() {
    return {
      newTodo: {
        title: '',
        due_date: '',
        label_color: ''
      }
    }
  },
  methods: {
    submitTodo() {
      this.$emit('add-todo', { ...this.newTodo })
      this.newTodo = { title: '', due_date: '', label_color: '' }
    }
  }
})
</script>

<style scoped>
.todo-form {
  display: flex;
  margin-top: 20px;
}

.todo-form input,
.todo-form select {
  margin-right: 10px;
  padding: 5px;
}

.todo-form button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
