<template>
  <view v-if="!(underLimitHidden&&isUnderLimit)" :style="[showAllStyle]" @tap="dealClick">{{ underLimitHidden?'':limitText }}</view>
</template>

<script>
export default {
  name: "showAll",
  props:{
    mainStyle: {
      type: Object,
      default () {
        return {
          background: '#ffffff'
        }
      }
    },
    underLimitHidden: {
      type: Boolean,
      default () {
        return false
      }
    },
    limitText:{
      type: String,
      default: ()=> { return '显示全部'}
    },
    itemList:{
      type: [Object, Array],
      required:true
    },
    limit:{
      type: [Number, String],
      default: null,
      required:true
    }
    },
  computed:{
    showAllStyle() {
      let style = {};
      Object.assign(style, this.mainStyle);
      return style;
    },
    isUnderLimit(){
      if (this.originItemList&&this.originItemList.length>this.limit){
        //大于limit
        return false
      }else {
        return true
      }
    },
  },
  created(){
    this.setItemList()
  },
  watch:{
    showAll:{
      handler:function (newVal,oldVal){
        if (newVal){
          console.log(this.showAll,'showAll',this.originItemList)
         this.$nextTick(()=>{this.$emit('update:itemList',this.originItemList )})
        }else {
          console.log(this.showAll,'showAll',this.originItemList)
          this.$nextTick(()=>{
            this.$emit('update:itemList',this.originItemList.filter((item,index)=>index<this.limit))
          })
        }
      },
      immediate:true

    },
  },
  data(){
    return {
      showAll:false,
      originItemList:null,
  }},
  methods:{
    setItemList(){
      if (!this.originItemList){
        console.log(this.itemList,'this.originItemList')
        this.originItemList=JSON.parse(JSON.stringify(this.itemList))
      }
    },
    dealClick(){
      this.showAll=!this.showAll
    },
  }
}
</script>

<style scoped>

</style>