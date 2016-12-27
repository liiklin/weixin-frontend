<style lang="less" scoped>

@import "../less/taskCenter";
@import "../less/lazyLoad";

</style>

<template lang="pug">
div
  .tab-header
    tab(:line-width="2", active-color="#e55652")
      tab-item.vux-center(v-for="item in tabList", v-link="{ name: item,replace: true}", :selected="$route.path.indexOf(item) > -1")
        | {{urlObj[item]}}
  div(style="padding-top:30px;")
    router-view
</template>

<script>

const NAME = 'taskCenter'

import {
    Tab,
    TabItem,
    XHeader
}
from 'vux';

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'

const urlObj = {
    'all': '全部任务',
    'my': '我的任务'
}

export default {
    components: {
        Tab,
        TabItem,
        XHeader
    },
    mixins: [mixins(NAME)],
    data() {
        return {
            tabList: ['all', 'my'],
            urlObj
        }
    },
    methods:{
      goBack(){
        this.$router.go({ name: 'home',replace: true})
      }
    }
}

</script>
