<!--
* @Author : GaoHan
* @Date :  2020/12/18
* @Version : 1.0
* @Content :
-->
<template>
  <view class="pay-page">
    <view class="order-content">
      <view class="lawyer-info">
        <text>服务项目：</text>
        <text class="lawyer-name">{{ productInfo.name }}</text>
      </view>
    </view>
    <view class="part">
      <view class="title">
        <view class="left-line"></view>
        <text class="title-1">支付金额</text>
      </view>
      <view class="order-pay-info" :class="showActiveCode ? 'active-pay-info' : ''">
        <view>支付金额：</view>
        <view>{{ productInfo.realPrice }}元</view>
        <!-- <view class="active-code" v-if="showActiveCode">
          <view class="code">
            <text>激活码</text>
            <input placeholder="请输入" @input="activeChange" :value="activeCode">
          </view>
          <view>提示：
            <text :style="{'color':activeTextStyle}">{{ activeText }}</text>
          </view>
          <view class="pay-total">
            小计：
            <text>{{ totalPrice }}元</text>
          </view>
        </view> -->
      </view>

    </view>
    <view class="part">
      <view class="title">
        <view class="left-line"></view>
        <text class="title-1">支付方式</text>
      </view>
      <view class="order-pay-info">
        <view>
          <image src="https://cdn-obs-question.aegis-info.com/mall/image/answer/weixin_pay@2x.png" mode="widthFix"
                 class="weixin-pay"></image>
          微信支付：
        </view>
        <view>
          <u-checkbox v-model="checked" @click="changeChecked" shape="circle"></u-checkbox>
        </view>
      </view>
    </view>
    <view class="agree-box">支付代表同意
      <text class="text" @click="handleClickAgreement">《服务协议》</text>
    </view>
    <!-- <view v-if="fromVipID" class="tip-text">支付完成后，会员权益将发送至您帐号，您可在“我的-我的权益”内使用。</view> -->
    <u-button type="primary" hover-class="none" :custom-style="customStyleBtn" @click="handleSubmitFeedback()">支付
    </u-button>
    <!--region -->
    <!--    <u-modal v-model="showWorkTime"
                 confirm-text="我知道了"
                 :mask-close-able="true"
                 @confirm="showWorkTime=false">
          <view style="text-align: center;">
            法律客服的工作是早上9:00-晚上10:00<br/>
            <br/>
            你可以提前支付<br/>客服上线后会第一时间短信联系您<br />
          </view>
        </u-modal> -->
    <!--endregion-->
    <signModal ref="signModal" :orderId="orderId" />
  </view>
</template>

<script>
// import { mapMutations } from 'vuex';
import {debounce, throttle,getOrderType} from '../../common/utils.js'
import signModal from '../../wxcomponents/signModal'
import config from '../../common/config'
import Log from '../../common/log'
const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
export default {
  components: {signModal},
  data() {
    return {
      // showWorkTime: false,
      productId: '',
      orderId: '',
      spuId: '',
      show: false,
      checked: true,
      productInfo: {},
      myUserInfo: {},
      // fromVipID: '', // 开通会员
      // startSign: '', // 开始咨询的标识
      customStyleBtn: {
        'width': '598rpx',
        'height': '96rpx',
        'background': 'linear-gradient(270deg,rgba(74,162,255,1) 0%,rgba(33,99,224,1) 100%)',
        'border-radius': '48px',
        'font-size': '32rpx',
        'margin-top': '20rpx'
      },
      activeText: '请输入激活码',
      activeCode: '',
      activeTextStyle: '',
      totalPrice: 365,
      voucherInfo: '',
      orderServiceTime: '',
      orderType: '',
      contractInfo:{
        currentContractId:'',
        kindId:''
      }
    }
  },
  computed: {
    phoneStr() {
      let phone = ''
      if (this.$u.test.isEmpty(this.myUserInfo.phone)) {
        phone = '';
      } else {
        phone = this.myUserInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
      return phone;
    },
    showActiveCode() {
      if (Number(this.productId) === 182) {
        return true
      } else {
        return false
      }
    }
  }
  ,
  methods: {
    changeChecked(){
      if(this.checked){
        Log.saveEvent('2', '点击[选中微信支付]', 'click')
      }else{
        Log.saveEvent('1', '点击[取消选中微信支付]', 'click')
      }
      
    },
    showFormModal() {
      if (String(this.productInfo.name) == '爆款服务型') {
        this.$refs.signModal.showFormModal()
      }
    },
    // activeChange: throttle(async function (e) {
    //   this.activeCode = e.target.value.trim()
    //   const params = {
    //     code: this.activeCode,
    //     productId: this.productId
    //   }
    //   const {data} = await this.$u.api.checkLegality(params)
    //   this.voucherInfo = data
    //   if (this.voucherInfo.legalityFlag) {
    //     this.totalPrice = 0
    //     this.activeTextStyle = '#3565E6'
    //     this.activeText = '有效的激活码'
    //   } else if (this.activeCode.length === 0) {
    //     this.activeText = '请输入激活码'
    //     this.totalPrice = this.productInfo.realPrice
    //   } else {
    //     this.activeText = '无效的激活码'
    //     this.activeTextStyle = 'red'
    //     this.totalPrice = this.productInfo.realPrice
    //   }
    // }, 1000, {
    //   leading: true,
    //   trailing: true
    // }),
    // 服务协议
    handleClickAgreement() {
      Log.saveEvent('3', '点击[服务协议]', 'click')
      this.$u.route({
        url: 'pagesOther/pay-info/service-agreement'
      })
    }
    ,
    /***
     * 获取订单信息
     * @returns {Promise<void>}
     */
    initOrderInfo() {
      if(this.orderId) {
        return new Promise((resolve,reject) => {
           resolve()
        })
      } 
      return this.$u.api.initPrepayOrder({userId: getApp().globalData.userId, productId: this.productId}).then((res) => {
        if (res.code === 200) {
          const {data} = res
          this.orderId = data.orderId
          this.productInfo = data.productInfo
          this.totalPrice = this.productInfo.realPrice
        }
      })

    }
    ,
    toHomePage() {
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/home/index'
        });
      }, 1000)
    }
    ,
    dealToPay(obj){
      this.$u.api.toPay(obj).then(res => {
        const that = this;
        function dealSin(){
          const isWxSignProduct = (String(that.productInfo.name) == '爆款服务型' )
          if (isWxSignProduct) {
            //电子签跳转
            that.showFormModal()
          } else {
            that.toHomePage()
          }
        }
        if (res.data && res.data.isFullAmount) {
          //全额抵扣
          uni.setStorageSync('payOrderId', that.orderId);
          uni.setStorageSync('pay-result', 'success');
          uni.showToast({title: '支付成功', duration: 2000});
          dealSin()
        } else {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success(res) {
              wx.hideLoading()
              uni.setStorageSync('payOrderId', that.orderId);
              uni.setStorageSync('pay-result', 'success');
              uni.showToast({title: '支付成功', duration: 2000});

              if(that.productInfo.name !=='文书生成') {
                wx.reLaunch({
                  url: `/pageServe/imgTextConsult/index?spuId=${that.spuId}&orderId=${that.orderId}&orderType=${that.orderType}&amount=${that.productInfo.realPrice}&isCreated=true&orderServiceTime=${that.orderServiceTime}&productId=${that.productId}`
                })
              } else{
                if(that.contractInfo.kindId){
                  that.saveWritMessage()
                }else{
                  that.$u.toast('没有kindId')
                }
              }
            },
            fail(err) {
              wx.hideLoading()
              console.log(err);
              uni.showToast({title: '支付失败', duration: 2000});
            }
          })
        }
      })
    },
    async saveWritMessage(){
      try {
         const params = {
          orderId: this.orderId,
          userId: getApp().globalData.userId,
          kindId: this.contractInfo.kindId
         }
        await this.$u.api.saveOrderDocumentConnection(params)
        this.$u.route({
          url: 'pages/web-view/index',
          type:'reLaunch',
          params: {
              path: `${straddleUrl[config.ENV]}/create-contract-block`,
              platform: 'miniprogram',
              company:'HouZhaoHui',
              source: 'charge',
              mp: '',
              userId: getApp().globalData.userId,
              orderId: this.orderId,
              kindId: this.contractInfo.kindId,
              contractId: this.contractInfo.contractId
          }
        })
      } catch (error) {
        
      }
    },
    /***
     * 支付
     */
    handleSubmitFeedback: debounce(function () {
        Log.saveEvent('3', '点击[支付]', 'click')
        wx.showLoading({
            title: '加载中'
        })
        
        this.initOrderInfo().then(()=>{
            if (!this.checked) {
            this.$u.toast('请选择微信支付！');
            return false;
            }
            const obj = {
            'orderId': this.orderId,
            'openid': getApp().globalData.openId, // #小程序支付必填，H5支付不用填
            'money': this.productInfo.realPrice * 100, // #单位：分
            'appid': getApp().globalData.appid,
            'user_ip': '' // #H5支付必传
            }
            if (this.voucherInfo.legalityFlag) {
            obj['additional'] = {
                "couponIds": [JSON.stringify(this.voucherInfo.couponId)],
                "isUseIntegration": false,
                "isUseOverage": false
            }
            } else {
            obj['additional'] = {
                "couponIds": [],
                "isUseIntegration": false,
                "isUseOverage": false
            }
            }
            
            this.dealToPay(obj)
        }, 1500, true)
      },200,true)
  },
  onShow(){
    this.$store.commit('setPagerInfo', {
				name: '登录页',
				code: '20',
				url: '/pagesOther/365pay/main'
			});
			Log.saveEvent('0', '加载页面', 'onShow');
  },
  onUnload(){
    Log.saveEvent('-1', '离开页面', 'onUnload');
  },
  onShareAppMessage() {
    Log.saveEvent('-2', '分享', 'click')
    // 分享埋点
    //1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
  }
  ,
  onReady() {
  },
  async onLoad(option) {
    console.log(option)
    this.spuId = option.spuId
    this.productId = option.productId
    this.productInfo.name =option.name
    this.productInfo.realPrice =option.realPrice
    this.totalPrice =option.realPrice
    this.orderServiceTime = option.orderServiceTime
    this.orderId = option.orderId
    this.orderType = getOrderType(this.productInfo.name)
    const { contractId, kindId } = option
    console.log('currentContractId:'+contractId)
    this.contractInfo = {
      contractId,
      kindId
    }
  }
}
</script>

<style lang="scss" scoped>
/**
 * @Author : GaoHan
 * @Date : 2020/12/18
 * @Version : 1.0
 * @Content :
 */
.pay-page {
  background-color: #EDF1F6;
  padding: 24upx;
  min-height: 100vh;

  .order-content {
    background-color: #ffffff;
    border-radius: 8upx;
    font-size: 32upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #131415;
    line-height: 44upx;
    padding: 32upx;

    .lawyer-info {
      padding-bottom: 16upx;
      border-bottom: 1px solid #EDF1F6;
      display: flex;
      justify-content: space-between;

      .lawyer-name {
        margin-right: 20upx;
      }
    }
  }

  .part {
    .title {
      margin: 32upx 0 16upx;

      .left-line {
        display: inline-block;
        width: 6upx;
        height: 24upx;
        background: linear-gradient(360deg, #4AA2FF 0%, #2163E0 100%);
        border-radius: 3upx;
        margin-right: 10upx;
      }

      .title-1 {
        font-size: 34upx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #131415;
        line-height: 48upx;
      }
    }

    .icon-select {
      width: 30upx;
      height: 30upx;
    }

    .order-pay-info {
      width: 702upx;
      height: 120upx;
      line-height: 120upx;
      padding: 0 32upx;
      background: #FFFFFF;
      border-radius: 8upx;
      display: flex;
      justify-content: space-between;
      position: relative;

      .right-pay-money {
        display: flex;
        justify-content: center;
      }

      .weixin-pay {
        width: 40upx;
        height: 40upx;
        margin-right: 12upx;
        vertical-align: middle;
      }
    }

    .active-pay-info {
      height: 260upx;
    }
  }

  .agree-box {
    margin: 16upx 0 80upx;
    font-size: 28upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #656C74;
    line-height: 40upx;

    .text {
      color: #007EFF;
    }
  }

  .tip-text {
    width: 518upx;
    text-align: left;
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #656C74;
    line-height: 34upx;
    margin: 280upx auto 0;
  }
}

.active-code {
  position: absolute;
  height: 120upx;
  margin: 10upx 0;
  width: 100%;
  top: 80upx;
  padding: 0 32upx 0 0;
  line-height: 30upx;
  text-align: left;

  .code {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60upx;
    border-top: 1upx #ccc solid;

    text {
      display: block;
      font-size: 34upx;
    }

    input {
      border: 1upx #ccc solid;
      margin: 0 10upx;
    }
  }

  .pay-total {
    height: 60upx;
    line-height: 60upx;
    margin: 10upx 0;
    border-top: 1upx #ccc solid;
    width: 100%;
    text-align: right;
    padding: 0 20upx;

    text {
      font-size: 34upx;
    }
  }
}
</style>
