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
    setDocumentTitle(transition.to.title)
  }
})

let setDocumentTitle = function (title) {
    document.title = title;
    let ua = navigator.userAgent;
    if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
        var i = document.createElement('iframe');
        i.src = '/favicon.ico';
        i.style.display = 'none';
        i.onload = function () {
            setTimeout(function () {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
    }
}

router.start(app, '#main')
