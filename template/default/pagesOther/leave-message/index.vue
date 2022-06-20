<template>
	<view class="case-detail-page">
		<x-form @cancelModal="cancelModal" @handleLinSocket="handleLinSocket" :isWaited="isWaited" :current="currentMe"></x-form>
	</view>
</template>

<script>
	import config from '../../common/config.js';
  import xForm from './form.vue';
	const plugin = requirePlugin('WechatSI');
	//获取全局唯一的语音识别管理器recordRecoManager
	const manager = plugin.getRecordRecognitionManager();
	export default {
		data() {
			return {
        isWaited: false, // 是否在排队
        currentMe: 0, // 当前排队数
        myCaseId: '', // 提交排队中填写的信息得到的id
        showModal: false, // 排队时填写表单的模态框开关
        isHuman: false, // 是否为IM
			};
		},
    components:{
      xForm
    },
		mounted() {
		},
		methods: {
      // 关闭排队填写的模态框
      cancelModal(params) {
        const { bool, id, contentList } = params
        this.myCaseId = id
        this.showModal = bool || false
        if(contentList && contentList.length) {
          contentList.forEach(item => {
            if(Array.isArray(item)) {
              /*item.forEach(li => {
                this.pushAskList({
                  type: QUESTION_TYPE.question,
                  isImg: true,
                  isRead: true,
                  text: li
                })
              })*/
            } else {
              /*this.pushAskList({
                type: QUESTION_TYPE.question,
                isImg: false,
                isRead: true,
                text: item
              })*/
            }
          })
        }
      },
      /**
       * 判断是否登录
       */
      async isLogin() {
        // 从缓存获取用户登录信息
        const _userInfo = await uni.getStorageSync('user-info');
        if (_userInfo && _userInfo.id && _userInfo.token && _userInfo.phone) {
          return true;
        }
        return false;
      },
      /**
       * 判断网络情况
       */
      async checkNetwork() {
        const that = this;
        return new Promise((resolve, reject) => {
          uni.getNetworkType({
            success(res) {
              if (res && res.networkType !== 'none') {
                resolve(true);
              } else {
                that.$u.toast('网络获取失败，请开启网络连接！');
                reject(false)
              }
            },
            fail() {
              that.$u.toast('网络获取失败，请开启网络连接！');
              reject(false)
            }
          })
        })
      },
      /**
       * 建立、关闭连接
       */
      async handleLinSocket() {
        const that = this;
        const net = await this.checkNetwork();
        console.log('net:', net);
        if (!net) {
          return;
        }
        const __temp = await this.isLogin();
        if (!__temp) {
          uni.navigateTo({
            url: '/pagesOther/login/index?redirct=pages/qa/main'
          });
          return;
        }
        if (this.isHuman) {
          try {
            // 发送断开指令
            this.socket.sendWebSocketMsg({
              data: JSON.stringify({
                sendId: getApp().globalData.userId,
                receiveId: this.lawyerId,
                role: 'xiaofa_user',
                receiveRole: this.receiveRole,
                code: 8
              }),
              success(res) {
                that.socket.isReconnection = false;
                that.socket.heartCheck = false;
                that.socket.closeWebSocket();
                that.socket = null;
                that.isHuman = false;
                that.showMoreFeature = false
                that.isWaited = false
                that.showModal = false
                that.pushAskList({
                  type: QUESTION_TYPE.tip,
                  text: '人工咨询已结束，感谢您的使用'
                })
              }
            })
          } catch (e) {
            console.log('e:', e);
          }
        } else {
          console.log('手动连接：')
          const currTime = new Date().getTime();
          const currDate = this.$u.timeFormat(currTime, 'yyyy/mm/dd')
          const startWork = new Date(`${ currDate } 9:00`).getTime();
          const endWork = new Date(`${ currDate } 18:30`).getTime();
          // 非工作时间限制
          if (currTime < startWork || currTime > endWork) {
            this.pushAskList({
              type: QUESTION_TYPE.answer,
              text: 'sorry(｡ ́︿ ̀｡)客服妹纸的工作是时间是上午9:00 - 下午6:30。 你可以给她留言，或者向小法咨询别的问题~',
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
              showLeaveMessageOpt: true,
              isChat: true
            });
            return;
          }
          // 判断律师是否在线
          const __onLine = await this.$u.api.checkLawyerOnline({
            unitId: getApp().globalData.eventId,
            userId: getApp().globalData.userId
          });
          if (!__onLine || __onLine.data === false) {
            this.pushAskList({
              type: QUESTION_TYPE.answer,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
              text: '对不起，暂无法律客服在线，您可以在此留言，我们会尽快回复您。',
              isChat: true,
              showLeaveMessageOpt: true
            });
            return;
          }
          // socket连接
          this.socketInit();
          this.isHuman = true;
          // 当进入人工咨询时，清空联想问题
          this.relateData = [];
          this.pushAskList({
            type: QUESTION_TYPE.tip,
            text: '小法正在帮你连线人工客服，请稍后...'
          })
          this.socket.initWebSocket({
            url: this.socketConfig.url,
            success(res) {
              console.log('websocket success:', res)
            },
            fail(err) {
              console.log("linkWebsocket err", err)
            }
          })
        }
      }
		},
		onShareAppMessage() {
			
			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onShow() {
			/*this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})*/
		},
		onLoad(){
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
	.case-detail-page {
		.banner {
			height: 310upx;
			width: 100%;
		}

		.case-info-wrap {
			padding: 32upx 32upx 32upx 0;
			box-sizing: border-box;

			.case-desc {
				display: flex;
				align-items: center;
				margin-bottom: 12upx;
				padding-left: 40upx;
				box-sizing: border-box;

				.item {
					flex: 0 0 50%;

					&.title {
						font-size: 32upx;
						color: #131415;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: Regular;
					}

					&.voice-input {
						text-align: right;
					}

					.btn {
						padding: 12upx 20upx;
						box-sizing: border-box;
						background: rgba(249, 252, 255, 1);
						box-shadow: 0 0 8upx 0 rgba(0, 51, 95, 0.24);
						border-radius: 30px;
						display: inline-block;
						font-size: 24upx;
						color: #007EFF;
						font-family: PingFangSC-Regular, PingFang SC;

						image {
							width: 18upx;
							height: 28upx;
							margin-right: 8upx;
							vertical-align: text-top;
						}
					}
				}
			}

			.textarea-input {
				padding-left: 40upx;
				box-sizing: border-box;
			}

			.image-wrap {
				margin-top: 26upx;
				margin-bottom: 60upx;
				padding-left: 40upx;
				box-sizing: border-box;

				&.margin-left-0 {}

				.u-list-item {
					margin: 20upx 20upx 0 20upx;
					box-sizing: border-box;
					border-width: 0;
					overflow: visible;

					&:first-child {
						margin-left: 0;
					}

					image {
						width: 152upx;
						height: 152upx;
					}

					.u-delete-icon {
						top: -20upx;
						right: -16upx;
					}

					.u-error-btn {
						background-color: rgba(0, 0, 0, .4);
					}
				}

				.slot-btn {
					border-radius: 10upx;
					border: 2px dashed rgba(0, 126, 255, 1);
					text-align: center;
					padding: 18upx 20upx 20upx 20upx;
					box-sizing: border-box;
					margin-top: 20upx;
					// margin-left: 10upx;

					.upload-img {
						width: 64upx;
						height: 64upx;
					}

					.text {
						color: #9BA0A4;
						font-size: 26upx;
						font-family: PingFangSC-Regular, PingFang SC;
					}
				}
			}

			.select-wrap {
				padding: 38upx 8upx 38upx 40upx;
				box-sizing: border-box;
				display: flex;

				.label {
					color: #131415;
					font-size: 32upx;
					flex: 0 0 260upx;
					font-family: PingFangSC-Regular, PingFang SC;
				}

				.value {
					display: flex;
					align-items: center;
					flex: 1;

					.text {
						flex: 1;
						text-align: right;
						font-size: 26upx;
						color: #656C74;
					}

					image {
						width: 24upx;
						flex: 0 0 24upx;
						height: 24upx;
						margin-left: 8upx;
					}
				}
			}

			.radio-wrap {
				padding-top: 28upx;
				padding-left: 40upx;

				.text {
					color: #666666;
					font-size: 22upx;
					font-family: PingFangSC-Regular, PingFang SC;

					text {
						color: #007EFF;
					}
				}
			}

			.btn-wrap {
				margin-top: 92upx;

				.have-submit {
					text-align: center;
					color: #007EFF;
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: Regular;
					margin-bottom: 20upx;
				}

				.btn {}
			}
		}

		.in-voice {
			position: fixed;
			left: 20upx;
			top: 400upx;
			z-index: 999;

			.listen {
				width: 710upx;
			}

			.stop-text {
				text-align: center;
				position: absolute;
				z-index: 1000;
				bottom: 30upx;
				left: 275upx;
				background-color: rgba(255, 255, 255, .3);
				padding: 4upx 40upx;
				box-sizing: border-box;
				border-radius: 32upx;

				text {
					color: #FFFFFF;
					font-size: 22upx;
				}
			}
		}
	}
</style>
