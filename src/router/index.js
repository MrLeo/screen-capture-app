/**
 * https://next.router.vuejs.org/zh/index.html / https://router.vuejs.org/zh/
 */

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import db from '../common/db'

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
    const token = db
      .read()
      .get('userInfo.token')
      .value()

    if (!token) return '/login'

    // import { getUserByToken } from '../api/user'
    // const res = await getUserByToken({ token })
    // db.read()
    //   .merge({ userInfo: res.data })
    //   .write()

    return true
  } catch (err) {
    console.log(`[LOG] -> router.beforeEach -> err`, err)
    return '/login'
  }
})

export default router
