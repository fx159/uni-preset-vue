<template>
	<view class="container">
		<Xheader @showPopup="showPopup" :value="searchValue" @change="searchChange" :roleDesc="roleDesc"></Xheader>
		<u-popup v-model="show" mode="bottom" :closeable="true">
			<view class="popup">
			<scroll-view :scroll-y="true" style="max-height: 1200upx">
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
						<u-input :value="customTime.startTime" inputAlign="center" @focus="customTimeChange('showStartPicker')" type="text"  :clearable="false" class="start-time" placeholder-style="text-align:center" placeholder="开始时间" border/>
						-
						<u-input :value="customTime.endTime" inputAlign="center" @focus="customTimeChange('showEndPicker')" type="text" :clearable="false" class="end-time" placeholder-style="text-align:center" placeholder="结束时间" border/>
					</view>
				</view>
				<view class="custom-time">
					<text class="screen-item">收款金额</text>
					<view class="content">
						<u-input v-model="amount.maxAmount" inputAlign="center"  type="text"  :clearable="false" class="start-time" placeholder-style="text-align:center" placeholder="最高金额" border/>
						-
						<u-input v-model="amount.minAmount" inputAlign="center"  type="text" :clearable="false" class="end-time" placeholder-style="text-align:center" placeholder="最低金额" border/>
					</view>
				</view>
			   <view class="screen-button">
					<text class="reset" @click="reset">重置</text>
					<text class="confirm" @click="confirm">确定</text>
			   </view>
			   <u-picker mode="time" v-model="showStartPicker" :params="params" @cancel="cancelStartPicker" @confirm="confirmStartPicker"></u-picker>
			   <u-picker mode="time" v-model="showEndPicker" :params="params" @cancel="cancelEndPicker" @confirm="confirmEndPicker"></u-picker>
			</scroll-view>
		</view>
		</u-popup>
        <view class="record-total">
        	条记录
        </view>
		<scroll-view :scroll-y="true" @scroll="bindScroll"  :style="{'height':scrollHeight + 'px'}" :enhanced="true">
		<view class="record-content" v-for="(item,index) in list" :key="index">
			<view class="content-desc">
				<text>{{item.user_id}}</text>
				<text>{{item.create_time}}</text>
			</view>
			<view class="content-desc">
				<text>20,000.00</text>
				<text>微信支付</text>
			</view>
			<view class="content-desc">
				<text>{{item.nickname}}</text>
				<text>已收款</text>
			</view>
		</view>

		</scroll-view>
	</view>
</template>

<script>
	const TIMETEMP = 24 * 60 * 60 * 1000
	import Xheader from '../componment/header/index.vue'
	import {throttle} from '../../common/utils.js'
	export default{
		data(){
			return {
				show: false,
				value:'123',
				position:'',
				registrationTime:['今日','近7日','近15日','近30日'],
				customTime:{
					startTime:'',
					endTime:''
				},
				list:[],
				amount:{
					maxAmount:'',
					minAmount:''
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				searchValue: '',
				roleDesc:{
					searchText: '',
					roleId: 5
				},
				scrollHeight: '',
				pageSize: 0,
				pageNum: 0,
				total: 0,
				rowHeight:100,
				startIndex: 0,
				endIndex:0,
				limit:5,
				scrollTop: ''
			}
		},
        components:{
			Xheader
		},
		methods:{
			searchChange(val){
				this.searchValue = val
			},
			showPopup(val){
			  this.show = val
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
			changeActiveTime(index){
				this.position = index
				this.parseTime(index)
			},
			customTimeChange(val){
				this.position = ''
				this[val] = true
			},
			confirmEndPicker(val){
				this.customTime.endTime= val.year + '-'+ val.month + '-' + val.day
			},
			confirmStartPicker(val){
				console.log(val)
				this.customTime.startTime = val.year+ '-'+val.month + '-' + val.day
			},
			reset(){
				this.customTime = {
					startTime:'',
					endTime: ''
				},
				this.position= ''
				this.amount ={
					maxAmount:'',
					minAmount:''
				}
			},
			confirm(){},
            getStaffList(){
				const params= {
					user_id:391934,
					role_id:1,
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					belong_lawfirm:[],
					parent:[], //user_id
					label:[], //label_id
					search_time:[],
					search_key:""
				}
				wx.request({
					url: `https://t-xiaofa-gateway.aegis-info.com/auto_call/getLawfirmMember`,
					method: 'POST',
					header: {
						'content-type': 'application/json; charset=utf-8'
					},
					data: params,
					success:(res)=>{
						console.log(res)
						this.list = [...this.list,...res.data.data]
						// console.log(this.list)
						this.total = res.data.total
		
					},
					fail: (err)=>{console.log(err)}
				})
			},
			bindScroll:throttle(function(e){
				
				const {scrollTop} = e.detail
			    const currentStartInedx = Math.ceil( scrollTop/ this.rowHeight)
				if(currentStartInedx !== this.startIndex && currentStartInedx > this.startIndex){
					this.startIndex = currentStartInedx
					this.pageNum +=1
					this.getStaffList()
				}
			},2000),
			dragstart(e){
				console.log(e)
			},
			dragend(e){
				console.log(e)
			},
			getList(currentStartInedx){
				
			}
		},
		onLoad(){
			const window = wx.getSystemInfoSync()
			this.scrollHeight = window.windowHeight-70
			this.pageSize = parseInt(this.scrollHeight /100) +1
			this.getStaffList()
		},
		onShow(){
			console.log(this.scrollHeight)
		}
	}
</script>

<style lang="less" scoped>
.popup{
	padding: 20upx 40upx;

	.title{
		text-align: center;
	}
	.screen-item{
		font-size: 33upx;
		font-weight: bold;
	}
	.order-time{
		.content{
			justify-content: space-between;
		}
	}
	.custom-time{
		margin: 45upx 0;
		.content{
			display: flex;
			justify-content: space-between;
			flex-wrap: nowrap;
			align-items: center;
			.start-time{
				width: 300upx;
				background-color: #F5F6F9;
				position: relative;
			}
			
			.end-time{
				width: 300upx;
				background-color: #F5F6F9;
			}
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		margin: 19upx 0;
		
		text{
			display: inline-block;
			background-color: #F5F6F9;
			width: 144upx;
			height: 72upx;
			text-align: center;
			padding: 0 10upx;
			line-height: 72upx;
			overflow: hidden;/*超出部分隐藏*/
			white-space: nowrap;/*不换行*/
			text-overflow:ellipsis;/*超出部分文字以...显示*/
		}
	}
	.commodity-type{
		.commodity-content{
			max-height: 300upx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			text{
				width: 256upx;
				margin: 20upx 20upx 0 20upx;
				display: inline-block;
				background-color: #F5F6F9;
				height: 72upx;
				text-align: center;
				padding: 0 10upx;
				line-height: 72upx;
				overflow: hidden;/*超出部分隐藏*/
				white-space: nowrap;/*不换行*/
				text-overflow:ellipsis;/*超出部分文字以...显示*/
			}
		}
	}
	.screen-button{
		display: flex;
		justify-content: space-between;
		margin-top: 60upx;
		text{
			width: 300upx;
			display: inline-block;
			text-align: center;
			height: 88upx;
			line-height: 88upx;
			border-radius: 6upx;
		}
		.confirm{
			background-color: #F8602A ;
			color: #FFFFFF;
		}
		.reset{
			border: 2upx #F8602A solid;
			color: #F8602A
		}
	}
}

.border-acitve{
	border-bottom: 2upx #EEEEEE solid;
}
.container{
	position: absolute;
	background-color: #F2F2F2;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	overflow: hidden;
	.record-total{
		padding: 0 30upx;
		height: 40upx;
	}
	.record-content{
		padding: 10upx 30upx;
		background-color: #FFFFFF;
		height: 180upx;
		margin: 10upx 0;
		.content-desc{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
}
.active{
	background: rgba(248, 96, 42, 0.1);
	color: #F8602A;
}

</style>
