<template>
	<view class="container">
		<view class="video">
			<image src="https://public-file.aegis-info.com/yuanjia/common/video.png" class="video-banner"></image>
			<view class="video-desc">企业法律顾问</view>
			<view class="nav-content">
				<view class="left-view">
					<view class="title">{{productInfo.name}}<image src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/fiery.png" ></image></view>
					<text class="left-desc">企业法律顾问</text>
				</view>
				<view class="right-view">
					<view class="right-content">
						<text class="content-num">{{productInfo.priceDesc}}</text>万元/年
					</view>
					<text class="right-desc">{{productInfo.originalPriceDesc}}</text>
				</view>
			</view>
			<view class="serve-container">
				<view class="serve-container-content">
					<view class="title">
						<view class="left">服务内容</view>
						<view class="right">{{productInfo.priceDesc}}万/年</view>
					</view>
					<view class="content" v-html="productInfo.serviceDetail"></view>
				</view>
			</view>
			<view class="nav-bottom">
				<text class="bottom-title">业务覆盖范围</text>
				<view class="bottom-tag">
					<text v-for="(item,index) in list" class="business-text" :key="index">{{item}}</text>
				</view>
			</view>
		</view>
		<!-- <view style="padding: 0 30upx;">
			<Xaddress :permisson="permisson"></Xaddress>
		</view> -->
		<view style="padding: 0 30upx;">
			<view class="lawyer-content">
           <view class="lawyer-title">候朝辉律师</view>
           <view class="lawyer-list">
             <view class="list-left left-phone" >联系方式:&nbsp;4006643088</view>
             <view class="list-right" @click="callPhone">
               立即拨号
             </view>
           </view>
           <view class="lawyer-list">
             <view class="list-left left-card">执业证号:&nbsp;13101 2019 1008 8047</view>
            </view>
           <view class="lawyer-list">
             <view class="list-left left-lawyer">执业律所:&nbsp;北京京师（上海）律师事务所</view>
           </view>
           <view class="lawyer-list">
             <view class="list-left left-location">联系地址:&nbsp;上海市静安区恒丰路299号京师律师广场3层</view>
             <!-- <view class="list-right" @click="goHere">
               到这里去
             </view> -->
           </view>
      </view>
		</view>
		
		<view class="AD-desc">
			    <view class="diamond-red"></view>
				<view class="AD-title">没有律师谁替你思考</view>
				<view class="AD-one">英国著名法官丹宁勋爵在其著作 &laquo最后的篇章&raquo中,</view>
				<view class="AD-one">引述了凯恩斯所讲述的一个故事：</view>
				<view class="AD-one">凯恩斯到布雷顿森林参加货币会议，只有秘书陪同。</view>
				<view class="AD-content">
					<view class="AD-two">他的美国朋友问他：“你的律师呢？”</view>
					<view class="AD-two">“我没有律师。”凯恩斯回答。</view>
					<view class="AD-two">“那谁替您思考？”</view>
				</view>	
				<view class="AD-content">
					<view class="AD-three">In uni-tde final</view>
					<view class="AD-three">chapter of his book,</view>
					<view class="AD-three">Lord of England,</view>
					<view class="AD-three">Lord tannin quoted a story by Keynes:</view>
					<view class="AD-three">Keynes went to Bretton Woods to participate</view>
					<view class="AD-three">in uni-tde monetary conference,</view>
					<view class="AD-three">accompanied only by uni-tde secretary.</view>
				</view>
				<view class="AD-content">
					<view class="AD-four">His American friend asked him,</view>
					<view class="AD-four">"what about your lawyer?"</view>
					<view class="AD-four">"I dont't have a laywer."</view>
					<view class="AD-four">"Who uni-tdinks for you?"</view>
				</view>
				<view class="diamond-blue"></view>
		</view>
		<view class="AD-problem">
			<view class="problem-title">企业老板们面临的问题</view>
			<view class="problem-content">
				<view class="problem-desc">为什么你日夜操劳，业绩还无法提升？</view>
				<view class="problem-desc">为什么你公司的企业额一直无法突破？</view>
				<view class="problem-desc">为什么多年来你的团队一直没有壮大？</view>
				<view class="problem-desc">为什么多年来你一直忙碌无法解放自己？</view>
				<view class="problem-desc">为什么你的优秀员工全部都离你而去？</view>
				<view class="problem-desc">为什么你的员工会成为你的竞争对手？</view>
				<view class="problem-desc">为什么你没有办法招到更多的员工？</view>
				<view class="problem-desc">为什么你总是找不到优秀的合作伙伴？</view>
				<view class="problem-desc">...</view>
			</view>
		</view>
		<view class="legal-serve">
			<view class="serve-title">企业法律顾问为企业保驾护航</view>
			<view class="serve-content">
				<image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/contract.png" ></image>
				<view class="serve-desc">
					<view class="title">合同事项</view>
					<view class="content">合同起草、合同审核修改、合同条款拟定、合同管辖权、合作方背景调查、合同权利义务及履行等各项事务，小公司人治，大公司法制，建立最完善的制度。</view>
				</view>
			</view>
			<view class="serve-content">
				<image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/staffing.png" ></image>
				<view class="serve-desc">
					<view class="title">劳动人事事项</view>
					<view class="content">劳动合同、入职离职文件资料、规章制度、薪酬结构、晋升体系、工伤认定等，人才留用、运用、发挥最大功用。构建最稳定、最合理的组织构成，发挥岗位的最大效用。</view>
				</view>
			</view>
			<view class="serve-content">
				<image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/debt.png" ></image>
				<view class="serve-desc">
					<view class="title">债权债务事项</view>
					<view class="content">借钱左谢右谢，要账千难万难，长路漫漫，要账艰辛。后收费+资金垫付+团队保障+零风险+一线专家团队，为企业保驾护航。千难万难，要账最难，帮助企业呆账变活、坏账变好、死账盘活、活账变现。</view>
				</view>
			</view>
			<view class="serve-content">
			  <image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/stock.png" ></image>
			  <view class="serve-desc">
				<view class="title">股权事项</view>
				<view class="content">如何设计股权让公司越做越大？如何分钱才能赚到更多的钱？如何才能持续不断的赚钱？如何把企业做大做强，实现财富自由？利用股权和分红激活员工的潜能和斗志，让员工为你所用帮你拿回结果，实现业绩翻倍。</view>
			  </view>
			</view>
			<view class="serve-content">
			  <image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/litigation.png" ></image>
			  <view class="serve-desc">
				<view class="title">诉讼事项</view>
				<view class="content">法律是纠纷处理的最后一道防线，设计体系化的诉讼方案事半功倍，一站式诉讼管理服务，专家律师团队化办案争取诉讼主动权。</view>
			  </view>
			</view>
			<view class="serve-content">
			  <image class="" src="https://public-file.aegis-info.com/yuanjia/common/legal-counsel/asset.png" ></image>
			  <view class="serve-desc">
				<view class="title">无形资产保护事项</view>
				<view class="content">知识就是“盾牌”，如何保护自己的商标、专利、著作权、版权？在“没有硝烟的战场”上保护好公司的软实力，在竞争中争取主动。</view>
			  </view>
			</view>

		</view>

		<view class="buy-button" @click="buyServe">立即购买</view>
	</view>

</template>

<script>
	import Log from '../../common/log'
	export default {
		data(){
			return {
				list: ['婚姻家事','民间借贷','拆迁安置','涉外案件','法律顾问','房产继承','劳动工伤','建筑施工','新兴案件','侵权纠纷','合同纠纷','交通事故','股权纠纷','疑难案件','经济纠纷','刑事辩护','知识产权','上诉再审'],
				law:{
				  address: '',
				  name: '',
				  phone: ''
				},
				productId: '',
				productInfo:'',
				targetLocation:{
					latitude: '',
					longitude: ''
				},
				location:{
					latitude: '',
					longitude: ''
				},
				permisson: ''
			}
		},
		methods:{
			callPhone(){
				Log.saveEvent('1', '点击[立即拨号]', 'click');
				wx.makePhoneCall({
					phoneNumber: '4006643088' //仅为示例，并非真实的电话号码
				})
    	},
			// 获取用户是否拥有分享二维码和获取激活码的权限
			getPermisson() {
				  const that = this
				  wx.request({
					url: getApp().globalData.host + `/api/app/qingDun/isIncludeSysUser/${getApp().globalData.unionId}`,
					method: 'GET',
					header: {
					  'content-type': 'application/json; charset=utf-8'
					},
					data: {},
					success:  (res)=> {
					console.log(res, 999);
					const permisson = ['15195751904','18515884892','13546822461']
					if (res.statusCode === 200) {
					  if (res.data) {
						 this.permisson = res.data.result.isSuccess	
						 // if(permisson.indexOf(this.userInfo.phone) >= 0){
							//  this.permisson = true
						 // }
						console.log('permisson:'+res.data.result.isSuccess)
					  } else {
						console.log(res)
					  }
					} else {
					  // that.loading("服务器错误");
					}
					},
					complete: function () {
					   wx.hideLoading();
					}
				  });
			},
			//获取服务商品详情
			getProductDeatil(){
			  this.$u.api.getLegalConsultSkuDetail({productId:this.productId}).then(res=>{
				  console.log(res)
				  this.productInfo = res.data
			  })
			},
			// 购买服务
			buyServe(){
				Log.saveEvent('2', '点击[立即购买]', 'click');
				console.log('buy')
				this.$u.toast('敬请期待')
				return
			  uni.navigateTo({
			  	url: `../365pay/main?productId=${this.productId}&&name=${this.productInfo.name}&&realPrice=${this.productInfo.realPrice}`
			  })
			},
			getPageInfo(){
				let pageInfo = {
					name:'',
					code:''
				}
				switch (Number(this.productId)) {
					case 399:
						pageInfo = {
							name: '爆款服务',
							code: '13'
						}
						break;
					case 400:
						pageInfo = {
							name: '基本服务',
							code: '14'
						}
						break;
					case 401:
						pageInfo = {
							name: '标准服务',
							code: '15'
						}
						break;
					case 402:
						pageInfo = {
							name: '深度服务',
							code: '16'
						}
						break;
					case 403:
						pageInfo = {
							name: '法务外包',
							code: '17'
						}
						break;
					default:
						break;
				}
				this.$store.commit('setPagerInfo', {
					name: pageInfo.name,
					code: pageInfo.code,
					url: '/pagesOther/legal-counsel/index'
				});
				Log.saveEvent('0', '加载页面', 'onShow');
			}
		},
		onShareAppMessage() {
			Log.saveEvent('-2', '分享', 'click')
			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onShow(){
			this.getPageInfo()
		  this.getPermisson()
		  this.getProductDeatil()
		},
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
		},
		onLoad(option){
			console.log(option)
			this.productId = option.productId
			// wx.updateShareMenu({
			// 	withShareTicket: true,
			// 	isPrivateMessage: true,
			// 	activityId: getApp().globalData.activityId,
			// 	success:res=>{
			// 		console.log(res)
			// 	},
			// 	fail: err =>{
			// 		console.log(err)
			// 	}
			// })
		}
	}
</script>	

<style lang="scss" scoped>
  @import "./index";
</style>
