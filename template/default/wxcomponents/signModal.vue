<template>
  <u-modal v-model="show"
           :content-style="{padding:'0 20rpx'}"
           title="请填写合同签署信息" @confirm="modalConfirm">
    <view class="slot-content">
      <u-form :model="form" ref="uForm">
        <u-form-item label="真实姓名" label-width="180rpx" prop="name">
          <u-input v-model="form.name"/>
        </u-form-item>
        <u-form-item label="身份证号" label-width="180rpx" prop="idCard">
          <u-input v-model="form.idCard"/>
        </u-form-item>
        <u-form-item label="手机号" label-width="180rpx" prop="phone">
          <u-input v-model="form.phone"/>
        </u-form-item>
      </u-form>
    </view>
  </u-modal>
</template>

<script>
import {debounce} from "../common/utils";

export default {
  name: "modal",
  data() {
    return {
      rules: {
        name: [{
          required: true,
          message: '请输入真实姓名',
          trigger: ['change', 'blur']
        }, {
          pattern: /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/, transform(value) {
            return String(value);
          }, message: '请输入正确姓名'
        }],// 正则检验前先将值转为字符串
        idCard: [{
          required: true,
          message: '请输入身份证号',
          trigger: ['change', 'blur']
        }, {
          pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
          transform(value) {
            return String(value);
          },
          message: '请输入正确身份证号'
        }],
        phone: [{
          required: true,
          message: '请输入手机号',
          trigger: ['change', 'blur']
        }, {
          pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, transform(value) {
            return String(value);
          }, message: '请输入正确的手机号'
        }],
      },
      productId: '',
      show: false,
      isSign: false,//是否已请求
      form: {
        name: '',
        idCard: '',
        phone: '',
      },
    }
  },
  props: {
    orderId: {}
  },
  methods: {
    showFormModal() {
      this.show = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.uForm.setRules(this.rules);
        })
      }, 200)
    },
    modalConfirm() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          console.log('验证通过');
          this.toSign()
        } else {
        }
      });
      this.show = true
    },
    /*
        handleToSign: debounce(() => {
          console.log(this, 'this')
          this.toSign()
        }, 2000, true),
    */
    toSign() {
      if (this.isSign) {
        return
      }
      const params = {
        "unitId": getApp().globalData.unitId,
        "orderId": this.orderId,
        "userRealName": this.form.name,
        "userIdCardNumber": this.form.idCard,
        "userPhone": this.form.phone
      }
      console.log(params, 'modalConfirm')
      this.isSign = true
      this.$u.api.lawyerEsign(params).then(res => {
        console.log(res, 'lawyerEsign')
        if (res.code === 200) {
          this.show = false
          this.isSign = true
          this.$emit('form-confirm')
          this.$u.route({url: 'pageServe/my-order/index'})
        }
        this.isSign = false
      }).catch((err) => {
        console.log('律师静默签署失败', err)
        this.$u.toast('请输入正确的身份信息！');
        this.isSign = false
        this.show = true
      })
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
    console.log('herer', this.$refs.uForm)
  }
  ,
}
</script>

<style scoped>

</style>