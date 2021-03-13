/**
 * https://next.router.vuejs.org/zh/index.html / https://router.vuejs.org/zh/
 */

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import Home from '../views/Home.vue'
import { TOKEN_KEY } from '../common/config'
import { getUserByToken } from '../api/user'
import { globalData } from '../common/global'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  if (to.name === 'Login') return true

  try {
    const token = Cookies.get(TOKEN_KEY)
    if (!token) return '/login'

    const res = await getUserByToken({ token })
    globalData.userInfo = res.data

    return true
  } catch (err) {
    return '/login'
  }
})

export default router
