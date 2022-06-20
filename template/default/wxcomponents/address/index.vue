<template>
  <view class="lawyer-content">
      <view class="lawyer-title">{{messageInfo.title}}</view>
      <!-- <view class="lawyer-list">
        <view class="list-left left-phone" >联系方式:&nbsp;{{messageInfo.phone}}</view>
        <view class="list-right phone-text" @click="callPhone">
          立即拨号
        </view>
      </view> -->
      <view class="lawyer-list">
        <view class="list-left left-card">执业证号:&nbsp;{{messageInfo.lawyerNumber}}</view>
      </view>
      <view class="lawyer-list">
        <view class="list-left left-lawyer">执业律所:&nbsp;{{messageInfo.lawyerLocation}}</view>
      </view>
      <view class="lawyer-list">
        <view class="list-left left-location">联系地址:&nbsp;{{messageInfo.callLocation}}</view>
        <!-- <view class="list-right" @click="goHere">
          到这里去
        </view> -->
      </view>
  </view>
</template>

<script>
export default {
  props: {
    messageInfo: {
      type: Object,
      default: {
        title: '',
        phone: '',
        lawyerNumber: '',
        lawyerLocation: '',
        callLocation: ''
      }
    }
  },
  data() {
    return {
      userRole: 0
    }
  },
  methods: {
    // 拨打电话
    callPhone() {
			this.$emit('callPhone')
      wx.makePhoneCall({
        phoneNumber: this.messageInfo.phone //仅为示例，并非真实的电话号码
      })
    },
    // 位置导航
    goHere() {
      
    },
    
  },
  async mounted() {
    console.log('mounted')
    const userInfo = await uni.getStorageSync('user-info') || null
    this.userRole = userInfo.userRole
  }
}
</script>

<style lang="scss" scoped>
	.lawyer-content{
    margin: 30upx 0;
		display: flex;
		flex-direction: column;
		padding: 0 0 0 36upx;
		background-color: #fff;
		font-size: 30upx;
		border-radius: 3px;
		border: 1px solid rgba(39, 78, 140, 0.1);
		.lawyer-title{
			height: 80upx;
			line-height: 80upx;
			font-size: 34upx;
			margin-left: -10upx;
			font-weight: 600;
		}
		.lawyer-list{
			display: flex;
			// justify-content: space-between;
			padding: 20upx 12upx 20upx 20upx;
			
			box-sizing: border-box;
			height: 100upx;
			align-items: center;
			position: relative;
			.phone-text{
				position: absolute;
				right: 20upx;
				// padding: 0 10upx ;
			}
			&:nth-child(2){
				border-bottom: 1px solid #EBEBEB;
			}
			&:nth-child(3){
				border-bottom: 1px solid #EBEBEB;
			}
			&:nth-child(4){
				border-bottom: 1px solid #EBEBEB;
			}
		}
		.list-right{
			flex: 1;
			color: #FFFFFF;
			border-radius: 6upx;
			background-color: #2E4E6F;
			text-align: center;
			padding: 10upx 6upx;
			font-size: 26upx;
			margin-left: 10upx;
		}
		.list-left{
			position: relative;
			// height: 80upx;
			// line-height: 80upx;
			width: 85%;
			padding-right: 20upx;
			box-sizing: border-box;
			word-wrap: break-word;
    	word-break: normal;
			&::after{
				position: absolute;
				content: '';
				display: inline-block;
				width: 28upx;
				height: 28upx;
				top: 8upx;
				left: -36upx;
			}
		}
		.left-phone{
			&::after{
				background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_cf9a074a-09fa-4314-906d-e91e9d1a10bf.png') no-repeat center center;
				background-size: cover;
			}
		}
		.left-card{
			&::after{
				background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_d6c024ad-2e0f-4197-8046-5329fba6db29.png') no-repeat center center;
				background-size: cover;
			}
		}
		.left-lawyer{
			&::after{
				background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_bfbadc70-f46a-4b58-9a41-9a2f77c013d8.png') no-repeat center center;
				background-size: cover;
			}
		}
		//https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_bfbadc70-f46a-4b58-9a41-9a2f77c013d8.png
		.left-location{
			&::after{
				background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_d9c51c09-f1a0-4108-ac6a-f28098051226.png') no-repeat center center;
				background-size: cover;
			}
		}
	}
</style>
