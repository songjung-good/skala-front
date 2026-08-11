import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/practice',
      component: () => import('../views/practice/PracticeLayout.vue'),
      redirect: '/practice/day1',
      children: [
        {
          path: 'day1',
          name: 'practice-day1',
          component: () => import('../views/practice/Day1PracticeView.vue'),
        },
        {
          path: 'day2',
          name: 'practice-day2',
          component: () => import('../views/practice/Day2PracticeView.vue'),
        },
      ],
    },
    {
      path: '/assignment',
      component: () => import('../views/assignment/AssignmentLayout.vue'),
      redirect: '/assignment/day1',
      children: [
        {
          path: 'day1',
          name: 'assignment-day1',
          component: () => import('../views/assignment/Day1AssignmentView.vue'),
        },
      ],
    },
  ],
})

export default router
