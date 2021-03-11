/**
 * https://next.router.vuejs.org/zh/index.html / https://router.vuejs.org/zh/
 */

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

// router.beforeEach(async (to, from, next) => {
//   // if (!Cookies.get('at')) {
//   //   window.location.href = `https://passport.zhaopin.com/login?bkUrl=${window.location.href}`
//   //   return false
//   // }
//   return true
// })

export default router
