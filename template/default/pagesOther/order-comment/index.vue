<!--
* @Author : GaoHan
* @Date :  2020/12/28
* @Version : 1.0
* @Content : 付费订单服务评价
-->
<template>
  <div class="order-comment-container">
    <view class="comment-word">
      <view :class="c.check ? 'text activeLabel' : 'text'" v-for="(c, index) in commentList" :key="index" @click="handleTagClick(c)">{{ c.name }}</view>
    </view>
    <view class="textarea-input">
      <u-input type="textarea" v-model="content" :clearable="false" height="360" border placeholder="说说哪里好嘛，其他用户也想知道"
               placeholder-style="color:#9BA0A4;font-size:28rpx;line-height:42rpx;" maxlength="512" :auto-height="false"
               border-color="#EEEEEE" :custom-style="customStyle"></u-input>
      <text class="max-text-length">{{ content.length }} / 512</text>
    </view>
    <view class="image-part">
      <view class="image-wrap">
        <u-upload :action="uploadAction" max-count="3" ref="uUpload" width="152" :custom-btn="true" :show-progress="false"
                  del-bg-color="#333333" @on-success="handleSuccess" @on-error="handleError" @on-remove="handleRemove">
          <view slot="addBtn" :class="uploadImg.length > 2 ? 'slot-btn margin-left-0': 'slot-btn'">
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/upload_icon.png" class="upload-img"></image>
            <view class="text">上传照片</view>
          </view>
        </u-upload>
      </view>
      <view class="">
        <u-checkbox v-model="isAnonymous" shape="circle">匿名评价</u-checkbox>
      </view>
    </view>
    <view class="btn-wrap">
      <view class="btn">
        <u-button type="primary" hover-class="none" :custom-style="customStyleBtn" @click="handleSubmitFeedback()">提交</u-button>
      </view>
    </view>
  </div>
</template>

<script>
import config from '../../common/config.js';

export default {
  components: {},
  data () {
    return {
      orderId: '', // 订单id
      commentList: [
        {
          id: 1,
          check: true,
          name: '服务专业'
        },
        {
          id: 2,
          check: false,
          name: '解答细致'
        },
        {
          id: 3,
          check: false,
          name: '响应快'
        },
        {
          id: 4,
          check: false,
          name: '对我很有帮助'
        }
      ], // 评语列表
      content: '',
      customStyle: '',
      uploadAction: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
      uploadImg: [], // 图片
      showPopup: false,
      isAnonymous: true, // 匿名
      orderStatus: '', // 从订单列表或订单详情中过来的
      customStyleBtn: {
        'width': '598rpx',
        'height': '96rpx',
        'background': 'linear-gradient(270deg,rgba(74,162,255,1) 0%,rgba(33,99,224,1) 100%)',
        'border-radius': '48px',
        'font-size': '32rpx'
      }
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {},
  methods: {
    /**
     * 图片上传成功
     * @param {Object} data
     * @param {Object} index
     * @param {Object} lists
     */
    handleSuccess(data, index, lists) {
      if (data && data.code === 200) {
        this.uploadImg.push(data.data);
      }
    },
    /**
     * 移除图片
     * @param {Object} index
     * @param {Object} lists
     */
    handleRemove(index, lists) {
      this.uploadImg.splice(index, 1);
    },
    /**
     * 上传失败
     */
    handleError() {
      this.$u.toast('图片上传失败！');
    },
    /**
     * 选择标签
     */
    handleTagClick(item) {
      item.check = !item.check;
    },
    // 提交
    handleSubmitFeedback() {
      let labelList = [];
      this.commentList.forEach((x) => {
        if (x.check) {
          labelList.push(x.name);
        }
      });
      if (labelList.length === 0) {
        this.$u.toast('请选择标签');
        return false;
      }
      const params = {
        orderId: this.orderId,
        comment: this.content,
        labels: labelList,
        files: this.uploadImg,
        hasAnonym: this.isAnonymous
      }
      this.$u.api.addComment(params).then((res) => {
        this.$u.toast(res.data);
        if (this.orderStatus) {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/user-center/order/order-list'
            })
          }, 1000)
        } else {
          uni.setStorageSync('commentSign', 'comment');
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/qa/main'
            });
          }, 1000)
        }
      })
    }
  },
  onShareAppMessage() {
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
  	// 分享埋点
  	//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
  },
  onLoad(option) {
    this.orderId = option.orderId;
    this.orderStatus = option.status;
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
  }
}
</script>

<style lang="less" scoped>
.order-comment-container {
  background-color: #fff;
  padding: 0 24upx;

  .comment-word {
    display: flex;
    flex-wrap: wrap;
    padding: 64upx 0 24upx;
    .text {
      box-sizing: border-box;
      width: 218upx;
      height: 72upx;
      background: rgba(0, 126, 255, 0.1);
      border-radius: 10upx;
      font-size: 28upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #656C74;
      text-align: center;
      line-height: 72upx;
      margin-bottom: 24upx;
      &:not(:nth-child(3n+3)) {
        margin-right: 24upx;
      }
      &.activeLabel {
        color: #FFFFFF;
        background: linear-gradient(270deg, #4AA2FF 0%, #2163E0 100%);
      }
    }
  }

  .textarea-input {
    position: relative;

    .max-text-length {
      position: absolute;
      right: 20upx;
      bottom: 20upx;
      color: #9BA0A4;
      font-size: 22upx;
    }
  }

  .image-wrap {
    margin-top: 46upx;
    margin-bottom: 60upx;
    box-sizing: border-box;

    &.margin-left-0 {
      margin-top: 20upx;
    }

    .u-list-item {
      margin: 17upx 20upx 0 0;
      box-sizing: border-box;
      border-width: 0;
      overflow: visible;

      &:first-child {
        margin-left: 0;
      }

      image {
        width: 152upx;
        height: 156upx;
      }

      .u-delete-icon {
        top: -20upx;
        right: -16upx;
      }

      .u-error-btn {
        background-color: rgba(0, 0, 0, .4);
      }
    }

    .slot-btn {
      border-radius: 10upx;
      border: 2px dashed rgba(0, 126, 255, 1);
      text-align: center;
      padding: 18upx 20upx 20upx 20upx;
      box-sizing: border-box;
      margin-top: 10upx;
      // margin-left: 10upx;

      .upload-img {
        width: 64upx;
        height: 64upx;
      }

      .text {
        color: #9BA0A4;
        font-size: 26upx;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }

  .btn-wrap {
    margin-top: 100upx;
  }
}
</style>
