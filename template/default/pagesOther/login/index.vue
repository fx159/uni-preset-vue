<template>
	<view class="login-page">
		<view class="content">
			<view class="title">侯朝辉法律顾问</view>
			<input class="u-border-bottom phone-input" type="number" v-model="phone" placeholder="请输入手机号" @click="handleInput()" />
			<view class="tips">若你是第一次登录，我们会帮你生成一个新账户</view>
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
		</view>
		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<button @click="bindGetUserProfile" class="wechat-button" id="phone">
						<view class="icon">
							<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
						</view>
						微信
					</button>
				</view>
				<view class="QQ item" @click="handleQQLogin()">
					<view class="icon">
						<u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon>
					</view>
					QQ
				</view>
			</view>
			<view class="hint">
				登录即表示你同意
				<text class="link" @click="handleShowText(0)">《隐私协议》</text>
				<text class="link" @click="handleShowText(1)">《免责声明》</text>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-popup v-model="showPhoneButton" mode="bottom">
				<view class="phoneContainer">
					<view class="desc">
						为了更好的提供服务，系统需要获取您的手机号
					</view>
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" type="default">手机号授权</button>
				</view>
		</u-popup>
		<u-popup v-model="showPopup" mode="bottom" height="900rpx" border-radius="24" :custom-style="popupStyle"
		 :mask-custom-style="maskCustomStyle">
			<view class="header-wrap" @click="handleClose()">
				<view v-for="(item ,index) in list" :key="index" :class="index === current ? 'active item' : 'item'" @click.stop="handleChangeTab(index)">{{ item.name }}</view>
			</view>
			<view v-if="current === 0" class="content-wrap">
				<scroll-view style="height: 742rpx;" :scroll-y="true">
					<view class="text-content">
						<view class="item" v-for="(item, index) in privacy" :key="index">{{item}}</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="current === 1" class="content-wrap">
				<scroll-view style="height: 742rpx;" :scroll-y="true">
					<view class="text-content">
						<view class="item" v-for="(item, index) in exemption" :key="index">{{item}}</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Doc from '../../static/doc/index.js';
	import Log from '../../common/log.js';
	import { debounce } from '../../common/utils.js'
	export default {
		data() {
			return {
				showPhoneButton: false,
				phone: '',
				redirctUrl: '',
				current: 0,
				userInfo: '',
				privacy: Doc.privacy,
				exemption: Doc.exemption,
				errorLoginCount: 0,
				list: [{
						name: '隐私协议'
					},
					{
						name: '免责声明'
					}
				],
				showPopup: false, // 显示隐私协议和免责声明
				canIUseGetUserProfile: false,
				location: { //用户定位经纬度
				  latitude: 0,
				  longitude: 0
			  	},
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (this.phone && this.$u.test.mobile(this.phoneVal)) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color.primary;
				}
				return style;
			},
			maskCustomStyle() {
				return {
					'background-color': 'rgba(0, 0, 0, 0.85)'
				}
			},
			popupStyle() {
				return {
					'box-shadow': '0 0 0.16rem 0 #edf1f6',
					// 'background-color': '#edf1f6'
				}
			},
			/**
			 * 去掉手机号中的空格
			 */
			phoneVal() {
				return this.phone.replace(/\s/g, '')
			}
		},
		watch: {
			// 手机号格式化为344格式
			phone(newValue, oldValue) {
				this.phone = newValue.length > oldValue.length ? newValue.replace(/\s/g, '').replace(/(\d{3})(\d{0,4})(\d{0,4})/,
					'$1 $2 $3') : this.phone.trim();
			}
		},
		methods: {
			// 获取用户位置
			// getLocation() {
			// 	return new Promise((resolve,reject)=>{
			// 		wx.getLocation({
			// 			type: 'gcj02',
			// 			success: (res)=>{
			// 				console.log(res)
			// 				this.location.longitude = res.longitude
			// 				this.location.latitude = res.latitude
			// 				resolve()
			// 			},
			// 			fail:(err)=>{
			// 				reject(err)
			// 			}
			// 		})
			// 	})
			// },
			/**
			 * 输入框店家
			 */
			handleInput() {
				Log.saveEvent('1', `{type: '点击', label: '手机号输入框', key: ''}`);
			},
			/**
			 * 获取验证码
			 */
			submit() {
				Log.saveEvent('3', `{type: '点击', label: '获取验证码', key: ''}`);
				wx.getUserProfile({
					desc: '完善用户信息',
					success: (result) => {
					  	if (this.$u.test.mobile(this.phoneVal)) {
					  		// 调用接口发送短信验证码
							console.log(result)
					  		this.$u.api.getCode({
					  			telephone: this.phoneVal
					  		}).then((res) => {								
					  			this.$u.route({
					  				url: 'pagesOther/login/code',
					  				params: {
					  					phone: this.phoneVal,
					  					redirct: this.redirctUrl,
										nickname: result.userInfo.nickName,
										icon: result.userInfo.avatarUrl
					  				}
					  			})
					  		})
					  	}
					},
					fail: (err) => {
				      console.log(err)
					}
				})
				
			},
			/**
			 * QQ登录
			 */
			handleQQLogin() {
				Log.saveEvent('6', 'QQ登录', 'click')
				this.$refs.uTips.show({
					title: '开发中，敬请期待...',
					type: 'info',
					duration: '2300'
				})
			},
			bindGetUserProfile(){
				
				wx.getUserProfile({
					  desc: '完善用户信息',
					  success:(res)=>{
						  console.log(res)
						this.userInfo  = res.userInfo
						Log.saveEvent('5', '微信登录', 'click')
						wx.login({
							success: res => {
								  this.$u.api.getWxInfoByCode({
											code: res.code
									}).then(async res => {
										
											const session_key = res.data.session_key;
											getApp().globalData.session_key = session_key;
											getApp().globalData.unionId = res.data.unionid;
											getApp().globalData.openId = res.data.openid;
											console.log('data uniom:'+JSON.stringify( res.data))
									})
								this.showPhoneButton = true
							},
							fail: err =>{
								
							}
						})
						
					  },
					  fail:(err)=>{
						  console.log(err)
					  }
				})
				
				
			},
			/**
			 * 微信一键登录
			 * @param {Object} e
			 */
			getPhoneNumber(e) {
				const session_key = getApp().globalData.session_key
                this.submitPhoneNumberLogin(e, session_key);
				Log.saveEvent('7', `{type: '点击', label: '手机号授权', key: ''}`, 'click');
			},
			submitPhoneNumberLogin (e, session_key) {
				if (!e.detail || !e.detail.encryptedData) {
				  return;
				}
				this.encryptedData = e.mp.detail.encryptedData;
				 console.log(getApp().globalData.unionId)
				const { iv, encryptedData } = e.mp.detail;
					  // this.userInfo  = res.userInfo
					  	this.$u.api.getWxLogin({
						  	icon: this.userInfo.avatarUrl,
						  	nickName:this.userInfo.nickName, 
						  	openId:getApp().globalData.openId,unionId:getApp().globalData.unionId,  
						 		encryptedData, 
						  	iv, 
						  	sessionKey: session_key, 
						  	version: '侯朝辉法律顾问',
								source: '侯朝辉法律顾问小程序',
								x: this.location.latitude,
			   			  y: this.location.longitude,
								unitId: getApp().globalData.unitId  
						  }).then( async res => {
						const { data } = res;
						if (data) {
								getApp().globalData.userId = data.userid;
								getApp().globalData.phone = data.phoneNumber;
								getApp().globalData.name = this.userInfo.nickName;
								getApp().globalData.userHeader = this.userInfo.avatarUrl;
								uni.setStorageSync('user-info', {
									token: `Bearer ${data.token}`,
									name: this.userInfo.nickName || data.phoneNumber,
									phone: data.phoneNumber,
									openid: getApp().globalData.openId,
									unionid: getApp().globalData.unionId,
									header: this.userInfo.avatarUrl,
									id: data.userid || getApp().globalData.unionId,
									icon: this.userInfo.avatarUrl,
									nickName:this.userInfo.nickName
								});
								console.log('opt.shareTicket:'+getApp().globalData.shareTicket)
								if(getApp().globalData.shareTicket) {
									console.log('opt.shareTicket:'+getApp().globalData.shareTicket)
									const params = {
										encryptedData: getApp().globalData.privateMessage.encryptedData,
										sessionKey: getApp().globalData.privateMessage.sessionKey,
										iv: getApp().globalData.privateMessage.iv,
										unoinId: getApp().globalData.unionId
									  }
									await this.$u.api.addShareRecord(params)
									console.log('addShareRecord success')
								}
								if(getApp().globalData.scene) {
									this.$u.api.scanCode(JSON.stringify({
										 userId: data.userid,
										 scene: getApp().globalData.scene
									}))
								}
								// const tokenData = await this.$u.api.getYuanjiaToken(getApp().globalData.unionId)
								if (this.$u.test.isEmpty(this.redirctUrl)) {
									uni.reLaunch({
										url: '/pages/home/index',
									})
									return;
								} else {
									uni.navigateTo({
										url: `/${this.redirctUrl}`
									})
								// 	if (this.redirctUrl === 'pages/qa/main' || this.redirctUrl === 'pages/home/index' || this.redirctUrl ==='pages/user-center/index') {
								// 			uni.navigateTo({
								// 				url: `/${this.redirctUrl}`
								// 			})
								// 		} else {
								// 			wx.navigateTo({
								// 				url: `/${this.redirctUrl}`
								// 			});
								// 		}
								// 	}
								// } else {
								//     this.errorLoginCount++;
								// 	if (this.errorLoginCount === 1) {
								// 		this.getPhoneNumber(e);
								// 	} else if (this.errorLoginCount > 1) {
								// 		this.$u.toast('刷新当前页面，请重新登录！')
									}
								}
					  })
					},
			/**
			 * 关闭弹窗
			 */
			handleClose() {
				this.current = 0;
				this.showPopup = false;
			},
			handleChangeTab(val) {
				this.current = val;
			},
			handleShowText(val) {
				Log.saveEvent('10', `{type: '点击', label: '查看隐私', key: ''}`);
				this.current = val;
				this.showPopup = true;
			}
		},
		onShow() {
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
			// 设置页面缓存
			this.$store.commit('setPagerInfo', {
				name: '登录页',
				code: '0',
				url: '/pages/login/index'
			});
			Log.saveEvent('0', '加载页面', 'onShow');
		},
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
		},
		async onLoad(opt) {
			// Log.saveEvent('0',)
			this.redirctUrl = opt.redirct;
			try {
				const { latitude, longitude } = await uni.getStorageSync('user-location')
				this.location.latitude = latitude
				this.location.longitude = longitude
			} catch (error) {
				console.log(error)
			}
			wx.login({
				success: (res) => {
					if (res && res.code) {
						uni.setStorageSync('wxcode', res.code);
					}
				}
			});
			if (wx.getUserProfile) {
				console.log('canIUseGetUserProfile success')
			     this.canIUseGetUserProfile = true
			 }else{
				 console.log('canIUseGetUserProfile fail')
			 }
		},
		/**
		 * 分享
		 */
		onShareAppMessage() {
			// 分享埋点
			Log.saveEvent('-2', '分享', 'click')
		}
	};
</script>

<style lang="scss" scoped>
	.phoneContainer{
		height: 400upx;
        align-items: center;
		display: flex;
		position: relative;
		text-align: center;
		.desc{
			position: absolute;
			top: 40upx;
            width: 100%;
			height: 80upx;
			text-align: center;
		}
		button{
			width: 80%;
			height: 80upx;
			border: 1px #ccc soild;
			border-radius: 5upx;
			font-size: 32upx;
			background-color: #04B404;
			color: #FFFFFF;
		}
	}
	.login-page {
		font-size: 28rpx;
		.content {
			width: 600rpx;
			margin: 80rpx auto 0;
			.title {
				text-align: left;
				font-size: 50rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
				font-size: 28upx;
			}

			.tips {
				color: #9fb0cd;
				font-size: 24upx;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: #007EFF;
				// color: rgba(255, 255, 255, .5);
				border: none;
				font-size: 30rpx;
				// padding: 12rpx 0;
				width: 100%;
				height: 80upx;
				font-weight: 500;
				color: #FFFFFF;
				// line-height: 80upx;
				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;
				align-items: center;
				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;

					button {
						background-color: transparent;
						font-size: 28rpx;
						color: #606266;
						border-radius: 0;
						line-height: 34upx;

						&::after {
							border-width: 0;
						}
					}
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 24rpx;
				color: $u-tips-color;

				.link {
					color: $uni-color-primary;
				}
			}
		}

		.header-wrap {
			display: flex;
			height: 138upx;
			padding-top: 20upx;
			box-sizing: border-box;

			&::before {
				width: 72upx;
				height: 6upx;
				background: rgba(222, 226, 232, 1);
				border-radius: 3upx;
				content: "";
				display: inline-block;
				left: 339upx;
				position: absolute;
			}

			.item {
				flex: 0 0 50%;
				font-size: 28upx;
				color: #65799b;
				text-align: center;
				position: relative;
				margin-top: 56upx;
				box-sizing: border-box;

				&.active {
					color: #113260;

					&::after {
						border-radius: 3px;
						background-color: #047BFF;
						content: "";
						display: inline-block;
						left: 90upx;
						height: 6upx;
						bottom: 0;
						width: 180upx;
						position: absolute;
						transition: all .3s;
					}
				}
			}
		}

		.content-wrap {
			background-color: #edf1f6;
			padding-top: 20upx;
			padding-bottom: 24upx;
			height: 762upx;
			box-sizing: border-box;
			overflow: hidden;

			.text-content {
				height: 100%;
				padding-top: 40upx;
				box-sizing: border-box;
				color: #3C3F50;
				font-size: 26upx;
				text-align: justify;
				line-height: 48upx;
				padding-left: 59upx;
				padding-right: 61upx;
			}
		}
	}
	.wechat-button{
		width: 180upx;
		padding-bottom: 10upx;
		font-weight: 500;
	}
	.wechat{
		display: flex;
		align-items: center;
	}
</style>
