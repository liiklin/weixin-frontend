import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import {
  sync
} from 'vuex-router-sync'

import * as filter from './filter' //自定义过滤器
import app from './App' //app
import route from './config/route' //路由配置
import store from './vuex/store' //vuex

import 'normalize.css' //重置浏览器默认样式
import 'flex.css' //flex布局
import './less/common.less' //公共样式
import './iconfont/iconfont.css' //web字体图标

Vue.use(VueRouter)
Vue.use(VueLazyload)

const FastClick = require('fastclick')
FastClick.attach(document.body)

Object.keys(filter).forEach(k => Vue.filter(k, filter[k])) //注册过滤器

const router = new VueRouter({
  // hashbang: false,
  // history: process.env.NODE_ENV !== 'production',
  transitionOnLoad: false
})

router.map(route)

let history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

/**
 * sync router loading status
 */
const commit = store.commit || store.dispatch
router.beforeEach(({
  to,
  from,
  next
}) => {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (toIndex > fromIndex) {
      commit('UPDATE_DIRECTION', 'forward')
    } else {
      commit('UPDATE_DIRECTION', 'reverse')
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    commit('UPDATE_DIRECTION', 'forward')
  }
  commit('UPDATE_LOADING', true)
  setTimeout(next, 500)
})

router.afterEach(() => {
  commit('UPDATE_LOADING', false)
})

// router.beforeEach(({
//   to,
//   next
// }) => {
  // if (to.auth && !app.store.state.user.id) { //验证用户是否登录，用户没有登录则强制跳转到登录页面
  //   router.replace('/signin')
  // } else {
  //   next()
  // }
// })

// router.start(Vue.extend({}), '#main')
router.start(app, '#main')
