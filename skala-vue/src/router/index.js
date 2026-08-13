import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
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
        {
          path: 'weather',
          name: 'assignment-weather',
          component: () => import('../views/assignment/WeatherHomeView.vue'),
        },
        {
          path: 'weather/:cityId',
          name: 'assignment-weather-detail',
          component: () => import('../views/assignment/WeatherDetailView.vue'),
        },
        {
          path: 'about',
          name: 'assignment-about',
          component: () => import('../views/assignment/WeatherAboutView.vue'),
        },
        {
          path: 'stats',
          name: 'assignment-stats',
          component: () => import('../views/assignment/WeatherStatsView.vue'),
        },
      ],
    },
    {
      path: '/weather',
      redirect: '/assignment/weather',
    },
    {
      path: '/weather/:cityId',
      redirect: (to) => `/assignment/weather/${to.params.cityId}`,
    },
    {
      path: '/about',
      redirect: '/assignment/about',
    },
    {
      path: '/stats',
      redirect: '/assignment/stats',
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
        {
          path: 'day3',
          name: 'practice-day3',
          component: () => import('../views/practice/Day3PracticeView.vue'),
        },
        {
          path: 'day4',
          name: 'practice-day4',
          component: () => import('../views/practice/Day4PracticeView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/assignment/NotFoundView.vue'),
    },
  ],
})

export default router
