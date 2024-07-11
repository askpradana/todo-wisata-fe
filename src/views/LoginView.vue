<template>
  <div class="neobrut-container">
    <div class="neobrut-main">
      <section class="login-form neobrut-box">
        <h2 class="form-title">Log In</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required class="neobrut-input" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="neobrut-input"
            />
          </div>
          <button type="submit" class="neobrut-btn neobrut-btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>
        <p v-if="error" class="error-message">{{ error }}</p>
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
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')

    // Use storeToRefs to create refs from the store state
    const { isLoading, error } = storeToRefs(authStore)

    const handleLogin = async () => {
      const success = await authStore.login(email.value, password.value)
      if (success) {
        router.push('/home')
      }
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      email,
      password,
      handleLogin,
      goToRegister,
      isLoading,
      error
    }
  }
})
</script>

<style scoped>
.neobrut-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.neobrut-main {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  box-sizing: border-box;
}

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

.neobrut-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.2rem;
  margin-top: 1rem;
  background-color: #ff6b6b;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 #000;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
  cursor: pointer;
}

.neobrut-btn:hover {
  transform: translate(-4px, -4px);
  box-shadow: 10px 10px 0 #000;
}

.neobrut-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0 #000;
}

.switch-form {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.neobrut-link {
  color: #ff6b6b;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.3s;
}

.neobrut-link:hover {
  color: #ff4757;
}

.error-message {
  color: #ff4757;
  text-align: center;
  margin-top: 1rem;
}
</style>
