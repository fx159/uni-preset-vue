<template>
    <view
        class="order-content"
        :style="showMore?'':'border:none'"
    >
        <view
            class="order-title"
            v-if="showTitle"
        >商品评价
            <view
                class="order-more"
                v-if="showMore"
                @click="toCommentPage"
            >查看更多 ></view>
        </view>
        <!-- ({{name}}) -->
        <view
            class="order-item"
            v-for="(item,index) in list"
            :key="index"
        >   
            <view class="list-item">
                <view class="list-left">
                    <image
                        :src="item.hasAnonym?'https://public-file.aegis-info.com/ilawpush_wxmini/user-header/9@2x.png':item.icon"
                        mode="widthFix"
                    />
                </view>
                <view class="list-right">
                    <view class="header">
                        <text class="type-1">{{item.hasAnonym?'匿名用户':item.nickName}}</text>
                        <text class="type-2">[{{item.productName||'-'}}]</text>
                        <!-- <text class="desc">{{item.labels||''}}</text> -->
                    </view>
                </view>
            </view>
            
            <view class="label-list"> 
                <text class="label-item" v-for="(i,index) in item.labels.split(',')" :key="index">
                    {{i || ''}}
                </text>
            </view>
            <view class="content">
                    {{item.comment||'-'}}
                </view>
                <view
                    class="img-wrapper"
                    v-if="item.files"
                >
                    <image
                        v-for="(it,picIndex) in item.files"
                        @click="preview(item,picIndex)"
                        :src="it"
                        :key="picIndex"
                    ></image>
                </view>
        </view>

    </view>
</template>

<script>
import UImage from "../../uview-ui/components/u-image/u-image";
export default {
    components: { UImage },
    props: {
        list: { type: Array },
        spuId: { type: String | Number },
        name: { type: String },
        showMore: { type: Boolean, default: false, required: false },
        showTitle: { type: Boolean, default: true, required: false },
    },
    data() {
        return {};
    },
    methods: {
        toCommentPage() {
            this.$emit('toCommentPage')
            this.$u.route({
                url: "pagesOther/commentList/index",
                params: { spuId: this.spuId, name: this.name },
            });
        },
        preview(item, index) {
            console.log(item, index, "fuck");
            if (!item.files) return;
            uni.previewImage({
                urls: item.files,
                current: item.files[index],
                success: () => {},
            });
        },
    },
    async mounted() {
        console.log(this.list, "OrderEstimate-list", this.showMore);
    },
};
</script>

<style lang="scss" scoped>
.order-content {
    margin: 30upx 0;
    display: flex;
    flex-direction: column;
    padding: 0 0 0 26upx;
    background-color: #fff;
    font-size: 30upx;
    border-radius: 3px;
    // border: 2upx solid rgba(39, 78, 140, 0.1);
    color: #2E4E6F;
    .order-title {
        display: flex;
        justify-content: space-between;
        height: 80upx;
        line-height: 80upx;
        font-size: 34upx;
        font-weight: 500;
        margin-right: 26upx;
    }
    .order-more{
        font-size: 26upx;
        font-weight: 500;
    }
    .order-item {
        // display: flex;
        // justify-content: space-between;
        padding: 10upx 12upx 20upx 0upx;
        box-sizing: border-box;
        // align-items: center;
    }
    .list-item{
        display: flex;
        align-items: center;
        
    }
    .list-right {
        flex: 1;
        border-radius: 6upx;
        padding: 10upx 6upx;
        font-size: 26upx;
        margin-left: 10upx;
        .header {
            display: flex;
            // align-items: center;
            flex-direction: column;
            .type {
                width: 150upx;
                white-space: nowrap;
                display: inline-block;
                text-align: left;
                padding: 4upx 10upx;
                // border-radius: 8upx;
                // color: #ffffff;
                // background-color: #2e4e6f;
                margin-right: 20upx;
            }
            .type-1{
                counter-reset: #113260;
            }
            .type-2{
                color: #C77137;
            }
            .desc {
            }
        }
        
    }
    .content {
            padding: 14upx 0;
            // color: #ffffff;
            // background-color: #2e4e6f;
            border-bottom: 2upx solid #EBEBEB;
            margin-top: 12upx;
    }
    .img-wrapper {
        margin-top: 20upx;
        image {
            margin-right: 8upx;
            width: 80upx;
            height: 80upx;
        }
    }
    .list-left {
        width: 80upx;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 20upx;
        image {
            width: 80upx;
            height: 80upx !important;
            border-radius: 50%;
        }
    }
}
.label-list{
    display: flex;
    flex-wrap: wrap;
    .label-item{
        height: 52upx;
        background: #EAEDF0;
        border-radius: 4upx;
        padding: 0upx 10upx;
        display: inline-block;
        // opacity: 0.1;
        line-height: 52upx;
        color: #5B758F;
        margin: 10upx 20upx 10upx 0;
    }
}
</style>
