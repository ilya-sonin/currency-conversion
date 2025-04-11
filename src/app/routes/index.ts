import { createRouter, createWebHistory } from 'vue-router'

import Convert from '@/pages/convert/index.vue'
import Home from '@/pages/home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/convert',
      name: 'convert',
      component: Convert,
    },
  ],
})

export default router
