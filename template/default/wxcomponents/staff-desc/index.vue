<template>
	<view class="desc" @click="viewDetail">
		<view class="avater">
			<image v-if="item.icon" :src="item.icon"></image>
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
				{{item.lawfirm_name ? item.lawfirm_name : ''}}
			</view>
			<view class="behavior">
				注册时间: {{item.create_time}}
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
				
			}
		},
		methods:{
			viewDetail(){
				let params=''
				for(let key in this.item){
					console.log(this.item[key])
					params +=`${key}=${this.item[key]}&`
				}
				wx.navigateTo({
					url: `../../pageServe/my-staff-detail/index?${params}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.desc{
	display: flex;
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
				padding: 10upx 10upx;
				color: #003F93;
				background-color: #E5EBF4;
				margin: 0 10upx 10upx 0;
			}
		}
	}
}
</style>
