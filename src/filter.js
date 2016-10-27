import moment from 'moment'

/**
 * 格式化时间
 *
 * @param {String} str
 * @returns 格式化后的时间
 */
export const formatDate = (str, format) => {
  format = format || "YYYY-MM-DD hh:mm"
  return moment(str).utc().zone(8).format(format)
}


/**
 * 格式化正负数
 *
 * @param {String} str
 * @returns 格式化后的结果
 */
export const formatNumbers = (num) => {
  return num > 0 ? `+${num}` : num
}

/**
 * 任务是否完成
 *
 * @param {String} str
 * @returns 任务是否完成
 */
export const isFinished = (bool) => {
  return bool ? '任务已经结束' : '任务进行中'
}
