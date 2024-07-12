<template>
  <div class="minimalist-container">
    <div class="minimalist-form-container">
      <h1 class="minimalist-title">Log In</h1>
      <form @submit.prevent="handleLogin" class="minimalist-form">
        <div class="minimalist-form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required class="minimalist-input" />
        </div>
        <div class="minimalist-form-group">
          <label for="password">Password</label>
          <div class="minimalist-password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              class="minimalist-input"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="minimalist-password-toggle"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>
        <button type="submit" class="minimalist-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
      <p class="minimalist-message" v-if="successMessage">{{ successMessage }}</p>
      <p class="minimalist-message error" v-if="errorMessage">{{ errorMessage }}</p>
      <p class="minimalist-switch-form">
        Don't have an account? <a @click="goToRegister" class="minimalist-link">Register</a>
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const handleLogin = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      try {
        const success = await authStore.login(email.value, password.value)
        if (success) {
          successMessage.value = 'Login successful! Redirecting...'
          setTimeout(() => {
            router.push('/home')
          }, 1500)
        } else {
          errorMessage.value = 'Login failed. Please check your credentials.'
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'An error occurred during login'
      }
    }

    const goToRegister = () => {
      router.push('/register')
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    return {
      email,
      password,
      showPassword,
      handleLogin,
      goToRegister,
      togglePasswordVisibility,
      isLoading: authStore.isLoading,
      successMessage,
      errorMessage
    }
  }
})
</script>

<style scoped>
.minimalist-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.minimalist-form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.minimalist-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.minimalist-form-group {
  margin-bottom: 1rem;
}

.minimalist-password-input {
  position: relative;
}

.minimalist-password-toggle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.minimalist-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.minimalist-button:hover {
  background-color: #3367d6;
}

.minimalist-message {
  margin-top: 1rem;
  text-align: center;
}

.minimalist-message.error {
  color: #ff4757;
}

.minimalist-switch-form {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.minimalist-link {
  color: #4285f4;
  cursor: pointer;
}
</style>
