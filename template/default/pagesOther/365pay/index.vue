<template>
    <view class="pay-container">
        <view class="tips" v-if="showTips">
            您有一个尚未使用的文书生成权益，点击<text style="color:#08A8EE"  @click="useRight">立即使用</text>
        </view>
        <view class="">
            <swiper
                class="swiper"
                duration="500"
                :autoplay="play"
            >
                <swiper-item>
                    <image
                        class="banner"
                        :src="productInfo.picUrl"
                        mode="widthFix"
                    ></image>
                </swiper-item>
            </swiper>
        </view>
        <view class="content ">
            <view class="title">
                <!-- <view>
                    {{productInfo.name}}
                </view> -->
                <!-- <view class="title-right">
                    已售3223次
                </view> -->
            </view>

            <view class="center">
                <view class="center-title">
                    <!-- 服务内容: -->
                </view>
                <view
                    class="center-container"
                    v-html="productInfo.serviceContent"
                >
                </view>
                <text class="center-text">已售{{productInfo.spuSales}}次</text>
            </view>
            <Xaddress :messageInfo="messageInfo" @callPhone="callPhone" />
            <OrderEstimate
                :list="commentList"
                :name="productInfo.name"
                :spuId="spuId"
                showMore
				@toCommentPage="toCommentPage"
            />
            <view
                class="btn-wrapper"
                @click="payCard"
            >
                <view class="pay">{{spuId ==119 ? '选择文书' : '立即购买'  }}</view>
            </view>
            <u-popup
                v-model="skuDialog"
                mode="bottom"
                border-radius="14"
            >
                <view class="sku-popup">
                    <view class="skuTitle">
                        {{productInfo.name}}
                        <image
                            class="icon-close"
                            @click="closeDialog"
                            src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_5973431a-9703-4b07-87bd-2c5600a8b238.png"
                            alt=""
                        >
                    </view>
                    <view class="sku-content">
                        <view class="serveTime-select">
                            <view class="desc">
                                选择咨询时长
                            </view>
                            <view class="minute">
                                <image
                                    src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_7dc175c9-d3ad-40ba-8bbb-8aa2e2b74b35.png"
                                    @click="reduceTime"
                                ></image>
                                {{productInfo.priceInfo[timePosition].serviceTime}}分钟
                                <image
                                    src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220513_8df39928-32da-4310-9bc3-4cd905c2ede2.png"
                                    @click="addTime"
                                ></image>
                            </view>
                        </view>
                    </view>
                    <view
                        class="sku-buy"
                        @click="skuBuy"
                    >￥{{productInfo.priceInfo[timePosition].realPrice}}购买</view>
                </view>

            </u-popup>
        </view>
    </view>
</template>

<script>
import Xaddress from "../../wxcomponents/address/index.vue";
import config from '../../common/config'
import Log from '../../common/log'
import OrderEstimate from "../../wxcomponents/order-estimate/index.vue";
const straddleUrl = ['https://t-straddle-end.aegis-info.com', 'https://r-straddle-end.aegis-info.com', 'https://straddle-end.aegis-info.com']
const SPU_LIST = {
  CREATE_WRIT : 119,
  WRITE_WRIT: 120,
  VIDEO_CONSULT: 121,
  AUDIO_CONSULT: 122,
  IMAGE_TEXT_CONSULT: 123
}
export default {
    data() {
        return {
            pageConfig: { pageNum: 1, pageSize: 3 },
            expired: true, //咨询卡是否过期,
            showCardDialog: false,
            cardInfo: "",
            productId: "",
            productInfo: "",
            play: true,
            spuId: "",
            showTips:false,
            skuDialog: false,
            commentList: [],
            timePosition: 0,
            orderId:'', // 文书订单Id
            messageInfo: {
                title: "候朝辉律师",
                phone: "4006643088",
                lawyerNumber: "13101 2019 1008 8047",
                lawyerLocation: "北京京师（上海）律师事务所",
                callLocation: "上海市静安区恒丰路299号京师律师广场3层",
            },
            contractInfo:{
                kindId: '',
                contractId: ''
            }
        };
    },
    components: {
        Xaddress,
        OrderEstimate,
    },
    methods: {
        closeDialog(){
            Log.saveEvent('8', '点击[关闭]', 'click')
            this.skuDialog= false
        },
        toCommentPage(){
            Log.saveEvent('3', '点击[商品评价-查看更多]', 'click')
        },
        callPhone(){
            Log.saveEvent('2', '点击[立即拨号]', 'click')
        },
        useRight(){
			Log.saveEvent('1', '点击[立即使用]', 'click')
            if(this.contractInfo && this.contractInfo.kindId){
                this.$u.route({
                    url: 'pages/web-view/index',
        
                    params: {
                        path: `${straddleUrl[config.ENV]}/create-contract-block`,
                        platform: 'miniprogram',
                        company:'HouZhaoHui',
                        source: 'charge',
                        mp: '',
                        orderId:this.orderId,
                        userId: getApp().globalData.userId,
                        kindId: this.contractInfo.kindId,
                        contractId: this.contractInfo.contractId
                    }
                })
            }else{
                this.$u.toast('网络问题请稍后再试')
            }
        },
        getSpuComment(pageNumPlus) {
            if (pageNumPlus) this.pageConfig.pageNum++;
            const params = {
                unitId: getApp().globalData.unitId,
                spuId: this.spuId,
            };
            this.$u.api
                .getSpuComment(Object.assign({}, params, this.pageConfig))
                .then((res) => {
                    console.log(res, "res");
                    res.data.forEach((element) => {
                        if (element.files)
                            element.files = JSON.parse(element.files);
                        this.commentList.push(element);
                        console.log(this.commentList, "this.commentList");
                    });
                });
        },
        addTime() {
			Log.saveEvent('5', '点击[咨询时长+]', 'click')
            if (this.timePosition >= this.productInfo.priceInfo.length - 1) return;
            this.timePosition += 1;
        },
        reduceTime() {
			Log.saveEvent('6', '点击[咨询时长-]', 'click')
            if (this.timePosition <= 0) return;
            this.timePosition -= 1;
        },
        async getCardInfo() {
            const params = {
                spuId: this.spuId,
            };
            const { data } = await this.$u.api.getSpuDetail(params);
            console.log(data);
            this.productInfo = data;
            const res = await this.$u.api.getSkuListBySpuId(params);
            this.productInfo = { ...this.productInfo, priceInfo: res.data };
            console.log("product:");
            console.log(this.productInfo);
        },
        // 文书购买逻辑
        handleBuyWrit(){
            this.$u.route({
                url: 'pages/web-view/index',
                params: {
                    path: `${straddleUrl[config.ENV]}`,
                    platform: 'miniprogram',
                    company:'HouZhaoHui',
                    source: 'charge',
                    mp: '',
                    productId: this.productInfo.priceInfo[0].productId,
                    userId: getApp().globalData.userId
                }
            })
        },
        
        async payCard() {
            console.log(this.spuId)
            Log.saveEvent('4', '点击[立即购买]', 'click')
            try {
                if(+this.spuId === 119){
                    this.handleBuyWrit()
                    return
                }
                if (this.productInfo.priceInfo.length > 1) {
                    this.skuDialog = true;
                    return;
                }
                uni.redirectTo({
                    url: `./main?productId=${this.productInfo.priceInfo[0].productId}&name=${this.productInfo.name}&spuId=${this.spuId}&realPrice=${this.productInfo.priceInfo[0].realPrice}&orderServiceTime=${this.productInfo.priceInfo[0].serviceTime}`,
                });
            } catch (e) {}
        },
        cancelCard() {
            this.showCardDialog = false;
        },
        skuBuy() {
            Log.saveEvent('7', '点击[购买]', 'click')
            uni.redirectTo({
                url: `./main?productId=${
                    this.productInfo.priceInfo[this.timePosition].productId
                }&name=${this.productInfo.name}&realPrice=${
                    this.productInfo.priceInfo[this.timePosition].realPrice
                }&orderServiceTime=${
                    this.productInfo.priceInfo[this.timePosition].serviceTime
                }&spuId=${this.spuId}`,
            });
        },
        confirmCard() {
            this.showCardDialog = false;
            uni.redirectTo({
                url: `./main?productId=${this.productInfo.productId}&name=${this.productInfo.name}&realPrice=${this.productInfo.realPrice}`,
            });
        },
        bindpause() {
            this.play = true;
        },
        bindplay() {
            this.play = false;
        },
        async getUserInfoByOpenId(query) {
            return new Promise(async (resolve, reject) => {
                const { data } = await this.$u.api.getSsoInfo();
                // const userInfo = await uni.getStorageSync('user-info')
                getApp().globalData.userId = data.id;
                getApp().globalData.unionId = query.unionId;
                getApp().globalData.openId = query.openId;
                uni.setStorageSync("user-info", {
                    token: query.token,
                    name: data.nickname,
                    phone: data.phone,
                    openid: query.openId,
                    unionid: query.unionId,
                    header: data.icon,
                    id: data.id || "",
                    icon: data.icon,
                    nickName: data.nickname,
                });
                resolve();
            });
        },
        getPageMessage(){
            let pageInfo = {
                name: '',
                code: ''
            }

            switch (Number(this.spuId)) {
                case SPU_LIST.CREATE_WRIT:
                    pageInfo = {
                        name: '文书生成',
                        code: 9
                    } 
                    break;
                case SPU_LIST.WRITE_WRIT:
                    pageInfo = {
                        name: '文书撰写',
                        code: 10
                    } 
                    break;
                case SPU_LIST.VIDEO_CONSULT:
                    pageInfo = {
                        name: '视频咨询',
                        code: 7
                    } 
                    break;
                case SPU_LIST.AUDIO_CONSULT:
                    pageInfo = {
                        name: '语音咨询',
                        code: 6
                    } 
                    break;
                case SPU_LIST.IMAGE_TEXT_CONSULT:
                    pageInfo = {
                        name: '图文咨询',
                        code: 8
                    } 
                    break;
                default:
                    break;
            }
            this.$store.commit('setPagerInfo', {
                name: pageInfo.name,
                code: pageInfo.code,
                url: '/pages/serve/index'
            });
        }
    },
    onShareAppMessage() {
		Log.saveEvent('-2', '分享', 'click')
    },
    onShow(){
        this.getPageMessage()
        Log.saveEvent('0', '加载页面', 'onShow');
    },
    onUnload(){
        Log.saveEvent('-1', '离开页面', 'onUnload');
    },
    async onLoad(option) {
        if(option.orderId){
            if(option.orderType == '8'){
                this.showTips = true
                this.contractInfo.contractId = option.contractId || ''
                this.contractInfo.kindId = option.kindId || ''
            } 
            this.orderId = option.orderId
        } 
        this.spuId = option.spuId || query.spuId;
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
        const query = await wx.getLaunchOptionsSync().query;
        getApp().globalData.skipToken = query.token || "";
        if (getApp().globalData.skipToken) {
            try {
                await this.getUserInfoByOpenId(query);
                // this.getCardInfo()
            } catch (e) {
                console.log(e);
            }
        } else {
            this.getCardInfo();
            this.getSpuComment();
        }
    },
};
</script>

<style lang="less" scoped>
.pay-container {
    padding-bottom: 123upx;
    background-color: #ffffff;
    min-height: 100vh;
    // padding: 0 20upx;
    position: relative;
    bottom: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    .tips{
        position: absolute;
        top: 0;
        z-index:1000;
        background-color: #FCF5EB;
        height: 100upx;
        line-height: 100upx;
        width: 100%;
        color: #E5A544;
        padding: 0 10upx;
    }
    .swiper {
        // height: 236upx;
        width: 100%;
    }
    .banner {
        width: 100%;
        // height: 236upx;
    }
    .video {
        width: 100%;
        height: 252upx;
    }
    .content {
        padding: 0 20upx;

        .title {
            color: #28354a;
            font-size: 36upx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title-right {
                font-size: 32upx;
            }
        }
    }
    .btn-wrapper {
        width: 100%;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        padding-bottom: 40upx;
        // padding-bottom: env(safe-area-inset-bottom);
        // margin-bottom: env(safe-area-inset-bottom);

        text-align: center;
        background: #fff;

        .pay {
            height: 80upx;
            width: 400upx;
            margin: 30upx auto 0 auto;
            line-height: 80upx;
            border-radius: 8upx;
            color: #ffffff;
            background-color: #2e4e6f;
        }
    }
    .center {
        position: relative;
        .center-title {
            font-size: 30upx;
            color: #c77137;
            margin: 20upx 0;
        }
        .center-container {
            font-size: 26upx;
        }
        .content-desc{
            margin: 12upx 0;
        }
        .center-text{
            position: absolute;
            display: inline-block;
            z-index: 999;
            top: 15upx;
            right: 20upx;
            color: #C77137;
        }
    }
}
.active-card {
    width: 560upx;
    height: 340upx;
    text-align: center;
    font-size: 30upx;
    .title {
        height: 60upx;
        line-height: 60upx;
    }
    .container {
        height: 200upx;
        padding: 30upx 60upx;
        text-align: justify;
        border-bottom: 2upx #ccc solid;
        word-wrap: break-word;
        text-justify: inter-ideograph;
    }
    .bottom {
        display: flex;
        align-items: center;
        width: 100%;
        height: 80upx;
        .code-text {
            display: inline-block;
            color: #3565e6;
            width: 50%;
            text-align: center;
        }
    }
}
.sku-popup {
    padding: 20upx 20upx 40upx 20upx;
    .skuTitle {
        text-align: center;
        position: relative;
        color: #2e4e6f;
        height: 80upx;
        line-height: 80upx;
        border-bottom: 2upx solid #ebebeb;
        .icon-close {
            width: 48upx;
            height: 48upx;
            position: absolute;
            right: 10upx;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .sku-content {
        min-height: 300upx;
        position: relative;
    }
    .serveTime-select {
        position: absolute;
        transform: translateX(-50%) translateY(-50%);
        left: 50%;
        top: 50%;
        white-space: nowrap;
        display: flex;
        align-items: center;
        .desc {
            margin: 0 20upx;
        }
    }
    .sku-buy {
        width: 100%;
        height: 88upx;
        border-radius: 8upx;
        line-height: 80upx;
        background-color: #2e4e6f;
        color: #ffffff;
        text-align: center;
    }
}
.minute {
    display: flex;
    align-items: center;
    image {
        width: 34upx;
        height: 34upx;
        margin: 0 10upx;
    }
}
</style>
