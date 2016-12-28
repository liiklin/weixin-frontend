<style lang="stylus" scoped>
@import '../stylus/myRed'
</style>

<template lang="pug">
div
  .header-box
    x-header(style="background-color:#000;", :left-options="{showBack:true,backText:'返回',preventGoBack:true}", @on-click-back="goBack")
      | 个人中心
  div
    div(flex="dir:top main:center cross:center", style="padding-top:46px;height:150px;background-color:#7998ab;color:#fff;")
      div
        i.iconfont.icon-align-justify(style="font-size: 50px;")
      div
        span
          | 共收到 
        span(v-text="myred.total")
        span
          | 元
    div(style="padding: 5px;")
      divider
        | 红包明细
    div
      .scoreDetail(v-for="red in list", flex="main:left box:last")
        div(flex="dir:top")
          span
            | {{red.createdAt | formatDate 'YYYY-MM-DD'}}
        div(flex="main:center cross:center")
          span.changeScore
            | {{`${red.receive}元`}}
</template>

<script >

const NAME = 'red'

import {
    Scroller,
    XHeader,
    Divider,
    Group,
    Cell
}
from 'vux'
import moment from 'moment'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {
    myred: {}
})


export default {
    components: {
        Scroller,
        XHeader,
        Divider,
        Group,
        Cell
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

            this.breakAjax = Tool.get(`/red`, {}, (data) => {
                this.SET_CUSTOM_KEY({
                    myred: data
                })
                this.PULL_PAGE_LIST_PUSH(data.details)
            }, this.GET_DATA_ERROR)
        },
        goBack(){
          this.$router.go({ name: 'home',replace: true})
        }
    },
    computed: {

    }
}
</script>
