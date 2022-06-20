<template>
    <view class="qa-question-page">
        <scroll-view
            :scroll-y="true"
            :scroll-top="scrollTop"
            scroll-with-animation="true"
            class="scroll-wrap"
        >
            <view class="title-con">
                <view class="title">聊天咨询</view>
                <view class="explain">侯律师为您提供最专业的解答</view>
            </view>
            <view

                id="ScrollBox"
                :style="{'padding-bottom':  showMoreEmoji ? '260px' : '114px' }"
            >
                <view
                    v-for="(item, index) in askList"
                    v-show="item.messageType != 5"
                    :key="index"
                    :class="
                        item.isCustomer == 1
                            ? 'question-box box'
                            : 'answer-box box'
                    "
                >
                    <!-- 自己信息 -->
                    <view
                        class="box-content"
                        v-if="item.isCustomer === 1"
                    >
                        <view
                            v-if="item.messageType == 2 && item.fileUrl"
                            class="box-content image-content"
                        >
                            <image
                                :src="item.fileUrl"
                                mode="widthFix"
                                @click="preview(item.fileUrl)"
                            ></image>
                        </view>
                        <text
                            v-if="item.messageType == 1"
                            class="text"
                        >{{
                            item.messageContent
                        }}</text>
                        <view
                            v-if="item.messageType == 4"
                            class="text"
                        >
                            <view>商品类型：
                                {{ item.messageBody.type }}</view>
                            <view>下单时间：
                                {{ item.messageBody.time }}</view>
                            <view>付款金额：
                                {{ item.messageBody.amount }}</view>
                        </view>
                        <view v-if="item.messageType == 3">
                            <image
                                class="img-label file-label"
                                src="https://public-file.aegis-info.com/ilawpush_wxmini/common/file.png"
                                @click="handleDownloadFile(item.fileUrl)"
                            ></image>
                        </view>
                        <view
                            v-if="item.messageType == 11"
                            class="cause-con"
                        >
                            <view class="title">{{ item.messageBody.name }}</view>
                            <view class="text">用户： {{ item.messageBody.userName }}</view>
                            <view class="text">提交时间 {{ item.messageBody.time }}</view>
                            <view class="line"></view>
                            <view
                                class="text"
                                v-for="(item1,index1) in item.messageBody.list"
                                :key="index1"
                            >
                                {{index1+1}}{{item1.q}}{{item1.a.join('、')}}
                            </view>
                        </view>
                        <view
                            v-if="item.messageType == 12"
                            @click="handlePlayVoice(item.messageBody.url)"
                        >
                            <view class="voice-long">
                                <text class="voice-duration">{{ item.messageBody.time }}</text>
                                <text class="voice-duration">"</text>
                                <image
                                    src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice_icon%402x.png"
                                    class="voice-icon"
                                ></image>
                                <view class="text">{{ item.messageBody.text }}</view>
                            </view>
                        </view>
                        <view v-if="item.messageType == 14" class="text-label">
                                <appointMentComponent @setOrderInfo="setOrderInfo" :isAppointed="isAppointed"/>
                            </view>
                        <view v-if="item.messageType == 13">
                            <view class="text">预约成功
                                <br>
                                {{ item.messageBody.startTime }}~
                                <br>
                                {{item.messageBody.endTime}}
                            </view>
                        </view>
                    </view>
                    <view
                        class="header-image user-header"
                        v-if="item.isCustomer === 1"
                    >
                        <image :src="userInfo.header"></image>
                    </view>
                    <!-- 客服信息 -->
                    <view
                        class="box-content answer-content chat-content"
                        v-if="item.isCustomer === 0"
                    >
                        <image
                            class="seat-icon"
                            src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220602_b1a1a809-6f44-46dd-a75a-5f4ffa473e02.png"
                        ></image>
                        <view :class="
                                item.isImg || item.isFile
                                    ? 'chat-message-box'
                                    : 'chat-message-box u-border'
                            ">
                            <view v-if="item.messageType == 2">
                                <image
                                    class="img-label"
                                    :src="item.fileUrl"
                                    mode="widthFix"
                                    @click="preview(item.fileUrl)"
                                ></image>
                            </view>
                            <view v-else-if="item.messageType == 3">
                                <image
                                    class="img-label file-label"
                                    src="https://public-file.aegis-info.com/ilawpush_wxmini/common/file.png"
                                    @click="handleDownloadFile(item.fileUrl)"
                                ></image>
                            </view>
                            <view
                                v-else-if="item.messageType == 6"
                                class="meet-con"
                                @click="enterRoom(item.messageBody,item.sender)"
                            >
                                <p class="meet-name">
                                    <u-icon name="calendar-fill"></u-icon>
                                    {{ item.messageBody.name}}
                                </p>
                                <p class="meet-time">
                                    {{ item.messageBody.time}}
                                </p>
                                <p class="meet-time">
                                    房间号:
                                    {{ item.messageBody.roomId}}
                                </p>
                                <p class="meet-content">
                                    会议内容：
                                    {{ item.messageBody.content}}
                                </p>
                            </view>
                            <!-- 7案情卡 -->
                            <!-- 8律师底稿 -->
                            <!-- 9语音信息 -->
                            <!-- 10订单结束 -->
                            <view
                                v-else-if="item.messageType == 12"
                                @click="handlePlayVoice(item.messageBody.url)"
                            >
                                <view class="voice-long">
                                    <text class="voice-duration">{{ item.messageBody.time }}</text>
                                    <text class="voice-duration">"</text>
                                    <image
                                        src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220530_e809925f-b4f9-4c90-b801-28fa339fa2dd.png"
                                        class="voice-icon"
                                    ></image>
                                    <view class="text">{{ item.messageBody.text }}</view>
                                </view>
                            </view>
                            <!-- 13预约信息 -->
                            <view
                                v-else-if="item.messageType == 14"
                                class="text-label"
                            >
                                <appointMentComponent @setOrderInfo="setOrderInfo" :isAppointed="isAppointed"/>
                            </view>
                            <view v-else-if="item.messageType == 13">
                                <view class="text">预约成功
                                    <br>
                                    {{ item.messageBody.startTime }}~
                                    <br>
                                    {{item.messageBody.endTime}}
                                </view>
                            </view>
                            <view
                                v-else
                                class="text-label"
                            >
                            {{
                                item.messageContent
                            }}</view>
                        </view>
                    </view>
                    <!-- 1文本信息提示 -->
                    <view
                        v-if="item.guideMsgType == 1"
                        class="tip-content"
                    >
                        <view class="tip-text">{{ item.text }}</view>
                    </view>
                    <!-- 2案由表 -->
                    <view
                        v-if="item.guideMsgType == 2"
                        class="tip-content"
                    >
                        <view class="tip-text">{{ item.text }}</view>
                        <view
                            v-if="caseList.length"
                            class="case-con"
                        >
                            <view
                                :class="['case-item', item1.id == chooseCase.id ? 'active' : '']"
                                v-for="item1 in caseList"
                                :key="item1.id"
                                @click="choose(item1)"
                            >
                                {{item1.name}}
                            </view>
                        </view>
                        <u-loading
                            mode="flower"
                            v-else
                        ></u-loading>
                    </view>
                    <!-- 3 案由连接 -->
                    <view
                        v-if="item.guideMsgType == 3"
                        class="tip-content"
                        @click="enterlegal(item.urlId)"
                    >
                        <view class="tip-text case-link">{{ item.text }}</view>
                    </view>
                    <!-- 4商品信息 -->
                    <view
                        v-if="item.guideMsgType == 4"
                        :class="Number(spuId)===123?'header-img':Number(spuId)===122?'header-audio':'header-video'"
                        @click="toProductDetail()"
                    >
                    </view>
                    <!-- 5订单评价 -->
                    <view
                        @click="toComment"
                        v-if="item.guideMsgType == 5"
                        class="tip-content"
                    >
                        <!-- css换行会报错 -->
                        <view class="box-content answer-content card-content u-border">
                            <view class="card-header">
                                <view class="card-info">
                                    <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa-header-icon@2x.png"></image>
                                    <text>订单评价</text>
                                </view>
                                <view class="bottom-border"></view>
                            </view>
                            <view class="text-box">
                                <view class="card-text u-line-3 ellipsis2">
                                    请您对我们的订单进行评价，谢谢
                                </view>
                                <view
                                    class="card-btn-all"
                                    style="margin-top:15upx;"
                                >
                                    <text>立即评价</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- end 问答区域-->
                </view>
            </view>
        </scroll-view>
        <view class="bottom-wrap" v-if="!isComplete">
            <view class="relate-question"> </view>
            <view class="input-wrap">
                <view class="input-box">
                    <view class="left-icon">
                        <image
                            :src="inputType"
                            :class="isRecord ? 'text-input' :''"
                            mode="widthFix"
                            alt=""
                            @click="handleChangeInputType()"
                        ></image>
                    </view>
                    <view
                        class="input"
                        v-if="!isRecord"
                    >
                        <u-input
                            v-model="inputText"
                            input-align="left"
                            :clearable="false"
                            :disabled="
                                (reachLimit && isHuman) || payConsulteServiceEnd
                            "
                            placeholder="请输入您要咨询的问题"
                            maxlength="120"
                            @click="handleTouchInput"
                            placeholder-style="color: #65799B;font-size:26rpx;"
                        ></u-input>
                    </view>
                    <view
                        class="input"
                        v-else
                    >
                        <view
                            class="voice-text"
                            @click="handleInVoice()"
                        >{{
                                inVoice
                                    ? durationTime + "秒"
                                    : "点击&nbsp;&nbsp;说话"
                            }}
                        </view>
                    </view>
                    <view class="right-icon">
                        <image
                            v-if="!isRecord"
                            :src="
                                inputText
                                    ? 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/send-en@2x.png'
                                    : 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/send@2x.png'
                            "
                            class="send-icon"
                            @click="handleInput(1, inputText)"
                        ></image>
                        <image
                            src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220601_8bfc5c03-5da6-4b18-8c1b-2dc74aab598d.png"
                            @click="handleMoreEmoji"
                            class="plus-icon"
                        >
                        </image>
                        <image
                            src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/more@2x.png"
                            @click="handleMoreFeature()"
                            class="plus-icon"
                            style="margin: 0 20rpx"
                        ></image>
                        
                        <!-- <image src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220518_ba4fe954-1794-4d6a-be78-9b2403e2f89a.png"
                            @click="handleMoreEmoji"
                            class="plus-icon"
                        ></image> -->
                    </view>
                </view>
            </view>
            <view
                class="upload-view-wrap"
                v-if="showMoreFeature"
            >
                <u-upload
                    :custom-btn="true"
                    :max-count="1"
                    :show-progress="false"
                    :deletable="false"
                    :show-upload-list="false"
                    :preview-full-image="false"
                    :action="uploadAction"
                    :before-upload="handleBeforeUpload"
                    @on-success="handleUploadSuccess"
                >
                    <view
                        slot="addBtn"
                        class="upload-item"
                    >
                        <image
                            src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/upload_img@2x.png"
                            mode="widthFix"
                            alt=""
                        ></image>
                        <view class="label">图片</view>
                    </view>
                </u-upload>
            </view>
            <view
                class="upload-view-wrap-1"
                v-if="showMoreEmoji"
            >
                <scroll-view  :enhanced="true" :paging-enabled="true" style="width:100%;white-space:nowrap;text-align:center;height:380upx;padding-bottom:30upx" :scroll-x="true" >
                    <!-- <view class="emoji-content" :style="{'width': emojiArr.length* emojiWidth + 'px' }"> -->
                      <view v-for="(emoji,index) in emojiArr" style="width:100%;display:inline-block;white-space:normal;height:380upx;vertical-align:top" :key="index">
                        <text
                            class="emoji-text"
                            v-for="(item,i) in emoji"
                            @click="changeInput(item.substring(0,2))"
                            :key="i"
                        >
                            {{item.substring(0,2)}}
                        </text>
                      </view>
                    <!-- </view> -->
                </scroll-view>
                <!-- <view class="emoji-step">
                    <u-icon
                        class="icon"
                        name="arrow-left"
                        @click="changeStep('pre')"
                        size="28"
                    ></u-icon>
                    <u-icon
                        class="icon"
                        name="arrow-right"
                        @click="changeStep('next')"
                        size="28"
                    ></u-icon>
                </view> -->
            </view>
        </view>
        <u-top-tips ref="uTips"></u-top-tips>
        <view
            v-if="isRecord && inVoice"
            class="in-voice"
        >
            <image
                src="https://public-file.aegis-info.com/ilawpush_wxmini/common/listen.gif"
                mode="widthFix"
                alt=""
                class="listen"
            ></image>
            <view
                class="stop-text"
                @click="handleStopInVoice()"
            >
                <text>点击结束</text>
            </view>
        </view>
    </view>
</template>

<script>
import config from "../../common/config.js";
import rsaDecryptWay from "../../common/rsa-decryption.js";
import { emojiData } from "./emoji.js";
import Log from "../../common/log.js";
import appointMentComponent from "../components/appointMentComponent/index.vue";
import WebSocket from "../../common/socket.js";
// import xForm from './form.vue';
// import VLeaveMessage from './leave-message/index.vue';

const plugin = requirePlugin("WechatSI");
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
const RegImg = /\.(png|jpe?g|gif|svg)(\?.*)?$/; // 校验是否为图片类型
const MaxVoiceDuration = 30; // 录音最大时长控制
const EMOJI_DATA = 42;

export default {
    data() {
        return {
            isComplete: false,
            isCreated: false, // 是否付款进入，需创建订单信息
            orderType: 0, // 订单类型
            askCount: 6, // 剩余咨询次数
            productId: "", // 商品id
            spuId: "", // 商品SPUid
            setTimeInteval: null, // 轮询
            sendLoading: false,
            userInfo: "",
            initOrderId: "", //订单id 以这个为准
            isPreview: false, // 是否出发预览文件
            eventId: "", // 机构id
            source: "", // source 渠道
            caseList: [], // 案由列表
            chooseCase: {}, // 选中案由
            subjectId: "",
            qaList: [],
            emojiArr: [],
            showMoreEmoji: false,
            amount: "",
            is_AudioPlay: true, // 是否播放录音
            serviceTime: "", //服务时间
            isAppointed: false, // 预约

            /* 旧数据 */
            type: "", // 类型
            recommendData: [], // 推荐问题
            dateVal: "", // 时间分割线
            askList: [], // 问答数据
            content: "", // 调用小法问答接口
            qId: "", // 当前的qId
            scrollTop: 0, // 滚动高度
            relateData: [], // 你可能想
            isHuman: false, // 是否为IM
            inputText: "", // 输入文本
            socket: null, // websocket对象
            uploadAction: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
            socketConfig: {
                url: config.domain.wss_im_domain, // 服务器地址
                limit: 5, // 心跳最大连接数
            },
            lawyerId: 0, // 律师id
            receiveRole: "", // 接收消息的用户角色
            lockReconnect: false, // 是否进行断线重连
            timer: null, // setTimeout 对象
            level1: "", // 法律专题
            level2: "", // 二级法律专题
            riskId: "", // 诉讼风险评估id
            topicId: "", // 法律专题id
            historyList: [], // 历史记录
            tempHistoryList: [], // 历史记录数据-临时变量
            isRecord: false, // 是否语音录入方式
            inVoice: false, // 是否正在录音中
            setTimeOutObj: null,
            orderInfo: null,
            voiceDuration: 0, // 显示语音时长
            durationTime: 0, // 录音时长
            voiceModel: {
                filePath: "", // 临时文件地址
                duration: 0, // 语音长度
                result: "", // 语音识别内容
            }, // 语音文件
            showMoreFeature: false, // 是否显示更多功能窗口
            isReconnecting: false, // 是否重连IM
            recommendPager: 1, // 推荐问题分页计数
            temp_into_content: "", // 临时使用 页面进入的content
            temp_page_into: false, // 临时使用 页面进入是否渲染，暂时没有方案解决进入页面onshow执行两次的情况
            reachLimit: false, // 是否触及到IM咨询次数限制
            askAnswerCount: 0, // 提问的次数
            showPopup: false,
            phone: "", // 授权号码
            paidOrderId: "", // 订单id
            customerServiceType: "1", // 0对应的是法律客服咨询。1对应的是普通人工服务
            payResult: "", // 记录是否从支付成功的页面返回的
            payConsulting: false,
            payConsulteServiceEnd: false, // 付费咨询服务已结束标识
            payStartConsult: "",
            pageSize: 0,
            position: 0,
            showMoreEmoji: false,
            emojiWidth: ''
        };
    },
    components: {
        // xForm,
        // VLeaveMessage
        appointMentComponent,
    },
    filters: {
        showText(value, type) {
            if (value) {
                const obj = JSON.parse(value);
                return obj[type];
            }
            return "";
        },
    },
    methods: {
        setOrderInfo() {
            Log.saveEvent('3', '点击[预约时间]', 'click')
            let orderStr = "";
            switch (this.orderType) {
                case "1":
                    orderStr = "企业法律顾问";
                    break;
                case "2":
                    orderStr = "咨询卡";
                    break;
                case "3":
                    orderStr = "文书";
                    break;
                case "4":
                    orderStr = "图文咨询";
                    break;
                case "5":
                    orderStr = "电话咨询";
                    break;
                case "6":
                    orderStr = "视频咨询";
                    break;
                case "7":
                    orderStr = "文书撰写";
                    break;
                case "8":
                    orderStr = "文书生成";
                    break;
                default:
                    break;
            }
            this.orderInfo = {
                orderId: this.initOrderId,
                orderStr,
                productId: this.productId,
                spuId: this.spuId,
                serviceTime: this.serviceTime,
                userInfo: {
                    nickName: this.userInfo.nickName,
                    phone: this.userInfo.phone,
                    userRole: this.userInfo.userRole,
                    id: this.userInfo.id,
                    icon: this.userInfo.icon,
                },
            };
            uni.setStorageSync("orderInfo", JSON.stringify(this.orderInfo));

            console.log(this.orderInfo, "setOrderInfo");
        },
        changeInput(emoji) {
            this.inputText += emoji;
        },
        changeStep(step) {
            if (step === "pre") {
                if (this.position === 0) return;
                this.position -= 1;
                return;
            }
            if (this.position === this.pageSize) return;
            this.position += 1;
        },
        handleEmojiData() {
            const res = wx.getSystemInfoSync()
            this.emojiWidth = res.windowWidth
            this.pageSize = emojiData.length / EMOJI_DATA;
            for (let index = 0; index < this.pageSize; index++) {
                this.emojiArr.push(
                    emojiData.slice(
                        index * EMOJI_DATA,
                        (index + 1) * EMOJI_DATA
                    )
                );
            }
            console.log(this.emojiArr);
        },
        toComment() {
            console.log("toComment");
            const toUrl = "pagesOther/advice/index";
            const orderInfo = {
                productId: this.productId,
                orderId: this.initOrderId,
            };
            this.$u.route({
                url: toUrl,
                params: {
                    isLawyer: 1,
                    orderInfo: JSON.stringify(orderInfo),
                },
            });
        },
        toProductDetail() {
            //pagesOther/365pay/index
            //spuId=121视频
            //spuId=123图文咨询
            this.$u.route({
                url: "pagesOther/365pay/index",
                params: {
                    spuId: this.spuId || 123,
                },
            });
        },
        preview(url) {
            let imgList = [url];
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: imgList, // 需要预览的图片http链接列表
            });
        },
        /**
         * 判断是否登录
         */
        async isLogin() {
            // 从缓存获取用户登录信息
            const _userInfo = await uni.getStorageSync("user-info");
            this.userInfo = _userInfo;
        },

        /**
         * 语音录入
         */
        handleInVoice() {
            // Log.saveEvent("14", "点击[开始说话]");
            this.inVoice = true;
            this.voiceDuration = 0;
            manager.start({
                lang: "zh_CN",
            });
        },
        /**
         * 语音录入倒计时
         */
        setTimeoutVoice() {
            this.durationTime = this.durationTime + 1;
            this.voiceDuration = this.voiceDuration + 1;
            if (this.durationTime >= 15) {
                this.durationTime = 0;
                this.voiceDuration = 0;
                clearTimeout(this.setTimeOutObj);
                this.setTimeOutObj = null;
                this.handleStopInVoice();
                return;
            }
            // 开始计时, 30秒后停止
            this.setTimeOutObj = setTimeout(() => {
                this.setTimeoutVoice();
            }, 1000);
        },
        /**
         * 停止语音录入
         */
        handleStopInVoice() {
            // Log.saveEvent("15", "点击[结束说话]");
            this.inVoice = false;
            this.durationTime = 0;
            clearTimeout(this.setTimeOutObj);
            manager.stop();
        },
        /**
         * 显示更多功能
         */
        handleMoreFeature() {
            Log.saveEvent('6', '点击[输入框+号]', 'click')
            this.showMoreEmoji = false;
            this.showMoreFeature = !this.showMoreFeature;
        },
        handleMoreEmoji() {
            Log.saveEvent('7', '点击[表情包]', 'click')
            this.showMoreFeature = false;
            this.showMoreEmoji = !this.showMoreEmoji;
            this.$nextTick(() => {
                this.scrollBottom();
            });
        },
        /**
         * 点击输入框
         */
        handleTouchInput() {
            // Log.saveEvent("11", "点击[文字输入框]");
        },
        // 获取全部消息记录
        /*
	*messageType: type, //消息类型 1：纯文字 2：纯图片 3：附件信息 4：订单详情信息  5、语音/视频咨询详情信息
	6、会议信息 7、案情卡 8、律师底稿 9、语音信息 10、订单结束  11、订单收集表 12、语音信息 13、预约信息
	*guideMsgType: 1,// 1文本，2.案由表 3、跳转连接 4、商品信息 5、订单评价 6、预约信息选择器
     */
        async getMessageList() {
            const __temp = await this.isLogin();
            let res = await this.$u.api.getTalkRecordList({
                userId: this.userInfo.id,
                unitId: getApp().globalData.unitId,
            });
            const shouldUpdateAskList = this.shouldUpdateAskList(
                this.askList,
                res.data.reverse()
            );
            if (!shouldUpdateAskList) return;
            // 筛掉非本订单的结束订单、预约订单
            this.askList = res.data.filter(
                (item) =>
                    !(
                        Number(item.messageType) === 10 &&
                        Number(item.orderId) !== Number(this.initOrderId)
                    ) &&
                    !(
                        Number(item.messageType) === 13 &&
                        Number(item.orderId) !== Number(this.initOrderId)
                    ) &&
                    !(
                        Number(item.messageType) === 14 &&
                        Number(item.orderId) !== Number(this.initOrderId)
                    )
            );
            //过滤掉非此订单的结束消息
            this.askList = this.askList.map((item) => {
                let obj = item;
                if (item.messageBody) {
                    obj.messageBody = JSON.parse(item.messageBody);
                }
                return obj;
            });
            console.log("开始更新");
            this.$nextTick(() => {
                this.scrollBottom();
                this.$nextTick(()=>{
                    console.log('我执行了----')
                    // 发送初始化订单消息
                    setTimeout(()=>{
                        this.creatOrderMsg();
                    }, 500)
                    // 发送初始化消息
                    this.dealMsgData()
                    this.setOrderGuide();
                })
            });
        },
        creatOrderMsg() {
            if (this.isCreated) {
                let orderStr = "";
                switch (this.orderType) {
                    case "1":
                        orderStr = "企业法律顾问";
                        break;
                    case "2":
                        orderStr = "咨询卡";
                        break;
                    case "3":
                        orderStr = "文书";
                        break;
                    case "4":
                        orderStr = "图文咨询";
                        break;
                    case "5":
                        orderStr = "电话咨询";
                        break;
                    case "6":
                        orderStr = "视频咨询";
                        break;
                    case "7":
                        orderStr = "文书撰写";
                        break;
                    case "8":
                        orderStr = "文书生成";
                        break;
                    default:
                        break;
                }
                const parms = {
                    type: orderStr,
                    time: this.$u.timeFormat(
                        new Date().getTime(),
                        "yy-mm-dd hh:MM:ss"
                    ),
                    amount: this.amount,
                    orderType: this.orderType,
                    startTime: this.$u.timeFormat(
                        new Date().getTime(),
                        "yy-mm-dd hh:MM:ss"
                    )
                };
                this.handleInput(4, parms);
                this.isCreated = false;
            }
        },
        dealMsgData() {
            this.checkAppointSuccess(); //预约消息
            /* 电话视频咨询 不查询免费次数 */
            if ((this.orderType == "6" || this.orderType == "5")&&!this.isComplete) {
                this.checkHasOverMsg(); //结束消息
                const endTag = this.askList.find(item => {
                  return +item.messageType === 10 && +item.orderId === +this.initOrderId
                })
                if(!endTag) {
                  this.askList.push({
                      guideMsgType: 1,
                      text: `${
                        this.orderType == "5" ? "电话咨询" : "视频咨询"
                      }由律师发起，请先与律师确认时间`,
                  });
                  return;
                }
            }
            /* 图文咨询 不查询次数 */
            if (this.orderType == 4&&!this.isComplete) {
                this.getRestConsultCount();
                return;
            }
        },
        checkAppointSuccess() {
            const askList = this.askList.filter(
                (item) =>
                    item.orderId === this.initOrderId &&
                    Number(item.messageType) === 13 &&
                    Number(item.isCustomer) === 1
            );
            console.log(askList, "askList");
            this.isAppointed = askList.length > 0;
 
        },
        /* 
        比对 本地列表、接口列表最后一条 相同=>不更新，不同=>更新
         */
        shouldUpdateAskList(localAskList, remote) {
            if (localAskList.length === 0) {
                return true;
            }
            // 筛掉非本次订单提示的
            const filterAskList = localAskList.filter(
                (item) =>
                    !item.guideMsgType &&
                    Number(item.orderId) === Number(this.initOrderId)
                // String(item.orderId) === String(this.initOrderId) &&
            );
            // 本次订单无消息,更新
            if (filterAskList.length === 0) return true;
            const localLastMsg = filterAskList[filterAskList.length - 1];

            const isSameMsg = this.isSameMsg(
                localLastMsg,
                remote[remote.length - 1]
            );
            // 相同则不更新，不同则更新
            return !isSameMsg;
        },
        isSameMsg(localLastMsg, remoteMsg) {
            return localLastMsg.id === remoteMsg.id;
        },
        /* 是否有结束消息 */
        checkHasOverMsg() {
            const overMsg = this.askList.filter(
                (item) =>
                    String(item.orderId) === String(this.initOrderId) &&
                    Number(item.messageType) === 10
            );
            console.log(overMsg, "overMsg");
            if (overMsg.length === 0) return;
            this.askCount = 0;
            this.onAskCout0();
            return overMsg.length > 0;
        },

        /**
         * 输入框文本提交
         */
        async handleInput(type, otherData, cb) {
            Log.saveEvent('8', '点击[发送]', 'click')
            if (this.sendLoading || this.isComplete) {
                return;
            }
            console.log(type, otherData, cb, "type, otherData, cb");
            // Log.saveEvent("16", "点击[发送]");
            // 判断免费自选次数
            if (
                this.orderType == 4 &&
                this.askCount <= 0 &&
                Number(type) !== 13
            ) {
                this.$u.toast("咨询次数已耗尽");
                return;
            }
            let params = {
                orderId: this.initOrderId,
                // receiver:'392155',
                sender: this.userInfo.id,
                messageType: type,
                isCustomer: 1,
                unitId: getApp().globalData.unitId,
                source: "侯朝辉法律顾问",
            };
            if(type == 14 ){
              // params.receiver = this.userInfo.id
              // params.sender = ''
              // params.isCustomer = 0
              params = {...params, receiver: this.userInfo.id, sender:0, isCustomer: 0 }
            }
            switch (type) {
                case 1:
                    this.showMoreEmoji = false;
                    params.messageContent = otherData;
                    break;
                case 2:
                    params.fileUrl = otherData;
                    break;
                case 3:
                    params.fileUrl = otherData;
                    break;
                case 4:
                    params.messageBody = JSON.stringify(otherData);
                    break;
                case 6:
                    params.messageBody = JSON.stringify(otherData);
                    break;
                case 11:
                    params.messageBody = JSON.stringify(otherData);
                    break;
                case 12:
                    params.messageBody = JSON.stringify(otherData);
                    break;
                case 13:
                    params.messageBody = JSON.stringify(otherData);
                    break;
                case 14:
                    params.messageBody = JSON.stringify(otherData);
                    break;

                default:
                    break;
            }
            if (
                type == 1 &&
                this.$u.test.isEmpty(this.inputText) &&
                this.$u.test.isEmpty(this.voiceModel.result)
            ) {
                return;
            }
            this.sendLoading = true;
            console.log(params, "paramsparamsparams");
            this.$u.api
                .saveTalkRecord(params)
                .then((res) => {
                    console.log("here");
                    if (cb) cb();
                    this.sendLoading = false;
                    this.$u.toast("发送成功");
                    // 发送完收集表，发送预约表
                    if(type == 11){
                        this.handleInput(14, {})
                    }else {
                        this.getMessageList();
                    }
                    // 如果是咨询类，消息递减
                    if (
                        this.orderType == 4 &&
                        (params.messageType == 1 || params.messageType == 2 || params.messageType == 3 || params.messageType == 12)
                    ) {
                        this.$u.api
                            .reduceServerCount({ spuId: this.spuId })
                            .then((res) => {
                                this.askCount--;
                                if(this.askCount === 0) {
                                    this.askList.push({
                                        guideMsgType: 1,
                                        text: `咨询次数已用尽,请再次购买咨询服务`,
                                    });
                                    return
                                }
                                this.askList.push({
                                    guideMsgType: 1,
                                    text: `剩余${this.askCount}次机会，请详细描述问题再提问`,
                                });
                            });
                    }
                    this.inputText = "";
                })
                .catch((res) => {
                    this.sendLoading = false;
                });
        },
        onAskCout0() {
            if (this.askCount > 0) return;
            this.askList.push({
                guideMsgType: 1,
                text: `服务已结束，感谢您的使用`,
            });
            this.askList.push({
                guideMsgType: 1,
                text: `还要继续咨询？可以续费补单`,
            });
            this.askList.push({
                guideMsgType: 4,
            });
            this.askList.push({
                guideMsgType: 5,
            });
        },
        // 订单引导信息
        async setOrderGuide() {
            const filterAskList = this.askList.filter(
                (item) => !item.guideMsgType
            );
            // 因网络原因判断是否已存在
            const already = this.askList.filter(
                (item) =>
                    item.guideMsgType == 1 &&
                    item.text ==
                        "您好，我是侯律师的智能助理小法。为了避免浪费咨询机会，提高服务质量，请先向侯律师提供您的基本案情信息"
            );
            // 判断是否需要展示
            const index = filterAskList.length;
            if (
                index &&
                filterAskList[index - 1].messageType == 4 &&
                !already.length
            ) {
                this.askList.push({
                    guideMsgType: 1,
                    text: `您好，我是侯律师的智能助理小法。为了避免浪费咨询机会，提高服务质量，请先向侯律师提供您的基本案情信息`,
                });
                if (!this.caseList.length) {
                    const res = await this.$u.api.getCaseTopics();
                    if (res.data.hot_topics_ranked) {
                        this.caseList = res.data.hot_topics_ranked.reverse();
                    } else {
                        this.caseList = JSON.parse(
                            rsaDecryptWay.rsaDecrypt(res.data)
                        ).hot_topics_ranked.reverse();
                    }
                }
                this.askList.push({
                    guideMsgType: 2,
                    text: `请选择您要咨询的案由`,
                });
                if (this.subjectId) {
                    this.chooseCase.id = this.subjectId;
                    this.caseList.map((item) => {
                        if (item.id == this.subjectId) {
                            this.chooseCase.name = item.name;
                        }
                    });
                }
                // 如果已经选择，处理因轮询导致选择信息消息问题
                if (this.chooseCase.id) {
                    this.choose(this.chooseCase);
                } else {
                    this.$nextTick(() => {
                        this.scrollBottom();
                    });
                }
            }
        },
        // 选择路由
        choose(obj) {
            Log.saveEvent('1', `点击[咨询案由-${obj.name}]`, 'click')
            this.chooseCase = obj;
            this.askList.push({
                guideMsgType: 1,
                text: `您选择的是${this.chooseCase.name}`,
            });
            this.askList.push({
                guideMsgType: 1,
                text: `侯律师提前准备了[${this.chooseCase.name}]案件的案情信息收集表，请您如实填写。填写案情表不占用正式的咨询时长和咨询次数`,
            });
            this.askList.push({
                guideMsgType: 3,
                text: `${this.chooseCase.name}案情信息收集表`,
                urlId: this.chooseCase.id,
            });
            this.$nextTick(() => {
                this.scrollBottom();
            });
            // 处理从h5回来显示数据
            if (this.subjectId) {
                this.dealCaseData();
            }
        },
        // 案情收集表
        dealCaseData() {
            const data = {
                name: `${this.chooseCase.name}案情收集表`,
                time: this.$u.timeFormat(
                    new Date().getTime(),
                    "yy-mm-dd hh:MM:ss"
                ),
                userName: getApp().globalData.name,
                list: this.qaList,
            };
            this.handleInput(11, data);
            this.qaList = [];
            this.subjectId = "";
        },
        // 获取剩余咨询次数
        getRestConsultCount() {
            const checkHasOverMsg = this.checkHasOverMsg();
            if (checkHasOverMsg) return;
            const params = {
                spuId: this.spuId,
                userId: this.userInfo.id,
            };
            this.$u.api.getRestConsultCount(params).then((res) => {
                this.askCount = res.data;
                if(this.askCount !==0) {
                    this.askList.push({
                        guideMsgType: 1,
                        text: `剩余${this.askCount}次机会，请详细描述问题再提问`,
                    });
                }else{
                    this.askList.push({
                        guideMsgType: 1,
                        text: `咨询次数已用尽,请再次购买咨询服务`,
                    });
                }
                
                this.askCount === 0
                    ? this.askList.push({
                          guideMsgType: 1,
                          text: `请耐心您耐心等待律师回复`,
                      })
                    : null;

                // this.onAskCout0();
            });
        },
        // 进入会议
        enterRoom(obj,lawyerUserId) {
            Log.saveEvent('9', '点击[视频咨询入口]', 'click')
            if (obj) {
                console.log(this.userInfo);
                // let param = JSON.parse(obj);
                let param = obj;
                console.log(param,this.spuId);
                wx.navigateTo({
                    url: `/pagesOther/roomView/index?token=${this.userInfo.token}&userId=${this.userInfo.id}&streamId=${param.userStreamId}&recordId=${param.recordId}&roomId=${param.roomId}&spuId=${this.spuId}&lawyerUserId=${lawyerUserId}&unitId=${getApp().globalData.unitId}&consultType=1&source=侯朝辉法律顾问`,
                });
            } else {
                this.$u.toast("会议咨询数据有误");
            }
        },
        // 进入法律问诊
        enterlegal(id) {
            const param = {
                initOrderId: this.initOrderId,
                spuId: this.spuId,
                orderType: this.orderType,
                productId: this.productId,
            };
            wx.setStorageSync("orderMsg", JSON.stringify(param));
            wx.reLaunch({
                url: `/pagesOther/consultation-view/index?subjectId=${id}`,
            });
        },
        /**
         * 滚动到顶部
         */
        scrollTopTop() {
            this.scrollTop = 0;
        },
        /**
         * 滚动到底部
         */
        scrollBottom() {
            // #ScrollBox
            const query = uni.createSelectorQuery();
            query.select("#ScrollBox").boundingClientRect();
            // this.$nextTick(()=>{
            query.exec((res) => {
                this.scrollTop = res[0].height;
            });
            // })
            // const historyLength = this.historyList.length > 0 ? this.historyList.length : 1;
            // this.scrollTop = 600 * this.askList.length * historyLength;
        },

        /**
         * 点击图片
         */
        handleClickImg() {
            // Log.saveEvent("18", "点击[图片]");
            this.preview(item.text);
        },

        /**
         * 上传图片前校验
         */
        handleBeforeUpload(index, list) {
            console.log("list:", list);
        },
        /**
         * 上传图片成功后回调
         * @param {Object} data
         * @param {Object} index
         * @param {Object} lists
         */
        handleUploadSuccess(data, index, lists) {
            this.handleInput(2, data.data);
        },
        /**
         * 切换输入方式
         */
        handleChangeInputType() {
            if (this.orderType == 4 && 0 >= this.askCount) {
                this.$u.toast("咨询次数已耗尽");
                return;
            }
            if(this.isRecord){
              Log.saveEvent('4', '点击[切换麦克风]', 'click')
            }else{
              Log.saveEvent('5', '点击[切换键盘]', 'click')
            }
            this.isRecord = !this.isRecord;
        },
        /**
         * 初始化语音识别
         */
        initRecord() {
            const that = this;
            // 有新的识别内容返回，则会调用此事件
            manager.onRecognize = (res) => {
                console.log("新的识别内容", res);
            };
            // 正常开始录音识别时会调用此事件
            manager.onStart = (res) => {
                console.log("成功开始录音识别", res);
                this.setTimeoutVoice();
            };
            // 识别错误事件
            manager.onError = (res) => {
                this.$u.toast("录音识别失败", res);
            };
            // 识别结束事件
            manager.onStop = (res) => {
                wx.showLoading({
                    title: "语音识别中",
                    mask: true,
                });
                this.voiceModel.duration = res.duration;
                this.voiceModel.filePath = res.tempFilePath;
                this.voiceModel.result = res.result;
                if (this.$u.test.isEmpty(res.result)) {
                    wx.hideLoading();
                    this.$u.toast("听不清楚，请再说一遍！");
                    return;
                }
                wx.hideLoading();
                this.getUploadFileUrl(res.tempFilePath);
            };
        },
        async getUploadFileUrl(filePath) {
            let that = this;
            wx.uploadFile({
                url: `${config.domain.lawyer_domain}/xiaofa-manager/fileManagementApi/pic/upload`,
                filePath: filePath,
                name: "file",
                header: {
                    "Content-Type": "multipart/form-data",
                },
                success(uploadRes) {
                    const { data, code, msg } = JSON.parse(uploadRes.data);
                    uni.hideLoading();
                    if (code === 200) {
                        that.handleInput(12, {
                            time: that.voiceDuration,
                            url: data,
                            text: that.voiceModel.result,
                        });
                    } else {
                        that.$u.toast(msg || "上传失败");
                    }
                },
            });
        },
        /**
         * 录音播放功能
         */
        handlePlayVoice(path) {
            console.log(path);
            const InnerAudioContext = wx.createInnerAudioContext();
            if (wx.setInnerAudioOption) {
                wx.setInnerAudioOption({
                    obeyMuteSwitch: false,
                });
            } else {
                InnerAudioContext.obeyMuteSwitch = false;
            }
            InnerAudioContext.src = path;
            if (this.is_AudioPlay) {
                InnerAudioContext.play();
            } else {
                InnerAudioContext.stop();
            }
            this.is_AudioPlay = !this.is_AudioPlay;
        },
        /**
         * 文件打开
         * @param {Object} path 文件地址
         */
        handleDownloadFile(path) {
            // Log.saveEvent("19", "点击[附件]");
            console.log("path:", path);
            const _this = this;
            wx.downloadFile({
                url: path,
                success(res) {
                    wx.openDocument({
                        filePath: res.tempFilePath,
                        showMenu: true,
                        success(res) {
                            console.log(res);
                            _this.$u.toast("文件正在打开...");
                        },
                    });
                },
            });
        },
        sendAppointMsg() {
            let appointSuccessInfo = uni.getStorageSync("appointSuccessInfo");
            if (!appointSuccessInfo) return;
            appointSuccessInfo = JSON.parse(appointSuccessInfo);
            console.log(appointSuccessInfo, "appointSuccessInfo");
            const data = {
                startTime: appointSuccessInfo.startTime + ":00",
                endTime: appointSuccessInfo.endTime + ":00",
                orderId: this.initOrderId,
                orderType: this.orderType,
            };
            this.handleInput(13, data, () => {
                uni.removeStorageSync("appointSuccessInfo");
            });
        },
        /**
         * 判断网络情况
         */
        async checkNetwork() {
            const that = this;
            return new Promise((resolve, reject) => {
                uni.getNetworkType({
                    success(res) {
                        if (res && res.networkType !== "none") {
                            resolve(true);
                        } else {
                            that.$u.toast("网络获取失败，请开启网络连接！");
                            reject(false);
                        }
                    },
                    fail() {
                        that.$u.toast("网络获取失败，请开启网络连接！");
                        reject(false);
                    },
                });
            });
        },
        promiseFy(fn){
            return new Promise((resolve,reject)=>{
                // fn(resolve,reject)\
                resolve(fn)
            })
        }
    },
    mounted() {
        this.initRecord();
    },
    computed: {
        /**
         * 语音输入类型
         */
        inputType() {
            return this.isRecord
                ? "https://public-file.aegis-info.com/ilawpush_wxmini/icon/text_input@2x.png"
                : "https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice@2x.png";
        },
        userHeader() {
            return getApp().globalData.userHeader
                ? getApp().globalData.userHeader
                : "https://thirdwx.qlogo.cn/mmopen/vi_32/QKbgfE8mY901EfF3NUxx0jjJRZVUyaDnZ6s5VJickmOHvgUoNhKHmGIEZ4ViamPneblGowoO0LiaEVTYXrbvHXfMw/132";
        },
        phoneStr() {
            let phone = "";
            if (this.$u.test.isEmpty(this.phone)) {
                phone = "";
            } else {
                phone = this.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
            }
            return phone;
        },
    },
    async onLoad(opt) {
        // 结构直接进入问答页
        // getApp().globalData.eventId = opt.eventId;
        // 判断是否有未结束的工单
        // this.checkIMState();
        // this.$u.mpShare.title = getApp().globalData.relay_title;
        // this.$u.mpShare.desc = getApp().globalData.relay_desc;
        this.handleEmojiData();

        this.initOrderId = opt.orderId;
        this.spuId = opt.spuId;
        this.orderType = opt.orderType;
        this.productId = opt.productId;
        this.serviceTime = opt.serviceTime;
        this.isComplete = opt.isComplete ? true : false
        if (opt.qaList) {
            this.qaList = JSON.parse(opt.qaList);
            this.subjectId = opt.subjectId;
            const orderMsg = JSON.parse(wx.getStorageSync("orderMsg"));
            this.initOrderId = orderMsg.initOrderId;
            this.spuId = orderMsg.spuId;
            this.orderType = orderMsg.orderType;
            this.productId = orderMsg.productId;
            wx.removeStorageSync("orderMsg");
        }

        this.userInfo = await uni.getStorageSync("user-info");
        // 是否需要生成订单信息
        this.isCreated = opt.isCreated;
        this.amount = opt.amount;
        this.sendAppointMsg();
        // wx.setNavigationBarTitle({
        //   title: getApp().globalData.web_title
        // })
        wx.updateShareMenu({
            withShareTicket: true,
            isPrivateMessage: true,
            activityId: getApp().globalData.activityId,
            success: (res) => {
                console.log(res);
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },
    onHide() {
        // 清空store状态机
        console.log("hide into");
        // this.$store.commit('emptyState')
        this.setTimeInteval&&clearInterval(this.setTimeInteval);
        this.setInterval = null;
    },
    onUnload() {
        Log.saveEvent('-1', '离开页面', 'onUnload');
        this.setTimeInteval&&clearInterval(this.setTimeInteval);
        this.setInterval = null;
    },
    async onShow() {
        this.$store.commit('setPagerInfo', {
          name: '服务咨询页',
          code: '21',
          url: '/pageServe/imgTextConsult/index'
        });
        Log.saveEvent('0', '加载页面', 'onShow');
        this.getMessageList();
        this.setTimeInteval&&clearInterval(this.setTimeInteval);
        this.setInterval = null;
        this.setTimeInteval = setInterval(() => { 
            this.getMessageList();
        }, 15000);
        // 从支付页面返回取订单id
        this.paidOrderId = uni.getStorageSync("payOrderId");
        this.payResult = uni.getStorageSync("pay-result");
        // 商品页面-专业法律客服咨询
        this.payStartConsult = uni.getStorageSync("startConsultSign");
        // 订单详情中联系客服
        const contactCustomer = uni.getStorageSync("contactCustomer");
        this.sendAppointMsg();
    },
    /**
     * 分享
     */
    onShareAppMessage() {
      Log.saveEvent('-2', '分享', 'click')
    },
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
