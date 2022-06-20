<template>
	<view>
		<Xheader @showPopup="showPopup"  @change="changeSearch" :roleDesc="roleDesc"></Xheader>
		<u-popup v-model="show" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">
					<text class="screen-item">筛选</text>
				</view>
				<view class="order-time">
					<text class="screen-item">注册时间</text>
					<view class="content">
						<text @click="changeActiveTime(index)"  v-for="(time,index) in registrationTime" :key="index" :class="[index===position? 'active': '']">{{time}}</text>
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
	<!-- 		<view class="commodity-type">
					<text class="screen-item">归属云律所</text>
							<view class="content">
							<text>365咨询卡/1年</text>
							<text>365咨询卡/1年</text>
							<text>365咨询卡/1年</text>
							<text>365咨询卡/1年</text>
						</view>
				</view> -->
				<view class="screen-button">
						<text class="reset" @click="reset">重置</text>
						<text class="confirm" @click="confirm(0)">确定</text>
				</view>
				<u-picker mode="time" v-model="showStartPicker" :params="params" @cancel="cancelStartPicker" @confirm="confirmStartPicker"></u-picker>
			   	<u-picker mode="time" v-model="showEndPicker" :params="params" @cancel="cancelEndPicker" @confirm="confirmEndPicker"></u-picker>
			</view>
		</u-popup>
		<scroll-view :scroll-y="true" :style="{'height':autoHeight+'px'}" @scrolltolower="bindsroll">
			<view class="content" v-if="myStaffList.length">
				<staffDesc v-for="(item,index) in myStaffList" :item="item" :key="index"></staffDesc>
			</view>
			<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
		</scroll-view>
	</view>
</template>

<script>
	const TIMETEMP = 24 * 60 * 60 * 1000
	import Xheader from '../components/header/header.vue'
	import staffDesc from '../../wxcomponents/staff-desc/index.vue'
	import { throttle } from '../../common/utils.js'
	export default {
		data() {
			return {
				customTime:{
					startTime: '',
					endTime: ''
				},
				position: '',
				registrationTime:['今日','近7日','近15日','近30日'],
				show: false,
				showStartPicker: false,
				showEndPicker: false,
				showPicker: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				value: '',
				roleId:'',
				myStaffList: [],
				searchValue:'',
				autoHeight:'',
				pageSize:0,
				pageNum:0,
				roleDesc:{
					searchText: '添加店员',
					roleId: ''
				},
			}
		},
		components:{
			Xheader,
			staffDesc
		},
		methods: {
			bindsroll:throttle(function(e){
				let offsetHeight = e.detail.scrollTop
				// if(offsetHeight>(this.pageNum+1)*110*Math.floor(this.autoHeight/110)){
					this.pageNum+=1
					this.pageSize = Math.floor(this.autoHeight/110) * 2
					//   this.getMyStaffList(this.pageNum,this.pageSize)
					this.confirm(this.pageNum)
				// }
			},1000,{leading: true,trailing: true}),
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
			changeSearch(val){
				this.searchValue = val
				this.confirm(0)
			},
			showPopup(val){
			  this.show = val
			},
			changeActiveTime(index){
				this.position = index
			    this.parseTime(index)
			},
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
			confirmStartPicker(val){
				console.log(val)
				this.customTime.startTime = val.year+ '-'+val.month + '-' + val.day
			},
			customTimeChange(val){
			    this.position = ''
				this[val] = true
			},
			viewUserDetail(){
				wx.navigateTo({
					url: '../my-user-detail/index'
				})
			},
			confirm(pageNum){
				const num = pageNum
				let amount = []
				if(this.customTime.startTime != '' || this.customTime.endTime != ''){
					if(!(this.customTime.startTime && this.customTime.endTime)){
						this.$u.toast('请选择完整的时间区间')
						return	
					}else{
						amount = [this.customTime.startTime,this.customTime.endTime]
					}
				}
				this.show = false
				this.getMyStaffList(num,10,amount,this.searchValue)
			},
			reset(){
				this.position = ''
				this.customTime = {
					startTime: '',
					endTime: ''
				}
				this.confirm(0)
			},
			// 获取员工列表
			getMyStaffList(pageNum=0,pageSize=10,search_time=[],search_key=''){
				const params= {
					user_id: getApp().globalData.userId,
					role_id: parseInt(this.roleId) ,
					pageNum,
					pageSize,
					search_time,
					search_key
				}
				this.$u.api.getMyEmployee(params).then(res=>{
					if(pageNum == 0){
						this.myStaffList = res.data.user_detail
					}else {
						this.myStaffList.push(...res.data.user_detail)
					}
					this.total = res.total
					// this.myStaffList= res.data.user_detail
				})
				// wx.request({
				// 	url: `${getApp().globalData.testHost}/getMyEmployee`,
				// 	method: 'POST',
				// 	header: {
				// 		'content-type': 'application/json; charset=utf-8'
				// 	},
				// 	data: params,
				// 	success:(res)=>{
				// 		console.log(res)
				// 		this.myStaffList= res.data.data.user_detail
				// 		// this.myUserList.map(item=>{
				// 		// 	item.userBehavior = [item.has_intelligent_quest,item.has_phone_call,item.has_video_call]
				// 		// })
				// 		// console.log(this.myUserList)
				// 	},
				// 	fail: (err)=>{console.log(err)}
				// })
			},
		},
		onLoad(option){
			console.log(option)
			this.roleId = option.roleId
			const res = wx.getSystemInfoSync()
			this.autoHeight = res.windowHeight - 60
			this.getMyStaffList()
		}
	}
</script>


<style lang="less" scoped>
@import "./index";
.content{
	padding: 0 30upx;
}
.active{
	color: #F8602A;
}
</style>
