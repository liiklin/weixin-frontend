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
          | 奖品列表
      div
        .scoreDetail(v-for="score in list", flex="main:left box:last")
          .detail(flex="dir:top")
            span(v-text="score.score | formatExchange score.redpack")
          div(flex="main:center cross:center")
            button.exchange(v-if="user.score > score.score" type="button" @click="scoreExchange(score.score,score.redpack)") 兑换
            button.disabled(v-else="" type="button") 兑换
</template>

<script>
const NAME = 'shop'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'
import _ from 'underscore' //underscore

import {
    Scroller,
    Divider
}
from 'vux'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {

})

export default{
  components: {
      Scroller,
      Divider
  },
  mixins: [mixins(NAME)],
  route:{
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
  methods:{
    getTaskLists() {
        this.GET_DATA_START()
        let wxId = this.user.id
        if (_.has(this.$route.query,'id')) {
          wxId = this.$route.query.id
        }

        Tool.get(`WxBus/getWxExchangeConfig`, {wxId}, (data) => {
            if (_.isEmpty(data)) {
              return;
            }
            let totalAmount = data.totalAmount,
              items = []
            _.each(data,(value,key)=>{
              if (key.indexOf('score') > -1) {
                let item = {}
                item.score = value
                item.redpack = data[`redpack${key.replace('score','')}`]
                items.push(item)
              }
            })
            this.GET_DATA_LIST(_.sortBy(items,'score'))
        }, this.GET_DATA_ERROR)
    },
    scoreExchange(score,redpack){
      if(this.breakAjax) return
      let wxId = this.user.id
      if (_.has(this.$route.query,'id')) {
        wxId = this.$route.query.id
      }

      Tool.post(`WxBus/scoreExchange`, {
          wxId,
          score,
          redpack
      },(data)=>{
        if (data.success) {
          let user = _.extend(JSON.parse(JSON.stringify(this.view)), {
						score: Number(this.view.score) + Number(data.msg)
					})
					// this.GET_DATA_VIEW(user)
          this.SIGNIN(user)
          alert('兑换成功')
        }else {
          alert('兑换失败，\n请重试。')
        }
      })
    }
  },
  computed:{
  }
}
</script>

<style lang="stylus">
@import '../stylus/shop'
</style>
