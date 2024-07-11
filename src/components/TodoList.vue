<!-- src/components/TodoList.vue -->
<template>
  <ul class="todo-list">
    <li
      v-for="todo in todos"
      :key="todo.id"
      class="todo-item"
      :style="{ borderLeft: `5px solid ${todo.label_color || 'transparent'}` }"
    >
      <input type="checkbox" :checked="todo.completed" @change="toggleTodo(todo)" />
      <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
      <span class="due-date">Due: {{ formatDate(todo.due_date) }}</span>
      <select v-model="todo.label_color" @change="updateTodo(todo)">
        <option value="">No Label</option>
        <option value="#ff0000">Red</option>
        <option value="#00ff00">Green</option>
        <option value="#0000ff">Blue</option>
        <option value="#ffff00">Yellow</option>
      </select>
      <button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useTodoStore } from '@/stores/tasklist'

export default defineComponent({
  name: 'TodoList',
  props: ['todos'],
  methods: {
    ...mapActions(useTodoStore, ['updateTodo', 'deleteTodo']),
    toggleTodo(todo) {
      this.updateTodo({ ...todo, completed: !todo.completed })
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }
  }
})
</script>

<style scoped>
.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.due-date {
  margin-left: auto;
  margin-right: 10px;
  font-size: 0.9em;
  color: #666;
}

select,
.delete-btn {
  margin-left: 10px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
