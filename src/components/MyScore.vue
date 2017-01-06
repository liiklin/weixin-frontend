<style lang="stylus" scoped>
@import '../stylus/myScore';
</style>

<template lang="pug">
div
  div
    div
      .scoreBg(flex="dir:top main:center cross:center")
        div
          i.iconfont.icon-align-justify(style="font-size: 50px;")
        div
          span
            | 积分 
          span(v-text="user.score")
      div(style="padding: 5px;")
        divider
          | 积分明细
      div
        .scoreDetail(v-for="score in list", flex="main:left box:last")
          .detail(flex="dir:top")
            span(v-text="score.name | prizesTitle")
            span
              | {{score.createTime | formatDate}}
          div(flex="main:center cross:center")
            span.addScore(v-show="score.content.indexOf('-') < 0")
              | {{score.content | formatNumbers}}
            span.exChangeScore(v-show="score.content.indexOf('-') > -1")
              | {{score.content | formatNumbers}}
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

import _ from 'underscore' //underscore

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
            let wxId = this.user.id
            if (_.has(this.$route.query,'id')) {
              wxId = this.$route.query.id
            }

            this.breakAjax = Tool.get(`WxBus/myScoreList`, {
                wxId
            }, (data) => {
                this.GET_DATA_LIST(data)
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
