<template>
	<view class="message-detail-page">
		<view class="message-wrap">
			<view class="message-list">
				<view v-for="(item, index) in list" :key="index" :class="item.type === 1 ? 'question-box box' : 'answer-box box'">
					<view v-if="item.type === 1 && item.isImg" class="box-content image-content">
						<image :src="item.text" mode="widthFix" v-if="item.isImg" @click="preview(item.text)"></image>
					</view>
					<view v-if="item.type === 1 && !item.isImg" class="box-content">
						<text class="text">{{item.text}}</text>
					</view>
					<view v-if="item.type === 2 && item.isChat" class="box-content answer-content chat-content">
						<image v-if="item.header" class="seat-icon" :src="item.header"></image>
						<view :class="item.isImg || item.isFile ? 'chat-message-box' : 'chat-message-box u-border'">
							<view v-if="item.isImg">
								<image class="img-label" :src="item.text" mode="widthFix" @click="preview(item.text)"></image>
							</view>
							<view v-else-if="item.isFile">
								<image class="img-label file-label" src="https://public-file.aegis-info.com/ilawpush_wxmini/common/file.png"></image>
							</view>
							<view v-else>{{item.text}}</view>
						</view>
					</view>
					<view v-if="item.type === 2 && item.isOrder" class="box-content answer-content order-content">
						<view class="file-wrap" v-if="item.file && item.isOrder">
							<image v-if="item.isOrder" class="order-image" mode="widthFix" :src="item.file.img"></image>
						</view>
					</view>
					<view class="header-image user-header" v-if="item.type === 1">
						<image :src="userHeader"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrap">
			<u-button type="primary" :custom-style="buttonStyle" @click="handleIMConnect()">咨询法律客服</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				workOrderId: '',
				lawyerId: '',
				isPreview: false
			}
		},
		computed: {
			buttonStyle() {
				return {
					'background': 'linear-gradient(270deg, #4AA2FF 0%, #2163E0 100%);',
					'border-radius': '48rpx',
					'width': '598rpx',
					'font-size': '32rpx',
					'font-weight': 'Medium'
				}
			},
			userHeader() {
				return getApp().globalData.userHeader;
			}
		},
		methods: {
      // 预览文件
      preview (url) {
        let imgList = [url];
				this.isPreview = true;
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: imgList // 需要预览的图片http链接列表
        });
      },
			getMessageDetail() {
				this.$u.api.getMessageBoxDetail({
					userId: getApp().globalData.userId,
					workOrderId: this.workOrderId || '',
					lawyerId: this.lawyerId || ''
				}).then((res) => {
					res.data.forEach((item) => {
						const qId = this.$u.guid(20);
						// getApp().globalData.userId
						const type = item.sendId.toString() === getApp().globalData.userId ? 1 : 2;
						const header = item.sendId === getApp().globalData.userId ? '' :
							'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png';
						switch (item.type) {
							// 话术
							case 1:
								this.list.push({
									type: type,
									qId: qId,
									text: item.msgContent,
									header: header,
									isChat: true,
								});
								break;
								// 图片
							case 2:
								this.list.push({
									qId: qId,
									type: type,
									header: header,
									text: item.msgContent,
									isChat: true,
									isImg: true
								})
								break;
								// 文件
							case 3:
								this.list.push({
									qId: qId,
									type: type,
									header: header,
									text: item.msgContent,
									isChat: true,
									isFile: true
								})
								break;
								// 优惠券
							case 5:
								this.list.push({
									qId: qId,
									type: type,
									file: {
										img: 'https://public-file.aegis-info.com/ilawpush_wxmini/common/lawyer__into_icon@2x.png'
									},
									isChat: false,
									isOrder: true
								})
								break;
						}
					})
				})
			},
			handleIMConnect() {
        this.$store.commit('setContent', '')
				this.$store.commit('setisHuman', true)
				uni.switchTab({
					url: '/pages/qa/main'
				})
			}
		},
		onShareAppMessage() {

			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onShow() {
			// this.getMessageDetail();
			if (this.isPreview) {
				this.isPreview = false;
				return;
			} else {
				this.list = [];
				this.getMessageDetail();
			}
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
		},
		onLoad(opt) {
			this.workOrderId = opt.workOrderId;
			this.lawyerId = opt.lawyerId;
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
	.message-detail-page {
		height: 100vh;
		width: 100vw;

		.message-wrap {
			height: calc(100vh - 180upx);
			overflow-y: hidden;

			.message-list {
				overflow-y: auto;
				padding-top: 40upx;
				height: 100%;

				.answer-box {
					width: 660upx;
					margin: 0 auto;

					&::after {
						border-radius: 12px;
						box-sizing: content-box;
					}
				}

				.question-box {
					display: flex;
					justify-content: flex-end;
					animation: fadeIn .5s;
					padding-right: 6upx;
					box-sizing: border-box;
					margin-top: 40upx;
					margin-bottom: 50upx;

					&:first-child {
						margin-top: 0;
					}

					.header-image {
						&.user-header {
							margin-left: 16upx;
						}

						image {
							width: 62upx;
							height: 60upx;
						}
					}

					.box-content {
						padding: 24upx 32upx;
						background-color: #009BFF;
						box-shadow: 0px 6px 4px 0px rgba(237, 241, 246, 0.3);
						border-radius: 6px;
						max-width: 525upx;
						position: relative;
						word-break: break-all;

						.image-content {
							background-color: transparent;
							box-shadow: none;
							padding: 0;
						}

						image {
							width: 200upx;
						}


						.text {
							font-weight: Regular;
							font-size: 26upx;
							font-family: PingFang SC;
							color: #FFFFFF;
							line-height: 42upx;
						}
					}
				}

				.answer-box {
					.chat-content {
						display: flex;
						margin-left: -24upx;

						.seat-icon {
							width: 54upx;
							height: 54upx;
							flex: 0 0 54rpx;
						}

						.chat-message-box {
							box-sizing: border-box;
							margin-left: 24upx;
							padding: 24upx 32upx;
							word-break: break-all;
							max-width: 576upx;
							width: auto;
							display: inline-block;
							ont-size: 30upx;
							box-shadow: 0 6px 4px 0 rgba(237, 241, 246, 0.3);

							.button-wrap {
								width: 512upx;
								height: 60upx;
								line-height: 60upx;
								color: #FFFFFF;
								margin-top: 32upx;
								font-size: 26upx;
								text-align: center;
								margin-bottom: 4upx;
								position: relative;
								background: linear-gradient(270deg, rgba(74, 162, 255, 1) 0%, rgba(33, 99, 224, 1) 100%);
								border-radius: 0 30upx 30upx 30upx;

								image {
									width: 88upx;
									height: 88upx;
									position: absolute;
									left: 12upx;
									bottom: 0;
								}
							}

							.img-label {
								width: 240upx;
							}

							.file-label {
								height: 170upx;
							}

							&::after {
								border-radius: 12px;
								border-color: #BECBDF;
							}
						}
					}

					.order-content {
						.file-wrap {
							.order-image {
								width: 660upx;
							}
						}
					}

					.answer-content {
						width: 660upx;
						max-width: none;
						margin-bottom: 24upx;
					}
				}
			}
		}

		.button-wrap {
			padding: 60upx 0;
			box-sizing: border-box;
		}
	}
</style>
