<style lang="less" scoped>

@import "../less/home";

</style>

<template>

<div>
    <div id="header">
        <div flex="main:center cross:center">
            <div class="user-icon" v-link="{ path: 'user' }">
                <img v-bind:src="view.userIcon" alt="" />
            </div>
        </div>
        <span id="userName" flex="main:center cross:center" v-text="view.userName"></span>
    </div>
    <div class="task-content" flex="main:center cross:center">
        <div class="task-item" flex-box="1" flex="main:center cross:center" v-link="{ name: 'all' }">
            <div class="task-icon" flex="dir:top main:center cross:center">
                <img src="http://placeholder.qiniudn.com/40x40/4CD964/fff" alt="" />
                <div class="notice" v-show="showRedPointer"></div>
                <span flex="main:center cross:center">任务中心</span>
            </div>
        </div>
        <div class="task-item" flex-box="1" flex="main:center cross:center">
            <div class="task-icon" flex="dir:top main:center cross:center">
                <img src="http://placeholder.qiniudn.com/40x40/4CD964/fff" alt="" />
                <span flex="main:center cross:center">积分商城</span>
            </div>
        </div>
        <div class="task-item" flex-box="1" flex="main:center cross:center">
            <div class="task-icon" flex="dir:top main:center cross:center" v-link="{ name: 'score' }">
                <img src="http://placeholder.qiniudn.com/40x40/4CD964/fff" alt="" />
                <span flex="main:center cross:center">我的积分</span>
            </div>
        </div>
        <div class="task-item" flex-box="1" flex="main:center cross:center">
            <div class="task-icon" flex="dir:top main:center cross:center" v-link="{ name: 'red' }">
                <img src="http://placeholder.qiniudn.com/40x40/4CD964/fff" alt="" />
                <span flex="main:center cross:center">我的红包</span>
            </div>
        </div>
    </div>
    <div class="my-briefing" flex="dir:top main:center">
        <div class="my-briefing-top" flex="main:center">
            <span flex="main:center cross:center">我的简报</span>
        </div>
        <div style="padding: 10px 0;" flex="dir:left main:center cross:center">
            <div class="briefing-item" flex-box="1" flex="main:center cross:center" v-link="{ name: 'my' }">
                <div flex-box="1">
                    <circle :percent="getTaskPrecent" :stroke-width="5" stroke-color="#eb7024">
                        <span>{{view.completedTask}}个</span>
                    </circle>
                    <span flex="dir:left main:center cross:center" style="font-size: 12px;">完成任务</span>
                </div>
            </div>
            <div class="briefing-item" flex-box="3" flex="main:center cross:center" v-link="{ name: 'score' }">
                <div flex-box="1">
                    <circle :percent="100" :stroke-width="5" stroke-color="#4a8efc">
                        <span>{{view.score}}分</span>
                    </circle>
                    <span flex="dir:left main:center cross:center" style="font-size: 12px;">获得奖励</span>
                </div>
            </div>
            <div class="briefing-item" flex-box="1" flex="main:center cross:center">
                <div flex-box="1">
                    <circle :percent="getRatePrecent" :stroke-width="5" stroke-color="#fb5b52">
                        <span>{{view.rate * 100}}%</span>
                    </circle>
                    <span flex="dir:left main:center cross:center" style="font-size: 12px;">击败比</span>
                </div>
            </div>
        </div>
        <div class="doTask" flex="main:center cross:center">
            <div flex-box="1" flex="main:center cross:center">
                <button type="button" class="wei-btn-default">开启任务赚积分</button>
            </div>
            <div flex-box="1" flex="main:center cross:center">
                <button type="button" class="wei-btn">邀请好友赚积分</button>
            </div>
        </div>
    </div>

</div>

</template>

<script>

const NAME = 'home'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'
import wx from 'weixin-js-sdk' //微信jssdk

import {
    Circle
}
from 'vux'


export default {
    components: {
        Circle
    },
    mixins: [mixins(NAME)],
    route: {
        data() {
                console.log(wx)
                this.getUserInfo()
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
        getUserInfo() {
            if (this.breakAjax) return false //请求未结束，防止重复请求
            this.GET_DATA_START()
            let id = '402881e756ffea570156ffeaa66d0000'

            this.breakAjax = Tool.get('SysUser/get', {'id[]':id}, (data) => {
                if (data) {
                    this.GET_DATA_VIEW(data)
                } else {
                    this.GET_DATA_ERROR({
                        loadTip: '用户不存在'
                    })
                }
            }, this.GET_DATA_ERROR)
        }
    },
    computed: {
        showRedPointer() {
                return this.view.totalTask - this.view.completedTask > 0
            },
            getTaskPrecent() {
                return Number(this.view.completedTask / this.view.totalTask).toFixed(2) * 100
            },
            getRatePrecent() {
                return this.view.rate * 100
            }
    }
}

</script>
