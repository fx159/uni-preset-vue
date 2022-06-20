<template>
    <view class="content">
        <view class="container">
            <!-- 日期列表 -->
            <scroll-view
                class="scroll-view_H b-t b-b"
                scroll-x
            >
                <block
                    v-for="(item,index) in dateArr"
                    :key="index"
                >
                    <div
                        class="flex-box"
                        @click="selectDateEvent(index,item)"
                        :class="{ borderb: index==dateActive}"
                    >
                        <view
                            class="date-box"
                            :style="{color:index==dateActive?selectedTabColor:'#333'}"
                        >
                            <text class="fontw">{{item.week}}</text>
                            <text>{{item.date}}</text>
                        </view>
                    </div>
                </block>

            </scroll-view>

            <!-- 时间选项 -->
            <view
                class="time-box"
                v-if="!isSection"
            >
                <template v-if="timeArr.length>0">
                    <block
                        v-for="(item,_index) in timeArr"
                        :key="_index"
                    >
                        <view class="item">
                            <view
                                v-if="_index!==timeArr.length-1"
                                class="item-box"
                                :class="{'disable':item.disable,
						'active':isMultiple?item.isActive:_index==timeActive}"
                                :style="{color:isMultiple?item.isActive? selectedItemColor:'#333'
						 :_index==timeActive?selectedItemColor:'#333'}"
                                @click="selectTimeEvent(_index,item)"
                            >
                                <text>{{item.time}}~{{                            
                                    selectDate?timeStamp(new Date((selectDate + " " + item.time).replace(/-/g,"/")).getTime() +
                                    (1000 * 60 * 60 * timeInterval),false).hour:''
                            }}</text>
                                <text class="all">{{item.disable?disableText:undisableText}}</text>
                            </view>
                        </view>
                    </block>
                </template>
                <u-empty style="margin:180upx auto;" v-else text="当天暂无可预约时间" mode="list"></u-empty>

            </view>

            <!-- 预约时间段 -->
            <view
                class="time-box"
                v-else
            >
                <block
                    v-for="(item,_index) in timeArr"
                    :key="_index"
                >
                    <view class="item">
                        <view
                            class="item-box"
                            :class="{'disable':item.disable || item.isInclude,
						'active':item.time == timeQuanBegin || item.time == timeQuanEnd }"
                            :style="{color:item.time == timeQuanBegin || item.time == timeQuanEnd? selectedItemColor:'#333'}"
                            @click="handleSelectQuantum(_index,item)"
                        >
                            <text>{{item.time}} </text>
                            <text class="all">{{item.disable?disableText:undisableText}}</text>
                        </view>
                    </view>
                </block>
            </view>
        </view>
        <view class="bottom">
            <view
                class="show-time"
                v-if="!isMultiple && !isSection"
            >
                预约时间：{{orderDateTime}}
            </view>
            <button
                form-type="submit"
                type="default"
                size="mini"
                class="submit-btn"
                @click="handleSubmit"
            >
                确认预约
            </button>

        </view>
    </view>
</template>

<script>
import log from "../../../../common/log.js";
import {
    initData,
    initTime,
    timeStamp,
    currentTime,
    isInRange,
} from "../utils/date.js";
export default {
    name: "times",
    model: {
        prop: "showPop",
        event: "change",
    },
    props: {
        isMultiple: {
            //是否多选
            type: Boolean,
            default: false,
        },
        isSection: {
            //预约时间段
            type: Boolean,
            default: false,
        },
        disableText: {
            //禁用显示的文本
            type: String,
            default: "已约满",
        },
        undisableText: {
            //未禁用显示的文本
            type: String,
            default: "可预约",
        },
        timeInterval: {
            // 时间间隔，小时为单位
            type: Number,
            default: 1,
        },
        selectedTabColor: {
            // 日期栏选中的颜色
            type: String,
            default: "#FB4B5C",
        },
        selectedItemColor: {
            // 时间选中的颜色
            type: String,
            default: "#FB4B5C",
        },
        beginTime: {
            type: String,
            default: "09:00:00",
        },
        endTime: {
            type: String,
            default: "19:00:00",
        },
        disableTimeSlot: {
            // 预约开始和结束时间，来禁用时间段
            type: Array,
            default() {
                return [];
            },
        },
        appointInfo: {
            // 预约信息
            type: Object,
            default() {
                return {};
            },
        },
    },
    watch: {
        appointTime: {
            handler(val) {
                if (val && val.length) {
                    console.log(val, "val");
                    // this.initOnload();
                }
            },
        },
        selectDate: {
            handler(val) {
                if (val) {
                    this.getDateAppointment();
                }
            },
        },
    },
    data() {
        return {
            lockData: null, // 锁定的数据
            appointTime: [],
            orderDateTime: "暂无选择", // 选中时间
            orderTimeArr: {}, //多选的时间
            dateArr: [], //日期数据
            timeArr: [], //时间数据
            nowDate: "", // 当前日期
            dateActive: 0, //选中的日期索引
            timeActive: 0, //选中的时间索引
            timeQuanBeginIndex: 0, //时间段开始的下标
            selectDate: "", //选择的日期
            remoteDateAppointInfo: null,
            selectTime: "", //选择的时间
            timeQuanBegin: "", //时间段开始时间
            timeQuanEnd: "", //时间段结束时间
        };
    },
    created(props) {
        this.selectDate = this.nowDate = currentTime().date;
    },
    methods: {
        timeStamp,
        isInRange,
        initOnload() {
            this.dateArr = initData(); // 日期栏初始化

            const workList =
                (this.remoteDateAppointInfo &&
                    this.remoteDateAppointInfo.hourList) ||
                [];
            this.timeArr = initTime(workList, this.timeInterval); //时间选项初始化
            this.timeQuanBegin = this.timeQuanEnd = "";
            let isFullTime = true;
            this.timeArr.forEach((item, index) => {
                //判断是当前这一天，选中时间小于当前时间则禁用
                if (
                    this.selectDate == this.nowDate &&
                    currentTime().time > item.time
                ) {
                    item.disable = true;
                }
                console.log(this.appointTime, "this.appointTime");
                this.appointTime.forEach((t) => {
                    // 相交 重合 包含 就返回true;
                    const a = {
                        startTime: new Date(
                            t.startTime.replace(/-/g, "/")
                        ).getTime(),
                        endTime:
                            new Date(t.startTime.replace(/-/g, "/")).getTime() +
                            Number(t.periodNum) * 15 * 60 * 1000,
                    };
                    // 切片的时间
                    if (!this.timeArr[index + 1]) return;
                    const timeArrItem = {
                        startTime: new Date(
                            (this.selectDate + " " + item.time).replace(
                                /-/g,
                                "/"
                            )
                        ).getTime(),
                        endTime:
                            new Date(
                                (this.selectDate + " " + item.time).replace(
                                    /-/g,
                                    "/"
                                )
                            ).getTime() +
                            1000 * 60 * 60 * this.timeInterval,
                    };

                    const isAppointed = this.isInRange(a, timeArrItem);
                    if (isAppointed) item.disable = true;
                });

                // 禁用时间段
                const cur_time = `${this.selectDate} ${item.time}`;

                for (let time of this.disableTimeSlot) {
                    const [begin_time = "", end_time = ""] = time;
                    if (
                        begin_time &&
                        end_time &&
                        begin_time <= cur_time &&
                        cur_time <= end_time
                    ) {
                        item.disable = true;
                    }
                }

                // 判断是否当前日期时间都被预约
                if (!item.disable) {
                    isFullTime = false;
                }
                this.isSection && (item.isInclude = false);

                // 对多选操作的已选时间的回显
                if (
                    this.isMultiple &&
                    (this.orderTimeArr[this.selectDate] || []).includes(
                        item.time
                    )
                ) {
                    // item.isActive = true;
                }
            });

            // this.orderDateTime = isFullTime ? "暂无选择" : this.selectDate;
            this.timeActive = -1;
            for (let i = 0, len = this.timeArr.length; i < len; i++) {
                if (!this.timeArr[i].disable) {
                    // this.orderDateTime = `${this.selectDate} ${this.timeArr[i].time}`;
                    // this.timeActive = i;
                    return;
                }
            }
        },

        // 日期选择事件
        selectDateEvent(index, item) {
            this.dateActive = index;
            this.selectDate = item.date;
            this.initOnload();
        },

        // 时间选择事件
        selectTimeEvent(index, item) {
            if (item.disable) return;
            if (this.isMultiple) {
                item.isActive = !item.isActive;
                this.timeArr = this.timeArr.slice();
                this.orderTimeArr[this.selectDate] = this.timeArr.reduce(
                    (prev, cur) => {
                        cur.isActive && prev.push(cur.time);
                        return prev;
                    },
                    []
                );
            } else {
                console.log(item, "item", this.selectDate);
                const endTime = this.selectDate?timeStamp(new Date((this.selectDate + " " + item.time).replace(/-/g,"/")).getTime() +
                                    (1000 * 60 * 60 * this.timeInterval),false).hour:''
                this.setLock(
                    {
                        day: this.selectDate,
                        timeSplit: [item.time, this.selectDate?endTime:''],
                    },
                    item,
                    index
                );
                // TODO 放到lock成功的回调 this.orderDateTime = `${this.selectDate} ${item.time}`
            }
        },
        setLock(
            payLoad = {
                day: "",
                timeSplit: "",
            },
            item,
            index
        ) {
            const params = {
                unitId: getApp().globalData.unitId,
                day: payLoad.day,
                timeSplit: payLoad.timeSplit,
            };
            if (this.lockData) {
                this.unLockData().then((res) => {
                    console.log("unlock");
                    this.checkLockDate(params, item, index);
                });
            } else {
                this.checkLockDate(params, item, index);
            }
        },
        unLockData() {
            console.log(this.lockData, "this.lockData");
            if (!this.lockData) return;
            return this.$u.api.unLockDate(this.lockData);
        },
        checkLockDate(params, item, index) {
            this.$u.api.checkLockDate(params).then((res) => {
                console.log(res, params, item, "checkLockDate");
                if (res.data) {
                    // 加锁成功
                    this.lockData = params;
                    this.timeActive = index;
                    this.selectTime = item.time;
                    this.orderDateTime = `${this.selectDate} ${this.selectTime}`;
                    console.log(this.lockData, "lockData");
                } else {
                    this.$u.toast("慢了一步，已经被抢先预约啦~");
                    item.disable = true;
                }
                return res.data;
            });
        },
        checkInTime(remote, local) {},
        formatAddOrUpdateData(payLoad) {
            /* hourList:[
                {
                    lawInfo: '',
                    appointInfo:null,
                    startTime:null,
                    endTime:null,
                    isAppointed:0 // 0 律师，1 用户
                },
                {
                    appointInfo:{
                        orderId: this.initOrderId,
                        orderStr,
                        productId: this.productId,
                        spuId: this.spuId,
                        serviceTime: this.serviceTime,
                        userInfo: this.userInfo,
                    },
                    lawInfo: '',
                    startTime:null,
                    endTime:null,
                    isAppointed:1 // 0 律师，1 用户
                }
            ] */
            console.log(payLoad, "payload");
            const startTime = this.selectDate + " " + payLoad.timeSplit[0];
            const endTime = this.selectDate + " " + payLoad.timeSplit[1];
            const hour = startTime.substring(0, 2);
            const min = startTime.substring(startTime.length - 2); // 分钟
            const startPeriod = ["00", "15", "30", "45"];
            const periodNum = this.timeInterval / 0.25;
            const timePeriodItem = {
                startTime,
                endTime,
                periodNum,
                // startPeriod, //0 1 2 3分表表示 '00','15','30','45' 开始
                isAppointed: 1,
                appointInfo: this.appointInfo,
                lawInfo: null,
            };
            const params = {
                id:
                    (this.remoteDateAppointInfo &&
                        this.remoteDateAppointInfo.id) ||
                    "",
                day: this.selectDate,
                unitId: getApp().globalData.unitId,
                userDate: JSON.stringify(timePeriodItem),
            };
            return [params, timePeriodItem];
        },
        getDateAppointment() {
            const params = {
                day: this.selectDate,
                unitId: getApp().globalData.unitId,
            };
            this.$u.api.getDateAppointment(params).then((res) => {
                console.log(res, "getDateAppointment");
                if (res.data) {
                    this.remoteDateAppointInfo = res.data;
                    // res && res.data && res.data.id ? res.data.id : null;
                    this.remoteDateAppointInfo.hourList =
                        (res.data &&
                            res.data.hourList &&
                            JSON.parse(res.data.hourList)) ||
                        [];
                    this.remoteDateAppointInfo.userDateList =
                        (res.data &&
                            res.data.userDateList &&
                            JSON.parse(res.data.userDateList)) ||
                        [];
                    //预约时间
                    this.appointTime = this.remoteDateAppointInfo.userDateList;
                } else {
                    this.remoteDateAppointInfo = null;
                }
                this.initOnload();

                // this.appointTime=hourList
            });
        },
        // 选择时间段
        handleSelectQuantum(index, item) {
            if (item.disable) return;

            function clearTime() {
                this.timeQuanBeginIndex = index;
                this.timeQuanBegin = item.time;
                this.timeQuanEnd = "";
            }

            if (!this.timeQuanBegin) {
                clearTime.call(this);
                return;
            }
            if (!this.timeQuanEnd && this.timeQuanBegin) {
                let isDisble = false;
                let start = this.timeQuanBeginIndex;
                let end = index;
                start > end && ([start, end] = [end, start]);
                for (let i = start + 1; i < end; i++) {
                    if (this.timeArr[i].disable) {
                        isDisble = true;
                        clearTime.call(this);
                        return;
                    }
                }
                if (!isDisble) {
                    for (let i = start + 1; i < end; i++) {
                        this.timeArr[i].isInclude = true;
                    }
                }
                this.timeQuanEnd = item.time;
                return;
            }

            if (this.timeQuanBegin && this.timeQuanEnd) {
                this.timeArr.forEach((t) => {
                    t.isInclude = false;
                });
                clearTime.call(this);
            }
        },
        handleChange() {
            this.timeQuanBegin > this.timeQuanEnd &&
                ([this.timeQuanBegin, this.timeQuanEnd] = [
                    this.timeQuanEnd,
                    this.timeQuanBegin,
                ]);
        },
        handleSubmit() {
            if (this.appointInfo && this.lockData) {
                const [params, timePeriodItem] = this.formatAddOrUpdateData(
                    this.lockData
                );
                console.log(params, "params");
                this.$emit("addOrUpdateAppointment", params, timePeriodItem);
            } else {
                this.$u.toast("请选择预约时间");
            }
            if (this.isSection) {
                this.handleChange();
                this.$emit("change", {
                    beginTime: `${this.selectDate} ${this.timeQuanBegin}`,
                    endTime: `${this.selectDate} ${this.timeQuanEnd}`,
                });
                return;
            }

            if (this.isMultiple) {
                let time = [];
                for (let date in this.orderTimeArr) {
                    this.orderTimeArr[date].forEach((item) => {
                        time.push(`${date} ${item}`);
                    });
                }
                this.$emit("change", time);
            } else {
                this.$emit("change", this.orderDateTime);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "./pretty-times.scss";

page {
    height: 100%;
}

.content {
    text-align: center;
    height: 100%;
}

/* 两个按钮 */
.bottom {
    display: flex;
    flex-direction: row;
    position: fixed;
    // bottom: 8px;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    top: auto;
    left: 0px;
    width: 100%;
    background-color: #fff;
}

.show-time {
    width: 70%;
    height: 47px;
    color: #505050;
    background-color: rgba(255, 255, 255, 1);
    font-size: 15px;
    line-height: 47px;
    text-align: center;
}

.submit-btn {
    width: 25%;
    height: 40px;
    color: white;
    background-color: #2e4e6f;
    font-size: 15px;
    line-height: 40px;
    text-align: center;
    margin: auto;
    padding: 0;
}

.fontw {
    font-weight: bold;
}

.borderb {
    border-bottom: 2px solid #fb4b5c;
}
</style>
