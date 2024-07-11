<template>
  <div class="neobrut-container">
    <div class="neobrut-main">
      <section class="register-form neobrut-box">
        <h2 class="form-title">Register</h2>
        <div v-if="successMessage" class="neobrut-message neobrut-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="neobrut-message neobrut-error">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required class="neobrut-input" />
          </div>
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
              <button
                type="button"
                class="password-toggle-btn"
                @click="togglePasswordVisibility('password')"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                class="neobrut-input"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="togglePasswordVisibility('confirm')"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <button type="submit" class="neobrut-btn neobrut-btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        <p class="switch-form">
          Already have an account? <a @click="goToLogin" class="neobrut-link">Log In</a>
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
  name: 'RegisterPage',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const successMessage = ref('')
    const errorMessage = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    const handleRegister = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
      }
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

    const togglePasswordVisibility = (field) => {
      if (field === 'password') {
        showPassword.value = !showPassword.value
      } else if (field === 'confirm') {
        showConfirmPassword.value = !showConfirmPassword.value
      }
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      handleRegister,
      goToLogin,
      isLoading: authStore.isLoading,
      successMessage,
      errorMessage,
      showPassword,
      showConfirmPassword,
      togglePasswordVisibility
    }
  }
})
</script>

<style scoped>
.register-form {
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
</style>
