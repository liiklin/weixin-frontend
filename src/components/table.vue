<template lang="pug">

table
	tr
		th(v-for="title in titles" v-text="title")
	tr(v-for="data in listDatas")
		td(style="width:1.5625rem;" v-text="data.index")
		td( v-text="data.name")
		td(style="width:1.5625rem;" v-text="data.scored")
</template>

<script>
export default {
    name: 'Vtable',
		props:{
			listDatas:{
				type:Array
			},
			titles:{
				type:Array,
				default:['排行', '名称', '分数']
			}
		}
}

</script>

<style scoped lang="stylus" src="../stylus/table.styl"></style>
