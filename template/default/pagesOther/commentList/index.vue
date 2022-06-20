<template>
    <view class="commentList">
        <OrderEstimate
            :list="commentList"
            :name="name"
            :spuId="spuId"
            :showTitle="false"
        ></OrderEstimate>

        <view
            style="text-align:center;margin-bottom: 60upx;"
        >
            <u-loading-icon
                mode="circle"
                color="#408CE2"
                size="32"
                v-show="showLoading"
            ></u-loading-icon>
            {{reachLimit?'到底了~':''}}
        </view>
    </view>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<script>
import OrderEstimate from "../../wxcomponents/order-estimate/index.vue";
export default {
    name: "CommentList",
    props: {},
    components: {
        OrderEstimate,
    },
    data() {
        return {
            commentList: [],
            spuId: "",
            name: "",
            reachLimit: false,
            showLoading: false,
            pageConfig: { pageNum: 1, pageSize: 10 },
        };
    },
    onLoad({ name, spuId }) {
        wx.setNavigationBarTitle({
            title: name + "评价" || "商品评价",
        });
        this.name = name;
        this.spuId = spuId;
        this.getSpuComment();
    },
    methods: {
        getSpuComment(pageNumPlus) {
            if (this.reachLimit) return;
            if (pageNumPlus) this.pageConfig.pageNum++;
            const params = {
                unitId: getApp().globalData.unitId,
                spuId: this.spuId,
            };
            this.showLoading = true;
            this.$u.api
                .getSpuComment(Object.assign({}, params, this.pageConfig))
                .then((res) => {
                    console.log(res, "res");

                    res.data.forEach((element) => {
                        if (element.files)
                            element.files = JSON.parse(element.files);
                        this.commentList.push(element);
                        console.log(this.commentList, "this.commentList");
                        if (
                            this.commentList.length === res.total ||
                            this.commentList.length > res.total
                        ) {
                            this.reachLimit = true;
                        }
                    });
                })
                .finally(() => {
                    this.showLoading = false;
                });
        },
    },
    mounted() {},
    onReachBottom() {
        this.getSpuComment(true);
    },
};
</script>
