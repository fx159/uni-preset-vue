<template>
    <view class="advice-submit-page">
        <view
            class="part"
            v-if="!isLawyer"
        >
            <view class="title">分类标签</view>
            <view class="tag-list">
                <view
                    :class="activeTag === item.id ? 'tag active' : 'tag'"
                    v-for="(item, index) in tags"
                    :key="index"
                    @click="handleTagClick(item)"
                >{{item.name}}</view>
            </view>
        </view>
        <view
            class="part"
            v-else
        >
            <view class="title">分类标签</view>
            <view class="tag-list">
                <view
                    :class="activeTagList.includes(item.id) ? 'tag active' : 'tag'"
                    v-for="(item, index) in tagsLawyer"
                    :key="index"
                    @click="handleTagClickMultipleChoice(item)"
                >{{item.name}}</view>
            </view>
        </view>
        <view class="part">
            <!-- <view class="title">{{isLawyer?'律师投诉':'我要反馈'}}</view> -->
            <view class="textarea-input">
                <u-input
                    type="textarea"
                    v-model="content"
                    :clearable="false"
                    height="300"
                    border
                    placeholder="说说哪里好嘛，其他用户也想知道"
                    placeholder-style="color:#9BA0A4;font-size:26rpx;line-height:42rpx;"
                    maxlength="512"
                    :auto-height="false"
                    border-color="#EEEEEE"
                    :custom-style="customStyle"
                ></u-input>
            </view>
        </view>
        <view class="part image-part">
            <view class="image-wrap">
                <u-upload
                    :action="uploadAction"
                    max-count="3"
                    ref="uUpload"
                    width="152"
                    :custom-btn="true"
                    :show-progress="false"
                    del-bg-color="#333333"
                    @on-success="handleSuccess"
                    @on-error="handleError"
                    @on-remove="handleRemove"
                >
                    <view
                        slot="addBtn"
                        :class="uploadImg.length > 2 ? 'slot-btn margin-left-0': 'slot-btn'"
                    >
                        <image
                            src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/upload_icon.png"
                            class="upload-img"
                        ></image>
                        <view class="text">上传照片</view>
                    </view>
                </u-upload>

                <u-checkbox
                    v-model="hasAnonym"
                    shape="circle"
                >匿名</u-checkbox>
            </view>
        </view>
        <view class="note-wrap">
            <text
                class="text"
                style="padding:0 40upx;width:100%;text-align:left"
            >
                {{isLawyer?'律师跳单行为一经举报，平台核实通过后，将对律师进行严格处罚，当事人的消费全额退款，并给予相应补偿':'建议被采纳后，有机会获得精美礼物'}}
            </text>
            <image
                src="../../static/icon/pic_gift@2x.png"
                mode="widthFix"
            ></image>
        </view>
        <view class="btn-wrap">
            <view class="btn">
                <u-button
                    type="primary"
                    hover-class="none"
                    :custom-style="customStyleBtn"
                    @click="handleSubmitFeedback()"
                >提交</u-button>
            </view>
        </view>


<!--         <u-popup
            v-model="showPopup"
            mode="bottom"
            height="100%"
        >
            <view class="content-wrap">
                <view class="line-1 text">
                    您好！
                </view>
                <view
                    class="text"
                    style="text-indent: 2em;"
                >
                    我已经收到了您的反馈~我们团队一定会认真倾听；如被采纳，运营人员会主动添加您的微信，并为您准备了精美的小礼物。
                </view>
                <view
                    class="text"
                    style="text-indent: 2em;"
                >
                    感谢您对我们产品的支持~我们一定会不断努力，为用户提供智能、专业、高效、优质的泛法律服务！
                </view>
                <view class="shenfen-box">
                    <view class="header">
                        <image
                            src="../../static/icon/pic_mule@2x.png"
                            mode="widthFix"
                        ></image>
                    </view>
                    <view class="user-info">
                        <view class="name">Mule</view>
                        <view class="desc">小法产品经理</view>
                        <view class="desc">mule@aegis-data.cn</view>
                    </view>
                </view>
            </view>
            <view class="btn-wrap back-home">
                <view class="btn">
                    <u-button
                        type="primary"
                        hover-class="none"
                        :custom-style="customStyleBtn"
                        @click="handleBackHome()"
                    >返回首页</u-button>
                </view>
            </view>
        </u-popup> -->
    </view>
</template>

<script>
import config from "../../common/config.js";
export default {
    data() {
        return {
            // 标签
            //对我很有帮助,响应快,服务态度好,认真细致,专业可靠,性价比高
            tagsLawyer: [
                {
                    name: "对我很有帮助",
                    id: 1,
                },
                {
                    name: "响应快",
                    id: 2,
                },
                {
                    name: "服务态度好",
                    id: 3,
                },
                {
                    name: "认真细致",
                    id: 4,
                },
                {
                    name: "专业可靠",
                    id: 5,
                },
                {
                    name: "性价比高",
                    id: 6,
                },
            ],
            activeTag: 1,
            activeTagList: [1],
            tags: [
                {
                    name: "功能建议",
                    id: 1,
                },
                {
                    name: "内容建议",
                    id: 2,
                },
                {
                    name: "BUG建议",
                    id: 3,
                },
                {
                    name: "界面建议",
                    id: 4,
                },
                {
                    name: "其他",
                    id: 5,
                },
            ],
            isLawyer: false,
            activeTag: 1,
            orderInfo: {},
            hasAnonym: false,
            content: "",
            uploadAction: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
            uploadImg: [],
            showPopup: false,
            userInfo: {},
            customStyleBtn: {
                width: "598rpx",
                height: "96rpx",
                background:
                    "linear-gradient(270deg,rgba(74,162,255,1) 0%,rgba(33,99,224,1) 100%)",
                "border-radius": "48px",
                "font-size": "32rpx",
            },
        };
    },
    methods: {
        /**
         * 多选选择标签
         */
        handleTagClickMultipleChoice(item) {
            const index = this.activeTagList.indexOf(item.id);
            if (index > -1) {
                if (this.activeTagList.length === 1) return;
                this.activeTagList.splice(index, 1);
            } else {
                this.activeTagList.push(item.id);
            }
        },
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
            this.$u.toast("图片上传失败！");
        },
        /**
         * 选择标签
         */
        handleTagClick(item) {
            this.activeTag = item.id;
        },
        /**
         * 提交
         */
        handleSubmitFeedback() {
            if (this.$u.test.isEmpty(this.content)) {
                this.$u.toast("请填写反馈意见！");
                return false;
            }
            if (this.orderInfo && this.orderInfo.orderId) {
                this.addLawyerComment();
                console.log("here");
                return;
            }

            const params = {
                userid: this.userInfo.id,
                phone: this.userInfo.phone,
                name: this.userInfo.name,
                ids: [this.activeTag],
                content: this.content,
                pic_urls: this.uploadImg || [],
            };
            this.$u.api.submitFeedback(params).then((res) => {
                this.showPopup = true;
            });
        },
        addLawyerComment() {
            const lawyerParams = {
                labels: this.activeTagList
                    .map((item, index) => this.tagsLawyer[item - 1].name)
                    .join(","),
                comment: this.content,
                userId: this.userInfo.id,
                files: JSON.stringify(this.uploadImg || []),
                unitId: getApp().globalData.unitId,
                productId: this.orderInfo.productId,
                orderId: this.orderInfo.orderId,
                hasAnonym: this.hasAnonym ? 1 : 0, //是否匿名 0 1
            };
            console.log(
                lawyerParams,
                "lawyerParams",
                this.$u.api.addLawyerComment
            );
            this.$u.api.addLawyerComment(lawyerParams).then(() => {
                
                this.handleBackHome();
                setTimeout(()=>{
                    this.$u.toast('评价成功')
                },100)
            });
        },
        /**
         * 返回首页
         */
        handleBackHome() {
            uni.showTabBar({});
            uni.switchTab({
                url: "/pages/home/index",
            });
        },
    },
    onShareAppMessage() {
        // 分享埋点
        //1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
    },
    onLoad(opt) {
        const { orderInfo, isLawyer } = opt;
        this.isLawyer = isLawyer ? true : false;
        if (orderInfo) this.orderInfo = JSON.parse(orderInfo);
        // wx.updateShareMenu({
        // 	withShareTicket: true,
        // 	isPrivateMessage: true,
        // 	activityId: getApp().globalData.activityId,
        // 	success:res=>{
        // 		console.log(res)
        // 	},
        // 	fail: err =>{
        // 		console.log(err)
        // 	}
        // })
    },
    onShow() {
        this.userInfo = uni.getStorageSync("user-info");
        this.$u.mpShare.title = getApp().globalData.relay_title;
        this.$u.mpShare.desc = getApp().globalData.relay_desc;
        wx.setNavigationBarTitle({
            title: getApp().globalData.web_title,
        });
    },
};
</script>

<style lang="less" scoped>
.advice-submit-page {
    padding-top: 28upx;
    margin-bottom: 60upx;
    box-sizing: border-box;

    .part {
        padding: 0 40upx;
        box-sizing: border-box;

        &:not(:first-child) {
            margin-top: 60upx;
        }

        &.image-part {
            margin-top: 48upx;
        }

        .title {
            font-size: 32upx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: Medium;
            color: #131415;
        }

        .tag-list {
            display: flex;
            flex-wrap: wrap;

            .tag {
                flex: 0 0 200upx;
                background-color: rgba(33, 99, 224, 0.1);
                height: 72upx;
                border-radius: 10upx;
                text-align: center;
                font-size: 28upx;
                line-height: 72upx;
                color: rgba(101, 108, 116, 1);
                justify-content: space-between;
                margin-right: 24upx;
                margin-top: 24upx;

                &:nth-child(3) {
                    margin-right: 0;
                }

                &.active {
                    color: #ffffff;
                    background: linear-gradient(
                        270deg,
                        #4aa2ff 0%,
                        #2163e0 100%
                    );
                }
            }
        }

        .textarea-input {
            margin-top: 20upx;
        }

        .image-wrap {
            margin-bottom: 20upx;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
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
                    background-color: rgba(0, 0, 0, 0.4);
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
                    color: #9ba0a4;
                    font-size: 26upx;
                    font-family: PingFangSC-Regular, PingFang SC;
                }
            }
        }
    }

    .note-wrap {
        text-align: center;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        // margin-top: 200upx;

        .text {
            font-size: 26upx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: Regular;
            color: #9ba0a4;
            margin-right: 4upx;
        }

        image {
            width: 72upx;
            height: 64upx;
            vertical-align: text-top;
        }
    }

    .btn-wrap {
        margin-top: 24upx;

        &.back-home {
            margin-top: 150upx;
        }
    }

    .content-wrap {
        width: 662upx;
        height: 876upx;
        margin: 28upx auto 0 auto;
        padding: 68upx 94upx;
        background-image: url("https://public-file.aegis-info.com/ilawpush_wxmini/icon/pic_envelope@2x.png");
        background-repeat: no-repeat;
        background-size: cover;

        .text {
            color: rgba(19, 20, 21, 1);
            font-size: 26upx;
            font-weight: Medium;
            font-family: PingFangSC-Medium, PingFang SC;
            line-height: 36upx;
        }

        .line-1 {
            margin-bottom: 24upx;
        }

        .shenfen-box {
            width: 100%;
            display: flex;
            margin-top: 48upx;
            justify-content: flex-end;
            align-items: center;
            align-content: center;

            .header {
                flex: 0 0 60upx;
                margin-right: 16upx;

                image {
                    width: 60upx;
                    vertical-align: middle;
                }
            }

            .user-info {
                font-size: 18upx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #131415;
                line-height: 26upx;

                .name {
                    font-size: 22upx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: Medium;
                    color: #131415;
                }
            }
        }
    }
}
</style>
