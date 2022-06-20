<script>
	export default {
		globalData: {
			userId: '', // 用户ID
			uuId: '', // 用户唯一标识
			unionId: '',
			openId: '',
			session_key: '',
			phone: '', // 手机号（问答流程的id）
			userHeader: '', // 头像
			name: '', // 用户名
			eventId: '', // 机构ID
			source: '', // 机构标识:a22607cd04e9e0435aa4
			type: '', // mp
			relay_title: '', // 小程序转发标题
			relay_desc: '', // 小程序转发描述
			web_title: '', // 页面标题
			temp_user_id: new Date().valueOf(), // 获取当前时间戳，作为openid获取不到的用户标识
			show_order_banner: false, // 是否显示待使用订单banner
			haveCallPhone: '', // 是否接听
			isClosedSocket: '', // 是否关闭socket
			customerInfo: {},// 客服信息,
			appid: '',
			unitId: config.ENV === 0 ? '' : config.ENV === 1 ? '' : '',
			skipToken: '',
			privateMessage: {
				iv: '',
				sessionKey: '',
				encryptedData: ''
			},
			role: false,
			shareTicket: ''
  	},
		onLaunch: function() {
			console.log('App Launch')
			this.handleUpdateManager();
			this.getUserInfo();
		},
		onShow: function() {
			console.log('App Show1')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			async getUserInfo(){
				const userInfo = await uni.getStorageSync('user-info');
				if (userInfo && userInfo.id) {
					console.log(userInfo.unionid)
					this.$scope.globalData.userId = userInfo.id;
					this.$scope.globalData.phone = userInfo.phone;
					this.$scope.globalData.openId = userInfo.openid;
					this.$scope.globalData.unionId = userInfo.unionid;
					this.$scope.globalData.name = userInfo.name;
				}
			},
			handleUpdateManager(){
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function (res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate)
				})
				updateManager.onUpdateReady(function () {
					wx.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success: function (res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate()
							}
						}
					})
				})
				updateManager.onUpdateFailed(function (err) {
					console.log(err)
					// 新版本下载失败
				})
			}
		}
	}
</script>

<style lang="scss">
@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
