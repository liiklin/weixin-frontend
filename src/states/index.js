import pages from '../config/pages'
import page from './page'
import Tool from '../Tool'

var states = {}

states.user = JSON.parse(Tool.localItem('user')) || {} //当前登录的用户信息
states.isLoading = true  //显示loading
states.direction = 'forward' //

const newPage = (name) => {
  states[name] = page()
}

/**
 * 合并出来所有页面的初始状态
 */
pages.map((item) => newPage(item)) //创建页面对应的state

export default states
