<style lang="less" scoped>

@import '../less/myScore';

</style>

<template>

<div>
    <div>
        <x-header style="background-color:#000;" :left-options={showBack:true,backText:'返回',preventGoBack:true} @on-click-back="goBack">我的积分</x-header>
    </div>
    <div>
        <div flex="dir:top main:center cross:center" style="height:150px;background-color:#7998ab;color:#fff;">
            <div>
                <i class="iconfont icon-align-justify" style="font-size: 50px;"></i>
            </div>
            <div>
                <span>积分&nbsp;</span><span v-text="myscore.score"></span>
            </div>
        </div>
        <div style="padding: 5px;">
            <divider>积分明细</divider>
        </div>
        <div>
            <div class="scoreDetail" v-for="score in list" flex="main:left box:last">
                <div flex="dir:top" class="detail">
                    <span v-text="score.title"></span>
                    <span>{{score.createdAt | formatDate}}</span>
                </div>
                <div flex="main:center cross:center">
                    <span class="changeScore">{{score.change | formatNumbers}}</span>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script >

const NAME = 'score'

import {
    XHeader,
    Scroller,
    Divider
}
from 'vux'


import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {
    myscore: {}
})


export default {
    components: {
        XHeader,
        Scroller,
        Divider
    },
    mixins: [mixins(NAME)],
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

            this.breakAjax = Tool.get(`/score`, {}, (data) => {
                this.SET_CUSTOM_KEY({
                    myscore: data
                })
                this.PULL_PAGE_LIST_PUSH(data.scoreDetail)
            }, this.GET_DATA_ERROR)
        },
        goBack(){
          this.$router.go({ name: 'home',replace: true})
        }
    },
    computed: {
        showChange(change) {
            return change > 0 ? `+${change}` : change
        }
    }
}

</script>
