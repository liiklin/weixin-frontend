<style lang="stylus" scoped>
@import '../stylus/myRed';

</style>

<template lang="pug">
div
  div
    div(flex="dir:top main:center cross:center", style="padding-top:46px;height:150px;background-color:#7998ab;color:#fff;")
      div
        i.iconfont.icon-align-justify(style="font-size: 50px;")
      div
        span 共收到 
        span(v-text="user.myTotalRedPacket")
        span  元
    div(style="padding: 5px;")
      divider 红包明细
    div
      .scoreDetail(v-for="red in list", flex="main:left box:last")
        div(flex="dir:top")
          span {{red.createdAt | formatDate 'YYYY-MM-DD'}}
        div(flex="main:center cross:center")
          span.changeScore {{`${red.receive}元`}}
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
import _ from 'underscore' //underscore

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
                // let wxId = 'o1Xf6wJiAYZqvcParrR85Hl_7BD0'
                let wxId = this.user.id
                if (_.has(this.$route.query,'id')) {
                  wxId = this.$route.query.id
                }
                this.breakAjax = Tool.get(`WxBus/myRedPacketList`, {
                    wxId
                }, (data) => {
                    this.SET_CUSTOM_KEY({
                        myred: data
                    })
                    this.PULL_PAGE_LIST_PUSH(data.details)
                }, this.GET_DATA_ERROR)
            },
            goBack() {
                this.$router.go({
                    name: 'home',
                    replace: true
                })
            }
    },
    computed: {

    }
}

</script>
