<template>
	<view class="container">
		<Xheader @showPopup="showPopup" :roleDesc="roleDesc" @change="inputChange">
		</Xheader>
		<scroll-view :scroll-x="true" style="width: 100%;" class="order-header">
			<text @click="changeHeaderActive(item.spu_id,item,index)" :class="[item.spu_id === headerPosition ? 'header-active' : '']" v-for="(item,index) in productList" :key="item.spu_id">{{item.spu_name}}</text>
		</scroll-view>
		<scroll-view :scroll-y="true" :style="{'height':autoHeight+'px'}" >
			<view class="order-content" v-if="myOrderList.length">
				<orderDesc :item="item" v-for="(item,index) in myOrderList" @viewDetail="viewDetail(item)" :key="index"></orderDesc>
			</view>
			<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
		</scroll-view>
		<u-popup v-model="show" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">
				    <text class="screen-item">筛选</text>
				</view>
				<view class="order-time">
					<text class="screen-item">下单时间</text>
					<view class="content">
						<text @click="changeActiveTime(index,time)"  v-for="(time,index) in registrationTime" :key="index" :class="[index===position? 'active': '']">{{time}}</text>
					</view>
				</view>
				<view class="custom-time">
					<text class="screen-item">自定义时间</text>
					<view class="content">
						<u-input disabled :value="customTime.startTime" inputAlign="center" @click="customTimeChange('showStartPicker')" type="text" :clearable="false" class="start-time" placeholder-style="text-align:center" placeholder="开始时间" border/>
						-
						<u-input disabled :value="customTime.endTime" inputAlign="center" @click="customTimeChange('showEndPicker')" type="text" :clearable="false" class="end-time" placeholder-style="text-align:center" placeholder="结束时间" border/>
					</view>
				</view>
			   <view class="commodity-type" >
			   	   <text class="screen-item">商品类型</text>
				   <scroll-view :scroll-y="true" :scroll-x="false" class="commodity-content">
				   		<text v-for="(item,index) in productTypeList" @click="changeActive(index,item)" :class="[item.active ? 'active': '']" :key="item.id">
						{{item.name}}
					   </text>
				   </scroll-view>
			   </view>
			   <view class="custom-time">
			   	   <text class="screen-item">订单金额</text>
				   <view class="content" >
				   	<u-input v-model="orderAmount.maxAmount" @change="maxAmountChange"  type="text" :clearable="false" input-align="center" class="start-time" placeholder-style="text-align:center" placeholder="最高金额" border/>
				   	-
				   	<u-input v-model="orderAmount.minAmount" @change="minAmountChange"  type="text" :clearable="false" input-align="center" class="end-time" placeholder-style="text-align:center" placeholder="最低金额" border/>
				   </view>
			   </view>
			   <view class="screen-button">
			   	  <text class="reset" @click="reset">重置</text>
				  <text class="confirm" @click="confirm()">确定</text>
			   </view>
			   <u-picker mode="time" v-model="showStartPicker" :params="params" @cancel="cancelStartPicker" @confirm="confirmStartPicker"></u-picker>
			   <u-picker mode="time" v-model="showEndPicker" :params="params" @cancel="cancelEndPicker" @confirm="confirmEndPicker"></u-picker>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Xheader from '../components/header/header.vue'
	import orderDesc from '../../wxcomponents/order-desc/index.vue'
	import Log from '../../common/log'
	const TIMETEMP = 24 * 60 * 60 * 1000
	import { throttle } from '../../common/utils.js'
	export default {
		data() {
			return {
				show: false,
				showPicker: false,
				customTime:{
					startTime: '',
					endTime: ''
				},
				registrationTime:['今日','近7日','近15日','近30日'],
				showStartPicker: false,
				showEndPicker: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				value: '',
				orderAmount:{
				   maxAmount: '',
				   minAmount: ''
				},
				roleId:'',
				myOrderList:[],
				position: '',
				productList: [],
				productTypeList: [],
				product: [],
				headerPosition: 0,
				roleDesc: {
					roleId: '',
					searchText: ''
				},
				autoHeight: '',
				total:0,
				pageNum:0,
				pageSize: 8,
				startIndex: 0,
				currentIndex: 0,
				inputText: '',
                unitId: '',
			}
		},
		components:{
			Xheader,
			orderDesc
		},
		methods: {
			maxAmountChange(){
				Log.saveEvent('7', `输入订单金额`, 'change');
			},
			minAmountChange(){},
			viewDetail(item){
				Log.saveEvent('7', `输入订单金额`, 'change');
			},
			//时间解析方法
			parseTime(index){
				let time
				switch (index){
					case 0:
					    this.customTime.startTime = this.$u.utils.getTime(new Date())
						this.customTime.endTime = this.$u.utils.getTime(new Date())
						break;
					case 1:
						this.customTime.endTime = this.$u.utils.getTime(new Date())
						 time =new Date(this.customTime.endTime).getTime() - 7 * TIMETEMP
						this.customTime.startTime = this.$u.utils.getTime(new Date(time))
						console.log(this.customTime)
						break;
					case 2:
						this.customTime.endTime = this.$u.utils.getTime(new Date())
						 time =new Date(this.customTime.endTime).getTime() - 15 * TIMETEMP
						this.customTime.startTime = this.$u.utils.getTime(new Date(time))
						console.log(this.customTime)
						break;
					case 3:
						this.customTime.endTime = this.$u.utils.getTime(new Date())
						 time =new Date(this.customTime.endTime).getTime() - 30 * TIMETEMP
						this.customTime.startTime = this.$u.utils.getTime(new Date(time))
						console.log(this.customTime)
						break;
					default:
						break;
				}
			},
			changeHeaderActive(id,item,index){
				Log.saveEvent('2', `点击[tab选项]`, 'click');
				this.headerPosition = id
				this.productTypeList = item.sku_list
				this.pageNum = 0
				this.confirm()
			},
			// 改变选中的商品列表状态
			changeActive(index,item){
				Log.saveEvent('6', `选择[${item.name}]`, 'click');
				this.productTypeList.splice(index,1,Object.assign(item,{active: item.active? false : true}))
			},
			// 改变选中时间段的状态
			changeActiveTime(index,time){
				Log.saveEvent('4', `点击[下单时间-${time}]`, 'click');
				this.position = index
			    this.parseTime(index)
			},
			//确认结束时间
			confirmEndPicker(val){
				this.customTime.endTime= val.year + '-'+ val.month + '-' + val.day
				this.checkTime()
			},
			checkTime() {
				if (this.customTime.startTime && this.customTime.endTime && this.customTime.startTime > this.customTime.endTime) {
					const tmp = this.customTime.startTime
					this.customTime.startTime = this.customTime.endTime
					this.customTime.endTime = tmp
				}
			},
			//确认开始时间
			confirmStartPicker(val){
				console.log(val)
				Log.saveEvent('5', `输入自定义时间`, 'change');
				this.customTime.startTime = val.year+ '-'+val.month + '-' + val.day
			},
			// 改变自定义时间下单时间不显示
			customTimeChange(val){
			    this.position = ''
				console.log(val)
				this[val] = true
			},
			//重置
			reset(){
				Log.saveEvent('8', `点击[重置]`, 'click');
				this.position = ''
				this.customTime = {
					startTime: '',
					endTime: ''
				}
				this.orderAmount = {
				   maxAmount: '',
				   minAmount: ''
				}
				this.productTypeList.map(item=>{
					item.active = false
				})
				this.confirm(0)
			},
			// 确认筛选
			confirm(){
				Log.saveEvent('9', `点击[确定]`, 'click');
				let amount = []
				let search_time = []
				if(this.orderAmount.minAmount != '' || this.orderAmount.maxAmount != ''){
					if(!(this.orderAmount.minAmount && this.orderAmount.maxAmount)){
						this.$u.toast('请选择完整的订单金额')
						return	
					}else{
						amount = [this.orderAmount.minAmount,this.orderAmount.maxAmount]
					}
				}
				if(this.customTime.startTime != '' || this.customTime.endTime != ''){
					if(!(this.customTime.startTime && this.customTime.endTime)){
						this.$u.toast('请选择完整的时间区间')
						return	
					}else{
						search_time = this.customTime.startTime ? [this.customTime.startTime +' 00:00:00',this.customTime.endTime+' 23:59:59'] : []
					}
				}
				let sort = []
				this.productTypeList.map(item=>{if(item.active) sort.push(item.id)})
				// 如果筛选里面没有选中项则处理导航选中情况
				if(!sort.length && this.headerPosition != 0){
					this.productTypeList.map(item=>{sort.push(item.id)})
				}
				this.show  = false
				this.getMyorderList(0,10000,amount,sort,search_time,this.inputText)
			},
			showPopup(val){
				Log.saveEvent('3', `点击[筛选]`, 'click');
			  this.show = val
			},
			inputChange(val){
				this.inputText = val
				this.confirm()
			},
			// 获取订单类型
			getOrderType(){
				uni.showLoading({
					title: '加载中'
				});
				this.$u.api.getLawfirmProductSort({unitId: getApp().globalData.unitId}).then(res=>{
					this.productList = res.data
					let arr = []
					this.productList.map(item=>{
						arr = arr.concat(item.sku_list)
					})
					this.productTypeList = arr
					this.productList.unshift({"spu_name": "全部","spu_id": 0, "sku_list": arr})
					uni.hideLoading()
				})
			},
			bindsroll:throttle(function(e){
			  let offsetHeight = e.detail.scrollTop
			  console.log('offsetHeight',offsetHeight)
			//   if(offsetHeight>(this.pageNum+1)*132*Math.floor(this.autoHeight/132)){
				  this.pageNum+=1
				//   this.pageSize = Math.floor(this.autoHeight/132) * 2
				  // this.confirm(this.pageNum)
				//   this.getMyorderList(this.pageNum,this.pageSize)
			//   }
			},1000,{leading: true,trailing: true}),
			// 管理员身份获取订单列表
			getMyorderList(pageNum=0,pageSize=10000,amount=[],sort=[],search_time=[],search_key=''){
				const params= {
					user_id: getApp().globalData.userId,
					role_id: parseInt(this.roleId) ,
					pageNum,
					pageSize,
					amount,
					sort,
					search_time,
					search_key,
          unitId: getApp().globalData.unitId,
				}
				uni.showLoading({
					title: '加载中···'
				});
				this.$u.api.getUserOrderList(params).then(res=>{
					console.log(res)
					if(pageNum == 0){
						this.myOrderList = res.data
					}else {
						this.myOrderList.push(...res.data)
					}
					this.total = res.total
					uni.hideLoading();
					// this.myOrderList.map(item=>{
					// 	item.userBehavior = [item.has_intelligent_quest,item.has_phone_call,item.has_video_call]
					// })
				})
			},
		},
		onShow(){
			this.$store.commit('setPagerInfo', {
				name: '我的订单页',
				code: '24',
				url: '/pageServe/my-order/index'
			});
			Log.saveEvent('0', '加载页面', 'onShow');
		},
		async onLoad(option){
			console.log(option)
			const userInfo = await uni.getStorageSync('user-info') || null
    		this.roleId = userInfo.userRole
    		this.unitId = userInfo.unitId
			// this.roleId =parseInt(option.roleId) 
      		if(this.roleId === 5){
				this.roleDesc = {
					roleId: this.roleId,
					searchText: ''
				}
			}else{
				this.roleDesc = {
					roleId: this.roleId,
					searchText: '获取激活码'
				}
			}
			const res = wx.getSystemInfoSync()
			this.autoHeight = res.windowHeight - 100
			console.log(res.windowHeight)
			this.getMyorderList()
			this.getOrderType()
		},
		onUnload(){
			Log.saveEvent('-1', '离开页面', 'onUnload');
		},
		onShareAppMessage() {
			// 分享埋点
			Log.saveEvent('-2', '分享', 'click')
		}
	}
</script>

<style lang="scss" scoped>
@import "./index";
.content{
	padding: 0 30upx;
}
.active{
	color: #2E4E6F;
}
.order-header{
    white-space: nowrap;
	margin-bottom: 15upx;
	text{
		display: inline-block;
		margin: 0 0 0 30upx;
		height: 45upx;
		white-space: nowrap;/*不换行*/
		
	}
	.header-active{
		color: #2E4E6F;
		position: relative;
	}
	.header-active::after{
		position: absolute;
		bottom: 0;
		left: 0;
		content: '';
		height: 4upx;
		width: 100%;
		background-color: #2E4E6F ;
	}
}
</style>
