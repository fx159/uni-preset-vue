<template>
	<view class="order-container">
		<view class="order-info">
			<view>订单ID: <text> {{list.order | showNormal}}</text></view>
			<view>下单用户: <text>{{list.member_username | showNormal}}</text></view>
			<!-- <view>用户ID: <text>{{list.id | showNormal}}</text></view> -->
			<view>下单时间: <text>{{list.create_time | showNormal}}</text></view>
			<view>云律所: <text>{{list.lawfirm_name | showNormal}}</text></view>
			<view>商品: <text>{{list.product_name | showNormal}}</text></view>
		</view>
		<view class="search-record">
			<view>商品定价: <text>{{list.price | showNormal}}</text></view>
			<view>支付状态: <text>{{list.order_status | payStatus}}</text></view>
			<view>实付金额: <text>{{list.pay_amount | showNormal}}</text></view>
			<view>激活码: <text>{{list.coupon_no | showNormal }}</text></view>
			<view>返现状态: <text>{{activeStatus[parseInt(list.status)].text}}</text></view>
		</view>
		<!-- 用户签约信息模块 -->
		<view class="sign-message" v-if="signData.length">
			<view class="title">签约信息</view>
			<view  v-if="userInfo.userRole == 5">
				<view class="sign-success" v-if="isSign">签约成功，律师将立即开始服务</view>
				<view class="sign-success" v-else>律师已上传服务合同，等待您签约</view>
				<view class="tobesign">签约完成后，律师将立即开始服务</view>
			</view>
			<view  v-else>
				<view class="sign-success" v-if="isSign">签约成功，律师将立即开始服务</view>
				<view class="sign-success" v-else>待客户签约</view>
				<view class="tobesign">签约完成后，律师将立即开始服务</view>
			</view>
			<view class="total-num">合同总价：  <text>￥{{list.sign_totalAmount | showNormal}} </text></view>
			<view class="protocol-con">
				<view class="protocol-item" v-for="(item,index) in signData" :key="index" @click="toTen(item.sign_url)">
					<view class="name">{{item.flow_name}}</view>
					<view :class="[item.flow_status == 'ALL' ? 'is-sign' : 'no-sign']">{{item.flow_status | statusText}}</view>
				</view>
			</view>
    </view>
    <u-button
        v-if="toPay"
        type="primary"
        style="margin-top: 88upx"
        hover-class="none"
        :custom-style="customStyleBtn"
        @click="dealToPay()"
    >立即支付
    </u-button
    >
    <signModal ref="signModal" :orderId="list.id" @formConfirm=""/>

  </view>
</template>

<script>
import signModal from '../../wxcomponents/signModal'
	export default {
		data() {
			return {
				list: '',
        toPay: false,
				activeStatus: [{text:'未返现'},{text:'审核通过'},{text:'存疑暂缓'},{text:'返现完成'},{text:'返现失败'}],
				userInfo: '',
				signData: [],
				isSign: false,
			}
		},
    components:{signModal},
		filters: {
			showNormal: function (value) {
				if (!value || value == 'null' || value == 'None' ) return '--'
				return value
			},
			statusText: function (value) {
				let val = ''
				switch (value) {
					case 'ALL':
						val = '已完成'
						break;
					case 'REJECT':
						val = '已拒签'
						break;
					case 'CANCEL':
						val = '已撤回'
						break;
					default:
						val = '待签约'
						break;
				}
				return val

			},
			payStatus: function (value) {
				let val = ''
				switch (value) {
					case '0':
						val = '待付款'
						break;
					case '1':
						val = '待接单'
						break;
					case '2':
						val = '已付款'
						break;
					case '3':
						val = '已接单'
						break;
					case '4':
						val = '已签约'
						break;
					case '5':
						val = '已完成'
						break;
					case '6':
						val = '已取消'
						break;
					default:
						val = '--'
						break;
				}
				return val
			}
		},
		methods: {
      showSignModal(){
        this.$refs.signModal.showFormModal()
      },
      toHomePage() {
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/home/index'
          });
        }, 1000)
      },
      dealToPay(){
        const obj = {
          'orderId': this.list.id,
          'openid': getApp().globalData.openId, // #小程序支付必填，H5支付不用填
          'money':  this.list.sign_totalAmount*100 , // #单位：分
          'appid': getApp().globalData.appid,
          'user_ip': '' // #H5支付必传
        }
        this.$u.api.toPay(obj).then(res => {
          const that = this;
          function dealSin(){
            const isWxSignProduct = (String(that.list.product_name) == '爆款服务型')
            if (isWxSignProduct) {
              //电子签跳转
              that.showSignModal()
            } else {
              that.toHomePage()
            }
          }
          if (res.data && res.data.isFullAmount) {
            //全额抵扣
            uni.setStorageSync('payOrderId', that.orderId);
            uni.setStorageSync('pay-result', 'success');
            uni.showToast({title: '支付成功', duration: 2000});
            dealSin()
          } else {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success(res) {
                wx.hideLoading()
                uni.setStorageSync('payOrderId', that.orderId);
                uni.setStorageSync('pay-result', 'success');
                uni.showToast({title: '支付成功', duration: 2000});
                dealSin()
              },
              fail(err) {
                wx.hideLoading()
                console.log(err);
                uni.showToast({title: '支付失败', duration: 2000});
                //  uni.redirectTo({
                // url: '../365pay/index'
                //  })
              }
            })
          }
        })
      },
      toTen(signUrl){
				uni.navigateToMiniProgram({
					appId: 'wxa023b292fd19d41d',
					path: signUrl,
					success(res) {
						console.log('成功', res)
					}
				})
			},
			getDetail(){
				this.$u.api.getSignData({"order_id": this.list.id}).then(res=>{
					this.signData = res.data ? res.data : []
					this.signData.map(item=>{
						//合同状态 INIT-创建,PART-签署中,REJECT-拒签,CANCEL-撤回,DEADLINE-流签,ALL-签署完成
						if(item.flow_status != 'ALL'){
							this.isSign = false
							return
						}else{
							this.isSign = true
						}
					})
				})
			},
		},
		async onShow(){
			this.userInfo = await uni.getStorageSync('user-info') || null
			this.getDetail()
		},
		onLoad(option){
			this.list = option
      const toPay=this.list.order_status == '0'
      const toSign = option.sign_status == '3'
      console.log(option,'option')
			wx.setNavigationBarTitle({
				title: '订单详情'
			})
      if (toSign){
        this.showSignModal()
      }
      if (toPay){
        console.log('去支付')
        if (!option.id)return
        this.toPay = true
        // this.dealToPay()
      }
		}
	}
</script>

<style lang="less" scoped>
.order-container{
	padding: 30upx;
	font-size: 28upx;
	font-family: PingFangSC-Regular, PingFang SC;
	view{
		margin: 20upx 0;
	}
}
.order-info,.search-record{
	text{
		font-weight: 600;
		padding-left: 20upx;
	}
}
.search-record{
	border-top: 2upx #EEEEEE solid;
	margin: 30upx 0;
	padding: 30upx 0;
	.title{
		font-weight: bolder;
		margin: 0 0 30upx 0;
	}
	.sort{
		margin: 10upx 0;
	}
	.label{
		display: flex;
		justify-content: space-between;
	}
	.label-title{
		font-weight: bolder;
	}
	.edit{
		color: #F8602A;
	}
}
.sign-message{
	view{
		margin: 0;
	}
	.title{
		padding: 15upx;
		border-bottom: 2upx solid #eee;
		color: #000;
		font-weight: 600;
		font-size: 34upx;
	}
	.sign-success{
		color: red;
		font-weight: 600;
		margin-top: 15upx;
		font-size: 30upx;
	}
	.tobesign{
		font-size: 22upx;
		color: #666;
	}
	.total-num{
		margin-top: 30upx;
		text{
			font-weight: 600;
		}
	}
	.protocol-item{
		margin-top: 15upx;
		display: flex;
		justify-content: space-between;
		font-size: 25upx;
		font-weight: 600;
		.name{
			color: #017339;
		}
		.no-sign{
			color: red;
		}
		.is-sign{
			color: #333;
		}
	}
}
</style>
