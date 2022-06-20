<template>
	<view class="knowledge-page">
		<view class="header-wrap">
			<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/chat@2x.png" class="bg-img"></image>
<!--			<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/logo.png" class="top-image"></image>-->
			<!-- <image src="https://public-file.aegis-info.com/yuanjia/common/knowledge_logo.png" class="top-image"></image> -->
			<view class="header-content">
				<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/title.png" class="title"></image>
				<view class="title-text">打造最聪明的法律大脑，</view>
				<view class="title-text">让法律触手可及！</view>
			</view>
		</view>
		<view class="card-box question-box">
			<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/header.png" class="logo"></image>
			<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/douhao.png" class="dou-hao"></image>
			<view class="box-content">
				<image class="Q" src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/Q@2x.png"></image>
				<text class="text">{{question.value}}</text>
				<view class="tags-list">
					<view class="tag-item" v-for="(item, index) in tags.value" :key="index">#{{item}}</view>
				</view>
			</view>
		</view>
		<view class="card-box answer-box">
			<view class="card-content">
				<view class="title">小法建议</view>
				<image class="A" src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/A@2x.png"></image>
				<text class="text">{{answer.value}}</text>
			</view>
		</view>
		<view class="card-box law-box" v-if="laws && laws.value || caseIds && caseIds.value">
			<view class="card-content">
				<view :class="showLawLine ? 'title-wrap have-line' : 'title-wrap'">
					<view :class="lawActive === 1 ? 'title active' : 'title'" @click="handleLawTabClick(1)" v-if="laws.value && laws.value.length > 0">法律法规</view>
					<view :class="lawActive === 2 ? 'title active' : 'title'" @click="handleLawTabClick(2)" v-if="caseIds.value && caseIds.value.length > 0">相关案例</view>
				</view>
				<view class="law-list" v-if="lawActive === 1">
					<view class="law-item" v-for="(law, index) in laws.value" :key="index">
						<view class="title">
							<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/row_icon.png" class="icon"></image>
							<view class="text u-line-2">{{law.title}}</view>
						</view>
						<view class="content">
							{{law.content}}
						</view>
					</view>
				</view>
				<view class="law-list" v-if="lawActive === 2">
					<view class="law-item" v-for="(item,index) in cases" :key="index">
						<view class="title">
							<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/case_icon@2x.png" class="icon"></image>
							<view class="text case-title u-line-2" @click="handleOpenCaseDetailPopup(item)">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card-box law-box" v-if="files && files.value || pictures && pictures.value">
			<view class="card-content">
				<view :class="showFileLine ? 'title-wrap have-line' : 'title-wrap'">
					<view :class="fileActive === 1 ? 'title active' : 'title'" @click="handleFileTabClick(1)" v-if="files && files.value.length > 0">相关文书</view>
					<view :class="fileActive === 2 ? 'title active' : 'title'" @click="handleFileTabClick(2)" v-if="pictures && pictures.value.length > 0">相关图片</view>
				</view>
				<view class="file-wrap" v-if="fileActive === 1">
					<view class="file-item" v-for="(item, index) in files.value" :key="index">
						<view class="file-box" @click="handleDownloadFile(item.url)">
							<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/WechatIMG28@2x.png" class="file"></image>
						</view>
						<view class="name u-line-1">《{{item.name}}》</view>
					</view>
				</view>
				<view class="file-wrap" v-if="fileActive === 2">
					<view class="file-item" v-for="(item, index) in pictures.value" :key="index">
						<view class="file-box">
							<image :src="item.url" class="file" @click="handlePreviewImage(item.url)"></image>
						</view>
						<view class="name u-line-1">《{{item.name}}》</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card-box recommend-box" v-if="contract || risk">
			<view class="card-content">
				<view class="title">下一步该怎么做？</view>
				<view v-if="contract" class="contract-box" @click="handleNextStep('https://ilawpush5.aegis-info.com/icontractreview/home')">
					<view class="text">
						使用“<text>合同审查</text>”，智能审查相关合同，帮您快速“避坑”。
					</view>
					<view class="banner">
						<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/htsc.png"></image>
					</view>
				</view>
				<view v-if="risk" class="contract-box risk-box" @click="handleNextStep(risk.value)">
					<view class="text">
						使用“<text>智能法律问诊</text>”，站在资深律师和法官视角，预测潜在法律风险，提供专业法律意见
					</view>
					<view class="banner">
						<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/risk.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="im-connect">
			<!--<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_banner@2x.png" mode="widthFix" alt="" @click="handleIMConnect()"></image>-->
			<image src="https://public-file.aegis-info.com/yuanjia/common/static_icon_1v1.png" mode="widthFix" alt="" @click="handleIMConnect()"></image>
		</view>
		<view class="block-wrap" v-if="!relates || relates.length === 0"></view>
		<view class="relate-question-box" v-if="relates && relates.length > 0">
			<view class="relate-content">
				<view class="tag">都在问</view>
				<view class="relate-list">
					<view :class="item.active ? 'relate-item u-line-1 u-border-bottom active' : 'relate-item u-line-1 u-border-bottom'"
					 v-for="(item, index) in relates" :key="index" @click="handleRelateClick(item)">{{item.value}}</view>
				</view>
				<!-- 	<view class="change-pager" v-if="false" @click="handleChangeRecommend()">
					<image src="https://public-file.aegis-info.com/ilawpush_wxmini/common/refush.png" /> 换一批</view> -->
			</view>
		</view>
		<view class="bottom-wrap">
			<view class="card-box help-box">
				<view class="card-content">
					<view class="title">小法的解答是否有帮助？</view>
					<image src="https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/right-douhao.png" class="right-dou-hao"></image>
					<view class="helper-wrap">
						<image :src="star === 5 ? 'https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/help-active@2x.png' : 'https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/helper.png'"
						 @click="handleHelper(5)"></image>
						<image :src="star === 0 ? 'https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/no-help-active@2x.png' : 'https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/no-helper.png'"
						 @click="handleHelper(0)"></image>
					</view>
				</view>
			</view>
			<!-- <view class="advice-wrap">
				<view class="content-box" @click="handleAdvice()">
					<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/pic_gift@2x.png" mode="widthFix"></image>
					<text>反馈建议，有机会获得精美礼物</text>
				</view>
			</view> -->
		</view>
		<u-popup v-model="showCasePopup" mode="bottom" height="900" class="case-detail-popup" border-radius="16">
			<view class="title-wrap-popup">
				<view class="title">{{ caseDetail.title }}</view>
				<view class="court-info"><text>{{ caseDetail.courtName }}</text><text>{{ caseDetail.caseNumber }}</text></view>
				<view class="paras-wrap">
					<view class="paras-list">
						<view v-for="(item, index) in caseDetail.newParas" :key="index" class="paras-item" @click="handleCaseDetailTab(item, index)">
							<text :class="item.name === caseDetailIndex ? 'active' : ''">{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="paras-content">
				<scroll-view style="height: 600rpx;" :scroll-y="true">
					<view class="text">{{caseDetailContent}}</view>
				</scroll-view>
			</view>
		</u-popup>
		<!-- <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/kf@2x.png" mode="widthFix" class="kf-info" @click="handleIMConnect()"></image> -->
	</view>
</template>

<script>
	import Log from '../../common/log.js';
	export default {
		data() {
			return {
				qId: '',
				cId: '', // 卡片id
				lawActive: 1, // 法律法规
				fileActive: 1, // 相关文书
				question: '', // 问题
				tags: [], // 标签
				answer: '',
				laws: [], // 相关法规
				cases: [], // 相关案例
				caseIds: [], // 相关案例的ids
				files: [], // 相关文书
				pictures: [], // 相关图片
				contract: null, // 合同审查
				risk: null, // 法律问诊
				relates: [], // 相关问题
				star: 1, // 小法评价
				showCasePopup: false, // 显示案例详情
				caseDetailIndex: '当事人信息', // 当前案例详情的内容模块
				caseDetail: {}, // 案例详情
				recommendPager: 1
			}
		},
		mounted() {
			this.$u.api.getCaseInfoByQId({
				qid: this.cId
			}).then(res => {
				if (res.code === 0 && res.data) {
					const card = res.data.card;
					console.log(card)
					this.question = card.find(_x => _x.type === 'question');
					this.tags = card.find(_x => _x.type === 'tags');
					this.answer = card.find(_x => _x.type === 'answer');
					this.laws = card.find(_x => _x.type === 'laws');
					this.caseIds = card.find(_x => _x.type === 'cases');
					// 如果没有法律法规则直接展示相关案例
					this.lawActive = this.laws && this.laws.value.length > 0 ? 1 : 2;
					if (this.caseIds && this.lawActive === 2) {
						this.handleLawTabClick(2);
					}
					this.files = card.find(_x => _x.type === 'files');
					this.pictures = card.find(_x => _x.type === 'pictures');
					// 如果没有相关文书则展示相关图片
					this.fileActive = this.files && this.files.value.length > 0 ? 1 : 2;
					this.contract = card.find(_x => _x.type === 'contract_review');
					this.risk = card.find(_x => _x.type === 'intell_risk');
					const temp_relate = card.find(_x => _x.type === 'related_questions');
					if (temp_relate && temp_relate.value.length > 0) {
						temp_relate.value.forEach(_x => {
							this.relates.push({
								value: _x,
								active: false
							})
						})
					}
				}
			})
		},
		computed: {
			caseDetailContent() {
				if (this.lawActive === 2 && this.caseDetail && this.caseDetail.newParas) {
					const _paras = this.caseDetail.newParas.find(_x => _x.name === this.caseDetailIndex);
					return _paras ? _paras.value : '暂无内容';
				}
				return '暂无内容'
			},
			// 文件是否展示竖线
			showFileLine() {
				return (this.files && this.files.value && this.files.value.length > 0) && (this.pictures && this.pictures.value &&
					this.pictures.value.length > 0);
			},
			// 法条是否展示竖线
			showLawLine() {
				return (this.laws && this.laws.value && this.laws.value.length > 0) && (this.caseIds && this.caseIds.value &&
					this.caseIds
					.value.length > 0);
			}
		},
		methods: {
			/**
			 * 获取相关案例详情
			 * @param {Object} id：案例id
			 */
			async getCaseDetail(id) {
				const res = await this.$u.api.getSearchCase({ id })
				if (res.code === 200 && res.data) {
					this.cases.push({
						title: `《${res.data.caseInfoPlain.title}》`,
						newParas: res.data.caseInfoPlain.newParas,
						id: res.data.caseInfoPlain.id
					})
				}
			},
			/**
			 * 文件下载
			 * @param {Object} path 文件地址
			 */
			handleDownloadFile(path) {
				const _this = this;
				wx.downloadFile({
					url: path,
					success(res) {
						wx.openDocument({
							filePath: res.tempFilePath,
							showMenu: true,
							success(res) {
								console.log(res)
								_this.$u.toast('文件正在打开...')
							}
						})
					}
				})
			},
			/**
			 * 法律法规/相关案例切换
			 * @param {Object} index 1：法律法规  2：相关案例
			 */
			handleLawTabClick(index) {
			  if(index === 1){
          Log.saveEvent('3', '点击[法律法规阅读全部内容]')
			  }
        this.lawActive = index;
				if (this.cases.length === 0 && this.lawActive === 2) {
					this.caseIds.value.forEach((id) => {
						this.getCaseDetail(id);
            Log.saveEvent('6', `{type: '点击', label: '相关案例', key: '${id}'}`);
          })
				}
			},
			/**
			 * 连接业务
			 * @param {Object} path 业务地址
			 */
			handleNextStep(path) {
			  console.log('path:',path)
				let domain = path;
				const parseQueryString = (url) => {
					let json = '';
					const arr = url.substr(url.indexOf('?') + 1).split('&');
					domain = url.substr(0, url.indexOf('?'))
					json = arr.join('&');
					return json;
				}
				const params = path.indexOf('?') > -1 ? parseQueryString(path) : '';
				let url = '/pages/web-view/index?path=' + domain + '&phone=' + getApp().globalData.phone;
				if (!this.$u.test.isEmpty(params)) {
					url = url + '&' + params
				}
				console.log(url)
				wx.navigateTo({
					url: url
				})
			},
			/**
			 * 相关文书/相关图片切换
			 * @param {Object} index 1：相关文书  2：相关图片
			 */
			handleFileTabClick(index) {
				this.fileActive = index;
				if(index === 1){
          Log.saveEvent('5', '点击[文书模板]')
				}else {
          Log.saveEvent('11', '点击[相关图片]')
        }
			},
			/**
			 * 显示案例详情弹窗
			 */
			handleOpenCaseDetailPopup(item) {
				this.caseDetail = item;
				this.$u.api.getSearchCaseTag().then(res => {
					this.caseDetail.newParas.forEach(item => {
						for (let i in res.data) {
							if (i === item.name) {
								item.name = res.data[i];
							}
						}
					});
				});
				this.showCasePopup = true;
			},
			/**
			 * 案例详情tab点击
			 * @param {Object} item
			 * @param {Object} index
			 */
			handleCaseDetailTab(item, index) {
				this.caseDetailIndex = item.name;
			},
			/**
			 * 相关问题点击
			 */
			handleRelateClick(item) {
        Log.saveEvent('13', `{type: '点击', label: '智能推荐', key: '${item.value}'}`);
        item.active = true;
				this.$store.commit('setContent', item.value)
				this.$u.route({
					url: '/pagesOther/qa/main'
				});
			},
			/**
			 * 联系客服
			 */
			handleConectIM() {
        Log.saveEvent('12', '点击[咨询法律客服]');
        this.$store.commit('setisHuman', true);
				this.$u.route({
					url: '/pagesOther/qa/main'
				});
			},
			/**
			 * 换一批推荐问题
			 */
			handleChangeRecommend() {
				this.recommendPager++;
				this.getRecommendData();
			},
			/**
			 * 推荐问题
			 */
			async getRecommendData() {
				const res = await this.$u.api.getRecommend({
					count: 3,
					num: this.recommendPager,
					event_id: getApp().globalData.eventId,
					user_id: getApp().globalData.userId,
					type: getApp().globalData.type,
					source: getApp().globalData.type
				});
				this.relates = [];
				res.data.forEach((item, index) => {
					this.relates.push({
						value: item,
						active: false
					})
				})
			},
			/**
			 * 小法评价
			 * @param {Object} star
			 */
			handleHelper(star) {
			  if(star === 5){
          Log.saveEvent('14', '点击[有帮助]');
        }else {
          Log.saveEvent('15', '点击[无帮助]');
        }
			  if (this.star !== 1) {
					this.$u.toast('您已反馈！')
					return;
				}
				this.star = star;
				this.$u.api.getStar({
					qid: this.qId,
					star
				}).then(() => {
					this.$u.toast('感谢您的反馈！')
				})
			},
			/**
			 * 连接IM
			 * @param {Object} opt
			 */
			handleIMConnect() {
        this.$store.commit('setContent', '')
				this.$store.commit('setisHuman', true)
				this.$u.route({
					url: '/pagesOther/qa/main'
				});
			},
			/**
			 * 进入反馈建议
			 */
			handleAdvice() {
				wx.navigateTo({
					url: '/pagesOther/advice/index'
				})
			},
			/**
			 * 图片预览
			 * @param {Object} opt
			 */
			handlePreviewImage(url) {
				wx.previewImage({
					urls: [url]
				})
			}
		},
		onLoad(opt) {
			this.cId = opt.cid;
			this.qId = opt.qid;
			this.$u.mpShare.title = getApp().globalData.relay_title;
			this.$u.mpShare.desc = getApp().globalData.relay_desc;
			wx.setNavigationBarTitle({
				title: getApp().globalData.web_title
			})
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
		},
    /**
     * 分享
     */
    onShareAppMessage() {
    	
    	// 分享埋点
    	//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
    },
	}
</script>

<style lang="scss" scoped>
	.knowledge-page {
		background-color: #009BFF;
		overflow-x: hidden;

		.header-wrap {
			width: 100%;
			height: 565upx;
			position: relative;

			.bg-img {
				width: 100%;
				height: 100%;
			}

			.top-image {
				width: 280upx;
				height: 64upx;
				position: absolute;
				top: 0;
				left: 235upx;
			}

			.header-content {
				position: absolute;
				top: 154upx;
				left: 41upx;
				width: 100%;
				height: 100%;
				text-align: left;

				.title {
					width: 472upx;
					height: 69upx;
					margin-bottom: 32upx;
				}

				.title-text {
					font-size: 32upx;
					color: #FFFFFF;
					line-height: 48upx;
				}
			}
		}

		.card-box {
			width: 686upx;
			border-radius: 6px;
			position: relative;

			&::before {
				width: 14upx;
				height: 100%;
				content: "";
				display: block;
				position: absolute;
				bottom: -14upx;
				right: -14upx;
				border-right: 1upx white solid;
				border-top: 1upx white solid;
				border-bottom-left-radius: 16upx;
				border-top-right-radius: 16upx;
				border-bottom-right-radius: 16upx;
			}

			&::after {
				width: 100%;
				height: 14upx;
				content: "";
				display: block;
				position: absolute;
				bottom: -18upx;
				left: 12upx;
				border-bottom: 1px white solid;
				border-right: 1px white solid;
				border-bottom-left-radius: 16upx;
				border-bottom-right-radius: 16upx;
			}
		}

		.question-box {
			background-color: #FFFFFF;
			margin: -140upx auto 0 auto;

			.logo {
				width: 196upx;
				height: 196upx;
				position: absolute;
				right: 40upx;
				top: -156upx;
			}

			.dou-hao {
				width: 60upx;
				height: 48upx;
				position: absolute;
				left: 40upx;
				top: -24upx;
			}

			.box-content {
				padding: 52upx 46upx 16upx 32upx;

				.Q {
					width: 48upx;
					height: 46upx;
					vertical-align: text-bottom;
				}

				.text {
					font-size: 30upx;
					color: #65799B;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: Regular;
					line-height: 42upx;
					margin-left: 32upx;
				}

				.tags-list {
					display: flex;
					flex-wrap: wrap;
					margin-top: 24upx;

					.tag-item {
						padding: 12upx 20upx;
						box-sizing: border-box;
						background: rgba(229, 245, 255, 1);
						border-radius: 16px;
						color: #009BFF;
						font-size: 28upx;
						margin-right: 32upx;
						margin-bottom: 16upx;
					}
				}
			}
		}

		.answer-box {
			background-color: rgba(244, 251, 255, 1);
			border-radius: 6px;
			padding: 40upx 32upx;
			box-sizing: border-box;
			margin: 52upx auto 0 auto;

			.card-content {
				.title {
					color: #113260;
					font-size: 36upx;
					font-weight: Medium;
					margin-bottom: 24upx;
				}

				.A {
					width: 45upx;
					height: 46.95upx;
					vertical-align: text-bottom;
				}

				.text {
					margin-left: 32upx;
					font-size: 30upx;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #113260;
					line-height: 46upx;
				}
			}
		}

		.law-box {
			padding: 40upx 32upx;
			box-sizing: border-box;
			margin: 52upx auto 0 auto;
			background-color: rgba(244, 251, 255, 1);
			border-radius: 6px;

			.card-content {
				.title-wrap {
					display: flex;
					margin-bottom: 26upx;

					&.have-line {
						.title {
							&:first-child {
								&::after {
									content: '';
									background-color: #ABD4FF;
									width: 2px;
									height: 40upx;
									position: absolute;
									right: 0;
									top: 4upx;
									display: inline-block;
								}
							}
						}
					}

					.title {
						// flex: 0 0 50%;
						text-align: center;
						padding: 0 48upx;
						font-size: 32upx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: Regular;
						color: #65799B;
						flex: 0 0 242upx;
						box-sizing: border-box;
						position: relative;

						&:first-child {
							flex: 0 0 192upx;
							padding-left: 0;
						}

						&.active {
							color: #047BFF;
							font-size: 36upx;
							font-weight: Medium;
						}
					}
				}

				.law-list {
					.law-item {
						margin-bottom: 34upx;

						.title {
							display: flex;
							align-items: center;
							margin-bottom: 16upx;

							.icon {
								flex: 0 0 48upx;
								width: 48upx;
								height: 48upx;
								margin-right: 16upx;
							}

							.text {
								color: #113260;
								font-size: 30upx;
								font-weight: Medium;
								text-align: justify;
								font-family: PingFangSC-Medium, PingFang SC;
								line-height: 46upx;

								&.case-title {
									color: #047BFF;
								}
							}
						}

						.content {
							color: #113260;
							font-size: 28upx;
							font-weight: Regular;
							line-height: 42upx;
							text-align: justify;
							font-family: PingFangSC-Regular, PingFang SC;
						}
					}
				}

				.file-wrap {
					display: flex;
					flex-wrap: wrap;

					.file-item {
						flex: 0 0 calc(622upx / 3);
						overflow-x: hidden;
						text-align: center;

						.file-box {
							position: relative;

							.file {
								width: 120upx;
								height: 162.28upx;
							}
						}

						.name {
							color: #113260;
							font-size: 28upx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: Medium;
							display: block;
							width: 100%;
						}
					}
				}
			}
		}

		.recommend-box {
			padding: 40upx 32upx;
			box-sizing: border-box;
			margin: 52upx auto 0 auto;
			background-color: rgba(244, 251, 255, 1);
			border-radius: 6px;

			.card-content {
				.title {
					color: #113260;
					font-size: 36upx;
					font-weight: Medium;
					margin-bottom: 24upx;
				}

				.contract-box {
					width: 624upx;
					margin: 32upx auto 32upx auto;
					border-radius: 8upx;
					padding: 16upx 32upx;
					background-color: rgba(187, 203, 216, 0.35);

					&.risk-box {
						background-color: rgba(0, 167, 127, 0.1);

						.text {
							text {
								color: #00A77F;
							}
						}
					}

					.text {
						font-size: 26upx;
						color: #666666;
						text-align: justify;
						font-weight: Regular;

						text {
							color: #3B699A;
							font-weight: Medium;
						}
					}

					.banner {
						margin-top: 16upx;

						image {
							width: 560upx;
							height: 232upx;
						}
					}
				}
			}
		}

		.im-connect {
			padding: 52upx 65upx 0 65upx;

			image {
				width: 620upx;
			}
		}

		.relate-question-box {
			width: 100%;

			.relate-content {
				width: 660upx;
				height: 316upx;
				margin: 33upx auto 0 auto;
				border-radius: 12upx;
				border: 1px solid rgba(190, 203, 223, 1);
				padding: 40upx 16upx 32upx 16upx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				position: relative;

				.tag {
					padding: 4upx 16upx;
					background: linear-gradient(270deg, rgba(255, 137, 73, 1) 0%, rgba(250, 90, 65, 1) 100%);
					border-radius: 12upx 0 12upx 0;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: Medium;
					color: rgba(255, 255, 255, 1);
					text-shadow: 0 0 4px rgba(255, 72, 42, 1);
					display: inline-block;
					position: absolute;
					top: -1upx;
					left: -1upx;
				}

				.relate-list {
					height: 270upx;

					.relate-item {
						padding: 24upx 32upx;
						box-sizing: border-box;
						font-size: 30upx;
						color: #047BFF;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: Medium;

						&.active {
							color: #113260;

							&::before {
								width: 8upx;
								height: 8upx;
								background-color: #3DC56D;
								position: absolute;
								content: '';
								border-radius: 50%;
								left: 10upx;
								top: 40upx;
							}
						}

						&:last-child {
							border-bottom-width: 0;
						}
					}
				}

				.change-pager {
					text-align: center;
					color: #65799B;
					font-size: 24upx;
					padding-top: 32upx;

					image {
						width: 23.4upx;
						height: 22upx;
						margin-right: 8upx;
						vertical-align: middle;
						border-bottom: 2rpx solid rgb(255, 255, 255);
						// transition: All 0.4s ease;
						// transform: rotate(180deg);
					}
				}
			}
		}

		.bottom-wrap {
			background-image: url('https://public-file.aegis-info.com/ilawpush_wxmini/knowledge/chat%201.png');
			height: 566upx;
			background-size: cover;
			padding-top: 88upx;
			margin-top: -88upx;

			.help-box {
				padding: 32upx 40upx;
				box-sizing: border-box;
				margin: 68upx auto 0 auto;
				background-color: rgba(244, 251, 255, 1);
				border-radius: 6px;

				.card-content {
					position: relative;

					.title {
						color: #113260;
						font-size: 36upx;
						font-weight: Medium;
						margin-bottom: 24upx;
					}

					.right-dou-hao {
						position: absolute;
						right: 10upx;
						top: -64upx;
						width: 60upx;
						height: 53.94upx;
					}

					.helper-wrap {
						image {
							width: 128upx;
							height: 53upx;

							&:first-child {
								margin-right: 40upx;
							}
						}
					}
				}
			}

			.advice-wrap {
				margin-top: 50upx;
				margin-left: 60upx;

				.content-box {
					width: 500upx;
					height: 58upx;
					background: linear-gradient(90deg, #FFE046 0%, #FD924E 100%);
					border-radius: 6upx;

					font-size: 26upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 58upx;
					text-shadow: 0px 2upx 4upx #FD964D;
					-webkit-text-stroke: 1upx #FD964D;
					text-stroke: 1upx #FD964D;
					position: relative;
					padding-left: 67upx;
					box-sizing: border-box;

					image {
						width: 64upx;
						position: absolute;
						left: -32upx;
						top: 2upx;
					}
				}
			}
		}

		.block-wrap {
			height: 60upx;
			width: 100%;
		}

		.case-detail-popup {
			.title-wrap-popup {
				padding-top: 82upx;
				padding-bottom: 32upx;
				background-color: #ffffff;
				box-sizing: border-box;

				.title {
					text-align: center;
					color: #3C3F50;
					font-size: 28upx;
					box-sizing: border-box;
					padding: 0 32upx;
					margin-bottom: 14upx;
				}

				.court-info {
					text-align: center;
					color: #65799B;
					font-size: 24upx;
					margin-bottom: 44upx;

					span {
						&:first-child {
							display: inline-block;
							margin-right: 16upx;
						}
					}
				}

				.paras-wrap {
					overflow: hidden;
					width: 100%;
					padding: 0 14upx;
					box-sizing: border-box;
				}

				.paras-list {
					display: flex;
					width: 100%;
					overflow-x: scroll !important;
					padding-right: 14upx;
					flex-wrap: nowrap;

					.paras-item {
						flex: 0 0 180upx;
						margin-right: 16upx;

						text {
							display: inline-block;
							text-align: center;
							width: 100%;
							line-height: 54upx;
							height: 54upx;
							background: #EDF1F6;
							border-radius: 16px;

							&.active {
								background-color: #009BFF;
								color: #ffffff;
							}
						}
					}
				}
			}

			.paras-content {
				font-size: 28upx;
				color: #3C3F50;
				line-height: 48upx;
				overflow: hidden;
				height: 600upx;
				background-color: #EDF1F6;

				.text {
					text-align: justify;
					height: 100%;
					padding: 40upx 49upx;
					box-sizing: border-box;
				}
			}
		}

		.kf-info {
			width: 120upx;
			position: fixed;
			right: 0;
			top: 496upx;
		}
	}
</style>
