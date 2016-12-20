<style lang="less">
@import "../less/taskCenter";
@import "../less/lazyLoad";
@import "../less/allTasks";
</style>

<template lang="pug">
div
  br
  .items
    .item(v-for="task in list", @click="showTaskInfo(task.id)")
      .taskImg
        img.img(:src="task.coverUrl", lazy="loading")
        .taskTitle
          span.title(v-text="task.name")
      .taskStatus.taskShared(v-if="task.taskBusState | isEmpty")
        span
          | 未分享
      .taskStatus.taskNotShare(v-else="")
        span
          | 已分享
      div(flex="main:justify cross:center")
        .tasksFont
          div
            span(style="color:#ff6a99;")
              | {{ `点击+${task.clickScore}` }}
            span(style="color:#ff6a99;")
              | {{ `&nbsp;分享+${task.shareScore}` }}
        .tasksFont
          span(v-text="task.shareCount || \"0\" ")
          span 人参与●
          span {{task.state | isFinished }}
  div
    dialog(:show.sync="isShow", dialog-transition="", :scroll="false")
      .allTasks-modal
        .allTasks-content(flex="dir:top main:center cross:center")
          div(style="padding:10px;")
            span
              | 你即将进入活动链接页面，分享后返回任务中心，即可完成任务！
          div(style="padding:10px;", flex="dir:left main:center cross:center")
            img(style="width:30px;height:30px;border-radius:5px;", src="../assets/score2.png")
            span(style="font-size:30px;color:#ffb400;padding-left:10px;", v-text="user.score")
          div(style="width:100%;padding:10px 0px;", flex="main:center cross:center")
            div(flex-box="1" flex="dir:left main:center cross:center")
              div(flex-box="1" flex="main:center cross:center")
                span
                  | {{ `分享奖励&nbsp;&nbsp;+&nbsp;${showTask.clickScore}` }}
              div(flex-box="1" flex="main:center cross:center")
                span
                  | {{ `好友点击&nbsp;&nbsp;+&nbsp;${showTask.clickScore}` }}
        .allTasks-footer(flex="top:dir main:center cross:center")
          div(flex-box="1", @click="doTask(showTask.id,showTask.taskbusId,showTask.contentUrl)")
            span 做任务
          div(flex-box="1", @click="closeModal")
            span 取消
      .allTasks-header(flex="dir:top main:center cross:center")
        img(src="../assets/tips.png")
</template>

<script>

const NAME = 'myTasks'

import {
    Dialog
}
from 'vux'
import _ from 'underscore';

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {
    tasks: [],
    showTask: {},
    isShow: false
})

export default {
    mixins: [mixins(NAME)],
    components: {
        Dialog
    },
    route: {
        data() {
                this.getTaskLists()
            },
            canReuse({
                to
            }) {
                this.RESET(to.path)
                if (this.breakAjax) this.breakAjax() //中断之前的请求，防止执行回调方法
                delete this.breakAjax //清除掉上个页面的ajax请求
                return true
            }
    },
    methods: {
        getTaskLists() {
                if (this.breakAjax) return false //请求未结束，防止重复请求
                this.GET_DATA_START()
                let baseImgUrl = "http://weixin.7ipr.com/app/"
                let wxId = this.user.id
                if (_.has(this.$route.query,'id')) {
                  wxId = this.$route.query.id
                }
                this.breakAjax = Tool.get(`WxBus/getUserinfo`, {
                    wxId
                }, (data) => {
                    let tasks = _.map(data.myTaskList, (task) => {
                            task.coverUrl = `${baseImgUrl}${task.coverUrl}`
                            return task
                        })
                    //userInfo
                    console.log(JSON.stringify(tasks))
                    let score = data.score
                    let myTasks = data.myTaskList
                    let totalTask = myTasks.length
                    let completedTask = _.filter(myTasks, (task) => {
                        return task.state == 1
                    }).length
                    let user = _.extend(data.user, {
                        score,
                        totalTask,
                        completedTask
                    })
                    this.GET_DATA_VIEW(user)
                    this.GET_DATA_LIST(tasks)
                }, this.GET_DATA_ERROR)
            },
            showTaskInfo(id) {
                let taskJson = JSON.parse(JSON.stringify(this.list))

                let showTask = _.find(taskJson, (val) => {
                    return val.id == id
                })
                this.SET_CUSTOM_KEY({
                    isShow: true,
                    showTask
                })
            },
            closeModal() {
                this.SET_CUSTOM_KEY({
                    isShow: false,
                    showTask: {}
                })
            },
            doTask(taskId,taskbusId,contentUrl){
              let wxId = this.user.id
              if (_.has(this.$route.query,'id')) {
                wxId = this.$route.query.id
              }
              // console.log(contentUrl)
              self.location = `${contentUrl}?userId=${wxId}&taskId=${taskId}`
            }
    }
}

</script>
