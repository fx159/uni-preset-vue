<template>
<image class="robot" @click="viewAI" src="https://cdn-obs-question.aegis-info.com/mall/newspaper/20220609_cd035bf2-d0a8-4ed3-a9c0-c3deeabb5f09.gif" mode="widthFix"></image>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    viewAI(){
      wx.navigateTo({
        url: '/pagesOther/qa/main'
      })
    }
  },
}
</script>

<style scoped lang="scss">
.robot{
  position: fixed;
  bottom: 120upx;
  right: 30upx;
  border-radius: 50%;
  width: 160upx;
  height: 160upx;
}
</style>


