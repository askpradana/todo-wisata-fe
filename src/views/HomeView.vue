<template>
  <div class="neobrut-container">
    <header class="neobrut-header">
      <h1 class="app-name">OneTask</h1>
    </header>
    <main class="neobrut-main">
      <section class="hero-cta neobrut-box">
        <h2 class="headline">Focus. Achieve. Repeat.</h2>
        <p class="subheadline">Master your day by conquering one task at a time.</p>
        <div class="button-group">
          <button @click="login" class="neobrut-btn neobrut-btn-primary">Log In</button>
          <button @click="register" class="neobrut-btn neobrut-btn-secondary">
            Start For Free
          </button>
        </div>
        <p class="no-credit-card">No credit card. Start focusing today.</p>
      </section>
      <section class="how-it-works neobrut-box">
        <h3>How OneTask Works:</h3>
        <ol>
          <li>Add your tasks</li>
          <li>Focus on one task</li>
          <li>Complete it</li>
          <li>Repeat & succeed</li>
        </ol>
      </section>
    </main>
    <footer class="neobrut-footer">
      <p>&copy; 2024 OneTask. Simplify your focus, amplify your success.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const login = () => {
  router.push('/login')
}

const register = () => {
  router.push('/register')
}
</script>

<style scoped>
.hero-cta {
  background-color: #4ecdc4;
}

.headline {
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.subheadline {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.how-it-works h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.how-it-works ol {
  list-style-type: none;
  padding: 0;
  counter-reset: item;
}

.how-it-works li {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #ffe66d;
  border: 2px solid #000;
  counter-increment: item;
  display: flex;
  align-items: center;
}

.how-it-works li::before {
  content: counter(item);
  margin-right: 10px;
  background-color: #000;
  color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
