<template>
	<view class="container">
	   <view class="title">
	   	收款信息
	   </view>
	   <view class="main-message">
		   <view class="desc">
		   	  <text>收款单位:</text>南京擎盾信息科技有限公司
		   </view>
		   <view class="desc">
			   <text class="amount">收款金额:</text>
		   	   <u-input :value="value" @input="changePrice" type="number" border class="input" />
			   <text>元/人民币</text>
		   </view>
		   <view class="upper">
		   	大写:人民币{{upperValue}}
		   </view>
		   <view class="desc">
			  <text class="amount1">备注:</text>
		   	  <u-input v-model="remark" type="text" border class="input" />
		   </view>
	   </view>
	   <view class="qrcode" @click="getQrcode">
	   	  生成收款码
	   </view>
<!-- 	   <view class="record" @click="viewPage">
	   	   收款记录
	   </view> -->
		<u-popup v-model="showPopup" mode="center" >
			<view class="popup">
				<view style="text-align: center;">
					收款码
				</view>
				<image :src="qrcodeUrl" ></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				value: '',
				showPopup:false,
				upperValue:'',
				remark: '',
				qrcodeUrl: ''
			}
			
		},
		methods:{
			viewPage(){
				wx.navigateTo({
					url:'../receipt-record/index'
				})
			},
			getQrcode(){
				if(!this.value){
					wx.showToast({
						title: '请输入收款金额',
						icon:'error'
					})
					return
				}
				if(!this.remark){
					wx.showToast({
						title: '请输入备注',
						icon:'error'
					})
					return
				}
				const params = {
					amount: this.value,
					remark: this.remark
				}
				this.$u.api.buildPayQrCode(params).then(res=>{
					console.log(res)
					this.qrcodeUrl = res.data.codeUrl
					this.showPopup = true
				})
			},
			changePrice(val){
				this.upperValue = this.$u.utils.numbertoUpperCase(val)
				this.value = val
				console.log(val)
			}
        }
	}
</script>

<style lang="less" scoped>
	.title{
		padding:10upx 20upx;
	}
	.container{
		background-color: #F2F2F2;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
        height: 100%;
	}
	.main-message{
		padding: 10upx 20upx ;
		background-color: #FFFFFF;
		.desc{
			display: flex;
			align-items: center;
			position: relative;
			margin: 30upx 0;
			text{
				width: 134upx;
				text-align: right;
				margin-right: 10upx;
			}
			.amount{
				position: relative;
			}
			.amount1{
				position: relative;
			}
			.amount1::after{
				position: absolute;
				right: 68upx;
				top: 0;
				color: red;
				content: '*';
			}
			.amount::after{
				position: absolute;
				left: 0;
				top: 0;
				color: red;
				content: '*';
			}
			.input{
				flex: 1;
			}

		}
		.upper{
			height: 40upx;
			margin: 20upx 0 20upx 160upx;
			
		}
	}
	.qrcode{
		height: 60upx;
		width: 230upx;
		text-align: center;
		line-height: 60upx;
		margin: 30upx auto;
		border-radius: 30upx;
		color: #FFFFFF;
		background-color: #178BFF;
	}
	.record{
		color:#178BFF;
		width: 200upx;
		text-align: center;
		margin: 100upx auto;
	}
	.popup{
		height: 600upx;
		width: 600upx;
		margin: 0 auto;
		padding: 20upx;
		overflow: hidden;
		image{
			display: block;
			height: 500upx;
			width: 500upx;
			margin: 0 auto;
		}
	}
</style>
