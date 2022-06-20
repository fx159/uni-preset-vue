<template>
    <view class="container">
        <Xheader @showPopup="showPopup"  @change="changeSearchKey" :roleDesc="roleDesc"></Xheader>
        <text class="frequency">共{{total}}份文书</text>
		<scroll-view :scroll-y="true" :style="{'height':autoHeight+'px'}" @scrolltolower="bindsroll">
			<view v-if="list.length">
				<view class="desc" v-for="(item,index) in list" @click="viewDetail(item.name,item.document_id,item.status,item.type,item.record_id,item.out_id,item.order_id,item.order_status,item.pay_amount)" :key="index">
					<view class="law-name">
						<text>{{item.nickName}} </text>
						<!-- <text class="title">{{item.lawfirm_name}}</text> -->
					</view>
					<view class="time">
						时间：{{item.create_time}}
					</view>
					<view class="order-name">
						文书名称：{{item.name}}
					</view>
					<view class="real-pay">
						文书类型： {{item.main_type}}
					</view>
					<text :class="['text',activeStatus[item.status].class]">{{activeStatus[item.status].text}}</text>
				</view>
			</view>
			<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
		</scroll-view>
        <u-popup v-model="show" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选</view>
				<view class="order-time">
					<text class="screen-item">下单时间</text>
					<view class="content">
						<text @click="changeActiveTime(index)"  v-for="(time,index) in registrationTime" :key="index" :class="[index===position? 'active': '']">{{time}}</text>
					</view>
				</view>
				<view class="custom-time">
					<text class="screen-item">自定义时间</text>
					<view class="content">
						<u-input disabled :value="customTime.startTime" @click="customTimeChange('showStartPicker')" type="text" :clearable="false" class="start-time" placeholder-style="text-align:center" placeholder="开始时间" border/>
						-
						<u-input disabled :value="customTime.endTime" @click="customTimeChange('showEndPicker')" type="text" :clearable="false" class="end-time" placeholder-style="text-align:center" placeholder="结束时间" border/>
					</view>
				</view>
				<view class="commodity-type">
					<text class="screen-item">文书类型</text>
					<scroll-view :scroll-y="true" :scroll-x="false" class="commodity-content">
							<text :class="['time-item',item.active ? 'active': '']" @click="changePosition(item,index)" v-for="(item,index) in writList" :key="item.type">
								{{item.text}}
							</text>
					</scroll-view>
<!--                    <view class="time-con">
                        <view :class="['time-item',index === typePostion ? 'active' : '']" @click="changePosition(item,index)" v-for="(item,index) in writList" :key="item.type">
                        	{{item.text}}
                        </view>
                    </view> -->
                </view>
				
				<view class="screen-button">
					  <text class="reset" @click="reset">重置</text>
					  <text class="confirm" @click="confirm(1)">确定</text>
				</view>
                <u-picker mode="time" v-model="showStartPicker" :params="params" @cancel="cancelStartPicker" @confirm="confirmStartPicker"></u-picker>
                <u-picker mode="time" v-model="showEndPicker" :params="params" @cancel="cancelEndPicker" @confirm="confirmEndPicker"></u-picker>
			</view>
		</u-popup>
    </view>
</template>

<script>
import Xheader from '../components/header/header.vue'
const TIMETEMP = 24 * 60 * 60 * 1000
import { throttle } from '../../common/utils.js'
export default {
    components:{
        Xheader
    },
    data(){
        return {
            activeStatus: [{class:'unreview',text:'未生成'},{class:'review-allow',text:'已生成'},'',{class:'impeach',text:'可下载'}],
            list:[],
			total: 0,
            searchText: '',
			registrationTime:['今日','近7日','近15日','近30日'],
			showStartPicker: false,
			showEndPicker: false,
			customTime:{
				startTime: '',
				endTime: ''
			},
            show: false,
            timer: null,
			typePostion:'',
			position: '',
			params: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false
			},
			autoHeight:'',
			writList: [
				{route:['../../pagesSub/borrow/loanAgreeSelect/loanAgreeSelect','../../pagesSub/borrow/loanAgreeResult/loanAgreeResult'],text:'借款协议',type:1},
				{route:['../../pagesSub/borrow/lawyerLetterSelect/lawyerLetterSelect','../../pagesSub/borrow/lawyerLetterResult/lawyerLetterResult'],text:'律师函',type:2},
				{route:['../../pagesSub/borrow/indictmentSelect/indictmentSelect','../../pagesSub/borrow/indictmentResult/indictmentResult'],text:'借款起诉状',type:3},
				{route:['../../pagesSub/marriage/marryFrontSelect/marryFrontSelect','../../pagesSub/marriage/marryFrontResult/marryFrontResult'],text:'婚前协议',type:4},
				{route:['../../pagesSub/marriage/marryInSelect/marryInSelect','../../pagesSub/marriage/marryInResult/marryInResult'],text:'婚内财产协议',type:5},
				{route:['../../pagesSub/marriage/divorceAgreementSelect/divorceAgreementSelect','../../pagesSub/marriage/divorceAgreementResult/divorceAgreementResult'],text:'离婚协议',type:6},
				{route:['../../pagesSub/marriage/divorceIndictmentSelect/divorceIndictmentSelect','../../pagesSub/marriage/divorceIndictmentResult/divorceIndictmentResult'],text:'婚姻起诉状',type:7}
			],
			roleDesc:{
				searchText: '',
				roleId: ''
			},
			writ:{
				search_type: [],
				search_key: '',
				search_time: []
			},
			pageSize:0,
			pageNum:1
        }
    },
    methods:{
		bindsroll:throttle(function(e){
			  let offsetHeight = e.detail.scrollTop
			//   if(offsetHeight>(this.pageNum+1)*140*Math.floor(this.autoHeight/140)){
				  this.pageNum+=1
				//   this.pageSize = Math.floor(this.autoHeight/140) * 2
				  this.confirm(this.pageNum)
			//   }
		},1000,{leading: true,trailing: true}),
		// 搜索框内容
		changeSearchKey(val){
			this.writ.search_key = val
			this.confirm(1)
		},
		// 自定义时间解析
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
		// 自定义时间切换
		changeActiveTime(index){
			this.position = index
		    this.parseTime(index)
		},
	    // 选择结束时间
		confirmEndPicker(val){
			this.customTime.endTime= val.year + '-'+ val.month + '-' + val.day
			this.checkTime()
		},
		//选择开始时间
		confirmStartPicker(val){
			console.log(val)
			this.customTime.startTime = val.year+ '-'+val.month + '-' + val.day
		},
		// 选择自定义时间段
		customTimeChange(val){
		    this.position = ''
			this[val] = true
		},
		//查看文书详情
		viewDetail(name,document_id,status,type,record_id,out_id,order_id,order_status,pay_amount){
			let i 
			this.writList.map((item,index)=>{
			  if(item.text === name) {
				  i = index
			  }
			})
			console.log(i)
			if(status == 0){
				wx.navigateTo({
					url: `${this.writList[i].route[0]}?document_id=${document_id}&type=${type}&record_id=${record_id}`
				})
			}
			// else if(status ===2){
			// 	wx.navigateTo({
			// 		url: `${this.writList[this.writList.indexOf(name)].route[1]}?id=${id}`
			// 	})
			// }
			else{
				wx.navigateTo({
					url: `${this.writList[i].route[1]}?id=${out_id?out_id:''}&type=${type?type:''}&record_id=${record_id?record_id:''}&document_id=${document_id?document_id:''}&order_id=${order_id?order_id:''}&order_status=${order_status?order_status:''}&pay_amount=${pay_amount?pay_amount:''}`
				})
			}
		},
		// 改变文书类型
		changePosition(item,index){
			this.writList.splice(index,1,Object.assign(item,{active: item.active? false : true}))
		},
        showPopup(val){
          this.show = val
        },
        // 防抖
        textFilter(e){
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                console.log(e)
                this.getList()
            },500)
        },
		//获取文书列表
		getWritList(pageNum=1,pageSize=20,search_type=[],search_key='',search_time=[]){
			const params= {
				user_id: getApp().globalData.userId,
				pageNum,
				pageSize,
				search_type,
				search_key,
				search_time
			}
			this.$u.api.getDocumentList(params).then(res=>{
				// this.list = res.data
				if(pageNum == 1){
					this.list = res.data
				}else{
					this.list.push(...res.data)
				}
				this.total = res.total
			})
		},
		checkTime() {
			if (this.customTime.startTime && this.customTime.endTime && this.customTime.startTime > this.customTime.endTime) {
				const tmp = this.customTime.startTime
				this.customTime.startTime = this.customTime.endTime
				this.customTime.endTime = tmp
			}
		},
		confirm(pageNum){
			let timer = []
			if(this.customTime.startTime != '' || this.customTime.endTime != ''){
				if(!(this.customTime.startTime && this.customTime.endTime)){
					this.$u.toast('请选择完整的时间区间')
					return	
				}else{
					timer = [this.customTime.startTime,this.customTime.endTime]
				}
			}
			this.show = false
			let search_type = []
			this.writList.map(item=>{if(item.active) search_type.push(item.type)})
			this.getWritList(pageNum, 10, search_type, this.writ.search_key, timer)
		},
		reset(){
			this.customTime = {
				startTime:'',
				endTime:''
			}
			this.writList.map(item=>{item.active = false})
			this.position = ''
			this.writList.map(itme=>{
				item.active = false
			})
		}
    },
	onShow(){
		this.getWritList()
	},
	onLoad(option){
		console.log(option)
		this.roleDesc.roleId = parseInt(option.roleId)
		const res = wx.getSystemInfoSync()
		this.autoHeight = res.windowHeight - 60
		wx.request({
			url: getApp().globalData.host + `/api/app/qingDun/tokenByUnionId/${getApp().globalData.unionId}`,
			method: 'GET',
			header: {
				'content-type': '	application/json; charset=utf-8'
			},
			data: {},
			success:  (res)=> {
				console.log(res, 999);
				if (res.statusCode === 200) {
				if (res.data) {
					// that.setData({
					//   userIsEmail: res.data
					// }, function () {
					//   that.Register(that.dataId);
					// });
					const tokenData = res.data
					getApp().globalData.token = `Bearer ${tokenData.result.access_token}` // 元甲token
					
				} else {
					// that.setData({
					//   userIsEmail: res.data,
					//   layerState: true
					// });
					console.log(res)
				}
				} else {
				that.loading("服务器错误");
				}
			},
			fail: (res) => {
				wx.showModal({
					title:'请求失败!'
				})
			},
			complete: function () {
				wx.hideLoading();
			}
	  });
	}
}
</script>

<style lang="scss" scoped>
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
.container{
    width: 100%;
    padding: 20upx 40upx;
}
.frequency{
    font-size: 24upx;
    color: #999;
    display: block;
    margin-bottom: 20upx;
}
.desc{
    background-color: #E5EBF4;
    padding: 24upx;
    position: relative;
    margin: 0 0 32upx 0;
    view{
        margin: 16upx 0 0 0;
    }
    .law-name{
        font-weight: bold;
        display: flex;
        margin: 0;
        .title{
            width: 330upx;
            display: inline-block;
            vertical-align: top;
            position: relative;
            margin: 0 0 0 15upx;
        }
        .title::before{
            content: '';
            width: 4upx;
            height: 30upx;
            top: 5upx;
            background-color: #000000;
            position: absolute;
            left: -10upx;
        }
    }
    .text{
        position: absolute;
        right: 0;
        top: 0;
        height: 56upx;
        width: 116upx;
        line-height: 56upx;
        text-align: center;
        display: inline-block;
        color: #FFFFFF;
    }
}
.unreview{
    background-color: #D50F19;
}
.review-allow{
    background-color:#E4B78C
}
.impeach{
    background-color:#003F93
}
.return-complete{
    background-color:#52C41A 
}
.return-fail{
    background-color:#D50F19 
}
.search{
  display: flex;
  align-items: center;
  padding: 0 140upx 0 0;
  margin: 20upx 0;
  position: relative;
  .input{
	  flex: 1;
  }
  >text{
	  width: 150upx;
	  height: 60upx;
	  line-height: 60upx;
	  background: #F8602A;
	  border-radius: 30upx;
	  font-size: 26upx;
	  color: #FFFFFF;
	  text-align: center;
	  margin-right: 20upx;
  }
  .screen{
	  position: absolute;
	  right: 22upx;
	  font-size: 33upx;
	  text{
		  // color: $uni-color-houlv;
		  display: inline-block;
		  
	  }
	  image{
		  width: 34upx;
		  display: inline-block;
		  height: 34upx;
		  vertical-align: middle;
	  }
  }
}
.popup{
    color: #333;
    font-size: 32upx;
    padding: 32upx 40upx 68upx;
    .title{
        margin-bottom: 48upx;
        text-align: center;
    }
	.active{
	    background: rgba(46, 78, 111, 0.1);
	    color: #2E4E6F;
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
		line-height: 72upx;
	}
}
.order-time{
	.content{
		justify-content: space-between;
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
		background-color: #2E4E6F ;
		color: #FFFFFF;
	}
	.reset{
		border: 2upx #2E4E6F solid;
		color: #2E4E6F
	}
}
</style>
