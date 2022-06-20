<template>
    <view class="container">
        <view class="item">
            <input type="text" v-model="name" maxlength="8" placeholder="请输入您的昵称"/>
            <text class="text" @click="changeName()">确定修改</text>
        </view>
        <view class="hint">
            <text>昵称不超过8个字</text>
            <text>{{name.length}}/8</text>
        </view>
    </view>
</template>

<script>
import Log from '../../common/log'
export default {
    data(){
        return{
            name: ''
        }
    },
    methods:{
        async changeName(){
            Log.saveEvent(4, '点击[确认修改昵称]', 'click');
            if(!this.name){
                this.$u.toast('请输入昵称！')
                return
            }
            this.$u.api.updateNickName({"nickName": this.name}).then(res => {
                this.$u.toast('修改成功！')
                const userInfo = uni.getStorageSync('user-info')
                userInfo.nickName = this.name
                uni.setStorageSync('user-info',userInfo)
                wx.navigateBack()
            })
        }
    },
    async onShow(){
        const userInfo = await uni.getStorageSync('user-info') || null
        this.name = userInfo.nickName
    }
}
</script>

<style lang="less" scoped>
.container{
    padding: 0 40upx;
    font-family: PingFangSC-Medium, PingFang SC;
    .item{
        display: flex;
        justify-content: space-between;
        padding: 40upx 0;
        font-size: 32upx;
        color: #333333;
        font-weight: 400;
        border-bottom: 1upx solid #eee;
        .text{
            font-size: 28upx;
            color: #F8602A;
            font-weight: 500;
        }
    }
    .hint{
        display: flex;
        justify-content: space-between;
        margin-top: 20upx;
        font-size: 24upx;
        color: #999;
    }
}
</style>