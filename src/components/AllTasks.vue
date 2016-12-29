<style lang="stylus">
@import "../stylus/taskCenter";
@import "../stylus/lazyLoad";
@import "../stylus/allTasks";
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
      .taskStatus.taskShared(v-if="task.taskbusId | isEmpty")
        span 未接受
      .taskStatus.taskNotShare(v-else="")
        span 已接受
      div(flex="main:justify cross:center")
        .tasksFont
          div
            span(style="color:#ff6a99;") 点击+{{ task.clickScore }}
            span(style="color:#ff6a99;") &nbsp;点击+{{ task.shareScore }}
        .tasksFont
          span(v-text="task.shareCount || \"0\" ")
          span 人参与●
          span {{task.state | isFinished }}
  div
    dialog(:show.sync="isShow", dialog-transition="", :scroll="false")
      .allTasks-modal
        .h20
        .h20
        .allTasks-content(flex="dir:top main:center cross:center")
          div
            span 你即将进入活动链接页面，
            </br>
            span 分享后返回任务中心，即可完成任务！
          div(flex="dir:left main:center cross:center")
            img(style="width:30px;height:30px;border-radius:5px;", src="../assets/score2.png")
            span(style="font-size:30px;color:#ffb400;padding-left:10px;", v-text="user.score")
          div(flex="main:center cross:center")
            div(flex-box="1" flex="dir:left main:center cross:center")
              div(flex-box="1" flex="main:center cross:center")
                span 分享奖励&nbsp;&nbsp;+&nbsp;{{ showTask.clickScore }}
              div(flex-box="1" flex="main:center cross:center")
                span 好友点击&nbsp;&nbsp;+&nbsp;{{ showTask.clickScore }}
        .allTasks-footer(flex="top:dir main:center cross:center")
          div(flex-box="1", @click="accept(showTask.id,showTask.contentUrl)", v-if="showTask.taskbusId | isEmpty")
            span 接收
          div(flex-box="1", @click="doTask(showTask.id,showTask.contentUrl,showTask.taskbusId)", v-else="")
            span 做任务
          div(flex-box="1", @click="closeModal")
            span 取消
      .allTasks-header(flex="dir:top main:center cross:center")
        img(src="../assets/tips.png")
</template>

<script>

const NAME = 'tasks'

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
                this.GET_DATA_START()
                let baseImgUrl = "http://weixin.7ipr.com/app/"
                let wxId = this.user.id
                if (_.has(this.$route.query,'id')) {
                  wxId = this.$route.query.id
                }

                Tool.get(`WxBus/getUserinfo`, {
                    wxId
                }, (data) => {
                    let tasks = _.map(data.allTaskList, (task) => {
                            task.coverUrl = `${baseImgUrl}${task.coverUrl}`
                            return task
                        })
                        //userInfo
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
            accept(taskId,contentUrl){
              if(this.breakAjax) return
              let wxId = this.user.id
              if (_.has(this.$route.query,'id')) {
                wxId = this.$route.query.id
              }

              this.breakAjax = Tool.post(`WxBus/accept`, {
                  wxId,
                  taskId
              },(data)=>{
                if (data.success) {
                  self.location = `${contentUrl}?userId=${wxId}&taskId=${taskId}&taskBusId=${data.data.id}&type=1`
                }
              })
            },
            doTask(taskId,contentUrl,taskbusId){
              let wxId = this.user.id
              if (_.has(this.$route.query,'id')) {
                wxId = this.$route.query.id
              }
              self.location = `${contentUrl}?userId=${wxId}&taskId=${taskId}&taskBusId=${taskbusId}&type=1`
            }
    }
}

</script>
