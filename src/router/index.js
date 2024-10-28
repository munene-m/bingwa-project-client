import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login/:role',
      name: 'login',
      props: true,
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup/:role',
      name: 'signup',
      props: true,
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        auth: true,
        title: 'Bingwa - dashboard',
      },
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        auth: true,
        title: 'Bingwa - users',
      },
      component: () => import('../views/UsersView.vue'),
    },
    {
      path: '/customers',
      name: 'customers',
      meta: {
        auth: true,
        title: 'Bingwa - customers',
      },
      component: () => import('../views/CustomersView.vue'),
    },
    {
      path: '/leads',
      name: 'leads',
      meta: {
        auth: true,
        title: 'Bingwa - leads',
      },
      component: () => import('../views/LeadsView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        auth: true,
        title: 'Bingwa - settings',
      },
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

const dynamicTitleGuard = (to, from, next) => {
  document.title = to.meta.title || 'Bingwa CRM'
  next()
}

const currentUser = () => {
  return new Promise((resolve, reject) => {
    const token = cookies.get('token')
    resolve(token)
    reject
  })
}
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (await currentUser()) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

router.beforeEach(dynamicTitleGuard)

export default router
