<template>
    <view
        @click="toAppointment"
        style="position: relative;"
    >
        <image
            style="width:450upx"
            mode="widthFix"
            src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220531_77648d9c-d2fe-4e6b-832d-2955804a9316.png"
        ></image>
        <view class="title">
            侯律师时间表
            <view class="row">
                预约选择<view class="right-arrow"></view>

            </view>
        </view>

    </view>
</template>
<script>
import UImage from "../../../uview-ui/components/u-image/u-image";
export default {
    components: { UImage },
    data() {
        return {
        };
    },
    props:{isAppointed:{}},
    methods: {
        toAppointment() {
            if(this.isAppointed)return
            this.$emit("setOrderInfo");
            this.$u.route({ url: "pageServe/appointment/index" });
        },
    },
    mounted() {},
};
</script>
<style lang="scss" scoped>
.title {
    color: #2e4e6f;
    font-weight: 800;
    font-size: 36upx;
    position: absolute;
    left: 45upx;
    top: 22upx;
}
.row {
    width: 70%;
    font-size: 20upx;
    background: #fff;
    box-shadow: 0px 4px 8px 0px rgba(255, 227, 194, 0.2);
    border-radius: 20upx;
    padding: 4upx 16upx;
    margin-top: 12upx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.right-arrow {
    display: inline-block;
    width: 24upx;
    height: 24upx;
    background: url("https://public-file.aegis-info.com/yuanjia/common/left1.png")
        center no-repeat;
    background-size: 100% 100%;
}
</style>