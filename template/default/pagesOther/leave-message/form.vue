<template>
	<view class="form-wrapper">
		<view class="close" :class="{'noMar': !isWaited}">
			<view class="close-in">
				<u-icon name="close" @click="close"></u-icon>
			</view>
		</view>
		<!-- 排队提示 -->
		<view class="queue-box">
			<view class="queue-tip" v-if="!isWaited">
				<text class="queue-text">已排到您，请在2分钟内完成提交</text>
			</view>
			<view v-else class="queue-tip">
				<view class="queue-text">
					您前面有{{ current }}人排队,请稍等片刻..
					<text class="cancelRank" @click="showCloseRank = true">取消排队</text>
				</view>
			</view>
		</view>

		<view class="upload-area">
			<view class="textarea-box">
				<u-input type="textarea" v-model="contentInfo.value" :clearable="false" height="300" border placeholder="请详细描述您的问题,便于更精准的回复…"
				 placeholder-style="color:#9BA0A4;font-size:26rpx;line-height:42rpx;" maxlength="512" :auto-height="false"
				 border-color="#EEEEEE" :custom-style="customStyle"></u-input>
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

		<u-select v-model="showTypeSelect" mode="single-column" value-name="id" label-name="name" :list="TypeList" @confirm="handleTypeConfirm($event, 'type')"></u-select>
		<u-select v-model="showStageSelect" mode="single-column" value-name="id" label-name="name" :list="stageList" @confirm="handleTypeConfirm($event, 'stage')"></u-select>
		<u-select v-model="showMoneySelect" mode="single-column" value-name="id" label-name="name" :list="moneyList" @confirm="handleTypeConfirm($event, 'money')"></u-select>

		<u-modal v-model="showCloseTips"
			cancel-text="确认离开"
			confirm-text="继续填写"
			:mask-close-able="true"
			:show-cancel-button="true"
			@cancel="cancelEdit"
			@confirm="confirmEdit">
			<view style="text-align: center;">
				是否确认离开<br/>
				(法律客服将无法准确了解您的问题)
			</view>
		</u-modal>
		<u-modal v-model="showSubmitTips"
			cancel-text="继续填写"
			confirm-text="确认提交"
			content="是否确认提交"
			:mask-close-able="true"
			:show-cancel-button="true"
			@confirm="confirmSubmit">
		</u-modal>

		<u-modal v-model="showCloseRank"
			cancel-text="取消排队"
			confirm-text="我再想想"
			:mask-close-able="true"
			:show-cancel-button="true"
			@cancel="cancelRank"
			@confirm="confirmRank">
			<view style="text-align: center;">
				是否确认取消排队开<br/>
				<br/>
				(取消排队后您填写的问题不会保留)
			</view>
		</u-modal>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	const COUNT_DOWN = 120;

	export default {
		data() {
			return {
				timer: null,
				count: '',
				height: 220,
				action: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
				fileList: [],
				rules: {
					/*typeLabel: [{required: true, message: '', trigger: ['change','blur']}],
					stageLabel: [{required: true, message: '', trigger: ['change','blur']}],
					moneyLabel: [{required: true, message: '', trigger: ['change','blur']}],*/
				},
				showTypeSelect: false,
				showStageSelect: false,
				showMoneySelect: false,
				showSubmitTips: false,
				showCloseTips: false,
				showCloseRank: false,
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
			}
		},
		watch: {
			isWaited(newVal) {
			  console.log('n:', newVal)
				if(!this.isWaited) {
					this.resetTime(COUNT_DOWN)
				}
			},
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
		  console.log('isWaited:', this.isWaited)
      this.getSelect()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onUnload() {
			clearInterval(this.timer)
		},
		methods: {
			close() {
				this.showCloseTips = true
			},
			confirmRank() {
				this.showCloseRank = false
			},
			cancelRank() {
				this.handleLinSocket()
			},
			handleLinSocket() {
				this.$emit('handleLinSocket')
			},
			submiting() {
				// this.showSubmitTips = true
        this.submitCase()
			},
			cancelEdit() {
				let params = {
					bool: false
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
			confirmEdit() {
				this.showCloseTips = false
			},
			confirmSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {

					} else {
						console.log('验证失败');
					}
				});
			},
			async submitCase() {
				if(!this.contentInfo.value) {
					uni.showToast({
					    title: '请填写您的问题描述',
					    duration: 2000
					});
					return
				}
				if (!this.contentInfo.type) {
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
          msgType: 1
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
						contentList: arrList
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
			},
			resetTime(totalTime){
			  console.log('totalTime:', totalTime)
				const that = this
				that.timer=setInterval(async function(){
					let s = (totalTime % 60) < 10 ? ('0' + totalTime % 60) : totalTime % 60;
					let m = totalTime / 60 < 10 ? ('0' + parseInt(totalTime / 60)) : parseInt(totalTime / 60);
					that.count = m + ' : ' + s;
					totalTime--;
					if(totalTime < 0) {
						clearTimeout(that.timer);
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
              msgType: 1
						}
						const res = await that.$u.api.imSubmitlEAVEMessage(params)
						const { code, message, data } = res
						if(code === 200) {
							uni.showToast({ title: message || '提交成功!', duration: 2000 })
							const one = that.contentInfo.typeLabel ? that.contentInfo.typeLabel+' | ' : '';
							const two = that.contentInfo.stageLabel ? that.contentInfo.stageLabel+' | ' : '';
							const three = that.contentInfo.moneyLabel ? that.contentInfo.moneyLabel : '';
							const type = `${one}${two}${three}`;
							const msg = that.contentInfo.value
							let arrList = []
							if(type !== '') {
								arrList.push(type)
							}
							if(msg !== '') {
								arrList.push(msg)
							}
							if(that.fileList.length) {
								arrList.push(that.fileList)
							}
							let params = {
								bool: false,
								id: data,
								contentList: arrList
							}
							that.$emit('cancelModal', params)
						} else {
							uni.showToast({ title: message || '提交失败,请重试', duration: 2000 })
						}
					}
				},1000)
			}
		},
	}
</script>

<style lang="less" scoped>
	@import "./form.less";
	.select-area /deep/ .u-form-item{
		border-top: 1px solid #000;
		border-bottom: 1px solid #000;
	}
</style>
