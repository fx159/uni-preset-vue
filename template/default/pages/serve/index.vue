<template>
  <view class="serve-container">
    <image mode="widthFix" style="width:100%" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220512_a44df20e-eecd-4b75-8ee5-3bbe965f8b56.png"></image>
     <view class="main-container">
       <Xaddress :messageInfo="messageInfo" />
        <view class="serve-desc" v-if="permissonList['my-user']">
        <view class="left-desc">
          <image src="../../static/serve/user.png"></image>
          <text>我的用户</text>
        </view>
        <!-- <text v-if="myUserList.length===0" class="right-button" @click="invite('user')">邀请用户</text> -->
        <view  class="right-arrow" @click="viewPage('my-user')">
          <text>{{totalList.user || 0}}位用户</text>
          <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_08720629-8507-46ca-b273-fba78a1bb6c8.png" ></image>
        </view>
      </view>
      <view class="user-content" v-if="permissonList['my-user']&&myUserList.length!==0">
        <userDesc v-for="item in myUserList" :key="item.user_id" :item="item"></userDesc>
        <!-- <text v-if="myUserList.length>0" class="right-button" @click="invite('user')">邀请用户</text> -->
      </view>
      <view class="serve-desc" v-if="permissonList['my-order']&&roleId!==5&&roleId!==6">
        <view class="left-desc">
          <image src="../../static/serve/order.png"></image>
          <text>我的订单</text>
        </view>
        <view class="right-arrow"  @click="viewPage('my-order')">
          <text>{{totalList.order || 0}}个订单</text>
          <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_08720629-8507-46ca-b273-fba78a1bb6c8.png" ></image>
        </view>
      </view>
      <view class="order-content"  v-if="permissonList['my-order']&&roleId!==5&&myOrderList.length !== 0">
        <orderDesc :item="item" v-for="(item,index) in myOrderList" :key="index"></orderDesc>
      </view>
      <view class="user-serve-desc">
        <view class="desc" v-if="permissonList['my-writ']">
          <view class="title">我的文书</view>
          <!-- <view class="times">{{ totalList.instrument }}份文书</view> -->
          <view class="review" @click="handleContract('/contractList')">
            <text>查看全部</text>
            <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_ca9e0d7a-0688-4ba1-b929-8190a91bc05b.png" class="icon-more"></image>
          </view>
          <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_798db32f-2e8b-4dce-93ed-edd44eab41a3.png" class="desc-image"></image>
        </view>
        <view class="desc" v-if="permissonList['my-order']&&(roleId===5||roleId===6)" @click="viewPage('my-order')">
          <view class="title">我的订单</view>
          <view class="times">{{ totalList.order }}个订单</view>
          <view class="review">
            <text>去首页下单</text>
            <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_ca9e0d7a-0688-4ba1-b929-8190a91bc05b.png" class="icon-more"></image>
          </view>
          <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_b222bf16-3fcc-4dc2-992f-dd465e1fd717.png" class="desc-image"></image>
        </view>
      </view>
     </view>
    <u-popup v-model="showVideoDialog" mode="center" border-radius="14" class="phone-popup">
      <view class="active-code">
        <view class="code-title">
          提示
        </view>
        <view class="code-container">
          请确认发起视频请求
        </view>
        <view class="code-bottom">
          <text class="code-text active-text" @click="cancelVideo">取消</text>
          <text class="code-text active-text" @click="confirmVideo">确认</text>
        </view>
      </view>
    </u-popup>
    <xiaofaRobot/>
  </view>
</template>

<script>
import xiaofaRobot from '../../wxcomponents/xiaofaRobot/index.vue'
import Log from '../../common/log.js';
import Xaddress from '../../wxcomponents/address/index.vue'
import orderDesc from '../../wxcomponents/order-desc/index.vue'
import userDesc from '../../wxcomponents/user-desc/index.vue'
import staffDesc from '../../wxcomponents/staff-desc/index.vue'
import config from '../../common/config.js'
const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
export default {
  components: {
    Xaddress,
    orderDesc,
    userDesc,
    staffDesc,
    xiaofaRobot
  },
  data() {
    return {
      messageInfo: {
          title: "候朝辉律师",
          phone: "4006643088",
          lawyerNumber: "13101 2019 1008 8047",
          lawyerLocation: "北京京师（上海）律师事务所",
          callLocation: "上海市静安区恒丰路299号京师律师广场3层",
      },
      rankListMostUser: [],
      rankListMostOrder: [],
      permisson: false,
      consultCount: 0,
      userInfo: '',
      isBuy: false, // 是否咨询卡权益
      cardInfo: '',
      backgroundUrl: '',
      bindXiaoDuState: '',
      showVideoDialog: false,
      showActiveCode: false,
      activeCode: '',
      QRcode: {
        url: ''
      },
      scanCodeResult: '',
      authorizeMic: true,
      authorizeCamera: true,
      permissonList: {},
      roleId: '',
      myUserList: [],
      myOrderList: [],
      myStaffList: [],
      totalList: {
        order: '',
        staff: '',
        user: '',
        instrument: '',
        card: 0,
        consult: 0
      },
      location: {}
    }
  },

  methods: {
    handleContract (path) {
      Log.saveEvent('2', '我的文书', 'click');
			if (!(this.userInfo && this.userInfo.id)) {
					this.$u.toast('请先登陆！');
					return;
			}
			this.$u.route({
					url: 'pages/web-view/index',
					params: {
						path: straddleUrl[config.ENV] + path,
						mp: ''
					}
			})
		},
    callPhone(){
      wx.makePhoneCall({
        phoneNumber: '4006643088' //仅为示例，并非真实的电话号码
      })
    },
    // // 获取位置
    // getLocation() {
    //   return new Promise((resolve, reject) => {
    //     wx.getLocation({
    //       type: 'gcj02',
    //       success: (res) => {
    //         uni.setStorageSync('user-location', {
    //           longitude: res.longitude,
    //           latitude: res.latitude,
    //         })
    //         this.location.longitude = res.longitude
    //         this.location.latitude = res.latitude
    //         resolve()
    //       },
    //       fail: (err) => {
    //         const userLocation = uni.getStorageSync('user-location');
    //         if (userLocation) {
    //           this.location.longitude = userLocation.longitude
    //           this.location.latitude = userLocation.latitude
    //           resolve()
    //         }
    //         reject(err)
    //       }
    //     })
    //   })
    // },
    // 管理员身份获取订单列表
    getMyorderList() {
      const params = {
        user_id: getApp().globalData.userId,
        role_id: this.roleId,
        unitId: getApp().globalData.unitId,
        pageNum: 0,
        pageSize: 3,
        amount: [],
        sort: [],
        search_time: []
      }
      this.$u.api.getUserOrderList(params).then(res => {
        this.myOrderList = res.data
        this.totalList.order = res.total
      })
    },
    // 获取用户资源权限
    async getUserResource() {
      this.permissonList = {}
      const res = await this.$u.api.getRoleResource({unitId:getApp().globalData.unitId})
      const list = res.data.list.filter(item => {
        return item.name === 'service_page'
      })

      this.roleId = res.data.roleId
      list[0].child.map(item => {
        this.permissonList[item.name] = item.name
      })

      return true
    },
    // 页面访问
    viewPage(route) {
      Log.saveEvent('3', '我的订单', 'click');
      wx.navigateTo({
        url: `../../pageServe/${route}/index?roleId=${this.roleId}&userId=${this.userInfo.id}`
      })

    },
    getLaw() {
      uni.getSetting({
        success: async (res) => {
          if (res.authSetting['scope.userLocation']) {
            try {
              console.log('进入')
              try {
                const { latitude, longitude } = await uni.getStorageSync('user-location')
                this.location.latitude = latitude
                this.location.longitude = longitude
              } catch (error) {
                console.log(error)
              }
              const params = {
                x: this.location.latitude,
                y: this.location.longitude,
                unitId: getApp().globalData.unitId,
                unionId: getApp().globalData.unionId
              }
              const {data} = await this.$u.api.getUnitInfo(params)
              this.lawfirmData = data
              uni.setStorageSync('unit-info', data)
              this.lawfirmId = data.lawfirmId
              this.law.address = data.address
              this.law.name = data.name
              this.law.phone = data.phone
              this.targetLocation.latitude = data.x
              this.targetLocation.longitude = data.y
            } catch (e) {
              console.log(e, 'getLocation-err')
              // await this.setOldInfo()
            }
          } else {
            // this.$refs.uToast.showAll({
            // 	title: '无法获取最近律所信息，请打开位置定位'
            // })
            return wx.showModal({
              content: '您没有打开位置定位权限，是否去设置打开？',
              confirmText: '确认',
              cancelText: '取消',
              success: (res) => {
                // that.hasOpenDeviceAuthorizeModal = false
                console.log(res)
                // 点击“确认”时打开设置页面
                if (res.confirm) {
                  console.log('用户点击确认')
                  wx.openSetting({
                    success: (res) => {
                    }
                  })
                } else {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: (err) => {
          console.log(err, 'err')
        }
      })

    },
    // goHere() {
    //   return
    //   // this.getLaw()
    //   uni.getSetting({
    //     success: (res) => {
    //       if (res.authSetting['scope.userLocation']) {
    //         uni.openLocation({
    //           latitude: Number(this.targetLocation.latitude),
    //           longitude: Number(this.targetLocation.longitude),
    //           name: this.law.name,
    //           success: (res) => {
    //             console.log(res)
    //           },
    //           fail: (err) => {
    //             console.log(err)
    //           }
    //         })
    //       } else {
    //         return wx.showModal({
    //           content: '您没有打开位置定位权限，是否去设置打开？',
    //           confirmText: '确认',
    //           cancelText: '取消',
    //           success: (res) => {
    //             // that.hasOpenDeviceAuthorizeModal = false
    //             console.log(res)
    //             // 点击“确认”时打开设置页面
    //             if (res.confirm) {
    //               console.log('用户点击确认')
    //               wx.openSetting({
    //                 success: (res) => {
    //                 }
    //               })
    //             } else {
    //               console.log('用户点击取消')
    //             }
    //           }
    //         })
    //         // this.$refs.uToast.showAll({
    //         // 	title: '无法获取最近律所信息，请打开位置定位'
    //         // })
    //       }
    //     },
    //     fail: (err) => {
    //       console.log(err)
    //     }
    //   })
    // },
    viewStaff() {
      wx.navigateTo({
        url: '../../pageServe/my-staff/index'
      })
    },
    viewCard () {
      wx.navigateTo({
        url: '../../pageServe/business-card/index'
      })
    },
  },
  async onLoad() {
  },
  onUnload(){
    Log.saveEvent('-1', '离开页面', 'onUnload');
  },
  onShareAppMessage() {
    // 分享埋点
    Log.saveEvent('-2', '分享', 'click')
  },
  async onShow() {
    this.$store.commit('setPagerInfo', {
      name: '服务页',
      code: '2',
      url: '/pages/serve/index'
    });
    Log.saveEvent('0', '加载页面', 'onShow');
    this.userInfo = await uni.getStorageSync('user-info')
    
    if(this.userInfo&&this.userInfo.id){
        await this.getUserResource()
        this.getMyorderList()
        // this.getRankingList()
        // try {
        //   const userLocation = await uni.getStorageSync('user-location')
        //   this.location.longitude = userLocation.longitude
        //   this.location.latitude = userLocation.latitude
        // } catch (error) {
        //   console.log(error)
        // }
        // this.getMyorderList()
      }
  }
}

</script>


<style lang="scss">
@import "./index.scss";
</style>
