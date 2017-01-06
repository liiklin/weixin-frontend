<template lang="pug">
#bg
  .h10
  ul(v-if="list.length")
    li(flex="dir:left cross:center" v-for="item in list")
      .header
        img(:src="item.img")
      .name
        span(v-text="item.name")
      .time
        span(v-text="item.time | formatDate")
  .no-invite(v-else="")
    span 暂时没有邀请记录
  .h10
</template>

<script>
const NAME = 'invite'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'
import _ from 'underscore'

export default {
  mixins: [mixins(NAME)],
  route: {
    data() {
      this.getInvite()
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
    getInvite(){
      this.GET_DATA_START()
      let wxId = this.user.id
      if (_.has(this.$route.query, 'id')) {
        wxId = this.$route.query.id
      }

      Tool.get('WxBus/getMyInvitation', {
        wxId
      }, (data) => {
        if (data) {
          let lists = _.map(data,(value,key)=>{
            return {
              img:value.acceptPhoto,
              name:value.acceptName,
              time:value.modifyTime
            }
          })
          this.GET_DATA_LIST(lists)
        } else {
          this.GET_DATA_ERROR({
            loadTip: '用户不存在'
          })
        }
      }, this.GET_DATA_ERROR)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../stylus/invite'
</style>
