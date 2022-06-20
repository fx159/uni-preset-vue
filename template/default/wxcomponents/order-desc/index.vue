<template>
	<view class="desc" @click="viewDetail">
		<view class="law-name">
			<text>{{item.member_username | showNormal}} </text>
			<!-- <text class="title" v-if="item.lawfirm_name">{{item.lawfirm_name}}</text> -->
		</view>
		<view class="time">
			下单时间：{{item.create_time | showNormal}}
		</view>
		<view class="order-name">
			商品名称：{{item.product_name | showNormal}}
		</view>
		<view class="real-pay">
			实付： &#165;{{item.pay_amount}} 
            <!-- 应返现：&#165;{{item.return_amount}} -->
		</view>
		<!-- <view class="real-pay" v-if="activeStatus[item.status]">
			返现状态： {{activeStatus[item.status].text}}
		</view> -->
		<text v-if="dealSignStatus" :class="['text',signStatusStyle[dealSignStatus]]">{{dealSignStatus | signStatus}}</text>
    <text v-else :class="['text',payStatusStyle[item.order_status]]">{{item.order_status | payStatus}}</text>
  </view>
</template>

<script>
import config from '../../common/config'
const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
export default {
	props:{
		item: {}
	},
	data(){
		return {
			activeStatus: [
				{class:'unreview',text:'未返现'},
				{class:'review-allow',text:'审核通过'},
				{class:'impeach',text:'存疑暂缓'},
				{class:'return-complete',text:'返现完成'},
				{class:'return-fail',text:'返现失败'}
			],
			payStatusStyle: ['impeach','impeach','return-complete','return-complete','return-complete','return-complete','return-fail'],
      signStatusStyle: ['return-fail','review-allow','impeach','impeach']
		}
	},
	filters: {
		showNormal: function (value) {
      if (!value || value == 'null' || value == 'None' ) return '--'
      return value
		},
		payStatus: function (value) {
			let val = ''
      // 15分钟未支付 订单会已取消
			switch (value.toString()) {
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
		},
    signStatus: function (value) {
			let val = ''
			switch (value.toString()) {
				case '0':
					val = '无需签约'
					break;
				case '1':
					val = '已签约'
					break;
				case '2':
					val = '待签约'
					break;
          // 未发起律师静默签
          case '3':
					val = '待签署'
					break;
			}
			return val
		},
	},
  computed:{
    toFillForm(){
      //已支付
      const paied = this.item.order_status == '2'
      const releaseTime = new Date('2021/12/13 00:00:00').getTime()
      const orderCreateTime = new Date(this.item.create_time.replace(/-/g, '/')).getTime()
      const toSign = String(this.item.product_name) == '爆款服务型'&&!this.item.sign_status
      const isNewOrder = orderCreateTime>releaseTime
      return isNewOrder&&toSign&&paied
    },
    dealSignStatus() {
      if (this.toFillForm){this.item.sign_status='3'}
      return this.item.sign_status;
    },
  },
  methods:{
    viewDetail(){
			this.$emit('viewDetail')
      console.log(this.item)
      let params=''
      for(let key in this.item){
        console.log(this.item[key])
          if (typeof this.item[key] === 'string'){this.item[key]=this.item[key].replace('?','')}
          params +=`${key}=${this.item[key]}&`
          // console.log(this.item[key],'isIn')

      }
      console.log(params,'option')
			if(this.item.product_name === '文书生成' && this.item.order_status === 2) {
				this.$u.route({
						url: 'pages/web-view/index',
						params: {
								path: `${straddleUrl[config.ENV]}/create-contract-block`,
								orderId: this.item.id,
								platform: 'miniprogram',
								company:'HouZhaoHui',
								source: 'charge',
								mp: '',
								kindId: this.item.kindId,
								userId: getApp().globalData.userId,
								contractId: this.item.contractId
								// currentContractId: this.contractInfo.currentContractId
						}
				})
				return
			}
			if(this.item.product_name === '文书生成'&& this.item.order_status === 5 ){
				this.$u.route({
						url: 'pages/web-view/index',
						params: {
								path: `${straddleUrl[config.ENV]}/contractDetail`,
								platform: 'miniprogram',
								company:'HouZhaoHui',
								source: 'charge',
								mp: '',
								kindId: this.item.kindId,
								contractId: this.item.contractId
						}
				})
				return
			} 
			if(this.item.order_status === 5 && this.item.product_name !== '文书生成') {
				wx.navigateTo({
						url: `../../pageServe/imgTextConsult/index?isComplete=1&orderId=${this.item.id}&productId=${this.item.productId}&orderType=${this.item.orderType}&spuId=${this.item.spuId}`
				})
				return
			}
			if(this.item.order_status === 0) {
				wx.navigateTo({
					url:`/pagesOther/365pay/main?orderId=${this.item.id}&productId=${this.item.productId}&name=${this.item.product_name}&spuId=${this.item.spuId}&realPrice=${this.item.sign_totalAmount}&orderServiceTime=${this.item.serviceTime}`
				})
				return
			}
			if(this.item.order_status === 2 && this.item.product_name !== '文书生成') {
				wx.navigateTo({
						url: `../../pageServe/imgTextConsult/index?orderId=${this.item.id}&productId=${this.item.productId}&orderType=${this.item.orderType}&spuId=${this.item.spuId}`
				})
			}
      
    }
	}
}
</script>

<style lang="less" scoped>
	.desc{
		background-color: #E5EBF4;
		padding: 20upx;
		position: relative;
		margin: 0 0 20upx 0;
		view{
			margin: 18upx 0 0 0;
		}
		.law-name{
			font-weight: bold;
			margin-right: 120upx;
			display: flex;
			.title{
				width: 330upx;
				display: inline-block;
				vertical-align: top;
				position: relative;
				margin: 0 0 0 15upx;
			}
			.title::before{
				content: '';
				width: 4upx;
				height: 30upx;
				top: 5upx;
				background-color: #000000;
				position: absolute;
				left: -10upx;
			}
		}
		.text{
			position: absolute;
			right: 0;
			top: 0;
			height: 56upx;
			width: 116upx;
			line-height: 56upx;
			text-align: center;
			display: inline-block;
	        color: #FFFFFF;
		}
	}
	.unreview{
		  background-color: #D50F19;
	}
	.review-allow{
		  background-color:#003F93
	}
	.impeach{
		  background-color:#E4B78C
	}
	.return-complete{
		  background-color:#52C41A 
	}
	.return-fail{
		  background-color:#D50F19 
	}
</style>
