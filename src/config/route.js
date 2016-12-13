import home from '../components/Home'
import tasks from '../components/TaskCenter'
import user from '../components/UserCenter'
import score from '../components/MyScore'
import red from '../components/MyRed'

import allTasks from '../components/AllTasks'
import myTasks from '../components/MyTasks'

export default {
  '/': {
    component: (resolve) => {
      require(['../app.vue'], resolve)
    },
    subRoutes: {
      '*': {
        component: home
      },
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
        component: tasks,
        name: 'tasks',
        subRoutes: {
          '/': {
            component: allTasks
          },
          '/all': {
            name:'all',
            component: allTasks
          },
          '/my': {
            name:'my',
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
  }
}
