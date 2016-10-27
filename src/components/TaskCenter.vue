<style lang="less" scoped>

@import "../less/taskCenter";
@import "../less/lazyLoad";

</style>

<template>

<div>
    <div>
        <div>
            <x-header style="background-color:#000;" :left-options={showBack:true,backText:'返回',preventGoBack:true} @on-click-back="goBack">任务中心</x-header>
        </div>
        <tab :line-width=2 active-color='#e55652'>
            <tab-item class="vux-center" v-for="item in tabList" v-link="{ name: item,replace: true}" :selected="$route.path.indexOf(item) > -1">
                {{urlObj[item]}}
            </tab-item>
        </tab>
    </div>
    <div>
        <router-view></router-view>
    </div>
</div>

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

// const urlObj = {
//     '全部任务': 'all',
//     '我的任务': 'my'
// }

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
