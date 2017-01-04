import home from '../components/Home'
import tasks from '../components/TaskCenter'
import user from '../components/UserCenter'
import score from '../components/MyScore'
import red from '../components/MyRed'
import shop from '../components/Shop'

import allTasks from '../components/AllTasks'
import myTasks from '../components/MyTasks'
import invite from '../components/Invite'

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
        title: '我的简报',
        component: home
      },
      '/home': {
        // auth: true,
        title: '我的简报',
        name: 'home',
        component: home
      },
      '/tasks': {
        component: tasks,
        name: 'tasks',
        subRoutes: {
          '/': {
            title: '全部任务',
            component: allTasks
          },
          '/all': {
            name:'all',
            title: '全部任务',
            component: allTasks
          },
          '/my': {
            name:'my',
            title: '我的任务',
            component: myTasks
          }
        }
      },
      '/user': {
        // auth: true,
        name: 'user',
        title: '用户中心',
        component: user
      },
      '/score': {
        // auth: true,
        title: '我的积分',
        name: 'score',
        component: score
      },
      '/red': {
        // auth: true,
        title: '我的红包',
        name: 'red',
        component: red
      },
      '/shop': {
        // auth: true,
        title: '积分商城',
        name: 'shop',
        component: shop
      },
      '/invite': {
        // auth: true,
        title: '全部邀请记录',
        name: 'invite',
        component: invite
      }
    }
  }
}
