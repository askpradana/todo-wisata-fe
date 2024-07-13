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

<template>
  <div class="max-w-3xl mx-auto px-8 font-sans mt-12">
    <header class="flex justify-between items-center mb-16">
      <div class="flex items-center">
        <span class="bg-blue-500 text-white py-1 px-2 rounded font-bold mr-2">✓</span>
        <span class="font-medium text-xl">Geulist</span>
      </div>
      <div class="text-sm text-gray-600">
        Made with ♥ by <a href="#" class="text-blue-500 no-underline">nfldyprdn</a>
      </div>
    </header>

    <main class="flex flex-col items-center text-center">
      <h1 class="text-5xl font-bold mb-4">Simple, shareable todo lists.</h1>
      <p class="text-xl text-gray-600 mb-8">
        The easiest way to keep track of the stuff you want to do.
      </p>

      <div class="flex gap-4 justify-center mt-4">
        <button
          @click="navigateToLogin"
          class="bg-blue-500 text-white border-none py-3 px-8 text-base rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Sign in
        </button>
        <button
          @click="navigateToRegister"
          class="bg-blue-500 text-white border-none py-3 px-8 text-base rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Get started
        </button>
      </div>

      <div class="mt-16">
        <img
          src="@/assets/app-preview.webp"
          alt="App Preview"
          class="max-w-full shadow-md rounded-lg"
        />
      </div>
    </main>
  </div>
</template>
