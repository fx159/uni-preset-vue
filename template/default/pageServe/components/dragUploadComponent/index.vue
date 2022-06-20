<template>
  <view class="con">
    <movable-area class="area" :style="{ height: areaHeight }" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <template v-if="uploadType=='1'">
        <block v-for="(item, index) in imageList" :key="item.id">
          <movable-view
              class="view"
              :x="item.x"
              :y="item.y"
              direction="all"
              :damping="40"
              :disabled="item.disable || !sortable"
              @change="onChange($event, item)"
              @touchstart="touchstart($event,item)"
              @mousedown="touchstart($event,item)"
              @touchend="touchend($event,item)"
              @mouseup="touchend($event,item)"
              :style="{ width: viewWidth + 'px', height: (0.75*viewWidth) + 'px', 'z-index': item.zIndex, opacity: item.opacity }"
          >
            <view class="area-con"
                  :style="{ width: childWidth, height:childHeight, transform: 'scale(' + item.scale + ')' }">
              <image class="pre-image" :src="item.src" mode="aspectFill"></image>
              <view class="del-con" @click="delImage(item, index)" @touchstart.stop="delImageMp(item, index)"
                    @touchend.stop="nothing()" @mousedown.stop="nothing()" @mouseup.stop="nothing()">
                <view class="del-wrap">
                  <image
                      v-if="deletable"
                      class="del-image"
                      src="https://public-file.aegis-info.com/yuanjia/common/btn_close@2x.png"
                  ></image>
                </view>
              </view>
            </view>
          </movable-view>
        </block>
      </template>
      <!--视频      -->
      <template v-else>
        <block v-for="(item, index) in imageList" :key="item.id">
          <movable-view
              class="view"
              :x="item.x"
              :y="item.y"
              direction="all"
              :damping="40"
              :disabled="item.disable || !sortable"
              @change="onChange($event, item)"
              @touchstart="touchstart($event,item)"
              @mousedown="touchstart($event,item)"
              @touchend="touchend($event,item)"
              @mouseup="touchend($event,item)"
              :style="{ width: viewWidth + 'px', height: (0.75*viewWidth) + 'px', 'z-index': item.zIndex, opacity: item.opacity }"
          >
            <view class="area-con"
                  :style="{ width: childWidth, height:childHeight, transform: 'scale(' + item.scale + ')' }">
              <video class="pre-image" :src="item.src"></video>
              <!--             video -->
              <view class="del-con" @click="delImage(item, index)" @touchstart.stop="delImageMp(item, index)"
                    @touchend.stop="nothing()" @mousedown.stop="nothing()" @mouseup.stop="nothing()">
                <view class="del-wrap">
                  <image
                      v-if="deletable"
                      class="del-image"
                      src="https://public-file.aegis-info.com/yuanjia/common/btn_close@2x.png"
                  ></image>
                </view>
              </view>
            </view>
          </movable-view>
        </block>
      </template>
      <view
          class="add"
          v-if=" (imageList.length < number)&&showAdd"
          :style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: (0.75*viewWidth) + 'px' }"
          @click="addItem"
      >
        <view class="add-wrap" :style="{ width: childWidth, height:childHeight }">
          <image
              style="width: 37px;height: 37px;"
              src="https://public-file.aegis-info.com/yuanjia/common/btn_pic@2x.png"
          ></image>
          <view>{{ uploadType === 1 ? '上传/拍摄图片' : '上传/拍摄视频' }}</view>
        </view>
      </view>
    </movable-area>
  </view>
</template>
<script>
import config from "../../../common/config";

/**
 * shmily-drag-image基础上修改
 * @param {Number} uploadType 1,2 图片/视频
 * @param {string} canSortOrDelete true,false 排序/删除 开，关
 * @event {function} callBack 更新list时触发
 * */
export default {
  data() {
    return {
      imageList: [],
      width: 0,
      add: {
        x: 0,
        y: 0
      },
      colsValue: 0,
      viewWidth: 0,
      tempItem: null,
      timer: null,
      changeStatus: true,
      preStatus: true,
      firstIn: true,
    }
  },
  props: {
    uploadType: {
      type: Number,//1,2 图片，视频
      default: function () {
        return 1
      }
    },
    showAdd: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    // 返回排序后Item
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    sortable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    },
    // 选择图片数量限制
    number: {
      type: Number,
      default: 6
    },
    // 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位rpx
    imageWidth: {
      type: Number,
      default: 230
    },
    // 图片列数（cols > 0 则 imageWidth 无效）
    cols: {
      type: Number,
      default: 0
    },
    // 图片周围空白填充，单位 rpx
    padding: {
      type: Number,
      default: 10
    },
    // 拖动图片时放大倍数 [0, ∞)
    scale: {
      type: Number,
      default: 1.1
    },
    // 拖动图片时不透明度
    opacity: {
      type: Number,
      default: 0.7
    },
    // 自定义添加（需配合 @addItem 事件使用）
    custom: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    list: {
      handler: function (newVal, oldVal) {
        this.setList()
        console.log(newVal, 'list-newVal')
      },
      immediate: true,
    },
  },
  computed: {
    areaHeight() {
      if (this.imageList.length < this.number) {
        return Math.ceil((this.imageList.length + 1) / this.colsValue) * 0.75 * this.viewWidth + 'px'
      } else {
        console.log('here')
        return Math.ceil(this.imageList.length / this.colsValue) * 0.75 * this.viewWidth + 'px'
      }
    },
    childWidth() {
      return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px'
    },
    childHeight() {
      return (this.viewWidth - this.rpx2px(this.padding) * 2) * 0.75 + 'px'

    },
  },
  created() {
    this.width = uni.getSystemInfoSync().windowWidth
    this.viewWidth = this.rpx2px(this.imageWidth)
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query.select('.area').boundingClientRect(data => {
      this.colsValue = Math.floor(data.width / this.viewWidth)
      if (this.cols > 0) {
        this.colsValue = this.cols
        this.viewWidth = data.width / this.cols
      }
      this.imageList = []
      for (let item of this.list) {
        this.addProperties(item)
      }
    })
    query.exec()
  },
  methods: {
    setList() {
      this.imageList = []
      for (let item of this.list) {
        this.addProperties(item)
      }
    },
    onChange(e, item) {
      if (!item) return
      if (!this.sortable) {
        return
      }
      item.oldX = e.detail.x
      item.oldY = e.detail.y
      if (e.detail.source === 'touch') {
        if (item.moveEnd) {
          item.offset = Math.sqrt(Math.pow(item.oldX - item.absX * this.viewWidth, 2) + Math.pow(item.oldY - item.absY * this.viewWidth * 0.75, 2))
        }
        let x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth)
        if (x >= this.colsValue) return
        let y = Math.floor((e.detail.y + this.viewWidth / 2) / (this.viewWidth * 0.75))
        let index = this.colsValue * y + x
        if (item.index != index && index < this.imageList.length) {
          this.changeStatus = false
          for (let obj of this.imageList) {
            if (item.index > index && obj.index >= index && obj.index < item.index) {
              this.change(obj, 1)
            } else if (item.index < index && obj.index <= index && obj.index > item.index) {
              this.change(obj, -1)
            } else if (obj.id != item.id) {
              obj.offset = 0
              obj.x = obj.oldX
              obj.y = obj.oldY
              setTimeout(() => {
                this.$nextTick(() => {
                  obj.x = obj.absX * this.viewWidth
                  obj.y = obj.absY * this.viewWidth * 0.75
                })
              }, 0)
            }
          }
          item.index = index
          item.absX = x
          item.absY = y
          this.sortList()
        }
      }
    },
    change(obj, i) {
      obj.index += i
      obj.offset = 0
      obj.x = obj.oldX
      obj.y = obj.oldY
      obj.absX = obj.index % this.colsValue
      obj.absY = Math.floor(obj.index / this.colsValue)
      setTimeout(() => {
        this.$nextTick(() => {
          obj.x = obj.absX * this.viewWidth
          obj.y = obj.absY * this.viewWidth * 0.75
        })
      }, 0)
    },
    touchstart(e, item) {
      if (!this.sortable) {
        return
      }
      this.imageList.forEach(v => {
        v.zIndex = v.index + 9
      })
      item.zIndex = 99
      item.moveEnd = true
      this.tempItem = item
      this.timer = setTimeout(() => {
        item.scale = this.scale
        item.opacity = this.opacity
        clearTimeout(this.timer)
        this.timer = null
      }, 200)
    },
    touchend(e, item) {
      console.log(e, '$event$event')
      if (!this.sortable) {
        return
      }
      this.previewImage(item)
      item.scale = 1
      item.opacity = 1
      item.x = item.oldX
      item.y = item.oldY
      item.offset = 0
      item.moveEnd = false
      setTimeout(() => {
        this.$nextTick(() => {
          item.x = item.absX * this.viewWidth
          item.y = item.absY * this.viewWidth * 0.75
          this.tempItem = null
          this.changeStatus = true
        })
      }, 0)
      if (this.sortable) {
        this.$emit('get-sort-result', this.imageList, item)
      }
    },
    previewImage(item) {
      if (this.timer && this.preStatus && this.changeStatus && item.offset < 28.28) {
        clearTimeout(this.timer)
        this.timer = null
        let src = this.list.findIndex(v => v === item.src)
        if (this.uploadType === 1) {
          uni.previewImage({
            urls: this.list,
            current: src,
            success: () => {
              this.preStatus = false
              setTimeout(() => {
                this.preStatus = true
              }, 600)
            }
          })
        } else {
          /*
                    uni.previewVideo({
                      urls: this.list,
                      current: src,
                      success: () => {
                        this.preStatus = false
                        setTimeout(() => {
                          this.preStatus = true
                        }, 600)
                      }
                    })
          */

        }
      } else if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    mouseenter() {
      //#ifdef H5
      this.imageList.forEach(v => {
        v.disable = false
      })
      //#endif

    },
    mouseleave() {
      //#ifdef H5
      if (this.tempItem) {
        this.imageList.forEach(v => {
          v.disable = true
          v.zIndex = v.index + 9
          v.offset = 0
          v.moveEnd = false
          if (v.id == this.tempItem.id) {
            if (this.timer) {
              clearTimeout(this.timer)
              this.timer = null
            }
            v.scale = 1
            v.opacity = 1
            v.x = v.oldX
            v.y = v.oldY
            this.$nextTick(() => {
              v.x = v.absX * this.viewWidth
              v.y = v.absY * this.viewWidth * 0.75
              this.tempItem = null
            })
          }
        })
        this.changeStatus = true
      }
      //#endif
    },
    /**
     * 采用递归的方式上传
     */
    uploadOneByOne(imgPaths, successUp, failUp, count, length) {
      var that = this;
      console.log(imgPaths, successUp, failUp, count, length, 'count')
      wx.showLoading({
        title: that.uploadType === 1 ? `正在上传第${successUp}张` : `正在上传第${successUp}个`,
      })
      wx.uploadFile({
        url: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`, //仅为示例，非真实的接口地址
        filePath: imgPaths[count],
        name: 'file',//示例，使用顺序给文件命名
        success: function (res) {
          successUp++;//成功+1
          console.log(res, 'success')
          const uploadData = JSON.parse(res.data)
          that.$emit('upload-one-callBack', uploadData)
          console.log('uploadData', uploadData)
          const url = uploadData.data
          imgPaths[count] = url
          console.log(imgPaths[count], url, 'xxxxxx')
        },
        fail: function (e) {
          failUp++;//失败+1
        },
        complete: function (e) {
          count++;//下一张
          if (count == length) {
            //上传完毕，作一下提示
            console.log('上传成功' + successUp + ',' + '失败' + failUp);
            that.$emit('upload-complete-callBack', successUp, failUp)
            for (let item of imgPaths) {
              that.addProperties(item)
            }
            wx.showToast({
              title: that.uploadType === 1 ? `上传成功${successUp}张` : `上传成功${successUp}个`,
              icon: 'success',
              duration: 2000
            })
          } else {
            //递归调用，上传下一张
            that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
            console.log('正在上传第' + count + '张');
          }
        }
      })
    },
    replaceItem(index) {
      //传图片
      if (this.uploadType === 1) {
        if (this.custom) {
          this.$emit('addItem')
        } else {
          const that = this
          uni.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: res => {
              console.log(res, 'additem')
              let successUp = 0; //成功
              let failUp = 0; //失败
              let length = res.tempFilePaths.length; //总数
              let uploadCount = 0; //第几张
              that.uploadOneByOne(res.tempFilePaths, successUp, failUp, uploadCount, length);
            }
          })
        }
      }
      //传视频
      if (this.uploadType === 2) {
        if (this.custom) {
          this.$emit('addItem')
        } else {
          const that = this
          console.log('media--start')
          uni.chooseMedia({
            count: 1,
            // 默认9
            mediaType: ['video'],
            //'image','video'
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: res => {
              const filePathList = res.tempFiles.map(item => item.tempFilePath)
              console.log(res, 'res')
              let successUp = 0; //成功
              let failUp = 0; //失败
              let length = filePathList.length; //总数
              let uploadCount = 0; //第几个
              that.uploadOneByOne(filePathList, successUp, failUp, uploadCount, length);

            }
          })
          console.log('media--end')
        }
      }
    },
    addItem() {
      //传图片
      if (this.uploadType === 1) {
        if (this.custom) {
          this.$emit('addItem')
        } else {
          let checkNumber = this.number - this.imageList.length
          const that = this
          uni.chooseImage({
            count: checkNumber,
            sourceType: ['album', 'camera'],
            success: res => {
              console.log(res, 'additem')
              let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length
              let successUp = 0; //成功
              let failUp = 0; //失败
              let length = res.tempFilePaths.length; //总数
              let uploadCount = 0; //第几张
              that.uploadOneByOne(res.tempFilePaths, successUp, failUp, uploadCount, length);
            }
          })
        }
      }
      //传视频
      if (this.uploadType === 2) {
        if (this.custom) {
          this.$emit('addItem')
        } else {
          const that = this
          let checkNumber = this.number - this.imageList.length
          console.log('media--start')
          uni.chooseMedia({
            count: checkNumber,
            // 默认9
            mediaType: ['video'],
            //'image','video'
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: res => {
              const filePathList = res.tempFiles.map(item => item.tempFilePath)
              let count = checkNumber <= filePathList.length ? checkNumber : filePathList.length
              console.log(res, 'res')
              let successUp = 0; //成功
              let failUp = 0; //失败
              let length = filePathList.length; //总数
              let uploadCount = 0; //第几个
              that.uploadOneByOne(filePathList, successUp, failUp, uploadCount, length);

            }
          })
          console.log('media--end')
        }
      }

    },
    delImage(item, index) {
      this.$emit('deleted-callBack', index, item)
      this.imageList.splice(index, 1)
      for (let obj of this.imageList) {
        if (obj.index > item.index) {
          obj.index -= 1
          obj.x = obj.oldX
          obj.y = obj.oldY
          obj.absX = obj.index % this.colsValue
          obj.absY = Math.floor(obj.index / this.colsValue)
          this.$nextTick(() => {
            obj.x = obj.absX * this.viewWidth
            obj.y = obj.absY * this.viewWidth * 0.75
          })
        }
      }
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth * 0.75 + 'px'
      this.sortList()
    },
    delImageMp(item, index) {
      //#ifdef MP
      this.delImage(item, index)
      //#endif
    },
    sortList() {
      let list = this.imageList.slice()
      list.sort((a, b) => {
        return a.index - b.index
      })
      for (let i = 0; i < list.length; i++) {
        list[i] = list[i].src
      }
      this.$emit('update:list', list)
      this.$emit('call-back')
    },
    addProperties(item) {
      let absX = this.imageList.length % this.colsValue
      let absY = Math.floor(this.imageList.length / this.colsValue)
      let x = absX * this.viewWidth
      let y = absY * this.viewWidth * 0.75
      this.imageList.push({
        src: item,
        x,
        y,
        oldX: x,
        oldY: y,
        absX,
        absY,
        scale: 1,
        zIndex: 9,
        opacity: 1,
        index: this.imageList.length,
        id: this.guid(),
        disable: false,
        offset: 0,
        moveEnd: false
      })
      this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
      this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth * 0.75 + 'px'
      this.sortList()
    },
    nothing() {
    },
rpx2px(v) {
      return this.width * v / 750
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
  }
}
</script>

<style lang="scss" scoped>
.con {
  .area {
    width: 100%;

    .view {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .area-con {
        position: relative;

        .pre-image {
          border-radius: 6px;
          width: 100%;
          height: 100%;
        }

        .del-con {
          position: absolute;
          top: -16rpx;
          right: -16rpx;

          .del-wrap {
            width: 32rpx;
            height: 32rpx;
            border-radius: 0 0 0 10rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .del-image {
              width: 32rpx;
              height: 32rpx;
            }
          }
        }
      }
    }

    .add {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;

      .add-wrap {
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #f5f6f9;
        border: 2upx dashed #cccccc;

        image {
          width: 37rpx;
          height: 37rpx;
        }
      }
    }
  }
}
</style>