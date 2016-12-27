import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
import {
  sync
} from 'vuex-router-sync'

import * as filter from './filter' //自定义过滤器
import app from './app' //app
import route from './config/route' //路由配置
import store from './vuex/store' //vuex

import 'vue-animate/dist/vue-animate.min.css' // animate
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
  hashbang: true,
  // history: true,
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

router.afterEach((transition) => {
  commit('UPDATE_LOADING', false)
  if (transition.to.title) {
    let body = document.getElementsByTagName('body')[0],
      iframe = document.createElement("iframe")
    document.title = transition.to.title
    iframe.style.display = "none"
    // iframe.setAttribute("src", "http://named.cn/page/take/img/icon_phone.png")
    var d = function() {
      setTimeout(function() {
        iframe.removeEventListener('load', d);
        document.body.removeChild(iframe);
      }, 0)
    }
    iframe.addEventListener('load', d)
    document.body.appendChild(iframe)

  }
})

// router.beforeEach(({
//   to,
//   next
// }) => {
//   if (to.auth && !app.store.state.user.id) { //验证用户是否登录，用户没有登录则强制跳转到登录页面
//     router.replace('/signin')
//   } else {
//     next()
//   }
// })

// router.start(Vue.extend({}), '#main')
router.start(app, '#main')
