import moment from 'moment'
import _ from 'underscore'

const prizesRule = {
  "click": "点击",
  "share": "分享"
}

const PrizesType = {
  "0": "红包",
  "1": "礼品",
  "2": "积分",
  "3": "虚拟币",
  "4": "优惠券",
  "5": "抵用券"
}

/**
 * 格式化时间
 *
 * @param {String} str
 * @returns 格式化后的时间
 */
export const formatDate = (str, format) => {
  format = format || "YYYY-MM-DD hh:mm"
  return moment(str).format(format)
}


/**
 * 格式化正负数
 *
 * @param {String} str
 * @returns 格式化后的结果
 */
export const formatNumbers = (num) => {
  return Number(num) > 0 ? `+${num}` : num
}

/**
 * 任务是否完成
 *
 * @param {String} str
 * @returns 任务是否完成
 */
export const isFinished = (state) => {
  return (state > 1) ? '任务已经结束' : '任务进行中'
}

/**
 * 解析奖励
 *
 * @param {String} str
 * @returns 奖励
 */
export const prizes = (str, type) => {
  let obj = {}
  _.each(str.split(","), (val) => {
    let d = val.split(":")
    obj[d[0]] = d[1]
  })
  if (type == 'type') {
    return prizesRule[obj.type]
  } else {
    return obj.score
  }
}

/**
 * 解析奖励(红包)
 *
 * @param {String} str
 * @returns 红包
 */
export const redPrizes = (str) => {
  let obj = {}
  _.each(str.split(","), (val) => {
    let d = val.split(":")
    obj[d[0]] = d[1]
  })
  // method:equals
  if(_.has(obj.method ,'equals')){
    return `${prizesRule[obj.type]}得红包`
  }else{
    return `${prizesRule[obj.type]}得随机红包`
  }
}

/**
 * 解析积分明细title
 *
 * @param {String} str
 * @returns 积分明细title
 */
export const prizesTitle = (title,str) => {
  if(str){
    let obj = {}
    _.each(str.split(","), (val) => {
      let d = val.split(":")
      obj[d[0]] = d[1]
    })
    if(obj.type == 'click'){
      return `查看活动  "${title}"`
    }else if(obj.type == 'share'){
      return `分享活动  "${title}"`
    }
  }else {
    return title
  }
}

//判断是否为空
export const isEmpty = (str) =>{
  return _.isEmpty(str)
}


//解析兑换规则
export const formatExchange = (socre,redpack) =>{
  return `${socre}兑换${redpack}元红包`
}
