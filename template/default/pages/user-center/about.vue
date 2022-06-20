<template>
    <view class="container">
        <image :src='`https://public-file.aegis-info.com/yuanjia/common/dalvPDF${index+1}.jpg`' v-for="(item, index) in imgList" :key="index">
    </view>
</template>

<script>
export default {
    data(){
        return{
            imgList: []
        }
    },
    onShow() {
        console.log(1233333)
        this.imgList = []
        for(let i = 0 ;i <34;i++){
            this.imgList.push(i)
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    text-align: center;
    image{
        width: 95%;
        box-shadow: 10rpx 10rpx 10rpx #eee;
        margin: 10rpx;
    }
}
</style>