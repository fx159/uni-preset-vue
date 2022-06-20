<template>
	<view class="container">
    <view class="login-message">
	   <view class="login-info" >
				<!-- <image class="login-avater" :src="userInfo.header || userInfo.icon" ></image> -->
				<view class="user-text">
					<text class="user-name">
						{{userInfo.nickName ? userInfo.nickName : '请设置昵称'}}
						<text class="administrator" v-if="userInfo.userRole == 1">超级管理员</text>
						<text class="administrator" v-if="userInfo.userRole == 2">管理员</text>
						<text class="administrator" v-if="userInfo.userRole == 3">合伙人</text>
						<text class="administrator" v-if="userInfo.userRole == 4">员工</text>
						<text class="administrator" v-if="userInfo.userRole == 5">注册用户</text>
					</text>
					<text class="user-role">{{ userInfo.phone | hiddenNum}}</text>
					<!-- <text class="user-role" v-if="!permisson">普通用户</text> -->
				</view>
				<view class="right-arrow" ></view>
			</view>
    </view>
    <view class="contract-title">发起合同</view>
    <view class="contract-template">
      <view @click="viewTemplate">
          <u-icon size="128" name="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_0ae7b7cd-18b0-40ac-96a6-7ae2290f7aeb.png"></u-icon>
          <view class="template-desc">模板库发起</view>
      </view>
      <view @click="viewWxFile()">
        <u-icon size="128" name="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_ae4632c1-f61d-4b00-9d30-d98f057adfe1.png"></u-icon>
        <view class="template-desc">微信文件发起</view>
      </view>
    </view>
    <view class="visa-template">
      <view class="template-text" @click="viewWxFile">
				<image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_6258abf0-4fd7-4dec-b490-d2e04d32e907.png"></image>
				<view>合同管理</view>
			</view>
      <view class="template-text" @click="viewWxFile">
				<image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_1a41b31a-4028-44b8-8ee3-cab4d906d7b1.png"></image>
				<view>个人中心</view>
				
				</view>
    </view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
        userInfo: ''
			}
			
		},
    filters: {
      hiddenNum: function (value) {
        console.log(value)
        let num = value
        if(num) return num.slice(0,3)+'****'+num.slice(7,11)	
      }
	  },
		methods:{
			viewTemplate () {
        wx.navigateTo({
          url: './contract-template'
        })
      },
      viewWxFile (param) {
        wx.navigateToMiniProgram({
            appId: 'wxa023b292fd19d41d',
            // path: '',
            success(res) {
              // wx.hideLoading()
              console.log('成功', res)
            }
        })
      }
    },
    async onLoad () {
      this.userInfo = await uni.getStorageSync('user-info') || null
    }
	}
</script>

<style lang="less" scoped>
	.login-message{
	  position: relative;
		width: 100%;
		height: 138upx;
		background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_9adbad46-10c6-4854-a59e-009f687d1ede.png') no-repeat center center;
		background-size: cover;
		.login-btn{
			display: inline-block;
			vertical-align: top;
			margin-left: 10upx;
		}
		.login-info{
			width: 100%;
			position: absolute;
			display: flex;
			line-height: 140upx;
			padding: 0upx 38upx;
			align-items: center;
			top: 50%;
			transform: translateY(-50%);
		}
		.user-text{
			flex: 1;
			justify-content: center;
			display: flex;
			flex-flow: column;
			height: 100%;
			// color: #FFFFFF;
			text{
				display: inline-block;
				height: 40upx;
				line-height: 40upx;
			}
			.user-name{
				font-size: 36upx;
				font-weight: bold;
			}
			.user-role{
				font-size: 22upx;
				color: #666666;
			}
			.administrator{
				width: 140upx;
				height: 37upx;
				background: linear-gradient(180deg, #FFDFBA 0%, #FBBE73 100%);
				border-radius: 4px;
				border: 2upx solid #FFFFFF;
				font-size: 20upx;
				color: #7C4802;
				padding: 0 16upx;
				line-height: 34upx;
				vertical-align: bottom;
    			margin-left: 15upx;
				text-align: center;
			}
			.right-arrow{
				position: absolute;
				right: 2upx;
				top: 50upx;
			}
		}
	}
  .contract-title{
    text-align: center;
    font-size: 34upx;
    margin: 28upx;
		font-weight: bold;
  }
  .contract-template{
    margin: 80upx 0;
    display: flex;
    // justify-content: space-between;
    view{
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
		.template-desc{
			margin: 30upx 0;
			font-size: 28upx;
		}
  }
  .visa-template{
    margin-top: 20upx;
    display: flex;
		padding: 0 20upx;
		justify-content: space-between;
    .template-text{
      width: 48%;
			margin: 0 5upx;
      text-align: center;
      height: 240upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
      background-color: #F5F6F9;
			border-radius: 6upx;
			image{
				height: 88upx;
				width: 88upx;
			}
    }
    
  }
</style>
