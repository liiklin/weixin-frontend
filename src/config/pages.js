// 创建每个页面对应的state
export default [
  'home', //首页
  'taskCenter',//任务中心
  'tasks', //所有任务列表
  'myTasks',//我的任务列表
  'userInfo', //个人中心
  'score', //我的积分
  'red', //我的红包
  'shop' //积分商城
]

//创建每个页面的action
export const actions = [
  'GET_DATA_VIEW', //存储页面信息
  'GET_DATA_LIST', //存储列表信息
  'PULL_PAGE_LIST_PUSH', //拉取页面列表数据，分页使用
  'GET_DATA_START', //正在获取数据
  'GET_DATA_ERROR', //页面加载失败
  'LEAVE', //页面离开，存储滚动条位置
  'RESET', //重置页面状态
  'SET_CUSTOM_KEY', //设置自定义字段
]
