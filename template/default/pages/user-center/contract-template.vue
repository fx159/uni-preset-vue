<template>
  <view class="container">
    <view class="template" v-for="(template,index) in templateList" @click="viewTemplate(template)" :key="index">
        <view class="template-content">
        </view>
        <view class="template-name">
          {{template.templateName}}
        </view>
    </view>
    <u-modal v-model="show"
      :closeOnClickOverlay="true"
      :showCancelButton="true"
      :content-style="{padding:'0 20rpx'}"
      :title="form.flowName" @confirm="modalConfirm" @cancel="cancelConfirm">
        <view class="slot-content">
          <u-form :model="form" ref="uForm">
            <u-form-item label="姓名" label-width="180rpx" :required="true" prop="name">
              <u-input v-model="form.name"/>
            </u-form-item>
            <u-form-item label="身份证号" label-width="180rpx" :required="true" prop="idCard">
              <u-input v-model="form.idCard"/>
            </u-form-item>
            <u-form-item label="手机号" label-width="180rpx" :required="true" prop="phone">
              <u-input v-model="form.phone"/>
            </u-form-item>
            <u-form-item v-for="(item,index) in formList" :key="item.componentId" :label="item.componentDescription" label-width="180rpx" :required="item.componentRequired">
              <u-input v-model="form.dataArr[index]"/>
            </u-form-item>
          </u-form>
        </view>
  </u-modal>
  </view>
</template>

<script>
const OPENID = 'bf72b6e2b16247dbb913b6161d0216b7_320925199410183914'
const PROXYORGANIZATIONOPENID =  'bf72b6e2b16247dbb913b6161d0216b7'
export default {
  data () {
    return {
      templateList: [],
      userInfo: '',
      show: false,
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
        times: [{
          required: true,
          message: '请输入合同限期',
          trigger: ['change', 'blur']
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: ['change', 'blur']
        },{
          pattern: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, transform(value) {
            return String(value);
          }, message: '请输入正确邮箱'
        }],
        addr: [{
          required: true,
          message: '请输入地址',
          trigger: ['change', 'blur']
        }]
      },
      form: {
          name: '',
          idCard: '',
          phone: '',
          templateId: '',
          flowName: '',
          dataArr: []
      },
      formList: []
    }
  },
  methods: {
    // 获取合同模板列表
    getTemplateList () {
      const params = {
        openid: OPENID,
        proxyOrganizationOpenId: PROXYORGANIZATIONOPENID
      }
      this.$u.api.describeTemplates(params).then(res=>{
        console.log(res)
        this.templateList = res.data.templates
      })
    },
    // 查看模板
    async viewTemplate (template) {
      wx.showLoading({
        title:'加载中',
        mask: true
      })
      const templateInfo = await uni.getStorageSync('templateInfo')
      if(templateInfo) {
        this.form.name = templateInfo.name
        this.form.idCard = templateInfo.idCard
        this.form.phone = templateInfo.phone
      }
      const res = await this.getUserTemplateInfo(template.templateId)
      console.log(res)
      if(res.code !== 0 ) {
        this.form.dataArr = JSON.parse(res.data).component
      }else{
        this.form.dataArr = []
      }
      this.show = true
      wx.hideLoading()
      this.form.templateId = template.templateId
      this.form.flowName = template.templateName
      this.formList = template.components
    },
    // 确认提交
    modalConfirm () {
      console.log(this.form)
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.saveUserTemplateInfo()
          this.toSign()
        } else {
          // Object.assign(this.$data.form, this.$options.data().form)
          // this.$refs.uForm.resetFields()
          this.show = true
        }
      })
    },
    cancelConfirm () {
      // this.show = false
      console.log('close')
      // Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.uForm.resetFields()
    },
    // 保存提交用户合同模板信息
    saveUserTemplateInfo () {
      const params = {
        userId: getApp().globalData.userId,
        templateId: this.form.templateId,
        content: JSON.stringify({ component: this.form.dataArr})
      }
      uni.setStorageSync('templateInfo',{name: this.form.name, idCard: this.form.idCard, phone: this.form.phone})
      console.log(params)
      this.$u.api.addContractRecord(params).then(res => {
        console.log(res)
      })
    },
    // 获取保存的合同模板用户信息
    getUserTemplateInfo (templateId) {
      return new Promise((resolve,reject) => {
        const params = {
          userId: getApp().globalData.userId,
          templateId
        }
        this.$u.api.getContractRecord(params).then(res => {
          console.log(res)
          resolve(res)
        }).catch(err=> reject(err))
      })
      
    },
    // 签约
    toSign () {
      const params =  {
        openid: OPENID,
        proxyOrganizationOpenId: PROXYORGANIZATIONOPENID,
        customId: this.userInfo.id,
        source: 'daluyun',
        flowInfos: [
          {
            templateId: this.form.templateId,
            flowName: this.form.flowName,
            flowDesc: '',
            flowApprovers: [
              {
                name: this.form.name,
                mobile: this.form.phone,
                idCardNumber: this.form.idCard
              }
            ],
            formFields: this.formList.map((item, index)=> {
              return {
                componentName: item.componentName,
                componentValue: this.form.dataArr[index]
              }
            })
          }
        ]
      }
      console.log(params)
      this.$u.api.createFlowsByTemplates(params).then(res => {
        console.log(res)
        const flowIds = res.data.flowIds[0]
        wx.showLoading({
          title: '跳转中',
          mask: true
        })
        const params = {
          openid: OPENID,
          proxyOrganizationOpenId: PROXYORGANIZATIONOPENID,
          flowIds: [flowIds]
        }
        this.$u.api.createSignUrls(params).then(res => {
          console.log(res)
          wx.navigateToMiniProgram({
            appId: res.data.signUrlInfos[0].mpAppid,
            path: res.data.signUrlInfos[0].signUrl,
            success(res) {
              wx.hideLoading()
              console.log('成功', res)
            }
          })
        })
      })
    }
  },
  async onLoad () {
    this.userInfo = await uni.getStorageSync('user-info') || null
    this.getTemplateList()
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
 .template{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30upx;
    .template-content{
      background: url('https://cdn-obs-question.aegis-info.com/mall/newspaper/20220214_03a34a71-c70a-422f-bc85-c724493adde2.png') no-repeat center center;
      background-size: cover;
      width: 180upx;
      border: 2upx #ccc dotted;
      height: 240upx;
    }
    .template-name{
      width: 120upx;
    }
 }
}
.slot-content{
  padding: 0 20upx;
}
</style>