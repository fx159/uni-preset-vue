<template>
	<web-view :src="path"></web-view>
</template>

<script>
	import Log from '../../common/log' 
	export default {
		data() {
			return {
				path: ''
			}
		},
		onShareAppMessage() {
			// 分享埋点
			Log.saveEvent('-2', '分享', 'click')
		},
		onShow(){
			this.$store.commit('setPagerInfo', {
				name: '视频咨询页',
				code: '22',
				url: '/pagesOther/roomView/index'
			});
		},
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
		},
		onLoad(opt) {
			const {token,userId,recordId,streamId,roomId,spuId,lawyerUserId,unitId,source,consultType} = opt
      this.path = `https://lawyer-screen-metting.aegis-info.com/#/?token=${token}&userId=${userId}&recordId=${recordId}&streamId=${streamId}&roomId=${roomId}&spuId=${spuId}&lawyerUserId=${lawyerUserId}&unitId=${unitId}&source=${source}&consultType=${consultType}`
      console.log(this.path)
   	}
	}
</script>
