<style lang="stylus" scoped>
@import "../stylus/home"
@import "../stylus/button"
</style>

<template lang="pug">
div
	#header
		div(flex="main:center cross:center")
			.user-icon
				img(v-bind:src="view.wxPhoto")
		span#userName(flex="main:center cross:center", v-text="view.name")
		.h10
		.signBase(:class="{hasSign:isSign,sign:!isSign}" @click="doSign")
			div(v-if="isSign")
				span
					|	已签到
			.vux-reddot-border(v-else="")
				span
					| 签到
		.showSign(v-if="signShow" transition="fadeUp")
			span
				|	{{ `积分+&nbsp;${addSignSroce}` }}
	.task-content(flex="main:center cross:center")
		.task-item(flex-box="1", flex="main:center cross:center", v-link="{ name: 'all' }")
			.task-icon(flex="dir:top main:center cross:center")
				img(src="../assets/icon1.png")
				.notice(v-show="showRedPointer")
				span(flex="main:center cross:center")
					| 任务中心
		.task-item(flex-box="1", flex="main:center cross:center", v-link="{ name: 'shop' }")
			.task-icon(flex="dir:top main:center cross:center")
				img(src="../assets/icon2.png")
				span(flex="main:center cross:center")
					| 积分商城
		.task-item(flex-box="1", flex="main:center cross:center", v-link="{ name: 'score' }")
			.task-icon(flex="dir:top main:center cross:center")
				img(src="../assets/icon3.png")
				span(flex="main:center cross:center")
					| 我的积分
		.task-item(flex-box="1", flex="main:center cross:center", v-link="{ name: 'invite' }")
			.task-icon(flex="dir:top main:center cross:center")
				img(src="../assets/icon4.png")
				span(flex="main:center cross:center")
					| 我的邀请
	.my-briefing(flex="dir:top main:center")
		.my-briefing-top(flex="main:center")
			span(flex="main:center cross:center")
				| 我的简报
		div(style="padding: 10px 0;", flex="dir:left main:center cross:center")
			.briefing-item(flex="main:center cross:center", v-link="{ name: 'my' }")
				.briefing-item()
					circle(:percent="getTaskPrecent", :trail-width="strokeWidth", :stroke-width="strokeWidth", stroke-color="#f8b707")
						span
							| {{view.completedTask}}个
					span(flex="dir:left main:center cross:center", style="font-size: .375rem;color:#999999;")
						| 完成任务
			.briefing-item(flex="main:center cross:center", v-link="{ name: 'score' }")
				.briefing-item-center
					circle(:percent="50", :trail-width="strokeWidth", :stroke-width="strokeWidth", stroke-color="#00adeb")
						span
							| {{view.score}}分
					span(flex="dir:left main:center cross:center", style="font-size: .375rem;color:#999999;")
						| 获得奖励
			.briefing-item(flex="main:center cross:center")
				.briefing-item
					circle(:percent="getRatePrecent", :trail-width="strokeWidth", :stroke-width="strokeWidth", stroke-color="#f9343d")
						span
							| {{view.rate}}
					span(flex="dir:left main:center cross:center", style="font-size: .375rem;color:#999999;")
						| 击败比
		.doTask(flex="main:center cross:center")
			div(class="btn" flex-box="1" flex="dir:top main:center cross=center" @click="doExam")
				div(class="btn-start" flex="main:center cross=center")
					span
						| 考试赚积分
			div(class="btn" flex-box="1" flex="dir:top main:center cross=center" @click="goInvite")
				div(class="btn-rank" flex="main:center cross=center")
					span
						| 邀请好友赚积分
</template>

<script>
const NAME = 'home'

import Tool from '../Tool'
import mixins from '../mixins'
import store from '../vuex/store'
import _ from 'underscore'

import {
	Circle
}
from 'vux'

store.dispatch(`${NAME}ADD_CUSTOM_KEY`, {
	signShow: false,
	addSignSroce: 0,
	isSign: false,
	strokeWidth: 5,
})

export default {
	components: {
		Circle
	},
	mixins: [mixins(NAME)],
	route: {
		data() {
			this.getUserInfo()
			let rem = Number(getComputedStyle(window.document.documentElement)['font-size'].replace('px','')) / 32
			this.SET_CUSTOM_KEY({
				strokeWidth: 5 * rem
			})
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
		getUserInfo() {
			this.GET_DATA_START()
			let wxId = this.user.id
			if (_.has(this.$route.query, 'id')) {
				wxId = this.$route.query.id
			}

			Tool.get('WxBus/getUserinfo', {
				wxId
			}, (data) => {
				if (data) {
					// console.log(data.myTaskList)
					let isSign = data.isSign
					let score = data.myTotalScore
					let rate = data.beatRatio
					let myTasks = data.myTaskList
					let myTotalRedPacket = data.myTotalRedPacket
					let totalTask = myTasks.length
					let completedTask = _.filter(myTasks, (task) => {
						return task.taskBusState == 1
					}).length

					let user = _.extend(data.user, {
						myTotalRedPacket,
						score,
						totalTask,
						completedTask,
						rate
					})
					this.SET_CUSTOM_KEY({
						// isSign: false,
						isSign
					})
					this.SIGNIN(user)
					this.GET_DATA_VIEW(user)
				} else {
					this.GET_DATA_ERROR({
						loadTip: '用户不存在'
					})
				}
			}, this.GET_DATA_ERROR)
		},
		doExam(){
			let wxId = this.user.id
			if (_.has(this.$route.query, 'id')) {
				wxId = this.$route.query.id
			}
			self.location = `http://weixin.7ipr.com/app/weixin/exam/index.html#/?id=${wxId}`
		},
		doSign() {
			if (this.isSign) return false //防止重复签到
			let wxId = this.user.id
			if (_.has(this.$route.query, 'id')) {
				wxId = this.$route.query.id
			}

			if (this.breakAjax) return false //请求未结束，防止重复请求
			this.breakAjax = Tool.post('WxBus/sign', {
				wxId
			}, (data) => {
				delete this.breakAjax
				if (data.msg == "0") {
						console.log('已经签到')
						// let user = _.extend(JSON.parse(JSON.stringify(this.view)), {
						// 	score: Number(this.view.score) + Number(data.msg)
						// })
						// this.GET_DATA_VIEW(user)
						// this.SET_CUSTOM_KEY({
						// 		signShow: true,
						// 		isSign:true,
						// 		addSignSroce: data.msg
						// })
						// setTimeout(()=>{
						// 	this.SET_CUSTOM_KEY({
						// 			signShow: false
						// 	})
						// },1000)
				} else {
					let user = _.extend(JSON.parse(JSON.stringify(this.view)), {
						score: Number(this.view.score) + Number(data.msg)
					})
					this.GET_DATA_VIEW(user)
					this.SET_CUSTOM_KEY({
						signShow: true,
						isSign: true,
						addSignSroce: data.msg
					})
					setTimeout(() => {
						this.SET_CUSTOM_KEY({
							signShow: false
						})
					}, 1000)
				}
			}, () => {
				delete this.breakAjax
				console.log('签到失败')
			})
		},
		goInvite(){
			let wxId = this.user.id
			if (_.has(this.$route.query, 'id')) {
				wxId = this.$route.query.id
			}

			self.location = `http://weixin.7ipr.com/app/weixin/qrcode/index.html#/?id=${wxId}`
		}
	},
	computed: {
		showRedPointer() {
			return this.view.totalTask - this.view.completedTask > 0
		},
		getTaskPrecent() {
			if (typeof this.view.completedTask !== 'undefined') {
				return Number(this.view.completedTask / this.view.totalTask).toFixed(2) * 100
			}
		},
		getRatePrecent() {
			if (this.view.rate) {
				return Number(this.view.rate.replace("%",""))
			}
		}
	}
}
</script>
