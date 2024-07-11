import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email,
          password
        })
        this.token = response.data.token
        this.user = { id: response.data.userId, email }
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during login'
        return false
      } finally {
        this.isLoading = false
      }
    },
    async register(username, email, password) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
          username,
          email,
          password
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during registration'
        return false
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/')
    },
    // async fetchUserData() {
    //   try {
    //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`)
    //     this.user = response.data
    //   } catch (error) {
    //     console.error('Error fetching user data:', error)
    //     this.logout() // If fetching user data fails, log out
    //   }
    // },
    async initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // await this.fetchUserData()
        this.user = { isAuthenticated: true }
      }
    }
  }
})
