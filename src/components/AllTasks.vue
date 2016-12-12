<style lang="less" scoped>

@import "../less/taskCenter";
@import "../less/lazyLoad";
@import "../less/allTasks";

</style>

<template>

<div>
    <br>
    <div class="items">
        <div class="item" v-for="task in list" @click="showTaskInfo(task.id)">
            <div class="taskImg">
                <img class="img" :src="task.coverUrl" lazy="loading" />
                <div class="taskTitle">
                    <span class="title" v-text="task.name"></span>
                </div>
            </div>
            <div flex="main:justify cross:center">
                <div class="tasksFont" v-for="prize in task.prizes">
                    <div v-if="prize.type == 0">
                        <span>{{prize.getRule | redPrizes}}</span>
                    </div>
                    <div v-else>
                        <span>{{prize.getRule | prizes 'type'}}</span>
                        <span style="color:#f27427;">+{{prize.getRule | prizes ''}}</span>
                    </div>
                </div>
                <div class="tasksFont">
                    <span v-text="task.summary"></span><span>人参与 * </span>
                    <span>{{task.state | isFinished }}</span>
                </div>
            </div>
        </div>
    </div>
    <div>
        <dialog :show.sync="isShow" dialog-transition="" :scroll="false">
            <div class="allTasks-modal">
                <div class="allTasks-header" flex="dir:top main:center cross:center">
                    <img style="height:200px;" src="http://img0.imgtn.bdimg.com/it/u=4293591722,688107236&fm=21&gp=0.jpg" />
                </div>
                <div class="allTasks-content" flex="dir:top main:center cross:center">
                    <div class="" style="padding:10px;">
                        <span>你即将进入活动链接页面，分享后返回任务中心，即可完成任务！</span>
                    </div>
                    <div class="" style="padding:10px;" flex="dir:left main:center cross:center">
                        <img style="width:30px;height:30px;border-radius:5px;" src="http://img0.imgtn.bdimg.com/it/u=4293591722,688107236&fm=21&gp=0.jpg" />
                        <span style="font-size:30px;color:#f27427;padding-left:10px;" v-text="user.score"></span>
                    </div>
                    <div style="width:100%;padding:10px 0px;" flex="main:center cross:center">
                        <div flex-box="1" flex="main:center cross:center" v-for="prize in showTask.prizes">
                            <div flex="main:center cross:center" v-if="prize.type == 0">
                                <span>{{prize.getRule | redPrizes}}</span>
                            </div>
                            <div flex="main:center cross:center" v-else>
                                <span>{{prize.getRule | prizes 'type'}}</span>
                                <span style="color:#f27427;">+{{prize.getRule | prizes ''}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div flex="main:center cross:center" class="allTasks-footer">
                    <div flex-box="1" @click="accept(showTask.id)" v-if="showTask.userId | isEmpty">
                        <span>接收</span>
                    </div>
                    <div flex-box="1" @click="doTask(showTask.id)" v-else>
                        <span>做任务</span>
                    </div>
                    <div flex-box="1" @click="closeModal">
                        <span>取消</span>
                    </div>
                </div>
            </div>
        </dialog>
    </div>
</div>

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
                if (this.breakAjax) return false //请求未结束，防止重复请求
                this.GET_DATA_START()
                let baseImgUrl = "http://weixin.7ipr.com/weixin/"
                // let wxId = 'o1Xf6wJiAYZqvcParrR85Hl_7BD0'
                let wxId = this.user.id
                if (_.has(this.$route.query,'id')) {
                  wxId = this.$route.query.id
                }
                // console.log(wxId);
                this.breakAjax = Tool.get(`WxBus/getUserinfo`, {
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
            accept(taskId){
              // let userId = 'o1Xf6wJiAYZqvcParrR85Hl_7BD0'
              let userId = this.$route.query.id
              Tool.post(`WxBus/accept`, {
                  userId,
                  taskId
              },(data)=>{
                console.log(data)
              })
            },
            doTask(taskId){
              console.log(taskId)
            }
    }
}

</script>
