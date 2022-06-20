<template>
    <view class="container">
        <view class="title">{{processIndex == 0 ? '服务流程' : '当前节点'}}</view>
        <view class="process-con" v-for="(item,index) in processText" :key='index'>
            <view class="item-head">
                <view 
                    :class="['index', (index+1) === processIndex ? 'active': '', processIndex=== 0 ? 'active' : '']"
                >{{item.schedule}}</view>
                <view class="head-title">{{item.title}}</view>
            </view>
            <view class="item-body" :style="(index + 1) == processText.length ? 'border:none':''">
                <view class="text" v-html="item.text"></view>
            </view>
        </view>
        <view class="concat" @click="showModal = true" v-if="showCustom">联系客服</view>
        <button class="submit-btn" @click="back()">{{btnText}}</button>
        <!-- <u-mask :show="showModal" mask-click-able='false'>
            <view class="model-con">
                <image src='https://public-file.aegis-info.com/yuanjia/common/kefu.png' mode="widthFix"></image>
                <view class="text">可扫码或添加微信“aegis_2020”联系客服</view>
                <view class="modal-btn" @click="showModal = false">我知道了</view>
            </view>
        </u-mask> -->
    </view>
</template>

<script>
import log from '../../common/log'
export default {
    props:{
        btnText: {// 按钮文案
            type: String,
            default: '返回'
        },
        // processIndex: { // 步骤，0是全部
        //     type: Number,
        //     default: 0,
        // },
        showCustom:{ // 是否显示客服
            type: Boolean,
            default: true,
        }
    },
    data(){
        return{
            processIndex: 0,
            processText:[
                {schedule: 1, title: '用户下单', text: '若符合平台融资诉讼服务条件，用户可在平台下单，提交申请'},
                {schedule: 2, title: '律师接单', text: '平台智能匹配合适的律师，律师评估后，提交接单申请'},
                {schedule: 3, title: '风控审核', text: '平台、律师联系当事人、律师进一步沟通案件详情、案件资料，对案件进行风控评估。<br />若风控通过，平台、当事人、律师进一步沟通案件投资事宜。若风控未通过，当事人可与律师沟通选择其他更合适的应诉方案。'},
                {schedule: 4, title: '合作签约', text: '平台、当事人、律师共同沟通达成一致后，三方线下签署委托合同。合同签订后，律师进行案件办理，平台适时提供所需资金。当事人配合律师、平台进行案件办理。'},
                {schedule: 5, title: '完成服务', text: '服务完成后，用户根据回款情况支付合同约定的服务费用。'},
            ],
            showModal: false,
			backStep: 1
        }
    },
    methods:{
        getResult(){
            this.$u.api.getAppealFlag().then(res => {
                if(res.data){
                    this.processIndex = 2
                }
            })
        },
        back(){
			// wx.navigateBack({
			// 	delta: this.backStep
			// })
            wx.switchTab({
                url: '/pages/home/index'
            })
        }
    },
	onShareAppMessage() {
		
		// 分享埋点
		//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
	},
    onShow(){
        this.getResult()
    },
	onLoad(options){
		console.log(options)
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
		if(options&&options.backStep)this.backStep = Number(options.backStep)
	}
}
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    background: #fff;
    color: #333;
    padding: 40upx 48upx 40upx 44upx;
    font-size: 28upx;
}
.title{
    font-size: 30upx;
    margin-bottom: 40upx;
    font-weight: 600;
}
.process-con{
    .item-head{
        .index{
            display: inline-block;
            width: 48upx;
            height: 48upx;
            border-radius: 50%;
            background: #D1DDFD;
            color: #fff;
            line-height: 48upx;
            margin-right: 36upx;
            text-align: center;
            font-weight: 600;
        }
        .active{
            background: #3565E6;
        }
        .head-title{
            font-weight: 600;
            display: inline-block;
        }
    }
    .item-body{
        margin: 25upx 20upx;
        border-left: 4upx solid #D6E1FF;
        padding-left: 60upx;
        padding-bottom: 10upx;
        .text{
            position: relative;
            top: -16upx;
            font-size: 24upx;
        }
    }
}
.concat{
    margin: 40upx 20upx;
    text-align: right;
    color: #3565E6;
    font-size: 22upx;
}
.submit-btn{
    width: 632upx;
    height: 88upx;
    background: #3565E6;
    border-radius: 44upx;
    color: #fff;
    font-size: 32upx;
    text-align: center;
}
.model-con{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 560upx;
    height: 780upx;
    background: #FFFFFF;
    border-radius: 16upx;
    text-align: center;
    padding-top: 44upx;
    image{
        width: 390upx;
        // height: 390upx;
    }
    .text{
        width: 446upx;
        margin: 10upx auto;
        font-size: 30upx;
        color: #333;
    }
    .modal-btn{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 96upx;
        border-top: 1upx solid #E5E5E5;
        color: #3565E6; 
        font-size: 36upx;
        line-height: 2.5;
    }
}
</style>