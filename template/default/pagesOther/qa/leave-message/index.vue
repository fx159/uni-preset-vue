<template>
	<view class="form-wrapper">
		<view class="close">
			<view class="close-in">
				<u-icon name="close" @click="close"></u-icon>
			</view>
		</view>

		<view class="upload-area">
			<view class="textarea-box">
				<u-input type="textarea" v-model="contentInfo.value" :clearable="false" height="300" border placeholder="请详细描述您的问题,便于更精准的回复…"
				 placeholder-style="color:#9BA0A4;font-size:26rpx;line-height:42rpx;" :maxlength="maxlength" :auto-height="false"
				 border-color="#EEEEEE" :custom-style="customStyle" :disabled="contentInfo.value.length===512"></u-input>
				<view class="max-num-limit">{{ contentInfo.value.length }}/{{ maxlength }}</view>
			</view>

			<view class="upload-image">
				<u-upload :max-count="3" :custom-btn="true" width="152" :show-progress="false" :deletable="true"
				 :show-upload-list="true" file-list	="fileList" @on-remove="handleRemove" @on-error="handleError"
				 :preview-full-image="true" :action="action" :before-upload="handleBeforeUpload" @on-success="handleUploadSuccess">
					<view slot="addBtn" :class="fileList.length > 2 ? 'slot-btn margin-left-0': 'slot-btn'">
						<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/upload_icon.png" class="upload-img"></image>
						<view class="text">上传照片</view>
					</view>
				</u-upload>
			</view>
		</view>

		<view class="select-area">
			<u-form :model="contentInfo" class="select-form" :label-style="formLabelStyle" ref="uForm">
				<u-form-item label="咨询类型" label-width="180rpx" prop="typeLabel">
					<u-input v-model="contentInfo.typeLabel" type="select" :clearable="false" input-align="right" @click="showTypeSelect = true"
					 placeholder="请选择" />
				</u-form-item>

				<u-form-item label="案件阶段" label-width="180rpx" prop="stageLabel" v-if="contentInfo.typeLabel">
					<u-input v-model="contentInfo.stageLabel" type="select" :clearable="false" input-align="right" @click="showStageSelect = true"
					 placeholder="请选择" />
				</u-form-item>

				<u-form-item label="争议金额" label-width="180rpx" prop="moneyLabel" v-if="contentInfo.typeLabel && contentInfo.stageLabel">
					<u-input v-model="contentInfo.moneyLabel" type="select" :clearable="false" input-align="right" @click="showMoneySelect = true"
					 placeholder="请选择" />
				</u-form-item>
			</u-form>

			<view class="suggestion">
				<view class="title"><view class="left-line"></view>小法建议:</view>
				<view class="desc">{{ tip }}</view>
			</view>
		</view>

		<view class="submitBtn">
			<button type="primary" class="submitContent" @click="submiting">提交<text v-if="!isWaited" style="margin-left: 10rpx;">{{ count }}</text></button>
		</view>

		<!-- <u-select v-model="showTypeSelect" mode="single-column" value-name="id" label-name="name" :list="TypeList" @confirm="handleTypeConfirm($event, 'type')"></u-select>
		<u-select v-model="showStageSelect" mode="single-column" value-name="id" label-name="name" :list="stageList" @confirm="handleTypeConfirm($event, 'stage')"></u-select>
		<u-select v-model="showMoneySelect" mode="single-column" value-name="id" label-name="name" :list="moneyList" @confirm="handleTypeConfirm($event, 'money')"></u-select> -->

		<!--region 授权退提示-->
		<u-popup v-model="showPopup" mode="bottom" border-radius="14">
			<view class="auth-popup-content">
				<view class="content-title-wrap">
					<img class="title-img" src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/auth@2x.png" alt="">
					<img class="auth-close" @click="showPopup=false" src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_close@2x.png" alt="">
					<view class="auth-title">手机号码授权申请</view>
				</view>
				<view class="auth-main-info">
					<view class="auth-tip-text">
						大律云律所申请获取您的手机号码，当您的问题较为复杂时，方便及时与您联系
					</view>
					<view class="bound-phone">
						<view>{{ phoneStr }}</view>
						<view class="bound-phone-tip">大律云律所帐号绑定号码</view>
					</view>
				</view>
				<view class="btn-wrap">
					<u-button type="primary" hover-class="none" :custom-style="customStyleRefusedBtn" @click="handleAuthPopup('refused')">拒绝</u-button>
					<u-button type="primary" hover-class="none" :custom-style="customStyleBtn" @click="handleAuthPopup('allow')">允许</u-button>
				</view>
			</view>
		</u-popup>
		<!--endregion-->
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	const COUNT_DOWN = 120;

	export default {
		data() {
			return {
				timer: null,
				count: '',
				height: 220,
				action: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
				fileList: [],
				rules: {},
				showTypeSelect: false,
				showStageSelect: false,
				showMoneySelect: false,
				TypeList: [],
				moneyList: [],
				stageList: [],
				advice: '',
				tip: '',
				contentInfo: {
					value: '',
					type: '',
					typeLabel: '',
					stage: '',
					stageLabel: '',
					money: '',
					moneyLabel: ''
				},
        customStyle: {
				  'padding': '10rpx 0 40rpx'
				},
        showPopup: false,
        maxlength: 512,
        phone: '', // 授权号码
        customStyleBtn: {
          'width': '300rpx',
          'height': '96rpx',
          'background': 'linear-gradient(270deg,rgba(74,162,255,1) 0%,rgba(33,99,224,1) 100%)',
          'border-radius': '48px',
          'font-size': '32rpx'
        },
        customStyleRefusedBtn: {
          'width': '300rpx',
          'height': '96rpx',
          'background': '#fff',
          'border-radius': '48px',
          'font-size': '32rpx',
          'color': '#656C74',
          'border': '2px solid #656C74',
          'margin-right': '32rpx'
        }
			}
		},
		props: {
			isWaited: {
				type: Boolean
			},
			current: {
				type: Number
			}
		},
		computed: {
			formLabelStyle() {
				return {
					'font-size': '32upx',
					'font-family': 'PingFangSC-Regular, PingFang SC',
					'font-weight': 'Regular',
					'color': '#131415'
				}
			},
      phoneStr() {
        let phone = ''
        if (this.$u.test.isEmpty(this.phone)) {
          phone = '';
        } else {
          phone = this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        }
        return phone;
      }
		},
		watch: {
			contentInfo: {
				handler: function(newVal, oldVal) {
					if(newVal.type) {
						this.getSelect()
					}
					if(newVal.stage) {
						this.getSelect()
					}
					if(newVal.money) {
						this.getSelect()
					}
				},
				deep: true
			}
		},
		mounted() {
      this.phone = getApp().globalData.phone;
      this.getSelect()
		},
		onLoad(){
			wx.updateShareMenu({
				withShareTicket: true,
				isPrivateMessage: true,
				activityId: getApp().globalData.activityId,
				success:res=>{
					console.log(res)
				},
				fail: err =>{
					console.log(err)
				}
			})
		},
		onShareAppMessage() {
			// 分享埋点
			//1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods: {
			close() {
        let params = {
          bool: false,
          type: 'leavemessage'
        }
        this.$emit('cancelModal', params)
			},
			cancelEdit() {
				let params = {
					bool: false,
          type: 'leavemessage'
				}
				this.$emit('cancelModal', params)
			},
			async getSelect() {
				let params = {
					type: this.contentInfo.typeLabel,
					state: this.contentInfo.stageLabel,
					price: this.contentInfo.moneyLabel
				}, query = {};

				Object.keys(params).forEach(param => {
					if(params[param]) query[param] = params[param]
				})

				const { code, data } = await this.$u.api.serviceAdviceText(query)
				if(code === 200) {
					const { caseList, stateList, argueList, advice, tip } = data
					this.TypeList = caseList
					this.stageList = stateList
					this.moneyList = argueList
					this.advice = advice
					this.tip = tip
				}
			},

			// 提交
      async submiting() {
        if(!this.contentInfo.value) {
          uni.showToast({
            title: '请填写您的问题描述',
            duration: 2000
          });
          return
        }
        if (this.contentInfo.type === '') {
          uni.showToast({
            title: '请选择咨询类型',
            duration: 2000
          });
          return
        }
        if (!this.contentInfo.stage) {
          uni.showToast({
            title: '请选择案情阶段',
            duration: 2000
          });
          return
        }
        if (!this.contentInfo.money) {
          uni.showToast({
            title: '请选择争议金额',
            duration: 2000
          });
          return
        }
        // 提交前 判断是否已经授权 true=已授权；false=未授权
        const res = await this.$u.api.checkPhoneAuth({});
        if (!res.data) {
          this.showPopup = true
          return false
        } else {
          this.submitCase()
				}
      },
      // 授权弹窗拒绝事件
      async handleAuthPopup(flag) {
        // hasAuth: 允许授权=true，拒绝授权=false；
        const res = await this.$u.api.phoneAuth({
          hasAuth: flag !== 'refused'
        });
        uni.showToast({ title: res.message || res.msg, duration: 2000 })
        this.showPopup = false;
        this.submitCase()
      },
			// 提交留言
			async submitCase() {
				let params = {
          sendId: getApp().globalData.userId || '', // 发送者ID
          sendRole: 'xiaofa_user', // 发送者角色
          msgContent: this.contentInfo.value, // 留言内容
          images: this.fileList.length ? this.fileList.join(',') : '', // 图片
          amountInvolved: this.contentInfo.money, // 争议金额
          consultationType: this.contentInfo.type, // 咨询类型
          caseStage: this.contentInfo.stage, // 案情阶段
          unitId: getApp().globalData.eventId || '', // 机构ID
          source: getApp().globalData.source,
          terminalType: getApp().globalData.type,
          msgType: 10
				}
				const res = await this.$u.api.imSubmitlEAVEMessage(params)
				const { code, message, data } = res
				if(code === 200) {
					uni.showToast({ title: message || '提交成功!', duration: 2000 })
					const type = `${this.contentInfo.typeLabel} | ${this.contentInfo.stageLabel} | ${this.contentInfo.moneyLabel}`
					const msg = this.contentInfo.value
					let arrList = []
					arrList.push(type)
					arrList.push(msg)
					if(this.fileList.length) {
						arrList.push(this.fileList)
					}
					let params = {
						bool: false,
						id: data,
						contentList: arrList,
						type: 'leavemessage'
					}
					this.$emit('cancelModal', params)
				} else {
					uni.showToast({ title: message || '提交失败,请重试', duration: 2000 })
				}

			},
			/**
			 * 上传图片前校验
			 */
			handleBeforeUpload(index, list) {
				console.log('list:', list)
			},
			/**
			 * 上传失败
			 */
			handleError() {
				this.$u.toast('图片上传失败！');
			},
			handleRemove(index, lists, name) {
				this.fileList.splice(index, 1);
			},
			/**
			 * 上传图片成功后回调
			 * @param {Object} data
			 * @param {Object} index
			 * @param {Object} lists
			 */
			handleUploadSuccess(data, index, lists) {
				const { code } = data
				if (data && code === 200) {
					this.fileList.push(data.data);
				}
			},
			handleTypeConfirm(item, option) {
				console.log(item)
				if (!item || item.length === 0) {
					this.$u.toast('选择失败，请稍后再试！');
					return;
				}

				this.contentInfo[option] = item[0].value;
				this.contentInfo[option + 'Label'] = item[0].label;
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "./index";
	// .select-area /deep/ .u-form-item{
	// 	border-top: 1px solid #000;
	// 	border-bottom: 1px solid #000;
	// }
</style>
