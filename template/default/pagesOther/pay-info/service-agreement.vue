<!--
* @Author : GaoHan
* @Date :  2020/12/30
* @Version : 1.0
* @Content : 服务协议
-->
<template>
  <div class="service-agreement-container">
    <view v-html="pageInfo" class="page-content"></view>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      pageInfo: ''
    }
  },
  created () {
  },
  mounted () {
    this.initInfo();
  },
  onLoad(){
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
  },
  onShareAppMessage() {

  	// 分享埋点
  	//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
  },
  computed: {},
  methods: {
    initInfo() {
      this.$u.api.serviceAgreement({
        name: '',
        caseCause: '',
        orderId: '',
        event: '',
        entrust: ''
      }).then(res => {
        console.log('res:',res)
        this.pageInfo = res.data;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.service-agreement-container {
  background-color: #fff;
  .page-content {
    padding: 32upx;
    box-sizing: border-box;
    width: 100%;
    line-height:48upx;
    h1 {
      margin-bottom: 20upx!important;
    }
    p, span {
      color: #4A4A4A;
      font-size: 28upx !important;
      background-color: transparent !important;
    }
  }
}
</style>
