<template>
  <div class="minimalist-container">
    <header class="minimalist-header">
      <div class="logo">
        <span class="checkmark">✓</span>
        <span class="app-name">minimalist</span>
      </div>
      <div class="made-by">Made with ♥ by <a href="#" class="author-link">Your Name</a></div>
    </header>

    <main class="minimalist-main">
      <h1 class="main-title">Simple, shareable todo lists.</h1>
      <p class="subtitle">The easiest way to keep track of the stuff you want to do.</p>

      <div class="main-actions">
        <button @click="navigateToLogin" class="sign-in-button">Sign in</button>
        <button @click="navigateToRegister" class="sign-in-button">Get started</button>
      </div>

      <!-- <div class="app-preview">
        <img src="@/assets/app-preview.png" alt="App Preview" class="preview-image">
      </div> -->
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.minimalist-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
}

.minimalist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
}

.main-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.logo {
  display: flex;
  align-items: center;
}

.checkmark {
  background-color: #4285f4;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-weight: bold;
  margin-right: 0.5rem;
}

.app-name {
  font-weight: 500;
  font-size: 1.2rem;
}

.made-by {
  font-size: 0.9rem;
  color: #666;
}

.author-link {
  color: #4285f4;
  text-decoration: none;
}

.minimalist-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.sign-in-button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sign-in-button:hover {
  background-color: #3367d6;
}

.app-preview {
  margin-top: 4rem;
}

.preview-image {
  max-width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
