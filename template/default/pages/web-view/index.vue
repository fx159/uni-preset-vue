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
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
		},
		onShareAppMessage() {
			// 分享埋点
			Log.saveEvent('-2', '分享', 'click')
		},
		onShow() {
			this.$store.commit('setPagerInfo', {
				name: '法律专题',
				code: '18',
				url: '/pages/webview/index'
			});
			Log.saveEvent('0', '加载页面', 'onShow');
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
		},
		onLoad(opt) {
			const {
				path,
				recordId,
				subjectId,
				causeid,
				phone,
				topic,
				topic_id,
				eventId,
        type,
				orderId,
				platform,
				company,
				source,
				unitId,
				lawyerUserId,
				spuId,
				streamId,
				userId,
				productId,
				kindId,
				contractId
			} = opt;
			console.log(opt.mp)
			const query = '?from=mp' 
			this.path = path + query ;
			const userinfo = uni.getStorageSync('user-info');
			if (userinfo && userinfo.token) {
				this.path = this.$u.test.isEmpty(userinfo.token) ? this.path : this.path + '&token=' + userinfo.token.substr(7)
			}
			if (!this.$u.test.isEmpty(phone)) {
				this.path = this.path + '&phone=' + phone;
			}
			this.path = this.$u.test.isEmpty(recordId) ? this.path : this.path + '&record_id=' + recordId;
			this.path = this.$u.test.isEmpty(subjectId) ? this.path : this.path + '&subjectId=' + subjectId;
			this.path = this.$u.test.isEmpty(causeid) ? this.path : this.path + '&causeid=' + causeid;
			this.path = this.$u.test.isEmpty(topic) ? this.path : this.path + '&topic=' + topic;
			this.path = this.$u.test.isEmpty(topic_id) ? this.path : this.path + '&topic_id=' + topic_id;
			this.path = this.$u.test.isEmpty(eventId) ? this.path : this.path + '&eventId=' + eventId;
			this.path = this.$u.test.isEmpty(type) ? this.path : this.path + '&type=' + type;
			this.path = this.$u.test.isEmpty(orderId) ? this.path : this.path + '&orderId=' + orderId;
			this.path = this.$u.test.isEmpty(platform) ? this.path : this.path + '&platform=' + platform;
			this.path = this.$u.test.isEmpty(company) ? this.path : this.path + '&company=' + company;
			this.path = this.$u.test.isEmpty(source) ? this.path : this.path + '&source=' + source;
			this.path = this.$u.test.isEmpty(unitId) ? this.path : this.path + '&unitId=' + unitId;
			this.path = this.$u.test.isEmpty(lawyerUserId) ? this.path : this.path + '&lawyerUserId=' + lawyerUserId;
			this.path = this.$u.test.isEmpty(spuId) ? this.path : this.path + '&source=' + spuId;
			this.path = this.$u.test.isEmpty(streamId) ? this.path : this.path + '&streamId=' + streamId;
			this.path = this.$u.test.isEmpty(userId) ? this.path : this.path + '&userId=' + userId;
			this.path = this.$u.test.isEmpty(productId) ? this.path : this.path + '&productId=' + productId;
			this.path = this.$u.test.isEmpty(kindId) ? this.path : this.path + '&kindId=' + kindId;
			this.path = this.$u.test.isEmpty(contractId) ? this.path : this.path + '&contractId=' + contractId;
			console.log('this.path:',this.path)
			}
	}
</script>

<style>
</style>
