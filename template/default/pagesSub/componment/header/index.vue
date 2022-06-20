<template>
	<view class="search">
		<text v-if="roleDesc.roleId !== 5">{{roleDesc.searchText}}</text>
		<u-input :value="value" type="text" @change="change" border-color="#D50F19" class="input" border/>
		<view class="screen" @click="showPopup">
			<text>筛选</text>
			<!-- <image src="https://public-file.aegis-info.com/yuanjia/common/icon_filter.png" class="filter"></image> -->
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			roleDesc: '',
			value:''
		},
		data() {
			return {

			}
		},
		methods: {
			showPopup(){
				this.$emit('showPopup',true)
			},
			change(val){
			  this.$emit('change',val)
			}
		}
	}
</script>

<style lang="less" scoped>
.search{
  display: flex;
  align-items: center;
  padding: 0 140upx 0 30upx;
  height: 100upx;
  position: relative;
  .input{
	  flex: 1;
  }
  >text{
	  width: 150upx;
	  height: 60upx;
	  line-height: 60upx;
	  background: #F8602A;
	  border-radius: 30upx;
	  font-size: 26upx;
	  color: #FFFFFF;
	  text-align: center;
	  margin-right: 20upx;
  }
  .screen{
	  position: absolute;
	  right: 22upx;
	  font-size: 33upx;
	  text{
		  color: #F8602A;
		  display: inline-block;
		  
	  }
	  image{
		  width: 34upx;
		  display: inline-block;
		  height: 34upx;
		  vertical-align: middle;
	  }
  }
}
</style>

