<style lang="less" scoped>

@import "../less/taskCenter";
@import "../less/lazyLoad";

</style>

<template>

  <div>
      <br>
      <div class="myTasks">
          <div class="myTaskItem" flex="main:justify cross:center" v-for="task in list">
              <div flex="main:center cross:center">
                  <img class="img" :src="task.image" lazy="loading" style="border-radius:5px;width:80px;height:80px;" />
              </div>
              <div flex-box="4" flex="dir:top main:left cross:left" style="padding:5px;">
                  <div flex-box="1" class="taskItemTitle">
                      <span v-text="task.wxTask.name"></span>
                  </div>
                  <div flex-box="1" class="taskCreatedAt">
                      <span>{{task.wxTask.createDate | formatDate}} 发布</span>
                  </div>
                  <div flex-box="3" class="taskInfos">
                      <span>点击 </span>
                      <span v-text="task.wxTask.click"></span>
                      <span> 分享 </span>
                      <span v-text="task.wxTask.share"></span>
                  </div>
              </div>

          </div>
      </div>
  </div>

</template>

<script>

const NAME = 'myTasks'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {
    myTasks: []
})

export default {
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
            let userId = '402881e756ffea570156ffeaa66d0000'

            this.breakAjax = Tool.get(`WxTaskBus/list`, {userId}, (data) => {
                this.GET_DATA_LIST(data.data)
            }, this.GET_DATA_ERROR)
        }
    }
}

</script>
