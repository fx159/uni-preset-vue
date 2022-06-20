<template>
    <view class="container">
        <view class="from-item">
            <view class="title">被告信息</view>
            <view class="data-con">
                <view class="tab">
                    <view :class="tabType == 1 ? 'active':''" @click="tabType = 1">企业</view>
                    <view :class="tabType == 2 ? 'active':''" @click="tabType = 2">自然人</view>
                </view>
                <view class="input-con" v-if="tabType == 1">
                    <view class="name"><image src="../static/must.png" mode="" class="required"></image>企业名称</view>
                    <input type="text" placeholder="请输入" v-model="enterPriseName">
                </view>
                <view class="input-con" v-if="tabType == 2">
                    <view class="name"><image src="../static/must.png" mode="" class="required"></image>姓名</view>
                    <input type="text" placeholder="请输入" v-model="userName">
                </view>
                <view class="input-con" v-if="tabType == 2">
                    <view class="name"><image src="../static/must.png" mode="" class="required"></image>身份证号</view>
                    <input type="text" placeholder="请输入" v-model="userNum">
                </view>
            </view>
        </view>

        <view class="from-item">
            <view class="title"><image src="../static/must.png" mode="" class="required"></image>案件类型</view>
            <view class="data-con">
                <!-- 复选框组 -->
                <checkbox-group class="check-con">
                    <u-row gutter="16" align='bottom'>
                        <u-col span="4" v-for="item in checkBoxList" :key="item.id">
                            <label class="check-item" ><u-checkbox  v-model="item.checked" />{{item.name}}</label>
                        </u-col>
                    </u-row>
                </checkbox-group>
    
                <view class="input-con">
                    <view class="name"><image src="../static/must.png" mode="" class="required"></image>涉案金额</view>
                    <input type="number" placeholder="请输入" v-model="money" >
                </view>

                <view class="input-con">
                    <view class="name">案情阶段</view>
                    <view class="radio-con">
                        <u-radio-group v-model="radioValue">
                            <u-radio v-for="item in radioList" :name="item.value" :key="item.value">
                                {{item.name}}
                            </u-radio>
                        </u-radio-group>
                    </view>
                </view>
            </view>
         </view>

        <view class="from-item">
            <view class="title"><image src="../static/must.png" mode="" class="required"></image>案件描述</view>
            <view class="data-con">
                <textarea
                    placeholder='请输入10字以上案情描述。'
                    placeholder-style='color: #BFBFBF;'
                    maxlength="500"
                    v-model="descrption"
                ></textarea> 
            </view>
        </view>

        <view class="from-item">
            <view class="title">案情所在地</view>
            <view class="data-con">
                <picker mode="region" @change="e => region= e.detail.value">
                    <view class="picker" v-if="!region.length">
                        请选择所在地区
                        <u-icon name="arrow-down" class="arrow"></u-icon>
                    </view>
                    <view class="picker picker-result" v-else>
                        {{region.length ? `当前选择：${region[0]}，${region[1]}，${region[2]}` : '请选择地区'}}
                        <u-icon name="arrow-down" class="arrow"></u-icon>
                    </view>
                </picker>
            </view>
        </view>

        <button class="submit-btn" @click="submit">提交申请</button>
    </view>    
</template>

<script>
export default {
    data(){
        return{
            tabType: 1, // 1：企业，2：自然人
            enterPriseName: '',
            userName: '',
            userNum: '',
            money: '',
            descrption: '',
            checkBoxList:[], // 复选框组
            radioList:[
                    {name: '未立案', checked: false, value: 0},
                    {name: '法院审核阶段', checked: false, value: 1},
                    {name: '执行中或已结案', checked: false, value: 2},
            ], // 复选框组
            radioValue: null,
            region:[], // 地区
        }
    },
    methods:{
        submit(){
			var num = this.userNum.toUpperCase();
            if(this.tabType === 1 && (this.enterPriseName == '' || this.enterPriseName.trim() == '')) {
                uni.showToast({ title: '请填写企业名称', duration: 2000, icon: 'none' });
                return
            } else if(this.tabType === 2 && (this.userName == '' || this.userName.trim() == '' )) {
                uni.showToast({ title: '请填写姓名'  , duration: 2000, icon: 'none' });
                return
            }else if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) && this.tabType === 2 ){
				uni.showToast({ title: '请正确填写身份证号'  , duration: 2000, icon: 'none' });
				//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
                return
			}
            let typeData = []
            this.checkBoxList.map(item => {
                if(item.checked) typeData.push(item.id)
            })
            if(typeData == '' || typeData.length === 0) {
                uni.showToast({ title: '请选择案件类型', duration: 2000, icon: 'none' });
                return
            }
            if(this.money == '' || this.money.trim() == ''  ||  this.money < 0 || this.money > 9999999999999 ) {
                uni.showToast({ title: '请正确填写涉案金额', duration: 2000, icon: 'none' });
                return
            }
            const isNum=/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(!isNum.test(this.money)) {
                uni.showToast({ title: '请填写正确涉案金额', duration: 2000, icon: 'none' });
                return
            }
            // if(this.radioValue == '') {
            //     uni.showToast({ title: '请选择案情阶段', duration: 2000, icon: 'none' });
            //     return
            // }
            if(this.descrption == '' || this.descrption.trim() == '') {
                uni.showToast({ title: '请填写案件描述', duration: 2000, icon: 'none' });
                return
            }
			if(this.descrption.trim().length < 10){
				uni.showToast({ title: '案件描述的长度需要大于10个字符', duration: 2000, icon: 'none' });
				return
			}
            console.log('fasongqing')
            const parms = {
                defendantCompanyName: this.tabType === 1 ? this.enterPriseName : '',//被告企业名称
                defendantPersonName: this.tabType === 2 ? this.userName : '',//被告自然人名称
                defendantIdCard: this.tabType === 2 ? this.userNum : '',//被告人身份证号码
                caseTypeId: JSON.stringify(typeData),//案件类型  [1,2,6]
                involvedAmount: this.money,//涉案金额
                caseStage: this.radioValue ,//案情阶段0：未立案 1：法院审核阶段 2：执行中或已结案
                caseDesc: this.descrption,//案件描述
                caseProvince: this.region.length ? this.region[0] : '',//省份
                caseCity: this.region.length ? this.region[1] : '',//城市
                unitId: getApp().globalData.unitId
            }
            uni.showLoading({
                title: '正在提交信息'
            });
            this.$u.api.commitAppeal(parms).then(res => {
                uni.showToast({ title: '提交成功', duration: 2000});
                wx.navigateTo({
                    url: '/pagesOther/financing-litigation/process?backStep=2'
                })
            })
        },
        getCheckList(){
            this.$u.api.getCaseTypeList().then(res => {
                this.checkBoxList = []
                res.data.map(item =>{
                    item.checked = false
                    this.checkBoxList.push(item)
                })
                // this.checkBoxList = res.data
            })
        },
		onShareAppMessage() {

			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onLoad() {
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
		  this.getCheckList()
		}
        // onShow(){
        //     this.getCheckList()
        // }
    },
}
</script>

<style lang="less" scoped>
.container{
    widows: 100%;
    background: #F5F5F5;
    overflow: hidden;
    font-size: 26upx;
    color: #333;
    padding-bottom: 70upx;
}
.from-item{
    width: 702upx;
    margin: 16upx 24upx;
    background: #fff;
    padding-bottom: 40upx;
    .title{
        width: 100%;
        height: 90upx;
        border-bottom: 1upx solid #eee;
        font-size: 30upx;
        color: #333;
        padding: 24upx;
        font-weight: 600;
    }
    .data-con{
        margin: 30upx auto;
        .tab{
            display: flex;
            justify-content: space-evenly;
            .active{
                color: #3565E6;
                padding-bottom: 8upx;
                border-bottom: 4upx solid #3565E6;
            }
        }
        .input-con{
            .name{
                width: 130upx;
                display: inline-block;
                margin: 48upx 24upx 0 24upx;
                text-align: right;
            }
            input{
                display: inline-block;
                width: 490upx;
                height: 52upx;
                background: #FFFFFF;
                box-shadow: 0 0 2upx 0upx rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                border: 1upx solid rgba(38, 38, 38, 0.17);
                vertical-align: middle;
                padding-left: 16upx;
            }
            .radio-con{
                display: inline-block;
                width: 490upx;
                vertical-align: text-top;
            }
        }
        textarea{
            display: block;
            width: 606upx;
            height: 278upx;
            margin: 0 auto;
            box-shadow: 0 0 2upx 0upx rgba(0, 0, 0, 0.1);
            border-radius: 4upx;
            border: 1upx solid rgba(38, 38, 38, 0.17);
            padding: 20upx;
        }
    }
    .check-con{
        margin: 0 42upx;
    }

}
.submit-btn{
    width: 632upx;
    height: 88upx;
    background: #3565E6;
    border-radius: 44upx;
    color: #fff;
    font-size: 32upx;
    text-align: center;
    margin-top: 40upx;
}
.required{
    width: 20upx;
    height: 20upx;
}
// .check-item{
//     display: inline-block;
//     padding-bottom: 10upx;
// }
::v-deep .u-checkbox__label{
    margin-right: 4upx!important;
}
::v-deep .u-radio{
    margin-bottom: 10upx!important;
}
</style>