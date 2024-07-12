<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'RegisterPage',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const handleRegister = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      try {
        const result = await authStore.register(username.value, email.value, password.value)
        if (result) {
          successMessage.value = 'Registration successful! Redirecting to login...'
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          errorMessage.value = 'Registration failed. Please try again.'
        }
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || 'An error occurred during registration'
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    return {
      username,
      email,
      password,
      showPassword,
      handleRegister,
      goToLogin,
      togglePasswordVisibility,
      isLoading: authStore.isLoading,
      successMessage,
      errorMessage
    }
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl mb-6 text-center font-semibold">Register</h1>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="username" class="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="email" class="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="password" class="block mb-1 text-sm font-medium">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p v-if="successMessage" class="mt-4 text-center text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-center text-red-600">{{ errorMessage }}</p>
      <p class="mt-4 text-center text-sm">
        Already have an account?
        <a @click="goToLogin" class="text-blue-500 cursor-pointer hover:underline">Log In</a>
      </p>
    </div>
  </div>
</template>
