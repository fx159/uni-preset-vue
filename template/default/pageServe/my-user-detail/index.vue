<template>
	<view class="user-detail">
		<view v-if="!showAddLabel">
			<view class="user-info">
				<view class="user-id">用户ID：{{userInfo.id}}</view>
				<view class="time">注册时间: {{userInfo.user_detail.create_time | showNormal}}</view>
				<view class="law">云律所：{{userInfo.user_detail.lawfirm_name | showNormal}}</view>
		    </view>
			<view class="search-record">
				<view class="title">咨询记录：</view>
<!-- 				<view class="sort">1、20210906 15:43:22, 智能咨询</view> -->
				<view v-if="userInfo.quest_record.length">
					<view class="sort" v-for="(item,index) in userInfo.quest_record" :key="index">
						{{index}}、{{item.start_time | showNormal}} -- {{item.finish_time | showNormal}}, {{item.source}}
					</view>
				</view>
				<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
			</view>
			<view class="search-record">
				<view class="title">扫码记录：</view>
			<!-- 	<view class="sort">1、20210906 15:43:22, 智能咨询</view> -->
				<view v-if="userInfo.scan_record.length">
					<view class="sort" v-for="(item,index) in userInfo.scan_record" :key="index">
						{{index}}、{{item.scan_time | showNormal}}, {{item.nickname | showNormal}}
					</view>
				</view>
				<u-empty text="暂无搜索记录" mode="search" v-else></u-empty>
			</view>
			<view class="search-record" v-if="roleId != 5">
				<view class="label">
					<text class="label-title">用户标签：</text>
					<text class="edit" @click="editLabel" v-if="!activeLabel">编辑</text>
					<text class="edit" @click="confirmLabel" v-else>完成</text>
				</view>
				<view class="desc">
					<view :class="[ activeLabel ? 'active' : '', item.id == userInfo.user_detail.lable_id ? 'is-label' : '' ]"
						v-for="(item,index) in labelist" :key="index" @click="chooseLabel(item.id,index)">
						{{item.name}}
						<image src="https://public-file.aegis-info.com/yuanjia/common/btn_close.png" :class="[ activeLabel ? 'active-img' : 'deactive']" @click="removeItem(item.id,index)"></image>
					</view>
					<view @click="addLabel">+添加标签</view>
				</view>
			</view>
		</view>
		<view v-else>
			<u-field
				v-model="labelText"
				label=" "
				label-width="0"
				placeholder="请输入标签内容"
				:clearable="false"
				maxlength = 10
			>
			<text slot="right" class="laebl-right-confirm" @click="addLawfirmLabel()">确定</text>
			</u-field>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelist: [],
				activeLabel: false,
				showAddLabel: false,
				userInfo: {
					user_detail: {},
					quest_record: [],
					scan_record: [],
					id: ''
				},
				roleId: '',
				userId: '',
				labelText: '',
			}
		},
		filters: {
			showNormal: function (value) {
				if (!value || value == 'null' || value == 'None' ) return '--'		
				return value
			},
		},
		methods: {
			// 删除标签
			removeItem(id, index) {
				const parms = {
					"lawfirm_id": this.userInfo.user_detail.lawfirm_id, //所属律所id
					"lable_id": id,
				}
				uni.showLoading({
					title: '删除中'
				});
				this.$u.api.deleteUserLabel(parms).then(res=>{
					uni.hideLoading();
					this.labelist.splice(index,1)
				})
			},
			editLabel(){
				if(this.roleId == 3 || this.roleId == 4){
					this.activeLabel = true
				}else{
					this.$u.toast('不好意思，您暂无权限修改')
				}
			},
			confirmLabel(){
			   this.activeLabel = false
			},
			addLabel(){
				if(this.roleId == 3 || this.roleId == 4){
					this.showAddLabel  = true
				}else{
					this.$u.toast('不好意思，您暂无权限修改')
				}
			},
			getUserDetail(id){
				let params = { user_id: id }
				this.$u.api.getUserDetail(params).then(res=>{
					this.userInfo = {
						id,
						user_detail: res.data.user_detail,
						quest_record: res.data.quest_record,
						scan_record: res.data.scan_record
					}
				})
			},
			// 获取律所标签
			getUserLabel(){
				this.$u.api.getUserLabel({"user_id": this.userId, "role_id": this.roleId}).then(res=>{
					this.labelist = res.data
				})
			},
			// 增加律所标签
			addLawfirmLabel(){
				const parms = {
					"lawfirm_id": this.userInfo.user_detail.lawfirm_id, //所属律所id
					"label_name": this.labelText,
				}
				uni.showLoading({
					title: '添加中'
				});
				this.$u.api.addLawfirmLabel(parms).then(res=>{
					this.showAddLabel = false
					uni.hideLoading();
					this.getUserLabel()
				})
			},
			// 关联标签
			chooseLabel(id, index){
				// 如果处于编辑状态，则调用删除方法
				if(this.activeLabel){
					this.removeItem(id, index)
				}else{
					const parms ={
						"user_id": this.userInfo.id, 
						"lable_id": id,
						"relation_id": this.userInfo.user_detail.relation_id ? this.userInfo.user_detail.relation_id : '' 
					}
					uni.showLoading({
						title: '正在关联中···'
					});
					this.$u.api.relatedUserLabel(parms).then(res=>{
						uni.hideLoading();
						this.userInfo.user_detail.lable_id = id
					})
				}
			}
		},
		async onLoad(option){	
			const userInfo = await uni.getStorageSync('user-info') || null
    		this.roleId = userInfo.userRole
    		this.userId = userInfo.id
			this.getUserDetail(option.id)
			this.getUserLabel()
			wx.setNavigationBarTitle({
				title: ''
			})
			console.log(option)
		}
	}
</script>

<style lang="less" scoped>
.laebl-right-confirm{
	color: #F8602A ;
	font-size: 32upx;
}
.user-detail{
	padding: 30upx;
	font-size: 32upx;
	.search-record{
		border-top: 2upx #EEEEEE solid;
		margin: 30upx 0;
		padding: 30upx 0;
		.title{
			font-weight: bolder;
			margin: 0 0 30upx 0;
		}
		.sort{
			margin: 10upx 0;
		}
		.label{
			display: flex;
			justify-content: space-between;
		}
		.label-title{
			font-weight: bolder;
		}
		.edit{
			color: #F8602A;
		}
		.is-label{
			color: #F8602A;
		}
	}
	.desc{
		display: flex;
		flex-wrap: wrap;
		view{
			display: inline-block;
			padding: 10upx 30upx;
			background-color: #F5F6F9;
			margin: 20upx 20upx 0 0 ;
		}
		.active{
			position: relative;
			animation: myfirst 1.5s both infinite;
		}
		.active-img{
			position: absolute;
			top: -10upx;
			right: -10upx;
			width: 32upx;
			height: 32upx;
		}
		.deactive{
			display: none;
		}
	}
}
@keyframes myfirst
{
 0% {
        transform: scale(1);
        transform: scale(1)
    }

    50%,73%{
        transform: scale(1) rotate(0deg);
        transform: scale(1) rotate(0deg)
    }

    77%,83%,90%,97%  {
        transform: scale(1) rotate(3deg);
        transform: scale(1) rotate(3deg)
    }

    80%,87%,93%{
        transform: scale(1) rotate(-3deg);
        transform: scale(1) rotate(-3deg)
    }

    100% {
        transform: scale(1) rotate(0);
        transform: scale(1) rotate(0)
    }
}
</style>
