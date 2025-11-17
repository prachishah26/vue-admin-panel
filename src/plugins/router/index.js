import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(to => {
  const auth = useAuthStore()
  const authed = auth.isAuthenticated

  if (to.meta?.requiresAuth && !authed) return { path: '/login', query: { redirect: to.fullPath } }

  if (to.meta?.guestOnly && authed) return { path: '/dashboard' }

  return true
})

export default function (app) {
  app.use(router)
}

export { router }
