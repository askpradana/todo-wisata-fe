// src/stores/todoStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

// const colorMap = {
//   red: "#ff0000",
//   purple: "#800080",
//   blue: "#0000ff",
//   green: "#008000",
//   yellow: "#ffff00",
//   default: "transparent"
// }

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    username: '',
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchTodos() {
      this.isLoading = true
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`)
        this.todos = response.data.todoList
        this.username = response.data.username
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch todos'
      } finally {
        this.isLoading = false
      }
    },
    async addTodo(todoData) {
      this.isLoading = true
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, {
          title: todoData.title,
          description: todoData.description,
          color: todoData.color,
          reminder: todoData.reminder
        })
        this.todos.push(response.data)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add todo'
      } finally {
        this.isLoading = false
      }
    },
    async toggleTodoCompletion(id) {
      try {
        const todo = this.todos.find((t) => t.id === id)
        const updatedTodo = { ...todo, completed: !todo.completed }
        const response = await axios.patch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
          completed: updatedTodo.completed
        })
        const index = this.todos.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], ...response.data }
        }
      } catch (error) {
        console.error('Failed to toggle todo completion:', error)
        this.error = error.response?.data?.message || 'Failed to update todo'
      } finally {
        this.isLoading = false
      }
    }
  },
  getters: {
    getTodosByColor: (state) => {
      return (color) => state.todos.filter((todo) => todo.color === color)
    },
    getCompletedTodos: (state) => {
      return state.todos.filter((todo) => todo.completed)
    },
    getIncompleteTodos: (state) => {
      return state.todos.filter((todo) => !todo.completed)
    }
  }
})
