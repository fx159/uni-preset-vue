<template>
	<view class="user-detail">
		<view>
			<view class="user-info">
				<view class="user-id">员工昵称：{{userInfo.nickname}}</view>
				<view class="user-id">员工ID：{{userInfo.user_id}}</view>
				<view class="time">注册时间: {{userInfo.create_time}}</view>
				<view class="law">云律所：{{userInfo.lawfirm_name}}</view>
		    </view>

			<view class="search-record">
				<view class="title">扫码记录：</view>
			<!-- 	<view class="sort">1、20210906 15:43:22, 智能咨询</view> -->
				<view v-if="userInfo.quest_record.length">
					<view class="sort" v-for="(item,index) in userInfo.quest_record" :key="index">
						{{index}}、{{item.scan_time}}, {{item.nickname}}
					</view>
				</view>
				<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelist: ['A类','B类','C类'],
				activeLabel: false,
				showAddLabel: false,
				userInfo: {}
			}
		},
		methods: {
			removeItem(index) {
				if(index<3)return
				this.labelist.splice(index,1)
			},
			editLabel(){
			   this.activeLabel = true
			},
			confirmLabel(){
			   this.activeLabel = false
			},
			addLabel(){
			   this.showAddLabel  = true
			}
		},
		onLoad(option){
			this.userInfo = option
			// this.getUserDetail(option.id)
			wx.setNavigationBarTitle({
				title: ''
			})
			console.log(option)
		}
	}
</script>

<style lang="scss" scoped>
.laebl-right-confirm{
	color: #F8602A ;
	font-size: 32upx;
}
.user-detail{
	padding: 30upx;
	font-size: 32upx;
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
	.desc{
		display: flex;
		flex-wrap: wrap;
		view{
			display: inline-block;
			padding: 10upx 30upx;
			background-color: #F5F6F9;
			margin: 20upx 20upx 0 0 ;
		}
		.active{
			position: relative;
			animation: myfirst 1.5s both infinite;
		}
		.active-img{
			position: absolute;
			top: -10upx;
			right: -10upx;
			width: 32upx;
			height: 32upx;
		}
		.deactive{
			display: none;
		}
	}
}
@keyframes myfirst
{
 0% {
        transform: scale(1);
        transform: scale(1)
    }

    50%,73%{
        transform: scale(1) rotate(0deg);
        transform: scale(1) rotate(0deg)
    }

    77%,83%,90%,97%  {
        transform: scale(1) rotate(3deg);
        transform: scale(1) rotate(3deg)
    }

    80%,87%,93%{
        transform: scale(1) rotate(-3deg);
        transform: scale(1) rotate(-3deg)
    }

    100% {
        transform: scale(1) rotate(0);
        transform: scale(1) rotate(0)
    }
}
</style>
