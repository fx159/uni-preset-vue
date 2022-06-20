<template>
	<view class="code-page">
		<view class="key-input">
			<view class="title">输入验证码</view>
			<view class="tips">验证码已发送至 +{{hidePhone}}</view>
			<view @click="handleClick">

			<u-message-input :focus="true" :value="value" @change="change"  @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			</view>
			<text :class="{ error: error }">验证码错误，请重新输入</text>
			<view class="captcha">
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Log from '../../common/log.js';
	export default {
		data() {
			return {
				maxlength: 6,
				value: '',
				second: 60,
				show: false,
				error: false,
				phone: '',
				redirctUrl: '',
				nickname: '',
				icon: '',
				location: { //用户定位经纬度
				  latitude: 0,
				  longitude: 0
			  	},
			};
		},
		computed: {
			hidePhone() {
				return this.phone.substring(0, 3) + ' **** ' + this.phone.substring(7, 11)
			}
		},
		onShow() {
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
		},
		async onLoad(opt) {
			this.phone = opt.phone;
			this.redirctUrl = opt.redirct;
			this.icon = opt.icon
			this.nickname = opt.nickname
			try {
				const { latitude, longitude } = await uni.getStorageSync('user-location')
				this.location.latitude = latitude
				this.location.longitude = longitude
			} catch (error) {
				console.log(error)
			}
			let interval = setInterval(() => {
				this.second--;
				if (this.second <= 0) {
					this.show = true;
					if (this.value.lenth != 4) {
						this.error = true;
					}
					clearInterval(interval);
				}
			}, 1000);
				
		},
		methods: {
			handleClick(){
				console.log('click')
				Log.saveEvent('2', `{type: '点击', label: '验证码输入框', key: ''}`);
			},
			/**
			 * change事件侦听
			 * @param {Object} value
			 */
			change(value) {
				console.log('change', value);
			},
			/**
			 * 输入完验证码最后一位执行
			 * @param {Object} value
			 */
			finish(value) {
				wx.login({
					success: async (res) => {
						this.$u.api.getWxInfoByCode({
							code: res.code
						    }).then(async result => {
								const session_key = result.data.session_key;
								getApp().globalData.session_key = session_key;
								console.log('unionId:'+result.data.unionid)
								getApp().globalData.unionId = result.data.unionid;
								getApp().globalData.openId = result.data.openid;
								// console.log('data uniom:'+JSON.stringify( res.data))
								// 判断是否携带shareTicket
								if(getApp().globalData.shareTicket) {
									const params = {
										encryptedData: getApp().globalData.privateMessage.encryptedData,
										sessionKey: result.data.session_key,
										iv: getApp().globalData.privateMessage.iv,
										unoinId: result.data.unionid
									  }
										try {
											await this.$u.api.addShareRecord(params)
										} catch (error) {
											console.log(error)
										}
									
								}
								this.$u.api.login({
									telephone: parseInt(this.phone),
									authCode: value,
									source: '侯朝辉法律顾问小程序',
									nickname: this.nickname,
									icon: this.icon,
									unionId: getApp().globalData.unionId,
									openId: result.data.openid,
									scene: getApp().globalData.scene || '',
									x: this.location.latitude,
			   					y: this.location.longitude,
									unitId: getApp().globalData.unitId
								}).then( async ({data}) => {
									// const {
									// 	data
									// } = result;
									getApp().globalData.userId = data.id;
									getApp().globalData.phone = this.phone;
									getApp().globalData.name = data.name;
									getApp().globalData.userHeader = data.pic_url;
									// const tokenData = await this.$u.api.getYuanjiaToken(getApp().globalData.unionId)
									// getApp().globalData.token = `${data.tokenHead} ${tokenData}`
									if(getApp().globalData.scene) {
										this.$u.api.scanCode(JSON.stringify({
											 userId: data.id,
											 scene: getApp().globalData.scene
										}))
									}
									uni.setStorageSync('user-info', {
										token: `${data.tokenHead} ${data.token.token}`,
										name: data.name,
										phone: this.phone,
										header: data.pic_url,
										openid: getApp().globalData.openId,
										unionid: getApp().globalData.unionId,
										id: data.id
									});
									if (this.$u.test.isEmpty(this.redirctUrl)) {
										uni.switchTab({
											url: '/pages/home/index',
										})
									} else {
										if (this.redirctUrl === 'pages/qa/main' || this.redirctUrl === 'pages/home/index' || this.redirctUrl ===
											'pages/user-center/index') {
											uni.switchTab({
												url: `/${this.redirctUrl}`
											})
										} else {
											wx.navigateTo({
												url: `/${this.redirctUrl}`
											})
										}
									}
							    })
						    })
						
					},
					fail: err =>{
						console.log(err)
					}
				})
				Log.saveEvent('2', `{type: '点击', label: '验证码输入框', key: ''}`);
				
			}
		}
	};
</script>

<style lang="scss" scoped>
	.code-page {
		padding: 80rpx 40upx;
	}
	.box {
		margin: 30rpx 0;
		font-size: 30rpx;
		color: 555;
	}
	.key-input {
		padding: 30rpx 0;
		text {
			display: none;
		}

		.error {
			display: block;
			color: red;
			font-size: 30rpx;
			margin: 20rpx 0;
			padding: 0 40upx;
		}
	}

	.title {
		font-size: 50rpx;
		color: #333;
		padding: 0 40upx;
	}

	.tips {
		padding: 0 40upx;
	}

	.key-input .tips {
		font-size: 30rpx;
		color: #333;
		margin-top: 20rpx;
		margin-bottom: 60rpx;
	}

	.captcha {
		color: $u-type-warning;
		padding: 0 40upx;
		font-size: 30rpx;
		margin-top: 40rpx;

		.regain {
			display: block;
		}
	}
</style>
