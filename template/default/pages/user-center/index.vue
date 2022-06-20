<template>
	<view class="user-center-page">
		<view class="login-message">
			<view v-if="!userInfo||!userInfo.header" class="login-info">
				<image class="login-avater" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_46906100-2db1-4dce-b139-87dfbd6cab23.png" ></image>
				<view class="user-text" @click="handleLogin">
					<text class="user-role">登录</text>
					<text class="user-role">点击登录，享受专属法律服务</text>
				</view>
			</view>
			<view class="login-info" v-else @click="routeAddress('usermessage')">
				<image class="login-avater" :src="userInfo.header || userInfo.icon" ></image>
				<view class="user-text">
					<text class="user-name">
						{{userInfo.nickName ? userInfo.nickName : '请设置昵称'}}
						<text class="administrator" v-if="userInfo.userRole == 1">超级管理员</text>
						<text class="administrator" v-if="userInfo.userRole == 2">管理员</text>
						<text class="administrator" v-if="userInfo.userRole == 3">合伙人</text>
						<text class="administrator" v-if="userInfo.userRole == 4">员工</text>
						<text class="administrator" v-if="userInfo.userRole == 5">注册用户</text>
					</text>
					<text class="user-role">{{userInfo.phone | hiddenNum}}</text>
					<!-- <text class="user-role" v-if="!permisson">普通用户</text> -->
				</view>
				<view class="right-arrow" ></view>
			</view>
		</view>
		<view class="list-con">	
			<view class="list-item" v-if="userInfo.userRole !== 5"  @click="routeAddress('./receipt')">
				<img src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_965ea421-fa1d-416d-b332-63549044399f.png" alt="">
				收款码
				<view class="right-arrow"></view>
			</view>
			<!-- <view class="list-item"  @click="routeAddress('./electronic-visa')">
				<img src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_dabc1d66-b856-46f1-966f-5488550cf38b.png" alt="">
				闪电签约
				<view class="right-arrow"></view>
			</view> -->
			<view class="list-item ">
				<img src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_a1483eca-4019-4794-b82f-e98418e316d4.png" alt="">
				<button class="button-style" open-type="share" @click="handleShareClick">推荐给好友</button>
				<view class="right-arrow"></view>
			</view>
			<!-- <view class="list-item"  @click="handleContract('/contractList')">
				<img src="https://public-file.aegis-info.com/yuanjia/common/opinion.png" alt="">
				我的合同
				<view class="right-arrow"></view>
			</view>
			<view class="list-item"  @click="handleContract('/downloadHistory')">
				<img src="https://public-file.aegis-info.com/yuanjia/common/opinion.png" alt="">
				下载历史
				<view class="right-arrow"></view>
			</view> -->
			<view class="list-item"  @click="routeAddress('',3,'帮助中心')">
				<img src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_ba04e7f5-765f-4504-92f8-4cd1fe830f71.png" alt="">
				帮助中心
				<view class="right-arrow"></view>
			</view>
			<view class="list-item"  @click="routeAddress('',4,'意见反馈')">
				<img src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_3a35b71c-1edf-4270-8571-0bfbc6f5136d.png" alt="">
				意见反馈
				<view class="right-arrow"></view>
			</view>
		</view>
		<xiaofaRobot/>
	</view>
</template>

<script>
import xiaofaRobot from '../../wxcomponents/xiaofaRobot/index.vue'
import Log from '../../common/log.js';
import config from '../../common/config.js'
const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
export default {
	data() {
		return {
			permisson: false,
			law: {
				address: '',
				phone: '',
				name: ''
			},
			QRcode: '',
			userInfo: '',
			showDialog: false,
			activeCode: '',
			showActiveCode: false, // 是否展示激活码弹框
			// userRole: 1 , // 用户角色
			location: { //用户定位经纬度
				latitude: 0,
				longitude: 0
			},
			// userHeader: this.$u.globalData.userHeader
		}
	},
	components: {
		xiaofaRobot
	},
	computed: {
		hasContractRole () {
			return this.userInfo.userRole === 1 || this.userInfo.userRole === 2 || this.userInfo.userRole === 4
		}
	},
	filters: {
		hiddenNum: function (value) {
			let num = value
			if(!num) return ''
			return num.slice(0,3)+'****'+num.slice(7,11)	
		}
	},
	methods: {
		handleContract (path) {
			if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
			}
			this.$u.route({
					url: 'pages/web-view/index',
					params: {
						path: straddleUrl[config.ENV] + path,
						mp: ''
					}
			})
		},
		handleShareClick(){
			Log.saveEvent('2', '推荐给好友', 'click');
		},
		// 获取用户是否拥有分享二维码和获取激活码的权限
		getPermisson() {
			const that = this
			wx.request({
			url: getApp().globalData.host + `/api/app/qingDun/isIncludeSysUser/${getApp().globalData.unionId}`,
			method: 'GET',
			header: {
				'content-type': 'application/json; charset=utf-8'
			},
			data: {},
			success:  (res)=> {
				console.log(res, 999);
			const permisson = ['15195751904','18515884892','13546822461']
				if (res.statusCode === 200) {
				if (res.data) {
					this.permisson = res.data.result.isSuccess	
					if(permisson.indexOf(this.userInfo.phone) >= 0){
						this.permisson = true
					}
					console.log('permisson:'+res.data.result.isSuccess)
				} else {
					console.log(res)
				}
				} else {
				that.loading("服务器错误");
				}
			},
			complete: function () {
					wx.hideLoading();
			}
			});
		},
		needLogin() {
			this.$refs.uToast.show({
				duration: 3000,
				title: '请先登录'
			})
		},
		// 登录
		handleLogin() {
			uni.navigateTo({
				url: '/pagesOther/login/index'
			});
		},
		// 获取激活码弹框
		async getActiveCode() {
			if(this.userRole === 0 || !this.userInfo){
			this.needLogin()
			return  
			}
			this.showDialog = true
			this.showActiveCode = true
			try{
				const {data} = await this.$u.api.getActivationCode({userId: this.userInfo.id})
			this.activeCode = data.code + ''
			console.log(data)
			}catch(e){
				console.log(e)
				this.showDialog = false
				//TODO handle the exception
			}
		},
		// 分享二维码弹框
		async qrCodeShare() {
			if(!this.userInfo){
				this.needLogin()
				return
			}
			this.showDialog = true
			this.showActiveCode = false
			// console.log
			const params = {
			userId: this.userInfo.id,
			unitId: getApp().globalData.unitId, //机构ID
			x: this.location.latitude,
			y: this.location.longitude,
			unionId: getApp().globalData.unionId
			}
			try{
				const { data }= await this.$u.api.getQRcode(params)
			this.QRcode = data
			console.log(data)
			}catch(e){
				this.showDialog = false
				console.log(e)
				//TODO handle the exception
			}
			uni.getImageInfo({
				src: this.QRcode.url,
				success: ({path}) => {
					this.QRcode.url = path
				}
			})
		},
		// 保存分享二维码到本地
		saveQRcode() {
			uni.saveImageToPhotosAlbum({
				filePath: this.QRcode.url,
				success: (res) => {
					this.$refs.uToast.show({
						type: 'success',
						title: '已成功保存二维码'
					})
					// this.showCanvas = false
					this.showDialog = false
					},
					fail: (err) => {
						console.log(err)
					// this.showCanvas = false
					}
			})	
		},
		routeAddress(url,code,name){
			Log.saveEvent(code, name, 'click');
			if(url){
				uni.navigateTo({
					url: `./${url}`
				})
			}else{
				this.$u.toast('目前还未开放，敬请期待')
			}
		},
	},
	async onShow() {
		// 获取用户信息
		this.userInfo = await uni.getStorageSync('user-info') || null
		if(this.userInfo){
			this.getPermisson()
		}
		wx.setNavigationBarTitle({
			title: getApp().globalData.web_title
		})
		// 设置页面缓存
		this.$store.commit('setPagerInfo', {
			name: '我的',
			code: '4',
			url: '/pages/user-center/index'
		});
		Log.saveEvent('0', '加载页面', 'onShow');
	},
	onLoad() {
		setTimeout(()=>{
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#D2450E'
			})
			},0)
			wx.updateShareMenu({
				withShareTicket: true,
				isPrivateMessage: true,
				activityId: getApp().globalData.activityId,
				success:res=>{
					console.log(res)
				},
				fail: err =>{
					console.log(err)
				}
		})
	},
	onUnload(){
    Log.saveEvent('-1', '离开页面', 'onUnload');
  },
	onShareAppMessage() {
		Log.saveEvent('-2', '分享', 'click')
		// 分享埋点
		//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
	}
}
</script>

<style lang="scss" scoped>
  @import "./index";
  .receipt{
	 padding: 20upx 30upx; 
	 font-size: 32upx;
	 display: flex;
	 margin: 30upx 0;
	 align-items: center;
	 box-shadow: 0upx 4upx 20upx 0 #BFBFBF;
	 .dollar{
		 width: 32upx;
		 height: 32upx;
	 }
  }
	.button-style {
    background: white;
    // border: none;
		border: 0upx #ccc solid;
    padding: 0rpx;
    margin: 0rpx;
    // font-size: 18px;
    text-align: left;
    width: 100%;
		font-size: 32upx;
		// display: inline;
    line-height: 1.3;
		font-weight: 500;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 90upx;
}

</style>
