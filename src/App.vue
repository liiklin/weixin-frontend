<style media="screen" lang="less">
@import 'less/transition';
</style>

<template>

<div style="height:100%;">
    <loading :show="isLoading" text="获取数据中..." position="absolute"></loading>
    <router-view></router-view>
    <!-- <router-view :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"></router-view> -->
</div>

</template>

<script>

import Tool from './Tool'
import store from './vuex/store'

import {
    Loading
}
from 'vux'

export default {
    components: {
        Loading
    },
    store: store,
    vuex: {
        getters: {
            isLoading: (state) => state.isLoading,
            direction: (state) => state.direction
        }
    },
    data () {
      return {
        routerTransition: {
          forward: 'slideRL',
          back: 'slideLR'
        }
      }
    }
}

</script>
