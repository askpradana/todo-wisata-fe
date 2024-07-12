// src/stores/todoStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

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
      this.error = null
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`)
        this.todos = response.data.todoList
        this.username = response.data.username
      } catch (error) {
        this.error =
          error.response?.status === 401 || error.response?.status === 400
            ? 'UNAUTHORIZED'
            : error.response?.data?.message || 'An error occurred while fetching todos'
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
    },
    async updateTodo(updatedTodo) {
      this.isLoading = true
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/todos/${updatedTodo.id}`,
          updatedTodo
        )
        const index = this.todos.findIndex((t) => t.id === updatedTodo.id)
        if (index !== -1) {
          this.todos[index] = response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update todo'
      } finally {
        this.isLoading = false
      }
    },
    async deleteTodo(id) {
      this.isLoading = true
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`)
        this.todos = this.todos.filter((todo) => todo.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete todo'
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
