import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import LoggedinHomeViewVue from '@/views/loggedin/LoggedinHomeView.vue'
import MyDay from '@/components/MyDay.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'LoggedinHome',
    component: LoggedinHomeViewVue,
    meta: { requiresAuth: true }
  },
  {
    path: '/myday',
    name: 'MyDay',
    component: MyDay,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.token) {
      next('/login')
    } else {
      next()
    }
  } else {
    if (authStore.token && (to.path === '/login' || to.path === '/')) {
      next('/home')
    } else {
      next()
    }
  }
})

export default router
