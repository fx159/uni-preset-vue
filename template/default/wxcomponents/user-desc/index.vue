<template>
	<view class="desc" @click="viewDetail">
		<view class="avater">
			<image v-if="item.icon" :src="item.icon" ></image>
			<image v-else src="../../static/serve/pic.png" ></image>
		</view>
		<view class="content">
			<view class="top">
				<view class="title-left">
					{{item.nickname}}
				</view>
				<view class="title-phone">
					<image src="../../static/serve/phone.png"></image>
					{{item.phone}}
				</view>
			</view>
			<view class="name">
				{{item.lawfirm_name ?item.lawfirm_name : ''}}
			</view>
			<view class="behavior">
				用户行为: {{item.userBehavior[0] === 0 ? '': '智能咨询、'}}{{item.userBehavior[1] === 0 ? '':'电话咨询、' }}{{item.userBehavior[2] === 0 ? '' : '视频咨询'}}
			</view>
			<view class="label">
				<text v-for="(i,index) in item.labelName">{{i}}</text>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
		   item: {}
		},
		data(){
			return {
				activeStatus: [{class:'unreview',text:'未返现'},{class:'review-allow',text:'审核通过'},{class:'impeach',text:'存疑暂缓'},{class:'return-complete',text:'返现完成'},{class:'return-fail',text:'返现失败'}]
			}
		},
		methods:{
			viewDetail(){
				wx.navigateTo({
					url: `../../pageServe/my-user-detail/index?id=${this.item.user_id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.desc{
	display: flex;
	margin: 0 0 20upx 0;
	.avater{
	   width: 100upx;
	   padding: 20upx 0 0 0;
	   margin-right: 10upx;
	   
	   image{
		   width: 98upx;
		   height: 98upx;
		   border-radius: 50%;
	   }
	}
	.content{
		flex: 1;
		display: flex;
		flex-direction: column;
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 20upx 0;
		}
		.title-left{
			font-size: 34upx;
			font-weight: bold;
		}
		.title-phone{
			color: #003F93;
			position: relative;
			image{
				position: absolute;
				width: 34upx;
				height: 34upx;
				left: -40upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.behavior{
			margin: 20upx 0;
			color: #666666;
		}
		.label{
			display: flex;
			flex-wrap: wrap;
			text{
				display: inline-block;
				width: 96upx;
				text-align: center;
				height: 60upx;
				padding: 10upx 10upx;
				color: #003F93;
				background-color: #E5EBF4;
				vertical-align: top;
				margin: 0 10upx 10upx 0;
				overflow: hidden;/*超出部分隐藏*/
				white-space: nowrap;/*不换行*/
				text-overflow:ellipsis;/*超出部分文字以...显示*/
			}
		}
	}
}
</style>
