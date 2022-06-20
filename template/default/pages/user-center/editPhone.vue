<template>
    <view class="container">
        <view v-if="step == 1">
            <view class="item">
                <view class="label1">当前手机号</view>
                <view class="label2" >
                    <input type="number" v-model="phone" maxlength="11" placeholder="请输入手机号" disabled/>
                </view>
            </view>
            <view class="item">
                <view class="label1">验证码</view>
                <view class="label2">
                    <input type="number" v-model="reviewCode" @change="codeChange" placeholder="请输入验证码"/>
                </view>
                <view class="count-down">
                    <text class="text" @click="getCode(6)" v-if="!stratTime">获取验证码</text>
                    <text class="number" v-else>{{countTime}}s</text>
                </view>
            </view>
            <view :class="[ 'btn-con', 'ok-btn',  reviewCode ? '' : 'opa']" @click="enterNewPhone">下一步</view>
        </view>
        <view v-if="step == 2">
            <view class="item">
                <view class="label1">新手机号</view>
                <view class="label2" @click="newPhoneChange">
                    <input type="number" v-model="newPhone" maxlength="11"  placeholder="请输入手机号"/>
                </view>
            </view>
            <view class="item">
                <view class="label1">验证码</view>
                <view class="label2">
                    <input type="number" v-model="newReviewCode" @change="codeChange" placeholder="请输入验证码"/>
                </view>
                <view class="count-down">
                    <text class="text" @click="getCode(11)" v-if="!stratTime">获取验证码</text>
                    <text class="number" v-else>{{countTime}}s</text>
                </view>
            </view>
            <view :class="['btn-con']">
                <view class="cancel" @click="cancel()">取消</view>
                <view :class="['ok-btn',  (newReviewCode && newPhone) ? '' : 'opa']" @click="sureChange()">确认修改</view>
            </view>
        </view>
    </view>
</template>

<script>
import Log from '../../common/log'
export default {
    data(){
        return{
            phone: '',
            reviewCode: '',
            countTime: 0,
            timeInterval: null,
            stratTime: false,
            step: 1,
            newPhone: '',
            newReviewCode: '',
        }
    },
    methods:{
        newPhoneChange(){
            Log.saveEvent(9, '输入新手机号', 'click');
        },
        codeChange(){
            if(this.newReviewCode.length>=6) {
                Log.saveEvent(7, '输入验证码', 'change');
            }
            if(this.reviewCode.length>=6){
                Log.saveEvent(11, '输入验证码', 'change');
            }
        },
        routeAddress(url){
            uni.navigateTo({
				url: `./${url}`
			})
        },
        // 获取验证码
        getCode(code){
            Log.saveEvent(code, '点击[获取验证码]', 'click');
            const myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            const parms = {
                telephone: this.step == 1 ? this.phone : this.newPhone
            }
            if (!myreg.test(parms.telephone)) {
                this.$u.toast('手机号格式错误')
                return
            }
            if(this.step == 2 && this.phone == this.newPhone){
                this.$u.toast('请输入新手机号码')
                return
            }
            this.stratTime = true
            this.startCount()
            this.$u.api.getCode(parms)
        },
        // 倒计时
        startCount(){
            this.countTime = 60
            this.timeInterval = setInterval(()=>{
                if(this.countTime > 0){
                    this.countTime--
                } else{
                    this.clearTime()
                }
            },1000)
        },
        // 清空重置计时器
        clearTime(){
            clearInterval(this.timeInterval)
            this.timeInterval = null
            this.stratTime = false
        },
        async sureChange(){
            Log.saveEvent(13, '点击[确认修改]', 'change');
            if(!this.newReviewCode || !this.newPhone){
                return
            }
            uni.showLoading({
                title: '加载中',
            })
            const reviewResult = await this.$u.api.verifyAuthCode({telephone: this.newPhone,code: this.newReviewCode})
            if(!reviewResult.data.isPassed){
                uni.hideLoading();
                this.$u.toast('验证码错误')
                return
            } 
            this.$u.api.updatePhone({phone: this.newPhone}).then(res=>{
                uni.hideLoading();
                this.$u.toast('修改成功！')
                const userInfo = uni.getStorageSync('user-info')
                userInfo.phone = this.newPhone
                uni.setStorageSync('user-info',userInfo)
                wx.navigateBack()
            })
        },
        cancel(){
            Log.saveEvent(12, '点击[取消]', 'change');
            this.step = 1
            this.clearTime()
        },
        enterNewPhone(){
            Log.saveEvent(8, '点击[下一步]', 'click');
            if(this.reviewCode){
                this.$u.api.verifyAuthCode({telephone: this.phone,code: this.reviewCode}).then(res=>{
                    if(res.data.isPassed){
                        this.step = 2
                        this.clearTime()
                    } else {
                        this.$u.toast('验证码错误')
                    }
                })
            }
        }
    },
    async onShow(){
        const userInfo = await uni.getStorageSync('user-info') || null
        this.phone = userInfo.phone
    }
}
</script>

<style lang="scss" scoped>
.container{
    padding: 0 40upx;
    font-family: PingFangSC-Medium, PingFang SC;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 40upx 0;
        font-size: 32upx;
        color: #333333;
        font-weight: 400;
        border-bottom: 1upx solid #eee;
        position: relative;
        .label1{
            flex: 1;
        }
        .label2{
            flex: 2;
        }
    }
    .count-down{
        position: absolute;
        right: 0;
        font-size: 32upx;
        z-index: 1000;
        .text{
            color: #F8602A;
        }
        .number{
            color: #999;
        }
    }
    .btn-con{
        width: 100%;
        height: 88upx;
        margin-top: 88upx;
        font-size: 32upx;
        color: #FFF;
        font-weight: 500;
        text-align: center;
        line-height: 88upx;
    }
    .ok-btn{
        display: inline-block;
        min-width: 316upx;
        background: #F8602A;
        border-radius: 6px;
    }
    .cancel{
        display: inline-block;
        width: 316upx;
        height: 88upx;
        background: #FFFFFF;
        border-radius: 6px;
        border: 2px solid #F8602A;
        color: #F8602A;
        margin-right: 38upx;
        vertical-align: top;
    }
    .opa{
        opacity: 0.3;
    }
}
input[type=number] {  
    -moz-appearance:textfield;  
}  
input[type=number]::-webkit-inner-spin-button,  
input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;  
    margin: 0;  
}
</style>