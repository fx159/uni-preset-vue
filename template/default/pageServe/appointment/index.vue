<template>
    <view>
        <times
            v-if="appointInfo"
            ref="times"
            @change="getTime"
            @addOrUpdateAppointment="addOrUpdateAppointment"
            :timeInterval="timeInterval"
            beginTime="09:00"
            endTime="20:00"
            :isMultiple="false"
            :isSection="false"
            :appointInfo="appointInfo"
        ></times>
    </view>
</template>

<script>
import times from "./components/pretty-times/pretty-times.vue";
export default {
    components: {
        times,
    },
    onUnload() {
        this.$refs.times.unLockData();
    },
    onLoad(opt) {
        this.setAppointInfo();
    },
    computed: {
        timeInterval() {
            if (!this.appointInfo||!this.appointInfo.serviceTime) return 0.25;
            return (Number(this.appointInfo.serviceTime) / 60) < 0.25
                ? 0.25
                : Number(this.appointInfo.serviceTime) / 60;
        },
    },
    data() {
        return {
            appointInfo: null,
            /* disable的开始时间列表 */
            // ["2022-05-05 16:30:00", "2022-05-05 18:30:00"],
        };
    },
    methods: {
        setAppointInfo() {
            if (uni.getStorageSync("orderInfo")) {
                this.appointInfo = JSON.parse(uni.getStorageSync("orderInfo"));
                uni.removeStorageSync("orderInfo");
                console.log(this.appointInfo, "appointInfo");
            }
        },
        addOrUpdateAppointment(params, addItem) {
            console.log(params, "addOrUpdateAppointment");
            this.$u.api.addOrUpdateAppointment(params).then((res) => {
                uni.setStorageSync(
                    "appointSuccessInfo",
                    JSON.stringify(addItem)
                );
                this.$u.route({ type: "navigateBack" });
            });
        },
        getTime(e) {
            // console.log(e, "eee");
        },
    },
};
</script>

<style>
</style>
