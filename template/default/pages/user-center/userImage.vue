<template>
    <view class="container">
        <image :src="image" alt="">
        <view class="btn" @click="changeImg()">
            更换个人头像
        </view>
    </view>    
</template>

<script>
import config from '../../common/config.js';
import Log from '../../common/log'
export default {
    data(){``
        return{
            image: ''
        }
    },
    methods:{
        changeImg(){
            Log.saveEvent(2, '点击[更换个人头像]', 'click');
            const _this = this
            wx.chooseImage({
                count: 1,
                success (res) {
                    const tempFilePaths = res.tempFilePaths[0]
                    uni.showLoading({
                        title: '加载中',
                    })
                    wx.uploadFile({
                        url: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
                        filePath: tempFilePaths,
                        name: 'file',
                        header: {
                            "Content-Type": "multipart/form-data"
                        },
                        success(uploadRes) {
                            const { data, code} = JSON.parse(uploadRes.data);
                            if (code === 200) {
                                console.log('服务器url',data)
                                _this.$u.api.updateIcon({"icon": data}).then(res=>{
                                    uni.hideLoading();
                                    _this.$u.toast('上传成功！')
                                    _this.image = data
                                    const userInfo = uni.getStorageSync('user-info')
                                    userInfo.header = data
                                    uni.setStorageSync('user-info',userInfo)
                                })
                            } else {
                                uni.hideLoading();
                                _this.$u.toast('头像上传失败！')
                            }
                        },
                    })
                }
            })
        }
    },
    async onShow(){
        const userInfo = await uni.getStorageSync('user-info') || null
        this.image = userInfo.header || userInfo.icon
    }
}
</script>

<style lang="less" scoped>
.container{
    height: 100vh;
    background: #000;
    position: relative;
    image{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 750upx;
        height: 750upx;
    }
    .btn{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 150upx;
        color: #eee;
        background: #555;
        text-align: center;
        font-size: 34upx;
        line-height: 3;
    }
}
</style>