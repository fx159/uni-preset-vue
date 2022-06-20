<template>
	<view>
		<Xheader @showPopup="showPopup"  @change="searchChange" :roleDesc="roleDesc"></Xheader>
		<u-popup v-model="show" mode="bottom" :closeable="true">
			<view class="popup">
			<scroll-view :scroll-y="true" class="scroll-height">
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
						<u-input disabled :value="customTime.startTime" inputAlign="center" @click="customTimeChange('showStartPicker')" type="text"  :clearable="false" class="start-time" placeholder-style="text-align:center" placeholder="开始时间" border/>
						-
						<u-input disabled :value="customTime.endTime" inputAlign="center" @click="customTimeChange('showEndPicker')" type="text" :clearable="false" class="end-time" placeholder-style="text-align:center" placeholder="结束时间" border/>
					</view>
				</view>
			   <view class="screen-button">
			   	    <text class="reset" @click="reset">重置</text>
					<text class="confirm" @click="confirm()">确定</text>
			   </view>
			   <u-picker mode="time" v-model="showStartPicker" :params="params" @cancel="cancelStartPicker" @confirm="confirmStartPicker"></u-picker>
			   <u-picker mode="time" v-model="showEndPicker" :params="params" @cancel="cancelEndPicker" @confirm="confirmEndPicker"></u-picker>
			</scroll-view>
		</view>
		</u-popup>
		<scroll-view :scroll-y="true" :style="{'height':autoHeight+'px'}">
			<view class="content" v-if="myUserList.length">
				<userDesc :key="index" v-for="(item,index) in myUserList" :item="item"></userDesc>
			</view>
			<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
		</scroll-view>
	</view>
</template>

<script>
	import Xheader from '../components/header/header.vue'
	import userDesc from '../../wxcomponents/user-desc/index.vue'
	import { throttle } from '../../common/utils.js'
	const TIMETEMP = 24 * 60 * 60 * 1000
	export default {
		data() {
			return {
				customTime:{
					startTime: '',
					endTime: ''
				},
				registrationTime:['今日','近7日','近15日','近30日'],
				show: false,
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
				myUserList: [],
				roleId: '',
				labelList: [],
				staffList: [],
				lawfirmList: [],
				position: '',
				lawfirm: [],
				label: [],
				staff: [],
				roleDesc:{
					searchText: '邀请用户',
					roleId: ''
				},
				searchValue: '',
				autoHeight:'',
				pageSize:0,
				pageNum:0,
			}
		},
		components:{
			Xheader,
			userDesc,
		},
		methods: {
			bindsroll:throttle(function(e){
			  let offsetHeight = e.detail.scrollTop
			//   if(offsetHeight>(this.pageNum+1)*145*Math.floor(this.autoHeight/145)){
				  // this.pageNum+=1
				//   this.pageSize = Math.floor(this.autoHeight/145) * 2
				  // this.confirm(this.pageNum)
			//   }
			},1000,{leading: true,trailing: true}),
			searchChange(val){
				this.searchValue = val
				this.confirm()
			},
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
			reset(){
				this.position = ''
				this.customTime = {
					startTime: '',
					endTime: ''
				}
				this.labelList.map(item=>{
					item.active = false
				})
				this.staffList.map(item=>{
					item.active = false
				})
				this.lawfirmList.map(item=>{
					item.active = false
				})
				this.confirm()
				// this.labelList = []
				// this.staffList = []
				// this.getUserList()
			},
			// 确认筛选条件
			confirm(){
			 //    let params = {
				// 	search_time: [this.customTime.startTime,this.customTime.endTime],
				// 	belong_lawfirm: this.lawfirm 
				// }
				let search_time = []
				if(this.customTime.startTime != '' || this.customTime.endTime != ''){
					if(!(this.customTime.startTime && this.customTime.endTime)){
						this.$u.toast('请选择完整的时间区间')
						return	
					}else{
						search_time =   [this.customTime.startTime +' 00:00:00',this.customTime.endTime+' 23:59:59']
					}
				}
				// let belong_lawfirm = []
				// let parent = []
				// let label = []
				// this.lawfirmList.map(item=>{if(item.active) belong_lawfirm.push(item.id)})
				// this.staffList.map(item=>{if(item.active) parent.push(item.user_id)})
				// this.labelList.map(item=>{if(item.active) label.push(item.id)})
				this.show = false
				this.getUserList(10000,0,search_time,this.searchValue)
			},
			changeActive(index,i,position,item,list){
				this[list].splice(index,1,Object.assign(item,{active: item.active? false : true}))
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
			getBelongLawfirm(){
				const params= {
					user_id: getApp().globalData.userId,
					role_id: parseInt(this.roleId)
				}
				this.$u.api.getBelongLawfirm(params).then(res=>{
					this.lawfirmList = res.data
					// this.lawfirmList.push(...res.data)
				})

			},
			// 获取所属员工
			getStaffList(){
				this.staffList = []
				if(this.roleId == 1 || this.roleId == 2 || this.roleId == 3 ){
					const params= {
						user_id: getApp().globalData.userId,
						role_id: parseInt(this.roleId)
					}
					this.$u.api.getAllEmployeeList(params).then(res=>{
						this.staffList = res.data
					})
				}
			},
			//获取用户标签
			getUserLabel(){
				const params= {
					user_id: getApp().globalData.userId,
					role_id: parseInt(this.roleId)
				}
				this.$u.api.getUserLabel(params).then(res=>{
					this.labelList = res.data
				})
			},
			showPopup(val){
			  this.show = val
			},
			getUserList(pageSize=10000,pageNum=0,search_time=[],search_key=''){
				const params= {
					user_id: getApp().globalData.userId,
					role_id: parseInt(this.roleId),
					pageNum,
					unitId:getApp().globalData.unitId,
					pageSize,
					amount:[],
					sort:[],
					search_time,
					search_key
				}
				uni.showLoading({
					title: '正在加载中···'
				});
				this.$u.api.getLawfirmMember(params).then(res=>{
					if(pageNum == 0){
						this.myUserList = res.data
					}else {
						this.myUserList.push(...res.data)
					}
					this.myUserList.map(item=>{
						item.userBehavior = [item.has_intelligent_quest,item.has_phone_call,item.has_video_call]
					})
					uni.hideLoading();
				})

			}
		},
		async onShow(){
			const userInfo = await uni.getStorageSync('user-info') || null
    		this.roleId = userInfo.userRole
			this.roleDesc.roleId = this.roleId
			const res = wx.getSystemInfoSync()
			this.autoHeight = res.windowHeight - 60
			this.getUserList()
			this.getUserLabel()
			this.getBelongLawfirm()
		},
	}
</script>


<style lang="scss" scoped>
@import "./index";
.content{
	padding: 0 30upx;
}
.active{
	color: #F8602A;
}
</style>
