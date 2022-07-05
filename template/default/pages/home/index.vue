<template>
	<view class="index-page">
		
		<view class="title-text" :style="{'top':titleStyle.top+'px','height': titleStyle.height+'px', 'line-height': titleStyle.height+'px'}">海浩律所法律顾问</view>
		<view class="header-content">
			<swiper style="width:100%;height:100%;"  :current="activeSwiper" @change="swiperChange" :autoplay="autoplay" :interval="4000" class="swiper" circular>
				<swiper-item>
					<view class="video-item">
						<video @play="videoPlay " controls play-btn-position="center" @fullscreenchange="fullscreenchange" :object-fit="videoFit"  @pause="videoPause"	 style="width:100%;" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/legal-advisor.mp4"></video>
					</view>
				</swiper-item>
				<swiper-item v-for="(banner,index) in bannerList" @click="handleClickItem(banner.name,'',index+1)" :key="index">
						<image
								class="banner"
								:src="banner.url"
								mode="widthFix"
						></image>
				</swiper-item>
			</swiper>
			
			<view class="swiper-step" >
				<view v-for="(item,index) in 3" @click.stop="changeActive(index)"  :data-index="index" :style="{'width':activeSwiper === index ? '24px':'16px'}" class="step-item" :key="index"></view>
			</view>
			<view class="bottom-wrap">
				<image mode="widthFix" @click="handleClickItem('图文咨询','',4)" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_2e89735f-8882-4615-8ded-e2274e28dea5.png"></image>
				<image mode="widthFix" @click="handleClickItem('视频咨询','',3)" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_33adc907-d6d6-479f-92c4-7e20f6076d28.png"></image>
			</view>
		</view>
    <view class="main">
			<view class="characteristic-service">
				<view class="title">特色服务</view>
				<view class="service-content service-content-first">
					<view v-for="(s, index) in serviceFisrtList" :key="index" :style="{'background': s.bgColor}" class="service-item" @click="handleServiceLink(s)">
								<image class="service-icon" :src="s.icon"></image>
								<view>{{ s.name }}</view>
					</view>
				</view>
		</view>
		<view class="characteristic-service legal-counsel">
			<view class="title">企业法律顾问</view>
			<view class="service-content service-content-two">
					<view v-for="(s, index) in legalCounselList" class="counsel-item" :key="index" @click="handleCounselLink(s)">
								<image class="service-icon-two" :src="s.icon"></image>
								<view class="counsel-text" >{{ s.name.substring(0,4) }}</view>
								<view class="counsel-price">{{ s.name.substring(4) }}</view>
					</view>
				</view>
		</view>
		<view class="law-subject-content">
			<view class="subject-title"><text>法律专题</text></view>
			<view class="service-content">
				<view v-for="(l, index) in subjectList" class="content-box" :key="index" @click="handleClickSubject(l)">
						<image class="subject-icon" :src="l.icon_url"></image>
						<view class="grid-text-law">
							<view class="text-law-name " :class="[index===0?'text-law-name-hot':'']">{{ l.subject_name }}</view>
							<view class="text-law-desc">{{l.subject_desc}}</view>
							<view class="text-law-count">{{l.consultant_count}}人咨询</view>
						</view>
				</view>
			</view>
		</view>
		<xiaofaRobot />
		<!--region 登录弹窗-->
		<view class="login-container" v-if="isShowLogin">
			<text class="login-text">立即登录，享受专属法律服务</text>
			<view class="login-btn" @click="handleLogin">立即登录</view>
		</view>
		<!--endregion-->
		</view>
  </view>
</template>


<script>
	import xiaofaRobot from '../../wxcomponents/xiaofaRobot/index.vue'
	import { getOrderType } from "../../common/utils.js"
	import config from '../../common/config.js'
	import Log from '../../common/log.js';
	const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
	export default {
		data() {
			return {
				videoFit: 'fill',
				autoplay: true,
        finderUserName: 'sphxFxwXaZLE3wP',//小法管家视频号ID
        cardIndex: '', //咨询卡索引
				cardInfo: '',//用户咨询卡信息
				userInfo: null,
        showMask: false,//遮罩
        inLiveTime: false,//直播时间内
				showCardDialog: false,
        jumpUrl: '',
        imgUrl: '',
				// privateMessage:'',
				// opt:'',
        popupList:[],
				bannerList: [
					{
						url: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_79b2679d-0efa-4ac9-8860-171ad87a80c5.png',
						name: '语音咨询'
					},
					{
						url: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_eb71dc57-b142-46bb-b618-f217e90461cf.png',
						name: '智能咨询'
					}
				],
        qdBannerList:[],//后台配置
				legalCounselList: [
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_45413b0c-ec6e-484f-9e07-6b6ab898be15.png',
						name: '爆款服务2万/年',
						productId: '',
						url: '../../pagesOther/legal-counsel/index'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_bf3989bf-7f20-4411-8a67-078a807c5514.png',
						name: '基本服务5万/年',
						productId: '',
						url: '../../pagesOther/legal-counsel/index'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_a17418e2-d328-4971-b3f8-4b1336616967.png',
						name: '标准服务10万/年',
						productId: '',
						url: '../../pagesOther/legal-counsel/index'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_682cc7b4-121d-4e08-b14f-9d7bb1433c98.png',
						name: '深度服务20万/年',
						productId: '',
						url: '../../pagesOther/legal-counsel/index'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_8fdf69fb-0a31-47ad-80be-a50487cc73e7.png',
						name: '法务外包20-50万/年',
						productId: '',
						url: '../../pagesOther/legal-counsel/index'
					}
				],
				serviceFisrtList: [
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_1872765c-072b-4ae3-b85f-3f2b667da3e3.png',
						name: '文书生成',
						spuId: '383',
						url: '../../pagesOther/365pay/index',
						bgColor: '#F1F9FE'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_867402e4-6d03-4e7f-9666-4a3e855ca784.png',
						name: '文书撰写',
						spuId: '383',
						url: '../../pagesOther/365pay/index',
						bgColor: '#F5F8FB'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_f9f36a03-5319-4a99-8a37-bcc3178a4da2.png',
						name: '语音咨询',
						spuId: '383',
						url: '../../pagesOther/365pay/index',
						bgColor: '#F1F9FE'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_d7e17866-c64e-4b01-99a1-8d7348795ff5.png',
						name: '视频咨询',
						spuId: '383',
						url: '../../pagesOther/365pay/index',
						bgColor: '#F7F7FF'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_03cbd656-012b-4bb7-bba6-8406905b2568.png',
						name: '法律意见',
						url: 'https://ilawpush5.aegis-info.com/iLitigationRisk/home',
						bgColor: '#FFF9F8'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_0414d146-c4d2-4d42-b945-cdd6122d88fc.png',
						name: '量刑预测',
						url: 'https://h5.law.push.aegis-info.com/html/penalties_list',
						bgColor: '#F7F7FF'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_7457d7a9-ed39-462a-930d-131616851a5b.png',
						name: '律师费报价',
						url: '',
						bgColor: '#FFFAEF'
					},
					{
						icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220607_13d9c97c-3c21-46f6-a178-91125501b681.png',
						name: '融资诉讼',
						url: '../../pagesOther/financing-litigation/index',
						bgColor: '#F5F8FB'
					},
					// {
					// 	icon: 'https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_0ae7b7cd-18b0-40ac-96a6-7ae2290f7aeb.png',
					// 	name: '合同模板库',
					// 	url: `${straddleUrl[config.ENV]}`
					// }
				],
				serviceLastList: [
					
				],
				lawSubjectList: [
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/jiating_icon@2x.png',
						name: '婚姻家庭',
						topicId: '5ee72bea672d7343db0650ff'
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/laodong_icon@2x.png',
						name: '劳动纠纷',
						topicId: '5ee73e84672d7343db06510e'
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/qinquan_icon@2x.png',
						name: '侵权纠纷',
						topicId: '5ee744f0672d7343db065115'
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/jiaotong_icon@2x.png',
						name: '交通事故',
						topicId: '5ed5f156672d732a8feea15a'
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/gongzheng_icon@2x.png',
						name: '公证',
						topicId: ''
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/sifa_icon@2x.png',
						name: '司法鉴定',
						topicId: ''
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/yuanzhu_icon@2x.png',
						name: '法律援助',
						topicId: ''
					},
					{
						icon: 'https://public-file.aegis-info.com/yuanjia/common/tiaojie_icon@2x.png',
						name: '人民调解',
						topicId: ''
					}
				],
				isCommodity: false,
				phoneValue: '',
				isShowLogin: true,
				userID: '',
				// pusher URL 参数
				// player 参数
				productList: '', //会员卡列表
				subjectList: [],
				activityId: '',
				titleStyle: {
					top: '',
					height: ''
				},
				activeSwiper: 0
			}
		},
		components: {
			xiaofaRobot
  	},
		methods: {
			fullscreenchange(e){
				console.log(e)
				if(e.target.fullScreen){
					this.videoFit = 'contain'
				}else{
					this.videoFit = 'fill'
				}
			},
			changeActive(i){
				this.activeSwiper = i
			},
			videoPlay(){
				this.autoplay = false
			},
			videoPause(){
				this.autoplay = true
			},
			swiperChange(e){
				// if(e.detail.source)
				if(!e.target.source) return
				this.activeSwiper  = e.target.current
				// if(e.target&&e.target.current ===2) {
				// 	this.autoplay = false
				// }
			},
			async handleOpenLink(spuId,type){
				try {
					const data = await this.getCommodityInfo(spuId,type) 
					getApp().globalData.orderInfo = {...getApp().globalData.orderInfo,orderType: data.productType, productId: data.productId, orderId: data.orderId,serviceTime:data.serviceTime }
					if(data.existFlag) {
						uni.navigateTo({
							///pageServe/imgTextConsult/index?orderId=${data.orderId}&orderType=${orderType}&productId=${data.productId}&spuId=${spu.spuId}
							url: `/pageServe/imgTextConsult/index?serviceStatus=${data.serviceStatus}&orderId=${data.orderId}&orderType=${data.orderType}&productId=${data.productId}&spuId=${spuId}`
					})
					}else{
						wx.navigateTo({
							url: `/pagesOther/365pay/index?spuId=${spu.spuId}`
						})
					}
				} catch (error) {
					
				}
			},
			viewQa(){
				wx.navigateTo({
					url: '/pagesOther/qa/main'
				})
			},
			getTitleLocation() {
				const res = wx.getMenuButtonBoundingClientRect()
				this.titleStyle ={
					height: res.height,
					top: res.top,
				}
				console.log(res)
			},
      dealLogin(query){
        if(this.userInfo && this.userInfo.id) {
          // this.getRole()
          this.isShowLogin = false
					// this.getBannerSettings()
					if(query.spuId && query.type) {
						console.log('query:')
						console.log(query.spuId,query.type)
						this.handleOpenLink(query.spuId,query.type)
					}
        }else{
          this.getUserInfoByOpenId().then(async res=>{
            this.userInfo = res
            if(this.userInfo && this.userInfo.id) {
              await this.getUserRole()
              this.getLegalList()
              // this.getCommodityInfo()
							this.getProductList()
							// this.getBannerSettings()
							if(query.spuId && query.type) {
								console.log('query:')
								console.log(query.spuId,query.type)
								this.handleOpenLink(query.spuId,query.type)
							}
              // this.getRole()
            }
						console.log('user:',this.userInfo)
            this.isShowLogin = !(this.userInfo && this.userInfo.id)
          })
        }
      },

      getRole(){
				this.$u.api.getRoles({unitId:getApp().globalData.unitId}).then(res=>{
					// getApp().globalData.role = res.data
					console.log(res)
					res.data.map(item=>{
						item.roleId !== 5
						getApp().globalData.role = true
					})
				})
			},
			handleCounselLink(counsel){
				Log.saveEvent(6, `法律顾问-${counsel.name}`, 'click')
				if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
				}
				
				uni.navigateTo({
			     url: `../../pagesOther/legal-counsel/index?productId=${counsel.productId}`
			  })
			},
			goCounsel(name){
			 if (!(this.userInfo && this.userInfo.id)) {
				this.$u.toast('请先登陆！');
				return;
			 }
			 const data = this.legalCounselList.find(item => {
				 return item.name.substring(0,4) === name
			 })
			  uni.navigateTo({
			     url: `../../pagesOther/legal-counsel/index?productId=${data.productId}`
			  })
			},
			// 获取企业法律商品ID
			getLegalList(){
				const params = {
					unitId:getApp().globalData.unitId
				}
				this.$u.api.getLegalCounselSku(params).then(res=>{
				    this.legalCounselList.map(item=>{
						res.data.map(i=>{
							if(i.name.substring(0,4) === item.name.substring(0,4)) {
								item.productId = i.productId
							}
						})
					})
				})
			},
			// 获取用户咨询卡权限
			async getCommodityInfo(spuId,productType) {
				if(!this.userInfo && !this.userInfo.id) return
				const { data } = await this.$u.api.getProductRight({spuId,productType})
				console.log('existFlag')
				console.log(data)
				return data
				// console.log(data)
				// this.isCommodity = data.existFlag
			    // await uni.setStorageSync('user-commodity', data)
			},
			// 获取咨询卡列表
			async getProductList() {
				this.userInfo = await uni.getStorageSync('user-info')
			   if(!this.userInfo) return
			   const params = {
				  unitId: getApp().globalData.unitId
			   }
			   const { data } = await this.$u.api.getSpuList(params)
			   this.productList = data
				 Object.assign(this.$data.serviceFisrtList, this.$options.data().serviceFisrtList)
			   this.serviceFisrtList.map(item=>{
				  this.productList.map(i=>{
					  if (i.spuName === item.name) {
						  item.spuId = i.spuId
					  }
				  })
			   })
			   console.log('getMemberCardtInfo:'+data)
			},
			// 前往365咨询卡页面
			async handleConsult(index) {
				if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
				}
				uni.navigateTo({
				   url: `../../pagesOther/365pay/index?spuId=${this.productList[index].spuId}`
				})
			},
			// 特色服务
			async handleServiceLink(item,index) {
				console.log(item,'item');
				Log.saveEvent(5, `特色服务-${item.name}`, 'click')
				if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
				}
				if(item.name === '律师费报价'){
					this.$u.toast('敬请期待')
					return
				}
				if (this.$u.test.url(item.url)) {
					this.$u.route({
						url: 'pages/web-view/index',
						params: {
							path: item.url,
							mp: ''
						}
					})

				} else {
					console.log(item.url)
					if(!item.url){
						this.$u.toast('敬请期待！')
						return
					}
					if(item.name === '融资诉讼' ) {
						uni.navigateTo({
						 url: `${item.url}`
						})
						return
					}
					this.handleClickItem(item.name,item.url)
				}
			},
			handleMoreSubject() {
				if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
				}
				this.$u.route({
					url: 'pages/web-view/index',
					params: {
						path: 'https://ilawpush5.aegis-info.com/law-subject',
						type: 'mp',
						eventId: '8014'
					}
				})
			},
			// 法律专题
			handleClickSubject (item) {
				Log.saveEvent(7, `法律专题-${item.name}`, 'click')
				if (item._id) {	
					this.$u.route({
						url: 'pages/web-view/index',
						params: {
							path: `https://xiaofaappletsh5.aegis-info.com/qa-topic`,
							topic: item.subject_name,
							topic_id: item._id,
							eventId: '8014', // TODO
							type: 'mp',
							mp: true
						}
					})
				}else {
					this.$u.toast('敬请期待！');
				}
			},
			async handleClickItem(name,url,code){
					if(code) Log.saveEvent(code, name, 'click')
					if (!(this.userInfo && this.userInfo.id)) {
						this.$u.toast('请先登陆！');
						return;
					}
					if(name==='智能咨询'){
						this.viewQa()
						return
					}
				 	let spu =	this.productList.find(item =>{
						return item.spuName === name
					})
					const orderType = getOrderType(name)
				 	const data = await this.getCommodityInfo(spu.spuId,orderType)
					if(data.existFlag && name == '文书生成'){
							uni.navigateTo({
								url: `${url}?spuId=${spu.spuId}&orderId=${data.orderId}&orderType=${orderType}&contractId=${data.contractId || ''}&kindId=${data.kindId || ''}`
							})
							return
					}
					if(data.existFlag) {
						uni.navigateTo({
							url: `/pageServe/imgTextConsult/index?serviceTime=${data.serviceTime}&orderId=${data.orderId}&orderType=${orderType}&productId=${data.productId}&spuId=${spu.spuId}`
						})
					}else{
						wx.navigateTo({
								url: `/pagesOther/365pay/index?spuId=${spu.spuId}&orderType=${orderType}`
						})
					}
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

			// ai法律咨询
			handleAIClick() {
				if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
				}
				wx.switchTab({
					url:'/pages/qa/main'
				})
			},
			// 跳转登录
			async handleLogin() {
				if (!(this.userInfo && this.userInfo.id)) {
					uni.navigateTo({
						url: '/pagesOther/login/index'
					});
					return;
				}
				uni.navigateTo({
					url: '/pagesOther/login/index'
				});
			},
			/**
			 * 获取首页配置信息
			 */
			async initSubjectInfo() {
				try {
					const res = await this.$u.api.getH5Setting({
						interfaceId: 'mp',
						eventId: '8014' // TODO
					});
					// 解析接口返回的数据
					if (res && res.data && res.data.content) {
						const {content} = res.data.content[0];
						const {banner_list,coreFeatures,recommended,headSearch} = JSON.parse(content);
            console.log(res.data.content[0].banner_list,'res.data')
						// 抽取法律专题id
						const _ids = await coreFeatures.list[0].list.map(item => {
							return item.id;
						});
						this.getCoreFeatures(_ids);
					}
				} catch (e) {
					uni.showModal({
						title: '提示',
						content: '网络问题，请稍后再试！',
						showCancel: false,
						confirmText: '知道了',
						confirmColor: '#007AFF'
					})
				}
			},
			/**
			 * 根据专题id法律专题信息
			 * @param {Object} ids
			 */
			async getCoreFeatures(ids) {
				const res = await this.$u.api.multiSubject(ids);
				if (res.data && res.data.length > 0) {
					this.subjectList = res.data.splice(0, 8);
				}
			},
			// 获取用户角色
			getUserRole(){
				return new Promise((resolve,reject)=>{
					this.$u.api.getRoles({unitId:getApp().globalData.unitId}).then(res=>{
						const userInfo = uni.getStorageSync('user-info')
						console.log(res)
						res.data.map(item=>{
							if(item.isCurrentRole == 1){
								userInfo.userRole = item.roleId
							}
						})
						uni.setStorageSync('user-info',userInfo)
						uni.setStorageSync('user-role',res.data)
						resolve()
					})
				})
			},
      // 根据openId获取用户信息
			getUserInfoByOpenId(){
				return new Promise((resolve,reject)=>{
					wx.login({
					  success: (res) => {
						if (res && res.code) {
						  this.$u.api.getWxInfoByCode({
							code: res.code
						  }).then(async res => {
							  console.log('login:'+JSON.stringify(res.data) )
							const { openid, session_key, unionid } = res.data;
							getApp().globalData.unionId = unionid;
							getApp().globalData.openId = openid;
							getApp().globalData.session_key = session_key;
							const obj = {
								source: '海浩律所法律顾问',
								role: '',
								openId: openid
							}
							const {data} = await this.$u.api.getUserInfoByOpenId(obj)
							if(!data.authorityFlag){
								resolve(null)
							}
							getApp().globalData.userId = data.userId
							getApp().globalData.phone = data.phone
							getApp().globalData.name = data.nickname
							// console.log("openid data:" + JSON.stringify(data.nickname))
							uni.setStorageSync('user-info', {
								token: `Bearer ${data.token}`,
								name: data.nickname,
								phone: data.phone,
								openid: openid,
								unionid: unionid,
								header: data.icon,
								id: data.userId || '',
								icon: data.icon,
								nickName:data.nickname
							});

							const userInfo = await uni.getStorageSync('user-info')
							resolve(userInfo)
						  })
						}
					  },
					  fail: (err)=>{
						  reject(err)
					  }
					})
				})
		 },
		mounted() {
			uni.showTabBar({
				animation: true,
				success() {
					console.log('mounted tabbar')
				},
				error() {
					console.log('error showAll tabbar:')
				}
			});
		},
		async onShow() {
			uni.showTabBar({
				animation: true,
				success() {
					console.log('showAll tabbar')
				},
				error() {
					console.log('error showAll tabbar:')
				}
			});
			getApp().globalData.haveCallPhone = '';
			// 设置页面缓存
			this.$store.commit('setPagerInfo', {
				name: '首页',
				code: '1',
				url: '/pages/home/index'
			});
			Log.saveEvent('0', '加载', 'onShow')
			this.userInfo = await uni.getStorageSync('user-info') || null
			this.isShowLogin = !(this.userInfo && this.userInfo.id)

			if(this.userInfo&&this.userInfo.id) {
				console.log(this.userInfo)
				await this.getUserRole()
				this.getLegalList()
				// this.getCommodityInfo()
				this.getProductList()
			}
		},
		onUnload(){
			Log.saveEvent('-1', '离开', 'onUnload')
		},
		async onLoad(query) {
			this.getTitleLocation()
			const net = await this.checkNetwork();
            // await this.$u.api.resetAskCount({phone:'13618215414'})
			if (!net) {
				return;
			};
			// this.getUserInfoByOpenId()
			// 判断是否扫码登录和是否首次登录
			this.userInfo = await uni.getStorageSync('user-info') || null
      // this.bindByScanCode(query)
      this.dealLogin(query)
      // this.getBannerSettings()
			this.initSubjectInfo()
      // 读管理弹窗平台配置
      // this.getPopupWindowSettings()
		 }
		},
		/**
		 * 分享
		 */
		onShareAppMessage() {
			// 分享埋点
			Log.saveEvent('-2', '分享', 'click')
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp

		},
		/**
		 * 底部tab点击
		 */
		onTabItemTap: function(tab) {
			console.log('tab:', tab);
		},
		onReachBottom() {
			console.log("到底了")
		}
	}
</script>

<style lang="scss">
	@import "./index";
</style>
