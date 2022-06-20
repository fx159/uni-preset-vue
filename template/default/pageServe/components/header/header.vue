<template>
	<view class="search">
		<u-input v-model='text'  type="text" @input="change" border-color="#2E4E6F" class="input" border/>
		<view class="screen" @click="showPopup">
			<text>筛选</text>
			<image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_2e52d1e2-37d3-45f6-ac3d-1764713235c4.png" class="filter"></image>
		</view>
		<u-popup v-model="showQrCode" mode="center">
			<view class="active-code" v-if="showActiveCode">
				<view class="code-title">激活码</view>
				<view class="code-container">
					<text class="active-text">{{ activeCode }}</text>
					, 激活码有效期五分钟
				</view>
				<view class="qrcode-bottom active-text" @click="copyActiveCode">复制</view>
			</view>
			<view class="qr-code" v-else>
				<view class="code-canvas"><image :src="QRcode.url" class="code"></image></view>
				<view class="code-bottom active-text" @click="saveQRcode">
					保存到手机
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props:{
			roleDesc: '',
			value:''
		},
		data() {
			return {
				timer: null,
				text: '',
				showQrCode: false,
				showActiveCode: false,
				activeCode: '',
				QRcode: {
					url: ''
				},
				userInfo: ''
			}
		},
		methods: {
			showPopup(){
				this.$emit('showPopup',true)
			},
			change(val){
				if(this.timer){
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(()=>{
			 	 	this.$emit('change',val)
				},500)
			},
			async showModel(){
				this.showQrCode = true
				uni.showLoading({
					title: '正在生成，请稍后'
				});
				switch (this.roleDesc.searchText) {
					case '获取激活码':
						this.getActiveCode()
						break;
					case '添加店员':
						const {data} = await this.$u.api.getStaffQR({unitId: getApp().globalData.unitId})
        				this.QRcode.url = data
						break;
					case '邀请用户':
						const userLocation = uni.getStorageSync('user-location');
						const params = {
							userId: this.userInfo.id,
							unitId: getApp().globalData.unitId, //机构ID
							x: userLocation.latitude,
							y: userLocation.longitude,
							unionId: getApp().globalData.unionId
						}
						const res = await this.$u.api.getQRcode(params)
						this.QRcode = res.data
						break;
					default:
						break;
				}
				uni.hideLoading();
				uni.getImageInfo({
					src: this.QRcode.url,
					success: ({path}) => {
					this.QRcode.url = path
					console.log(this.QRcode.url)
					}
				})
			},
			// 获取激活码弹框
			async getActiveCode() {
				this.showActiveCode = true
				const {data} = await this.$u.api.getActivationCode({userId: this.userInfo.id})
				this.activeCode = data.code + ''
			},
			// 保存分享二维码到本地
			saveQRcode() {
				const that = this
				uni.saveImageToPhotosAlbum({
					filePath: that.QRcode.url,
					success: (res) => {
						that.$u.toast('保存成功')
						// this.showCanvas = false
						that.showQrCode = false
					},
					fail: (err) => {
						console.log(err)
						// this.showCanvas = false
					}
				})
			},
			// 复制激活码
			copyActiveCode() {
				wx.setClipboardData({
					data: this.activeCode,
					success: (res) => {
						wx.getClipboardData({
							success: (res) => {
								this.showActiveCode = true
							},
							fail: (err) => {
								console.log(err)
							}
						})
					},
					fail: (res) => {
						console.log(res)
					}
				})
			},
		},
		async mounted(){
			this.userInfo = await uni.getStorageSync('user-info') || null
		}
	}
</script>

<style lang="scss" scoped>
.search{
  display: flex;
  align-items: center;
  padding: 0 140upx 0 30upx;
  margin: 20upx 0;
  position: relative;
  .input{
	  flex: 1;
  }
  >text{
	  width: 150upx;
	  height: 60upx;
	  line-height: 60upx;
	  background: #2E4E6F;
	  border-radius: 30upx;
	  font-size: 26upx;
	  color: #FFFFFF;
	  text-align: center;
	  margin-right: 20upx;
  }
  .screen{
	  position: absolute;
	  right: 22upx;
	  font-size: 33upx;
	  text{
		  color: #2E4E6F;
		  display: inline-block;
		  
	  }
	  image{
		  width: 34upx;
		  display: inline-block;
		  height: 34upx;
		  vertical-align: middle;
	  }
  }
}
.active-code{
	width: 560upx;
	height: 260upx;
	text-align: center;
	position: relative;
	.code-title{
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
	}
	.code-bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		height: 100upx;
		border-top: 2upx #ccc solid;
	}
	.qrcode-bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		height: 80upx;
		width: 100%;
		justify-content: center;
		display: flex;
		align-items: center;
		border-top: 2upx #ccc solid;
	}
	.code-text{
		display: inline-block;
		width: 100%;
	}
}
.qr-code{
	width: 458upx;
	height: 560upx;
	text-align: center;
	position: relative;
	.code-canvas{
	width: 100%;
	height: 480upx;
	display: flex;
	justify-content: center;
	align-items: center;
	}
	.code{
		width: 400upx;
		height: 400upx;
	}
	.code-bottom{
		border-top: 2upx #ccc solid;
		height: 80upx;
		line-height: 80upx;
	}
}
.active-text{
	color: #3565E6;
	font-size: 30upx;
}
</style>
