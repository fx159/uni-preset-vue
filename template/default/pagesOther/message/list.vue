<template>
	<view class="message-list-page">
		<view class="message-list" v-if="Array.isArray(list) && list.length > 0">
			<view class="item u-border-bottom" v-for="(item, index) in list" :key="index" @click="handleDetail(item.workOrderId, item.lawyerId)">
				<view class="icon">
					<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/headportrait2@2x.png" mode="widthFix" alt=""></image>
				</view>
				<view class="info">
					<view class="name">
						<view class="text">{{item.lawyerName}}</view>
						<view class="time">{{item.sendTime}}</view>
					</view>
					<view class="message">
						<view class="text u-line-1">
							{{ item.type === 3 ? '此消息为文件，请点击进入查看' : (item.type === 2 ? '此消息为图片，请点击进入查看' : item.msgContent) }}
						</view>
						<view class="count" v-if="item.unreadCount > 0">
							<view class="label">{{item.unreadCount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-else class="noContent">
			<image src="../../static/icon/pic_default_nocontent.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	import Log from '../../common/log.js';
	export default {
		data() {
			return {
				list: []
			}
		},
		mounted() {},
		methods: {
			getList() {
				this.$u.api.getMessageBoxList({
					userId: getApp().globalData.userId
				}).then((res) => {
					this.list = res.data;
				});
			},
			handleDetail(workOrderId, lawyerId) {
				this.$u.route({
					url: 'pagesOther/message/detail',
					params: {
						workOrderId,
						lawyerId
					}
				})
			}
		},
		onShareAppMessage() {

			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onShow() {
			this.getList();
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
			// 设置页面缓存
			this.$store.commit('setPagerInfo', {
				name: '消息盒子',
				code: '3',
				url: '/pages/message/list'
			});
			Log.saveEvent('0', '进入页面', 'init');
		},
		onLoad() {
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
		}
	}
</script>

<style lang="scss" scoped>
	.message-list-page {
		.noContent{
			width: 100%;
			text-align: center;
			image{
				margin-top: 50rpx;
			}
		}
		.message-list {
			padding: 16upx 0;
			box-sizing: border-box;

			.item {
				padding: 32upx 24upx;
				box-sizing: border-box;
				display: flex;

				.icon {
					flex: 0 0 100upx;
					margin-right: 24upx;

					image {
						width: 100upx;
					}
				}

				.info {
					flex: 1;

					.name {
						display: flex;

						.text {
							color: #113260;
							font-size: 34upx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: Medium;
							flex: 1;
						}

						.time {
							color: #9FB0CD;
							font-size: 24upx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: Regular;
							flex: 0 0 60upx;
						}
					}

					.message {
						display: flex;
						margin-top: 6upx;
						overflow: hidden;

						.text {
							flex: 0 0 510upx;
							font-size: 30upx;
							color: #747783;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: Regular;
							display: inline-block;
							width: 510upx;
						}

						.count {
							flex: 0 0 30upx;

							.label {
								background: #FF3B30;
								border-radius: 14px;
								margin-left: 28upx;
								height: 28upx;
								padding: 0 8upx;
								line-height: 28upx;
								display: inline-block;
								font-size: 22upx;
								color: #FFFFFF;
								font-family: PingFangSC-Regular, PingFang SC;
							}
						}
					}
				}
			}
		}
	}
</style>
