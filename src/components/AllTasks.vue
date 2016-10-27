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
                <img class="img" :src="task.image" lazy="loading" />
                <div class="taskTitle">
                    <span class="title" v-text="task.name"></span>
                </div>
            </div>
            <div flex="main:justify cross:center">
                <div class="tasksFont">
                    <span>转发</span><span style="color:#f27427;">{{` +${task.forwardRedowd}`}}</span>
                    <span>点击</span><span style="color:#f27427;">{{` +${task.clickReword}`}}</span>
                </div>
                <div class="tasksFont">
                    <span v-text="task.participation"></span><span>人参与 * </span>
                    <span>{{task.finished | isFinished }}</span>
                </div>
            </div>
        </div>
    </div>
    <div>
        <dialog :show.sync="isShow" dialog-transition="" :scroll="false">
            <div class="allTasks-modal">
                <div class="allTasks-header" flex="dir:top main:center cross:center">
                  <img style="height:200px;" src="http://img0.imgtn.bdimg.com/it/u=4293591722,688107236&fm=21&gp=0.jpg"/>
                </div>
                <div class="allTasks-content" flex="dir:top main:center cross:center">
                    <div class="" style="padding:10px;">
                      <span>你即将进入活动链接页面，分享后返回任务中心，即可完成任务！</span>
                    </div>
                    <div class="" style="padding:10px;" flex="dir:left main:center cross:center">
                      <img style="width:30px;height:30px;border-radius:5px;" src="http://img0.imgtn.bdimg.com/it/u=4293591722,688107236&fm=21&gp=0.jpg"/>
                      <span style="font-size:30px;color:#f27427;padding-left:10px;">1035</span>
                    </div>
                    <div style="width:100%;padding:10px 0px;" flex="main:center cross:center" >
                        <div flex-box="1" flex="main:center cross:center">
                          <span>分享奖励</span><span style="color:#f27427;">{{`&nbsp;+${showTask.forwardRedowd}`}}</span>
                        </div>
                        <div flex-box="1" flex="main:center cross:center">
                          <span>好友点击</span><span style="color:#f27427;">{{`&nbsp;+${showTask.clickReword}`}}</span>
                        </div>
                    </div>
                </div>
                <div flex="main:center cross:center" class="allTasks-footer">
                    <div flex-box="1">
                        <span>接收</span>
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
                let pageSize = 50,
                    pageIndex = 1

                this.breakAjax = Tool.get(`WxTask/list`, {pageSize,pageIndex}, (data) => {
                    this.GET_DATA_LIST(data.data)
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
            }
    }
}

</script>
