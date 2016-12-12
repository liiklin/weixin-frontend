import home from '../components/Home'
import tasks from '../components/TaskCenter'
import user from '../components/UserCenter'
import score from '../components/MyScore'
import red from '../components/MyRed'

import allTasks from '../components/AllTasks'
import myTasks from '../components/MyTasks'

export default {
  '/': {
    // auth: true,
    component: home
  },
  '/home': {
    // auth: true,
    name: 'home',
    component: home
  },
  '/tasks': {
    // auth: true,
    component: tasks,
    name: 'taks',
    subRoutes: {
      '/all': {
        name: 'all',
        component: allTasks
      },
      '/my': {
        name: 'my',
        component: myTasks
      }
    }
  },
  '/user': {
    // auth: true,
    name: 'user',
    component: user
  },
  '/score': {
    // auth: true,
    name: 'score',
    component: score
  },
  '/red': {
    // auth: true,
    name: 'red',
    component: red
  }
}
