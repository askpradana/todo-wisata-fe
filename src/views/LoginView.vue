<template>
  <div class="neobrut-container">
    <div class="neobrut-main">
      <section class="login-form neobrut-box">
        <h2 class="form-title">Log In</h2>
        <div v-if="successMessage" class="neobrut-message neobrut-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="neobrut-message neobrut-error">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required class="neobrut-input" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                class="neobrut-input"
              />
              <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <button type="submit" class="neobrut-btn neobrut-btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>
        <p class="switch-form">
          Don't have an account? <a @click="goToRegister" class="neobrut-link">Register</a>
        </p>
      </section>
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
    const successMessage = ref('')
    const errorMessage = ref('')
    const showPassword = ref(false)

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
      handleLogin,
      goToRegister,
      isLoading: authStore.isLoading,
      successMessage,
      errorMessage,
      showPassword,
      togglePasswordVisibility
    }
  }
})
</script>

<style scoped>
.login-form {
  padding: 2rem;
  border: 6px solid #000;
  box-shadow: 12px 12px 0 #000;
}

.form-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  color: #000;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
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

.switch-form {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.error-message {
  color: #ff4757;
  text-align: center;
  margin-top: 1rem;
}
</style>
