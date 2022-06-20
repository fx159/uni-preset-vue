<template>
	<view class="page">
	  <scroll-view class="container">
		 <image src="https://public-file.aegis-info.com/yuanjia/common/rongzi.png" mode="widthFix" class="banner"></image>
		 <view class="main-content">
		 	<view class="title">审核要求</view>
			<view class="content-title">
				<text v-for="(itme,index) in conditionList" :key="index" @click="changeActive(index)"  :class="position === index ? 'active' : ''">{{itme}}</text>
			</view>
			<view class="content-container" v-if="position === 0">
				<view class="container-title">申请融资诉讼服务，必须满足以下条件：</view>
				<view>1、案件标的额在50w以上；</view>
				<view>2、当事人为原告；</view>
				<view>3、相关资料及证据比较完整；</view>
				<view>4、被告/欠款人可被联系到； </view>
				<view>5、案件不是劳动人事、婚姻家庭、刑事诉讼、行政诉讼等。</view>
			</view>
            <view class="content-container" v-else>
            	<view class="container-title">案件满足一下条件，案件通过率更高：</view>
            	<view>1、被告/欠款人非失信被被执行人（老赖）；</view>
            	<view>2、被告/欠款人为公司。</view>
            </view>
		 </view>
		 <view class="main-content">
		 	<view class="title">
		 		服务流程
				<view class="right" @click="getProcess">详情流程 <image src="https://public-file.aegis-info.com/yuanjia/common/zhishi.png"></image></view>
		 	</view>
			<scroll-view scroll-x="true" >
				<view class="serve-container">
					<view v-for="(item,index) in serveList" :key="index"  class="serve-content">
						<view class="step" :class="index % 2 !== 0 ? 'activeColor' : ''">
							<text class="number">{{index+1}}</text>
							<text class="text">{{item}}</text>
						</view>
						<image src="https://public-file.aegis-info.com/yuanjia/common/jiantou.png" v-if="index !== 4" ></image>
					</view>
				</view>
			</scroll-view>
		 </view>
		 <view class="main-content">
		 	<view class="title">
		 		适用场景
		 	</view>
				<view class="scene-container">
					<image src="https://public-file.aegis-info.com/yuanjia/common/client-one.png"></image>
					<view class="content">
						公司财务紧张，无力承担打官司的律师、受理、保全等高额费用，自身正当权益无法实现！
						<text></text>
					</view>
				</view >
				<view class="scene-container">
					<image src="https://public-file.aegis-info.com/yuanjia/common/client-two.png" ></image>
					<view class="content">
						千辛万苦打赢官司，空有胜诉判决无法执行回款，但律师费、受理费一分不能少，到头来打了个“赔本”官司。
						<text></text>
					</view>
				</view>
				<view class="scene-container">
					<image src="https://public-file.aegis-info.com/yuanjia/common/client-three.png" ></image>
					<view class="content">
						费尽心思打赢官司，官司输了，不但旧账要不回，还添加了新负担，这可怎么办！
						<text></text>
					</view>
				</view>
				<view class="scene-container">
					<view class="right">
						风险代理风险太大，前期没有律师费，还要先行垫付差旅费等案件费用，一旦输了完全就是负收益，一般不敢结案。
						<text></text>
					</view>
					<image src="https://public-file.aegis-info.com/yuanjia/common/client-lvshi.png" ></image>
				</view>
		 </view>
		 <view class="main-content mode-content">
		 	<view class="title">
		 		模式优势
		 	</view>
			<image src="https://public-file.aegis-info.com/yuanjia/common/mode.png" class="mode-banner"></image>
			<image src="https://public-file.aegis-info.com/yuanjia/common/mode-one.png" class="mode-one" ></image>
			<view class="mode-container">
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-one.png" ></image>
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-two.png" ></image>
			</view>
			<image src="https://public-file.aegis-info.com/yuanjia/common/mode-two.png" class="mode-one" ></image>
			<view class="mode-container">
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-three.png" class="two"></image>
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-four.png" class="two"></image>
			</view>
			<image src="https://public-file.aegis-info.com/yuanjia/common/mode-three.png" class="mode-one" ></image>
			<view class="mode-container">
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-five.png" class="three"></image>
				<image src="https://public-file.aegis-info.com/yuanjia/common/litigation-six.png" ></image>
			</view>
		 </view>
		 <view class="main-content">
		 	<view class="title">
		 		平台优势
		 	</view>
			<view class="platform">
				<image src="https://public-file.aegis-info.com/yuanjia/common/zhaoshang.png" ></image>
				<view class="desc">
					<view class="border text">
						融资诉讼产品由擎盾集团和招商银行联合打造，资金雄厚、资质合规。
					</view>
				</view>
			</view>
			<view class="platform">
				<view class="desc">
					<view class="border center">
						擎盾集团是国内法律人工智能头部企业，在法律AI、法律大数据、案件风险等领域拥有丰富的AI、算法、知识积累。
					</view>
				</view>
				<image src="https://public-file.aegis-info.com/yuanjia/common/qingdun.png" ></image>
			</view>
			<view class="platform">
				<image src="https://public-file.aegis-info.com/yuanjia/common/tengxun.png"></image>
				<view class="desc">
					<view class="border text">
						擎盾集团是腾讯投后企业。依托腾讯技术与用户资源，实力雄厚。
					</view>
				</view>
			</view>
		 </view>
		 <view v-if="!state" class="bottom-submit" @click="handleSubmit">提交申请</view>
		 <view v-else class="bottom-submit" @click="handleMySubmit">我的申请</view>
		 <u-popup v-model="show" mode="bottom" @close="closePopup" @open="openPopup">
			 <view class="process-container">
			 	<view class="process-title">
			 		服务流程
			 	</view>
				<view class="process-content">
					<view class="mian-content" v-for="(item,index) in numList" :key="index">
						<view :class="index === 4 ? 'step-content' : 'step'" >
							<text>{{item.index}}</text>
						</view>
						<view class="desc">
							<view class="desc-title">{{item.title}}</view>
							<view class="desc-content" v-for="(desc,i) in item.content" :key="i">{{desc}}</view>
						</view>
					</view>
				</view>
				<view v-if="!state" class="submit" @click="handleSubmit">提交申请</view>
				<view v-else class="submit" @click="handleMySubmit">我的申请</view>
			 </view>
		 </u-popup>
		 
	  </scroll-view>
	</view>
</template>

<script>
	import Log from '../../common/log'
	export default {
		data() {
			return {
				serveList: ['用户下单','律师接单','风控审核','合作签约','完成服务'],
				conditionList: ['必备条件','加分条件'],
				state: false, //是否提交过申请
				active: true,
				position: 0,
				show: false,
				numList: [{
				  index: 1,
				  title: '用户下单',
				  content:['若符合平台融资诉讼服务条件，用户可在平台下单，提交申请'] 
				},{
				  index: 2,
				  title: '律师接单',
				  content: ['平台智能匹配合适的律师，律师评估后，提交接单申请']
				},{
				  index: 3,
				  title: '风控审核',
				  content: ['平台、律师联系当事人、律师进一步沟通案件详情、案件资料，对案件进行风控评估。','若风控通过，平台、当事人、律师进一步沟通案件投资事宜。若风控未通过，当事人可与律师沟通选择其他更合适的应诉方案。']
				},{
				  index: 4,
				  title: '合作签约',
				  content: ['平台、当事人、律师共同沟通达成一致后，三方线下签署委托合同。合同签订后，律师进行案件办理，平台适时提供所需资金。当事人配合律师、平台进行案件办理。']
				},{
				  index: 5,
				  title: '完成服务',
				  content: ['服务完成后，用户根据回款情况支付合同约定的服务费用。']
				}],
				scroll: true
			}
		},
		methods: {
		  changeActive(index){
		    this.position = index
		  },
		  getProcess() {
			 	this.show  = true
		  },
		  handleSubmit() {
				uni.navigateTo({
					url: './from'
				})
		  },
		  handleMySubmit() {
				uni.navigateTo({
					url: './process'
				})
		  },
		  closePopup() {
				this.scroll = true
		  },
		  openPopup() {
				this.scroll = false
		  },
		  async getState() {
			 const { data } = await this.$u.api.getAppealFlag()
			 this.state =  data
			 // console.log(this.state) 
		  }
		},
		async onShow(){
			this.$store.commit('setPagerInfo', {
				name: '融资诉讼页',
				code: '12',
				url: '/pagesOther/financing-litigation/index'
			});
		   this.getState()
		},
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
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
		},
		onShareAppMessage() {
			Log.saveEvent('-2', '分享', 'click')
			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
	}
</script>
<style lang="less" scoped>
 @import "./index";
</style>


