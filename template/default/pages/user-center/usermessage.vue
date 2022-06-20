<template>
    <view class="container">
        <view class="item">
            <view class="label">头像</view>
            <view @click="routeAddress('userImage',1,'点击[头像]')">
                <image :src="userInfo.header || userInfo.icon" alt="">
                <view class="right-arrow"></view>
            </view>
        </view>
        <view class="item">
            <view class="label">昵称</view>
            <view @click="routeAddress('editName',3,'点击[昵称]')">
                <view class="text">{{userInfo.nickName}}</view>
                <view class="right-arrow"></view>
            </view>
        </view>
        <view class="item">
            <view class="label">手机号</view>
            <view @click="routeAddress('editPhone',5,'点击[手机号]')">
                <view class="text">{{userInfo.phone}}</view>
                <view class="right-arrow"></view>
            </view>
        </view>
        <view class="item">
            <view class="label">用户ID</view>
            <view>
                <view class="text">{{userInfo.id}}</view>
                <!-- <view class="right-arrow"></view> -->
            </view>
        </view>
        <view class="item">
            <view class="label">当前身份:{{ nowIdentity.roleName}}</view>
            <view v-if="roleList.length > 1">
                <picker @change="chooseIdentity" :value="index" :range="roleList" :range-key="'roleName'">
                    <view class="text identity">切换身份</view>
                    <view class="right-arrow"></view>
                </picker>
            </view>
        </view>

    </view>
</template>

<script>
import Log from '../../common/log'
export default {
    data(){
        return {
            userInfo: '',
            roleList:[{roleId:1, roleName:'是的'},{roleId:2,roleName:'王企鹅'}],
            nowIdentity: {}
        }
    },
    methods:{
        routeAddress(url,code,name){
            Log.saveEvent(code, name, 'click');
            uni.navigateTo({
				url: `./${url}`
			})
        },
        chooseIdentity(e){
            console.log(e.detail.value)
            const num = e.detail.value
            this.$u.api.changeRole({roleId: this.roleList[num].roleId}).then(res=>{
                const userInfo = uni.getStorageSync('user-info')
                userInfo.userRole = this.roleList[num].roleId
                this.nowIdentity.roleName = this.roleList[num].roleId
                uni.setStorageSync('user-info',userInfo)
                wx.navigateBack()
                // wx.reLaunch({
                //     url: './usermessage'
                // })
            })
        },
        // 获取角色列表
        getRoleList(){
            this.$u.api.getRoles({unitId:getApp().globalData.unitId}).then(res=>{
                this.roleList = res.data
                this.roleList.map(item=>{
                    if(item.isCurrentRole == 1){
                        this.nowIdentity = item
                    }
                })
            })
        },
    },
    async onShow(){
        this.$store.commit('setPagerInfo', {
            name: '修改个人信息页',
            code: '25',
            url: '/pages/user-center/usermessage'
        });
        Log.saveEvent('0', '加载页面', 'onShow');
        this.userInfo = await uni.getStorageSync('user-info') || null
        console.log(this.userInfo)
        this.getRoleList()
    },
    onUnload(){
        Log.saveEvent('-1', '离开页面', 'onUnload');
    },
    onShareAppMessage() {
        // 分享埋点
        Log.saveEvent('-2', '分享', 'click')
    },
}
</script>

<style lang="less" scoped>
.container{
    padding: 0 40upx;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 40upx 0;
        font-size: 32upx;
        color: #333333;
        font-weight: 400;
        border-bottom: 1upx solid #eee;
        image{
            width: 120upx;
            height: 120upx;
            border-radius: 50%;
            margin-right: 8upx;
            vertical-align: middle;
        }
        .text{
            display: inline-block;
            margin-right: 16upx;
        }
        .identity{
            color: #F8602A;
        }
    }
    .right-arrow{
        display: inline-block;
		width: 24upx;
		height: 24upx;
		background: url('https://public-file.aegis-info.com/yuanjia/common/left1.png') center no-repeat;
		background-size: 100% 100%;
	}
}
</style>