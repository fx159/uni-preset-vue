<template>
  <view class="qa-question-page">
    <view class="submit" v-if="showModal">
      <x-form @cancelModal="cancelModal" @handleLinSocket="handleLinSocket" :isWaited="isWaited"
              :current="currentMe"></x-form>
    </view>
    <view class="submit leaveMessage" v-if="showLeaveMessageModal">
      <v-leave-message @cancelModal="cancelModal" @handleLinSocket="handleLinSocket" :isWaited="isWaited"
                       :current="currentMe"></v-leave-message>
    </view>
    <!-- 问答区域 -->
    <scroll-view :scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true" class="scroll-wrap">
      <view style="padding-bottom: 228upx;" id="ScrollBox">
        <view class="loading-wrap" v-if="showHistoryLoading">
          <u-loading mode="circle" color="#408CE2" size="32" v-show="showHistoryLoading"></u-loading>
        </view>
        <!-- <view class="history-text" v-else @click="handleHistory()">查看更多历史消息</view> -->
        <!-- begin 历史记录-->
        <view v-for="(item, index) in historyList" :key="index"
              :class="item.type === 1 ? 'question-box box' : 'answer-box box'">
          <view v-if="item.type === 1 && item.isImg && !item.text.text" class="box-content image-content">
            <text class="read-text">已读</text>
            <image :src="item.text" mode="widthFix" v-if="item.isImg" @click="preview(item.text)"></image>
          </view>
          <view v-if="item.type === 1 && !item.isImg && !item.text.text" class="box-content">
            <text class="read-text" v-if="item.text !== '...'">已读</text>
            <text class="text">{{ item.text }}</text>
          </view>
          <view style="display: flex;flex-flow: column;">
            <view v-if="item.type===1 && item.text.text" class="box-content" @click="handlePlayVoice(item.text.aduio)">
              <text class="read-text" v-if="item.text !== '...'">已读</text>
              <view class="voice-long">
                <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice_icon%402x.png"
                       class="voice-icon"></image>
              </view>
            </view>
            <!-- <view v-if="item.type===1 && item.text.text" class="box-content" >
							<text class="read-text" v-if="item.text !== '...'">已读</text>
							<view class="voice-long">
								<text class="voice-duration">{{ item.text.text }}</text><text class="voice-duration">"</text>
							</view>
						</view> -->

          </view>
          <view class="chat-content" v-if="item.text&&item.text.isTool">
            <image v-if="item.header" class="seat-icon" :src="item.header"></image>
            <view class="tool-box-history" @click="previewFile(item.text.question)">
              <view class="auxiliary-tool-item">
                <img class="tool-bg-image" :src="item.text.header[item.text.type]" alt="">
                <view v-if="item.type===1" class="tool-title book">{{ item.text.text }}</view>
                <view v-if="item.type===2" class="tool-title calculate">{{ item.text.text }}</view>
                <view v-if="item.type===3" class="tool-title predict">{{ item.text.text }}</view>
                <view v-if="item.type===4" class="tool-title law">{{ item.text.text }}</view>
              </view>
            </view>cid
          </view>
          <view v-if="item.type === 2 && item.isChat && !item.text.isTool"
                class="box-content answer-content chat-content ">
            <image v-if="item.header" class="seat-icon" :src="item.header"></image>
            <view :class="item.isImg || item.isFile ? 'chat-message-box' : 'chat-message-box u-border'">
              <view v-if="item.isImg">
                <image class="img-label" @click="preview(item.text)" :src="item.text" mode="widthFix"></image>
              </view>
              <view v-else-if="item.isFile" @click="previewFile(item)">
                <image class="img-label file-label"
                       src="https://public-file.aegis-info.com/ilawpush_wxmini/common/file.png"></image>
              </view>
              <view v-else>{{ item.text }}</view>
            </view>
          </view>


          <view v-if="item.type === 2 && item.isOrder" class="box-content answer-content order-content">
            <view class="file-wrap" v-if="item.file && item.isOrder">
              <image v-if="item.isOrder" class="order-image" mode="widthFix" :src="item.file.img"></image>
            </view>
          </view>
          <view v-if="item.type === 2 && item.isCard"
                :class="item.isCaseCard ? 'box-content answer-content card-content case-card u-border' : 'box-content answer-content card-content u-border'"
                @click="handleKnowledge(item)">
            <view class="card-header">
              <view class="card-info">
                <image :src="item.header"></image>
                <text>{{ item.title }}</text>
              </view>
              <view class="bottom-border"></view>
              <template v-if="item.isCaseCard">
                <view class="time">{{ caseDetailInfo.dateStr }}</view>
                <view :class="caseDetailInfo.emergencyLevel === '1' ? 'emergency-box' : 'emergency-box emergency-2'">
                  {{ caseDetailInfo.emergencyLabel }}
                </view>
              </template>
            </view>
            <view class="text-box">
              <view class="card-text u-line-3">
                <text class="Q" v-if="item.isCaseCard">Q:</text>
                <text :class="item.isCaseCard ? 'case-detail-text' : ''">{{ item.text }}</text>
              </view>
              <view class="case-stage" v-if="item.isCaseCard">
                案情阶段：
                <text>{{ caseDetailInfo.caseStageLabel }}</text>
              </view>
            </view>
            <view class="card-btn-all" v-if="!item.isCaseCard">
              <text>全部知识</text>
            </view>
          </view>
          <view v-if="item.type === 2 && item.options && item.options.length > 0"
                class="box-content answer-content options-content u-border">
            <view class="title">{{ item.title }}</view>
            <view v-if="item.option_desc" class="option-desc u-border-bottom">
              <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_text.png"/>
              {{ item.option_desc }}
            </view>
            <view v-for="(opt, _index) in item.options" :key="_index"
                  :class="opt.active ? _index === 0 ? 'option-item active' :  'option-item u-border-top active' :  _index === 0 ? 'option-item' : 'option-item u-border-top'">
              <text class="u-line-2 option-text">{{ opt.text }}</text>
            </view>
          </view>
          <view v-if="item.type=== 2 && item.similar && item.similar.length > 0"
                class="box-content answer-content options-content u-border">
            <view class="title">{{ item.title }}</view>
            <view v-for="(simi, _index) in item.similar" :key="_index"
                  :class="simi.active ? _index === 0 ? 'option-item active' :  'option-item u-border-top active' :  _index === 0 ? 'option-item' : 'option-item u-border-top'">
              <text class="u-line-2 option-text">{{ simi.text }}</text>
            </view>
          </view>
          <!-- 					<view v-if="item.type===9" class="box-content" @click="handlePlayVoice(item.text.audio)">
						<text class="read-text" v-if="item.text !== '...'">{{item.isRead ? '已读' : '未读'}}</text>
						<view class="voice-long">
							<text class="voice-duration">{{ item.text.text }}</text><text class="voice-duration">"</text>
							<image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice_icon%402x.png" class="voice-icon"></image>
						</view>
					</view> -->
          <view class="header-image user-header" v-if="item.type === 1">
            <image :src="userHeader"></image>
          </view>
        </view>
        <!-- end 历史记录-->
        <view class="date-time-text">
          <u-divider color="#A0ACBF" half-width="136" border-color="#A0ACBF" fontSize="22">{{ dateVal }}</u-divider>
        </view>
        <view class="default-greeting">
          <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa-logo@2x.png"
                 class="header-icon"></image>
          <text class="text">{{ level1 ? '我是' + level1 + '智能机器人' : '法律智能管家小法' }}，竭诚为您服务！</text>
        </view>
        <!-- 推荐问题 -->
        <view class="answer-box box u-border recommend">
          <view class="label">都在问</view>
          <view class="option-wrap">
            <view :class="item.active ? 'option-item u-border-bottom active' : 'option-item u-border-bottom u-line-2'"
                  v-for="(item, index) in recommendData"
                  :key="index" @click="handleOptionClick(item, '', 'hot')">
              <text class="u-line-2">{{ item.text }}</text>
            </view>
          </view>
          <view class="change-pager" @click="handleChangeRecommend($event)">
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/common/refush.png"/>
            换一批
          </view>
        </view>
        <!-- begin 问答区域-->
        <view v-for="(item, index) in askList" :key="index"
              :class="(item.type === 1 || item.type === 7) ? 'question-box box' : 'answer-box box'">
          <view v-if="item.type === 1 && item.isImg" class="box-content image-content">
            <text class="read-text">{{ item.isRead ? '已读' : '未读' }}</text>
            <image :src="item.text" mode="widthFix" v-if="item.isImg" @click="preview(item.text)"></image>
          </view>
          <!--region 录音识别-->
          <view v-if="item.type===7" class="box-content" @click="handlePlayVoice(item.qid)">
            <text class="read-text" v-if="item.text !== '...'">{{ item.isRead ? '已读' : '未读' }}</text>
            <view class="voice-long">
              <text class="voice-duration">{{ item.text }}</text>
              <text class="voice-duration">"</text>
              <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice_icon%402x.png"
                     class="voice-icon"></image>
            </view>
          </view>
          <!--endregion-->
          <view v-if="item.type === 1 && !item.isImg" class="box-content">
            <text class="read-text" v-if="item.text !== '...'">{{ item.isRead ? '已读' : '未读' }}</text>
            <text class="text">{{ item.text }}</text>
          </view>
          <view v-if="item.type === 3" class="tip-content">
            <view class="tip-text">{{ item.text }}
              <text v-if="item.isLawyerCard" class="lawyer-card" @click="handleLawyerCard()">看看TA的资历</text>
            </view>
            <view v-if="item.isQueue && isHuman" class="quit-queue" @click="showCloseTips = true">取消排队</view>
          </view>
          <!--付费-->
          <view v-if="item.type === 5">
            <!-- <view class="paid-img-box">
              <view class="paid-tip-text" :class="{'payTextAlign': (item.text).length>28}">{{ item.text }}</view>
              <img class="paid-img" @click="handleClickGoPay(item.paidOrderId)" :src="item.bannerImage" alt="">
            </view> -->
          </view>
          <!--智能辅助工具-->
          <view class="tool-box" v-if="item.type === 6">
            <view class="auxiliary-tool-item">
              <img class="tool-bg-image" :src="item.header" @click="handleToolDownloadFile(item.qId)" alt="">
              <view v-if="item.cid===1" class="tool-title book">{{ item.text }}</view>
              <view v-if="item.cid===2" class="tool-title calculate">{{ item.text }}</view>
              <view v-if="item.cid===3" class="tool-title predict">{{ item.text }}</view>
              <view v-if="item.cid===4" class="tool-title law">{{ item.text }}</view>
            </view>
          </view>
          <block v-if="isWaited">
            <view v-if="item.type === 3 && item.isQueue" class="tip-content-fix">
              <view class="tip-text">
                {{ item.text }},请稍等片刻..
                <text class="cancelRank" @click="showCloseTips = true">取消排队</text>
              </view>
            </view>
          </block>
          <view v-if="item.type === 2 && item.isChat" class="box-content answer-content chat-content">
            <image v-if="item.header" class="seat-icon" :src="item.header"></image>
            <view :class="item.isImg || item.isFile ? 'chat-message-box' : 'chat-message-box u-border'">
              <view v-if="item.isImg">
                <image class="img-label" :src="item.text" mode="widthFix" @click="handleClickImg(item)"></image>
              </view>
              <view v-else-if="item.isFile">
                <image class="img-label file-label"
                       src="https://public-file.aegis-info.com/ilawpush_wxmini/common/file.png"
                       @click="handleDownloadFile(item.text)"></image>
              </view>
              <view v-else class="text-label">{{ item.text }}</view>
              <view class="button-wrap" @click="openModal(index)"
                    v-if="item.isBtn && item.isWaitDialog && myCaseId === ''">
                <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa_write@2x.png"></image>
                <text>开始填写</text>
              </view>
              <view class="button-wrap" @click="handleLeaveMessage()"
                    v-if="item.showLeaveMessageOpt && (this.blackStatus !== 1 || this.blackStatus !== 3)">
                <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa_write@2x.png"></image>
                <text>开始留言</text>
              </view>
              <view class="button-wrap" @click="handleOrderComment(item.paidOrderId)"
                    v-if="item.showOrderComment && (this.blackStatus !== 1 || this.blackStatus !== 3)">
                <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa_write@2x.png"></image>
                <text>服务评价</text>
              </view>
            </view>
          </view>
          <view v-if="item.type === 2 && item.isOrder" class="box-content answer-content order-content">
            <view class="file-wrap" v-if="item.file && item.isOrder">
              <image v-if="item.isOrder" class="order-image" mode="widthFix" :src="item.file.img"></image>
            </view>
          </view>
          <view v-if="item.type === 2 && item.isCard" @click="handleKnowledge(item)"
                :class="item.isCaseCard ? 'box-content answer-content card-content case-card u-border' : 'box-content answer-content card-content u-border'">
            <view class="card-header">
              <view class="card-info">
                <image :src="item.header"></image>
                <text>{{ item.title }}</text>
              </view>
              <view :class="item.isCaseCard ? 'bottom-border custom-width' : 'bottom-border'"></view>
              <template v-if="item.isCaseCard">
                <view class="time">{{ caseDetailInfo.dateStr }}</view>
                <view :class="caseDetailInfo.emergencyLevel === '1' ? 'emergency-box' : 'emergency-box emergency-2'">
                  {{ caseDetailInfo.emergencyLabel }}
                </view>
              </template>
            </view>
            <view class="text-box">
              <view class="card-text u-line-3">
                <text class="Q" v-if="item.isCaseCard">Q:</text>
                <text :class="item.isCaseCard ? 'case-detail-text' : ''">{{ item.text }}</text>
              </view>
              <view class="case-stage" v-if="item.isCaseCard">
                案情阶段：
                <text>{{ caseDetailInfo.caseStageLabel }}</text>
              </view>
            </view>
            <view class="card-btn-all" v-if="!item.isCaseCard">
              <text>全部知识</text>
            </view>
          </view>
          <view v-if="item.type === 2 && item.options && item.options.length > 0"
                class="box-content answer-content options-content u-border">
            <view class="title">{{ item.title }}</view>
            <view v-if="item.option_desc" class="option-desc u-border-bottom">
              <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_text.png"/>
              {{ item.option_desc }}
            </view>
            <view v-for="(opt, _index) in item.options" :key="_index"
                  :class="opt.active ? _index === 0 ? 'option-item active' :  'option-item u-border-top active' :  _index === 0 ? 'option-item' : 'option-item u-border-top'"
                  @click="handleOptionClick(opt, item.qId, 'opt')">
              <text class="u-line-2 option-text">{{ opt.text }}</text>
            </view>
          </view>
          <view v-if="item.type=== 2 && item.similar && item.similar.length > 0"
                class="box-content answer-content options-content u-border">
            <view class="title">{{ item.title }}</view>
            <view v-for="(simi, _index) in item.similar" :key="_index"
                  :class="simi.active ? _index === 0 ? 'option-item active' :  'option-item u-border-top active' :  _index === 0 ? 'option-item' : 'option-item u-border-top'"
                  @click="handleOptionClick(simi, item.qId, 'simi')">
              <text class="u-line-2 option-text">{{ simi.text }}</text>
            </view>
          </view>
          <view class="header-image user-header" v-if="item.type === 1 || item.type===7">
            <image :src="userHeader"></image>
          </view>
        </view>
        <!-- end 问答区域-->
      </view>
    </scroll-view>
    <view class="bottom-wrap">
      <view class="relate-question">
        <view class="label">你可能想</view>
        <view class="relate-list">
          <view class="relate-item u-border" @click="handleHome()">首页</view>
          <!--isHuman ? (reachLimit ? '返回智能咨询' : '退出人工咨询') : '人工咨询'-->
          <!-- <view v-if="(blackStatus === 0 || blackStatus === 3)&&!isHuman"
                class="relate-item u-border" @click="handleLinSocket('free')">人工咨询
          </view>
          <view v-if="(blackStatus === 0 || blackStatus === 3)&&isHuman"
                class="relate-item u-border" @click="EditConsultBtn">
            {{
              reachLimit ? '返回智能咨询' : ((paidOrderId && !isWaited) ? '结束咨询' : (paidOrderId && isWaited ? '退出匹配' : '退出人工咨询'))
            }}
          </view>
          <view v-if="!isHuman" class="relate-item u-border" @click="handleAdvice()">反馈建议</view>
          <view v-for="(item, index) in relateData" :key="index" class="relate-item u-border"
                @click="handleRelateTap(item)">{{ item.name }}
          </view> -->
        </view>
      </view>
      <view class="input-wrap">
        <view class="input-box">
          <view class="left-icon">
            <image :src="inputType" :class="isRecord ? 'text-input' :''" mode="widthFix" alt=""
                   @click="handleChangeInputType()"></image>
          </view>
          <view class="input" v-if="!isRecord">
            <u-input v-model="inputText" input-align="left" :clearable="false"
                     :disabled="(reachLimit && isHuman) || payConsulteServiceEnd" placeholder="请输入您要咨询的问题"
                     maxlength="120" @click="handleTouchInput"
                     placeholder-style="color: #65799B;font-size:26rpx;"></u-input>
          </view>
          <view class="input" v-else>
            <view class="voice-text" @click="handleInVoice()">{{ inVoice ? durationTime + '秒' : '点击&nbsp;&nbsp;说话' }}
            </view>
          </view>
          <view class="right-icon">
            <image v-if="!isRecord"
                   :src="inputText ? 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/send-en@2x.png' : 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/send@2x.png'"
                   class="send-icon" @click="handleInput('input')"></image>
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/more@2x.png"
                   @click="handleMoreFeature()"
                   class="plus-icon"></image>
          </view>
        </view>
      </view>
      <view class="upload-view-wrap" v-if="showMoreFeature">
        <u-upload :custom-btn="true" :max-count="1" :show-progress="false" :deletable="false" :show-upload-list="false"
                  :preview-full-image="false" :action="uploadAction" :before-upload="handleBeforeUpload"
                  @on-success="handleUploadSuccess">
          <view slot="addBtn" class="upload-item">
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/upload_img@2x.png" mode="widthFix"
                   alt=""></image>
            <view class="label">图片</view>
          </view>
        </u-upload>
      </view>
    </view>
    <view v-if="showLawyerCard" class="lawyer-card-popup" @click="handleCloseLawyerCard()">
      <view class="card-content">
        <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/bg_tip@2x%20(1).png"
               class="tip-image"></image>
        <view class="content-box">
          <view class="box-content">
            <view class="header-icon">
              <image class="icon"
                     :src="lawyerInfo.pic_url ? lawyerInfo.pic_url : 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/headportrait2.png'"></image>
              <image class="border"
                     src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_grainborder.png"></image>
            </view>
            <view class="lawyer-info">
              <view class="name">{{ lawyerInfo.nick_name }}</view>
              <!--<view class="desc">{{lawyerInfo.role_name}}</view>-->
              <view class="desc">小法平台法律客服</view>
            </view>
          </view>
          <view class="info-1">
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_year@2x.png"></image>
            <text>法律服务年限：{{ lawyerInfo.service_length }}</text>
          </view>
          <view class="info-2">
            <image src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_number@2x.png"></image>
            <text>职业证号：{{ lawyerInfo.law_certificate }}</text>
          </view>
          <view class="info-3">
            <view class="text">已服务：
              <text>{{ lawyerInfo.service_count }}</text>
              人
            </view>
            <view class="border"></view>
          </view>
        </view>
      </view>
    </view>
    <u-top-tips ref="uTips"></u-top-tips>
    <view v-if="isRecord && inVoice" class="in-voice">
      <image src="https://public-file.aegis-info.com/ilawpush_wxmini/common/listen.gif" mode="widthFix" alt=""
             class="listen"></image>
      <view class="stop-text" @click="handleStopInVoice()">
        <text>点击结束</text>
      </view>
    </view>

    <u-modal v-model="showCloseTips"
             cancel-text="取消排队"
             confirm-text="我再想想"
             :mask-close-able="true"
             :show-cancel-button="true"
             @cancel="cancelEdit"
             @confirm="confirmEdit">
      <view style="text-align: center;">
        是否确认取消排队开<br/>
        <br/>
        (取消排队后您填写的问题不会保留)
      </view>
    </u-modal>

    <!--region 提前退出人工咨询的弹窗-->
    <u-modal v-model="showEditConsult"
             cancel-text="继续提问"
             confirm-text="确认结束"
             :mask-close-able="true"
             :show-cancel-button="true"
             @cancel="continueBtn"
             @confirm="confirmEditBtn">
      <view style="text-align: center;">
        <view v-if="paidOrderId&&!isWaited">
          是否确认提前结束咨询？<br/>
          <br/>
          (不满20分钟时按20分钟计算)
        </view>
        <view v-if="paidOrderId&&isWaited">
          正在帮您匹配最合适的法律客服，是否退出匹配？（下一次依然可以使用）
        </view>
      </view>
    </u-modal>
    <!--endregion-->

    <!--region 授权提示-->
    <u-popup v-model="showPopup" mode="bottom" border-radius="14">
      <view class="auth-popup-content">
        <view class="content-title-wrap">
          <img class="title-img" src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/auth@2x.png" alt="">
          <img class="auth-close" @click="showPopup=false"
               src="https://public-file.aegis-info.com/ilawpush_wxmini/icon/icon_close@2x.png" alt="">
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
          <u-button type="primary" hover-class="none" :custom-style="customStyleRefusedBtn"
                    @click="handleAuthPopup('refused')">拒绝
          </u-button>
          <u-button type="primary" hover-class="none" :custom-style="customStyleBtn" @click="handleAuthPopup('allow')">
            允许
          </u-button>
        </view>
      </view>
    </u-popup>
    <!--endregion-->

    <!--region app二维码下载-->
    <u-popup v-model="showDownLoadAppPopup" mode="center" border-radius="14" :closeable="true">
      <view class="app-download-content">
        <view class="erweima-box">
          <img class="down-erweima" src="../../static/icon/appDownload.png" alt="">
          <view class="down-tip-text">点击图片，保存到相册，下载APP</view>
        </view>
      </view>
    </u-popup>
    <!--endregion-->
  </view>
</template>

<script>
import config from '../../common/config.js';
import WebSocket from '../../common/socket.js';
import Log from '../../common/log.js';
import xForm from './form.vue';
import VLeaveMessage from './leave-message/index.vue';

const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
const RegImg = /\.(png|jpe?g|gif|svg)(\?.*)?$/; // 校验是否为图片类型
const MaxVoiceDuration = 30; // 录音最大时长控制
const QUESTION_TYPE = {
  question: 1, // 问题
  answer: 2, // 答案
  tip: 3, // 提示
  tip_with_cancel: 4, // 提示
  banner_message: 5, // 图片
  tool_image: 6, // 智能辅助工具
  voice_image: 7 // 语音识别
}; // 问答类型
const ANSWER_OPTION_FLAG = {
  option: 1, // 普通选项
  similar: 2, // 相似问题
  laws: 3, // 相关法条
  cases: 4, // 相关案例
  relate: 5, // 相关问题,
  lawyer: 6 // 律师
}; // 答案选项的分类
const IMTextType = {
  text: 1, // 文字
  img: 2, // 图片
  file: 3, // 文件
  order: 4, // 订单
  discount_code: 5, // 优惠券
  product: 6 // 产品
}; // 小法IM消息类型
export default {
  data() {
    return {
      isPreview: false, // 是否出发预览文件
      isFirstHistory: true, //是否第一次点击获取历史记录
      blackStatus: 0, // 0 解除 1 im+留言 2 im 3 留言
      showCloseTips: false, // 取消排队的弹出提示
      showModal: false, // 排队时填写表单的模态框开关
      showLeaveMessageModal: false, // 留言
      myCaseId: '', // 提交排队中填写的信息得到的id
      currentMe: 0, // 当前排队数
      isWaited: false, // 是否在排队
      eventId: '', // 机构id
      source: '', // source 渠道
      type: '', // 类型
      recommendData: [], // 推荐问题
      dateVal: '', // 时间分割线
      askList: [], // 问答数据
      content: '', // 调用小法问答接口
      qId: '', // 当前的qId
      scrollTop: 0, // 滚动高度
      relateData: [], // 你可能想
      isHuman: false, // 是否为IM
      inputText: '', // 输入文本
      socket: null, // websocket对象
      uploadAction: `${config.domain.lawyer_domain}/mall-im/api/common/uploadFile`,
      socketConfig: {
        url: config.domain.wss_im_domain, // 服务器地址
        limit: 5, // 心跳最大连接数
      },
      lawyerId: 0, // 律师id
      receiveRole: '', // 接收消息的用户角色
      lockReconnect: false, // 是否进行断线重连
      timer: null, // setTimeout 对象
      level1: '', // 法律专题
      level2: '', // 二级法律专题
      riskId: '', // 诉讼风险评估id
      topicId: '', // 法律专题id
      caseDetailInfo: null, // 案情登记信息
      caseId: 0, // 工单id
      historyPageNumber: 0, // 历史记录页码
      historyList: [], // 历史记录
      tempHistoryList: [], // 历史记录数据-临时变量
      showLawyerCard: false, // 展示律师资历卡
      lawyerInfo: null, // 律师信息
      showHistoryLoading: false, // 加载更多历史消息loading
      isRecord: true, // 是否语音录入方式
      inVoice: false, // 是否正在录音中
      setTimeOutObj: null,
      voiceDuration: 0, // 显示语音时长
      durationTime: 0, // 录音时长
      voiceModel: {
        filePath: '', // 临时文件地址
        duration: 0, // 语音长度
        result: '' // 语音识别内容
      }, // 语音文件
      showMoreFeature: false, // 是否显示更多功能窗口
      workOrderId: '', // 工单id
      isReconnecting: false, // 是否重连IM
      recommendPager: 1, // 推荐问题分页计数
      temp_into_content: '', // 临时使用 页面进入的content
      temp_page_into: false, // 临时使用 页面进入是否渲染，暂时没有方案解决进入页面onshow执行两次的情况
      reachLimit: false, // 是否触及到IM咨询次数限制
      askAnswerCount: 0, // 提问的次数
      showPopup: false,
      phone: '', // 授权号码
      is_AudioPlay: true, // 是否播放录音
      showDownLoadAppPopup: false, // 下载app二维码
      paidOrderId: '', // 订单id
      customerServiceType: '1', // 0对应的是法律客服咨询。1对应的是普通人工服务
      payResult: '', // 记录是否从支付成功的页面返回的
      payConsulting: false,
      payConsulteServiceEnd: false, // 付费咨询服务已结束标识
      cancelHumanBtnText: '退出人工咨询',
      showEditConsult: false, // 正在咨询中，提前退出人工咨询的弹窗
      payStartConsult: '',
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
  components: {
    xForm,
    VLeaveMessage
  },
  methods: {
    addMyCardList(params, data) {
      console.log(params, data, 'addMyCardList')
      const fuck = Object.assign(params, data)
      const questionName = params.content
      const questionDesc = params.answer
      const cidItem = data.card.find((item) => {
        return item.type === 'cid'
      })
      const addCardParams = {
        cardId: cidItem.value,
        questionId: data.qid,
        questionName: questionName,
        questionDesc: questionDesc,
      }
      this.$u.api.addMyCardList(addCardParams).then(res => {
        console.log(res, 'addMyCardList')
      })
    },
    async queryStatus() { // 查询当前用户是否被拉黑
      let userId = getApp().globalData.userId,
          params = {userId}
      if (userId) {
        try {
          const __temp = await this.isLogin();
          if (!__temp) {
            this.$u.toast('验证失败，请重新登录！');
            return;
          }
          const {code, data} = await this.$u.api.getBlack(params)
          if (code === 200) {
            this.blackStatus = data
          }
        } catch (e) {
          //TODO handle the exception
          console.log('2')
          console.log(e)
        }
      }
    },
    /**
     * 电话授权
     */
    async handleAuthPopup(flag) {
      // hasAuth: 允许授权=true，拒绝授权=false；
      const res = await this.$u.api.phoneAuth({
        hasAuth: flag !== 'refused'
      });
      uni.showToast({title: res.message || res.msg, duration: 2000})
      this.showPopup = false;
    },
    /**
     * 录音播放功能
     */
    handlePlayVoice(path) {
      console.log(path)
      const InnerAudioContext = wx.createInnerAudioContext()
      if (wx.setInnerAudioOption) {
        wx.setInnerAudioOption({
          obeyMuteSwitch: false
        })
      } else {
        InnerAudioContext.obeyMuteSwitch = false;
      }
      InnerAudioContext.src = path
      if (this.is_AudioPlay) {
        InnerAudioContext.play()
      } else {
        InnerAudioContext.stop()
      }
      this.is_AudioPlay = !this.is_AudioPlay
    },
    cancelEdit() {
      this.handleLinSocket()
    },
    confirmEdit() {
      this.showCloseTips = false
    },

    // 关闭排队填写的模态框
    async cancelModal(params) {
      const {bool, id, contentList} = params
      this.myCaseId = id
      if (params.type && params.type === 'leavemessage') {
        this.showLeaveMessageModal = bool
        // 获取待使用付费咨询订单数量
        const res = await this.$u.api.getPaidOrderCount({
          userId: getApp().globalData.userId
        });
        if (contentList && contentList.length) {
          contentList.forEach(item => {
            if (Array.isArray(item)) {
              item.forEach(li => {
                this.pushAskList({
                  type: QUESTION_TYPE.question,
                  isImg: true,
                  isRead: true,
                  text: li
                })
              })
            } else {
              this.pushAskList({
                type: QUESTION_TYPE.question,
                isImg: false,
                isRead: true,
                text: item
              })
            }
          })
          this.pushAskList({
            type: QUESTION_TYPE.answer,
            header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
            text: '收到，已向法律客服转达~',
            isChat: true,
            showLeaveMessageOpt: false
          })
          /*if (res.data.count === 0) {
              this.pushAskList({
                type: QUESTION_TYPE.banner_message,
                text: '建议您升级付费咨询，客服将第一时间响应，并为您提供更全面的法律意见和行动建议'
              })
            }*/
        }
      } else {
        this.showModal = bool || false
        if (contentList && contentList.length) {
          contentList.forEach(item => {
            if (Array.isArray(item)) {
              item.forEach(li => {
                this.pushAskList({
                  type: QUESTION_TYPE.question,
                  isImg: true,
                  isRead: true,
                  text: li
                })
              })
            } else {
              this.pushAskList({
                type: QUESTION_TYPE.question,
                isImg: false,
                isRead: true,
                text: item
              })
            }
          })
        }
      }
    },

    // 开启排队填写的模态框
    openModal(currIndex) {
      if (!this.isWaited) {
        this.$u.toast('排队结束！');
        return;
      }
      if (this.isWaited && currIndex !== this.askList.length - 1) {
        this.$u.toast('当前排队状态已结束！');
        return;
      }
      this.showModal = true
    },

    // 获取待使用付费咨询订单数量
    async getIsPayInfo() {
      const res = await this.$u.api.getPaidOrderCount({
        userId: getApp().globalData.userId
      });
      // 若为0显示需先付款，大于0可立即使用
      if (res.data.count === 0) {
        this.pushAskList({
          type: QUESTION_TYPE.banner_message,
          bannerImage: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/banner1@2x.png',
          text: '免费提问次数已用尽，如需进一步了解，可升级付费咨询，将为您提供更全面的法律意见和行动建议。',
          paidOrderId: res.data.orderId
        })
      } else {
        this.payConsulting = false;
        this.pushAskList({
          type: QUESTION_TYPE.banner_message,
          bannerImage: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/banner2@2x.png',
          text: `您有${res.data.count}次法律咨询未使用`,
          paidOrderId: res.data.orderId
        })
      }
    },
    // 点击banner
    async handleClickGoPay(paidOrderId) {
      this.paidOrderId = paidOrderId;
      if (paidOrderId) { // 付费咨询中
        // 点击过后 则提示正在付费咨询中
        if (this.payConsulting) {
          return;
        }
        this.payConsulting = true;
        this.reachLimit = false;
        this.handleLinSocket();
      } else { // 未付费则先去付费
        /*if (this.socket) {
            this.socket.closeWebSocket();
					}
          this.isHuman = false;*/
        this.reachLimit = false;
        this.$u.route({
          url: 'pagesOther/pay-info/index'
        })
      }
    },
    // pushAskList
    preview(url) {
      let imgList = [url];
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      });
    },
    previewFile(path) {
      console.log(path)
      const _this = this
      // _this.isPreview = true
      if (path && path.type && !path.isFile) {
        if (path.type === 1) {
          wx.downloadFile({
            url: path.value,
            success(res) {
              wx.openDocument({
                filePath: res.tempFilePath,
                showMenu: true,
                success(res) {
                  console.log(res)
                  _this.$u.toast('文件正在打开...')
                }
              })
            }
          })
        } else {
          // 诉讼链接单独处理 链接中包含subjectId时，单独将subjectId拿出 再带参数
          if (path.value.indexOf('subjectId') > -1) {
            let path1 = path.value.split('?')[1];
            let subjectIdParam = path1.split('=')[1];
            this.$u.route({
              url: 'pages/web-view/index',
              params: {
                path: path.value.split('?')[0],
                subjectId: subjectIdParam
              }
            })
          } else if (path.value.indexOf('causeid') > -1) {
            let path1 = path.value.split('?')[1];
            let paramValue = path1.split('=')[1];
            this.$u.route({
              url: 'pages/web-view/index',
              params: {
                path: path.value.split('?')[0],
                causeid: paramValue
              }
            })
          } else {
            _this.$u.route({
              url: 'pages/web-view/index',
              params: {
                path: path.value
              }
            })
          }
        }
      } else {
        wx.downloadFile({
          url: path.text,
          success(res) {
            wx.openDocument({
              filePath: res.tempFilePath,
              showMenu: true,
              success(res) {
                console.log(res)
                _this.$u.toast('文件正在打开...')
              }
            })
          }
        })
      }
    },
    /**
     * 监测是否有正在连接的IM
     */
    checkIMState() {
      // 获取token信息
      const userInfo = uni.getStorageSync('user-info');
      if (!userInfo || this.$u.test.isEmpty(userInfo.token)) {
        return;
      }
      if (this.isHuman) {
        return;
      }
      this.$u.api.getOnlineState({
        userId: getApp().globalData.userId
      }).then(res => {
        if (res && res.data) {
          // 当前还有未结束的IM
          this.workOrderId = res.data.workOrderId;
          this.handleLinSocket();
          this.getCurrentIMMessage();
        }
      })
    },
    /**
     * 获取当前工单的IM消息
     */
    getCurrentIMMessage() {
    //   this.$u.api.getCurrentMsg({
    //     workOrderId: this.workOrderId
    //   })
    //       .then(res => {
    //         const {
    //           data
    //         } = res;
    //         data.forEach(item => {
    //           this.formatIMMessage(item);
    //         })
    //       })
    },
    /**
     * 初始化语音识别
     */
    initRecord() {
      const that = this;
      // 有新的识别内容返回，则会调用此事件
      manager.onRecognize = (res) => {
        console.log("新的识别内容", res)
      }
      // 正常开始录音识别时会调用此事件
      manager.onStart = (res) => {
        console.log("成功开始录音识别", res);
        this.setTimeoutVoice();
      }
      // 识别错误事件
      manager.onError = (res) => {
        this.$u.toast('录音识别失败', res);
      }
      // 识别结束事件
      manager.onStop = (res) => {
        wx.showLoading({
          title: '语音识别中',
          mask: true
        })
        this.voiceModel.duration = res.duration;
        this.voiceModel.filePath = res.tempFilePath;
        this.voiceModel.result = res.result;
        if (this.$u.test.isEmpty(res.result)) {
          wx.hideLoading();
          this.$u.toast('听不清楚，请再说一遍！');
          return;
        }
        wx.hideLoading();
        this.getUploadFileUrl(res.tempFilePath);
        // 根据内容做逻辑判断
        this.content = this.voiceModel.result;

        // this.handleInput('input')
      }
    },
    async getUploadFileUrl(filePath) {
      let that = this;
      wx.uploadFile({
        url: `${config.domain.lawyer_domain}/xiaofa-manager/fileManagementApi/pic/upload`,
        filePath: filePath,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success(uploadRes) {
          const {data, code, msg} = JSON.parse(uploadRes.data);
          uni.hideLoading();
          if (code === 200) {
            that.pushAskList({
              type: QUESTION_TYPE.voice_image,
              text: that.voiceDuration,
              isRead: true,
              qid: data
            });
            that.handleInput('input', true)
            const _param = {
              sendId: getApp().globalData.userId,
              receiveId: that.lawyerId,
              type: 9,
              msgContent: {
                aduio: data || that.content,
                text: that.content
              },
              role: 'xiaofa_user',
              receiveRole: that.receiveRole,
              code: 2
            }
            console.log(that.socket)
            that.socket.sendWebSocketMsg({
              data: JSON.stringify(_param),
              success(res) {
                console.log('send success:', res)
              }
            })

            // that.handleSendSocketMessage(data, 9);
          } else {
            that.$u.toast(msg || '上传失败')
          }
        }
      })
    },
    /**
     *  @param {Object} params: {type:类型,title:标题, text: 内容, options:选项 , option_desc: 选项文案， similar:相似问题, header:头像 ,isHistory:是否是历史消息,qId: 问题ID, isRead: 是否已读,isCard: 是否为知识卡片,isChat: 是否普通话术,showLeaveMessageOpt: 留言,isQueue: 排队, isImg: 是否为图片, isFile: 是否为文件,isOrder: 是否为订单, file: 文件, isCaseCard: 是否为案情登记卡, isLawyerCard: 是否为律师资历卡, recordId: 法律意见书报告id,cid: 知识卡片id,isWaitDialog: 显示排队弹窗, bannerImage: banner图, paidOrderId: 支付订单, showOrderComment: 订单评论 }
     */
    pushAskList(params = {
      type: QUESTION_TYPE.question,
      title: '',
      text: '',
      options: [],
      similar: [],
      header: '',
      isHistory: false,
      qId: '',
      isBtn: false,
      isRead: false,
      isCard: false,
      isChat: false,
      showLeaveMessageOpt: false,
      isQueue: false,
      isImg: false,
      isFile: false,
      isOrder: false,
      file: null,
      isCaseCard: false,
      isLawyerCard: false,
      recordId: false,
      isWaitDialog: false,
      cid: '',
      bannerImage: '',
      paidOrderId: '',
      showOrderComment: false
    }) {
      // 历史记录消息
      if (params.isHistory) {
        this.tempHistoryList.push({
          ...params
        })
      } else {
        setTimeout(() => {
          this.askList.push({
            ...params
          })
          this.$nextTick(() => {
            this.scrollBottom();
          })
        }, 500)
      }
    },
    /**
     * 判断是否登录
     */
    async isLogin() {
      // 从缓存获取用户登录信息
      const _userInfo = await uni.getStorageSync('user-info');
      if (_userInfo && _userInfo.id && _userInfo.token && _userInfo.phone) {
        return true;
      }
      ;
      return false;
    },
    /**
     * loading等待标识
     */
    loadingAsk() {
      this.pushAskList({
        qId: this.$u.guid(20),
        type: QUESTION_TYPE.answer,
        header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
        text: '...',
        isHistory: false,
        isChat: true
      })
    },
    /**
     * 对接郑总 --- 小法问答接口
     */
    async lawApi() {
      const qId = this.qId || this.$u.guid(20, false, 8);
      if (!this.$u.test.isEmpty(this.content)) {
        this.pushAskList({
          type: QUESTION_TYPE.question,
          text: this.content,
          isHistory: false,
          isRead: false,
          qId: qId
        });
      }
      // 等待接口返回标识
      this.loadingAsk();
      const uId = getApp().globalData.phone || getApp().globalData.uuId;
      const params = {
        content: this.content || '',
        qid: qId,
        event_ids: getApp().globalData.eventId,
        industry_ids: 1,
        user_id: `${getApp().globalData.source}_${uId}`,
        category: '',
        topic_id: this.riskId || ''
      };
      // 初始化问题话术
      this.content = '';
      const res = await this.$u.api.lawApi(params);
      /*this.$u.api.lawApi(params).then(async (res) => {

				})*/
      // 删除当前的等待标识
      await this.askList.pop();
      // 讲当前语料的状态置为：已读
      this.changeMessageStatus();
      this.qId = res.data.qid;
      this.formatQaAnswer(res.data, false);
      this.addMyCardList(params, res.data)
    },
    /**
     * 封装小法问答接口出参,年薪十五万，个税缴多少
     */
    formatQaAnswer(data, isHistory = false) {
      const {
        qid,
        card,
        answer,
        similar_question,
        related_questions,
        choices,
        paperwork,
        relate,
        case_registration,
        is_chat,
        record_id
      } = data;
      // 你可能想
      this.relateData = relate;
      // 小法话术
      const _answer = answer ? answer.replace(/\n/g, '') : '';
      // 是否显示【知识卡片】
      const _showCard = (card && card.length > 0) || !this.$u.test.isEmpty(record_id);
      let cid = '';
      if (card && card.length > 0) {
        cid = card.find(_x => _x.type === 'cid').value;
      }
      // 知识卡片
      if (_showCard) {
        console.log(data, 'card-data-----------------')
        this.pushAskList({
          qId: this.qId,
          type: QUESTION_TYPE.answer,
          header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa-header-icon@2x.png',
          title: '知识卡片',
          text: _answer,
          isHistory,
          cid: cid,
          recordId: record_id || '',
          isCard: true
        })
        const cardItem = {
          qId: this.qId,
          type: QUESTION_TYPE.answer,
          text: _answer,
          isHistory,
          cid: cid,
          recordId: record_id || '',
        }
      }
      // 普通话术
      if (is_chat) {
        this.pushAskList({
          qId: this.qId,
          type: QUESTION_TYPE.answer,
          header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
          text: _answer,
          isHistory,
          isChat: true
        })
      }
      // 选项
      if (choices && choices.length > 0) {
        const _choices = [];
        choices.forEach(item => {
          _choices.push({
            active: false,
            text: item
          })
        })
        this.pushAskList({
          type: QUESTION_TYPE.answer,
          title: '为了提供更精准的解答，请告诉我：',
          isHistory,
          options: _choices,
          option_desc: paperwork ? paperwork : answer
        })
      }
      // 相似问题：有选项则不推荐相似问题
      if (!choices && similar_question && similar_question.length > 0) {
        const _similar = [];
        similar_question.forEach(item => {
          _similar.push({
            active: false,
            text: item
          })
        })
        this.pushAskList({
          type: QUESTION_TYPE.answer,
          title: '你想要咨询的问题可能是：',
          isHistory,
          similar: _similar
        })
      }
      // 相关问题：如果有相似问题，则不推相关问题
      if (!similar_question && related_questions && related_questions.length > 0) {
        const _related = [];
        // 标题
        const _title = case_registration && case_registration.cause ? `为你推荐协议${case_registration.cause}的相关问题，可查看：` :
            '你可能还想问：';
        related_questions.forEach(item => {
          _related.push({
            active: false,
            text: item
          })
        })
        this.pushAskList({
          type: QUESTION_TYPE.answer,
          title: _title,
          isHistory,
          similar: _related
        })
      }
    },
    /**
     * 推荐问题
     */
    async getRecommendData() {
      this.recommendData = [];
      const res = await this.$u.api.getRecommend({
        count: 3,
        num: this.recommendPager,
        event_id: getApp().globalData.eventId,
        user_id: getApp().globalData.phone,
        type: getApp().globalData.type,
        level1: this.level1,
        level2: this.level2,
        topic_id: this.topicId,
        source: getApp().globalData.type
      });
      res.data.forEach((item, index) => {
        this.recommendData.push({
          text: item,
          index,
          active: false
        })
      })
    },
    /**
     * 换一批推荐问题
     */
    handleChangeRecommend(e) {
      Log.saveEvent('3', '点击[换一批]');
      // Log.saveEvent('3', `{type: '点击', label: '换一批', key: ''}`);
      this.recommendPager++;
      this.getRecommendData();
    },
    /**
     * 获取历史记录
     */
    async handleHistory() {

      // Log.saveEvent('2', '点击[查看更多历史消息]');
      const __temp = await this.isLogin();
      if (!__temp) {
        uni.navigateTo({
          url: '/pagesOther/login/index?redirct=pages/qa/main'
        });
        return;
      }
      this.showHistoryLoading = true;
      const res = await this.$u.api.getQuestionHistory({
        telephone: getApp().globalData.phone,
        size: 10,
        page: this.historyPageNumber,
        // isRobot: false
      });
      this.showHistoryLoading = false;
      this.historyPageNumber++;
      // 判断是否为IM消息
      const {
        code,
        data
      } = res;
      console.log(data)
      let newArr = [] //新建数组存放第二次点击时候的历史记录
      try {


        data.content.forEach((item) => {
          this.tempHistoryList = [];
          // 小法问答机器人的爸爸
          if ([0, 1].indexOf(item.human_type) > -1) {
            console.log('human' + QUESTION_TYPE)
            if (item.msg_type === 1) {
              this.pushAskList({
                type: QUESTION_TYPE.question,
                text: item.question,
                qId: item.id,
                isHistory: true
              })
            } else if (item.msg_type === 9) {
              this.pushAskList({
                qId: item.id,
                type: QUESTION_TYPE.question,
                header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                text: {
                  text: JSON.parse(item.question).text || item.question,
                  aduio: JSON.parse(item.question).aduio
                },
                isChat: true,
                isHistory: true
                // isImg: true
              })

              // console.log('audio:'+item.question)
            } else {
              this.pushAskList({
                qId: item.id,
                type: QUESTION_TYPE.question,
                header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                text: item.question,
                isChat: true,
                isHistory: true,
                isImg: true
              })
            }
          } else {
            switch (item.msg_type) {
                // 话术
              case 1:
                this.pushAskList({
                  type: QUESTION_TYPE.answer,
                  qId: item.id,
                  text: item.question,
                  isHistory: true,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                  isChat: true,
                });
                break;
                // 图片
              case 2:
                this.pushAskList({
                  qId: item.id,
                  type: QUESTION_TYPE.answer,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                  text: item.question,
                  isChat: true,
                  isHistory: true,
                  isImg: true
                })
                break;
                // 文件
              case 3:
                this.pushAskList({
                  qId: item.id,
                  type: QUESTION_TYPE.answer,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                  text: item.question,
                  isChat: true,
                  isHistory: true,
                  isFile: true
                })
                break;
                // 优惠券
              case 5:
                this.pushAskList({
                  qId: item.id,
                  type: QUESTION_TYPE.answer,
                  file: {
                    img: 'https://public-file.aegis-info.com/ilawpush_wxmini/common/lawyer__into_icon@2x.png'
                  },
                  isChat: false,
                  isHistory: true,
                  isOrder: true
                })
                break;
                // 知识卡片
              case 7:
                console.log(item)
                this.pushAskList({
                  qId: JSON.parse(item.question).id.split('_')[0],
                  type: QUESTION_TYPE.answer,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa-header-icon@2x.png',
                  title: '知识卡片',
                  isCaseCard: false,
                  text: JSON.parse(item.question).content,
                  isHistory: true,
                  cid: JSON.parse(item.question).id,
                  recordId: '',
                  isCard: true
                })
                break;
                // 工具
              case 8:
                console.log('8:' + JSON.stringify(item))
                this.pushAskList({
                  qId: item.id,
                  type: QUESTION_TYPE.answer,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                  text: {
                    text: JSON.parse(item.question).name.match(/[\u4e00-\u9fa5]/g).join(''),
                    question: JSON.parse(item.question),
                    type: Number(JSON.parse(item.question).type),
                    header: [
                      '',
                      'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E6%96%87%E4%B9%A6%E6%A8%A1%E6%9D%BF%20banner@2x.png',
                      'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E8%AE%A1%E7%AE%97%E5%99%A8%20banner@2x.png',
                      'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E9%87%8F%E5%88%91%E9%A2%84%E6%B5%8B%20banner@2x.png',
                      'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E6%B3%95%E5%BE%8B%E9%97%AE%E8%AF%8Abanner@2x.png'
                    ],
                    isTool: true
                  },
                  isChat: true,
                  isHistory: true
                })
                break;
                // 语音信息
              case 9:
                this.pushAskList({
                  qId: item.id,
                  type: QUESTION_TYPE.answer,
                  header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/im_lawyer.png',
                  text: {
                    text: item.question.text,
                    aduio: JSON.parse(item.question).aduio
                  },
                  isChat: true,
                  isHistory: true,
                  // isImg: true
                })
                break;
            }
          }
          if (item.history && item.history.length > 0) {
            for (const _his of item.history) {
              this.formatQaAnswer(this.$u.deepClone(_his), true)
            }
          }
          // 把临时历史数据存入历史记录
          if (this.isFirstHistory) {
            this.historyList = this.historyList.concat(this.tempHistoryList)
          } else {
            newArr = newArr.concat(this.tempHistoryList)
          }
        })
      } catch (e) {
        //TODO handle the exception
        console.log(e)
      }
      this.historyList = [...newArr, ...this.historyList]
      this.$nextTick(() => {
        this.scrollTopTop();
        this.isFirstHistory = false
      })

    },
    /**
     * 联想问题点击
     * @param {Object} item
     */
    handleRelateTap(item) {
      // Log.saveEvent('7', '点击[切换语音输入]');
      // Log.saveEvent('7', `{type: '点击', label: '技能卡', key: '${item.name}'}`);
      // 根据不同的类型做不同的处理
      // 名词解释
      if (item.type === 'noun') {
        this.content = item.value;
        this.handleInput();
      } else if (item.type === 'topic') {
        this.riskId = item.value;
        const qId = this.qId || this.$u.guid(20, false, 8);
        this.pushAskList({
          type: QUESTION_TYPE.question,
          text: item.name,
          isHistory: false,
          isRead: false,
          qId: qId
        });
        // 风险评估提示语
        if (!this.$u.test.isEmpty(this.riskId)) {
          this.pushAskList({
            qId: this.qId,
            type: QUESTION_TYPE.answer,
            header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
            text: '我将用提问的方式了解您真实的案情信息，咨询时间约2～3分钟，请按提示耐心填写，问题描述越准确，法律意见越全面越精确。使用过程中严格保障您的隐私，请放心填写~',
            isHistory: false,
            isChat: true
          })
        }
        this.lawApi();
      } else {
        this.$u.toast('开发中，敬请期待！')
      }
    },
    /**
     * 修改未读状态为已读
     */
    changeMessageStatus() {
      for (let i in this.askList) {
        const _i = parseInt(i);
        if (_i === this.askList.length - 1 && this.askList[_i].type === QUESTION_TYPE.question) {
          this.askList[_i].isRead = true;
        }
      }
    },
    /**
     * 切换输入方式
     */
    handleChangeInputType() {
      if (this.isWaited) {
        return;
      }
      if (this.payConsulteServiceEnd) {
        return;
      }
      if (this.reachLimit && this.isHuman && !this.isWaited) {
        this.$u.toast('今日咨询次数已用尽，请付费咨询或者明日再来！');
        return;
      }
      this.isRecord = !this.isRecord;
      if (this.isRecord) {
        Log.saveEvent('8', '点击[切换文字输入]');
      } else {
        Log.saveEvent('7', '点击[切换语音输入]');
      }
    },
    /**
     * 语音录入
     */
    handleInVoice() {
      if (this.isWaited) {
        return;
      }
      if (this.payConsulteServiceEnd) {
        return;
      }
      if (this.reachLimit && this.isHuman) {
        this.$u.toast('今日咨询次数已用尽，请付费咨询或者明日再来！');
        return;
      }
      Log.saveEvent('9', '点击[开始说话]');
      this.inVoice = true;
      this.voiceDuration = 0;
      manager.start({
        lang: 'zh_CN'
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
      Log.saveEvent('15', '点击[结束说话]');
      this.inVoice = false;
      this.durationTime = 0;
      clearTimeout(this.setTimeOutObj);
      manager.stop();
    },
    /**
     * 显示更多功能
     */
    handleMoreFeature() {
      if (!this.isHuman) {
        this.$u.toast('开发中，敬请期待！');
        return;
      } else {
        if (this.isWaited) {
          return;
        }
        if (this.payConsulteServiceEnd) {
          return;
        }
        if (this.reachLimit) {
          this.$u.toast('今日咨询次数已用尽，请付费咨询或者明日再来！');
          return;
        }
      }
      this.showMoreFeature = !this.showMoreFeature;
    },
    /**
     * 选项选择
     * @param {Object} opt 选项文本
     * @param {Object} qId
     */
    handleOptionClick(opt, qId, type) {
      switch (type) {
        case 'hot':
          Log.saveEvent('4', '热门问题');
          break
        case 'opt':
          Log.saveEvent('4',  '智能推荐');
          break;
        case 'simi':
          Log.saveEvent('4', '智能推荐');
          break;
      }
      opt.active = true;
      // this.qId = qId;
      this.content = opt.text;
      // 调用问题接口
      this.lawApi();
    },
    /**
     * 点击输入框
     */
    handleTouchInput() {
      Log.saveEvent('6', '点击[文字输入框]');
    },
    /**
     * 输入框文本提交
     */
    async handleInput(type, isVoice = false) {
      Log.saveEvent('11', '点击[发送]');
      if (this.isWaited) {
        return;
      }
      if (this.payConsulteServiceEnd) {
        return;
      }
      if (this.isHuman && this.reachLimit) {
        this.$u.toast('今日咨询次数已用尽，请付费咨询或者明日再来！');
        return;
      }
      let that = this;
      // 网络情况
      const net = await this.checkNetwork();
      if (!net) {
        return;
      }
      this.content = this.$u.test.isEmpty(this.inputText) ? this.content : this.inputText;
      if (this.$u.test.isEmpty(this.content) && type === 'input') {
        this.$u.toast('请输入咨询内容！');
        return;
      }
      this.askAnswerCount++;
      if (this.isHuman) {
        // 用户在会话中，发送第二条提问时，应提示授权 true=已授权；false=未授权
        /*if (this.askAnswerCount === 2) {
            const res = await this.$u.api.checkPhoneAuth({});
            if (!res.data) {
              this.showPopup = true
						}
					}*/
        if (this.content !== '') {
          this.pushAskList({
            type: QUESTION_TYPE.question,
            text: that.content,
            isHistory: false,
            isRead: false,
            qId: that.$u.guid(10, false, 10)
          });
        }
        if (!isVoice) {
          this.handleSendSocketMessage(this.content, IMTextType.text)
        }
      } else {
        this.lawApi();
      }
      this.content = this.inputText = '';
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
      query.select('#ScrollBox').boundingClientRect();
      query.exec((res) => {
        this.scrollTop = res[0].height;
      })
      // const historyLength = this.historyList.length > 0 ? this.historyList.length : 1;
      // this.scrollTop = 600 * this.askList.length * historyLength;
    },
    /**
     * 案件详情
     */
    handleCaseDetailView() {
      this.$u.route({
        url: 'pagesOther/case-detail/detail',
        params: {
          caseId: this.caseId
        }
      })
    },
    /**
     * 反馈建议
     */
    async handleAdvice() {
      Log.saveEvent('7', `{type: '点击', label: '技能卡', key: '反馈建议'}`);
      const __temp = await this.isLogin();
      if (!__temp) {
        uni.navigateTo({
          url: '/pagesOther/login/index?redirct=pages/qa/main'
        });
      }
      wx.navigateTo({
        url: '/pagesOther/advice/index'
      })
    },
    /**
     * 回到首页
     */
    handleHome() {
      Log.saveEvent('12',  '首页');
      uni.switchTab({
        url: '/pages/home/index'
      })
    },
    /**
     * 知识卡片跳转
     */
    async handleKnowledge(info) {
      console.log(info)
      Log.saveEvent('5', `{type: '点击', label: '知识卡片', key: '${info.recordId}'}`);
      if (info.isCaseCard) {
        this.$u.route({
          url: 'pagesOther/case-detail/detail',
          params: {
            caseId: this.caseId
          }
        });
        return;
      }
      // 跳转到登录, 携带当前连接，跳转回登录
      const _temp = await this.isLogin();
      if (!_temp) {
        uni.navigateTo({
          url: '/pagesOther/login/index?redirct=pages/qa/main'
        });
      } else {
        // 跳转到诉讼风险评估的法律意见书
        if (info && info.recordId) {
          this.$u.route({
            url: 'pages/web-view/index',
            params: {
              path: `https://aegis.ai-risk-m.aegis-info.com/advice`,
              recordId: info.recordId
            }
          })
        } else {
          // 跳转到知识卡片
          uni.navigateTo({
            url: '/pagesOther/knowledge/index?cid=' + info.cid + '&qid=' + info.qId
          })
        }
      }
    },
    /**
     * 点击图片
     */
    handleClickImg() {
      Log.saveEvent('18', '点击[图片]');
      this.preview(item.text);
    },
    /**
     * 文件打开
     * @param {Object} path 文件地址
     */
    handleDownloadFile(path) {
      Log.saveEvent('19', '点击[附件]');
      console.log('path:', path)
      const _this = this;
      wx.downloadFile({
        url: path,
        success(res) {
          wx.openDocument({
            filePath: res.tempFilePath,
            showMenu: true,
            success(res) {
              console.log(res)
              _this.$u.toast('文件正在打开...')
            }
          })
        }
      })
    },
    handleToolDownloadFile(path) {
      console.log('path:', path)
      Log.saveEvent('19', '点击[附件]');
      const _this = this;
      if (path.indexOf('.docx') < 0) {
        // causeid
        // 诉讼链接单独处理 链接中包含subjectId时，单独将subjectId拿出 再带参数
        if (path.indexOf('subjectId') > -1) {
          let path1 = path.split('?')[1];
          let subjectIdParam = path1.split('=')[1];
          this.$u.route({
            url: 'pages/web-view/index',
            params: {
              path: path.split('?')[0],
              subjectId: subjectIdParam
            }
          })
        } else if (path.indexOf('causeid') > -1) {
          let path1 = path.split('?')[1];
          let paramValue = path1.split('=')[1];
          this.$u.route({
            url: 'pages/web-view/index',
            params: {
              path: path.split('?')[0],
              causeid: paramValue
            }
          })
        } else {
          _this.$u.route({
            url: 'pages/web-view/index',
            params: {
              path: path
            }
          })
        }
      } else {
        wx.downloadFile({
          url: path,
          success(res) {
            wx.openDocument({
              filePath: res.tempFilePath,
              showMenu: true,
              success(res) {
                console.log(res)
                _this.$u.toast('文件正在打开...')
              }
            })
          }
        })
      }
    },
    /**
     * 留言
     */
    async handleLeaveMessage() {
      this.showLeaveMessageModal = true
      /*this.$u.route({
					url: 'pagesOther/case-detail/index'
				});*/
      /*this.$u.route({
          url: 'pagesOther/leave-message/index'
        });*/
    },
    // 服务评价
    handleOrderComment(orderId) {
      this.$u.route({
        url: 'pagesOther/order-comment/index',
        params: {
          orderId: orderId
        }
      });
    },
    /**
     * 查看律师卡片信息
     */
    async handleLawyerCard() {
      const res = await this.$u.api.getLawyerInfo({
        userid: this.lawyerId
      });
      this.lawyerInfo = res.data;
      this.showLawyerCard = true;
    },
    /**
     * 关闭律师卡片信息
     */
    handleCloseLawyerCard() {
      this.showLawyerCard = false;
    },
    /**
     * 上传图片前校验
     */
    handleBeforeUpload(index, list) {
      console.log('list:', list)
    },
    /**
     * 上传图片成功后回调
     * @param {Object} data
     * @param {Object} index
     * @param {Object} lists
     */
    handleUploadSuccess(data, index, lists) {
      if (data && data.code === 200) {
        this.pushAskList({
          qId: '',
          type: QUESTION_TYPE.question,
          title: '文件',
          isImg: true,
          isChat: true,
          isRead: true,
          text: data.data
        });
        this.handleSendSocketMessage(data.data, IMTextType.img)
      }
    },
    /**
     * 判断网络情况
     */
    async checkNetwork() {
      const that = this;
      return new Promise((resolve, reject) => {
        uni.getNetworkType({
          success(res) {
            if (res && res.networkType !== 'none') {
              resolve(true);
            } else {
              that.$u.toast('网络获取失败，请开启网络连接！');
              reject(false)
            }
          },
          fail() {
            that.$u.toast('网络获取失败，请开启网络连接！');
            reject(false)
          }
        })
      })
    },
    // 退出人工咨询
    EditConsultBtn() {
      // 付费咨询中，提前结束咨询
      if (this.paidOrderId) {
        this.showEditConsult = true;
        return
      }
      this.handleLinSocket('free')
    },
    // 继续提问
    continueBtn() {
      this.showEditConsult = false;
    },
    // 确认结束
    confirmEditBtn() {
      this.handleLinSocket();
    },


    // ===================== websocket ===================
    /**
     * 创建websocket 对象
     */
    socketInit(consultType) {
      // 创建socket对象
      this.socket = new WebSocket({
        heartCheck: true,
        isReconnection: true,
        uId: getApp().globalData.userId,
        eventId: getApp().globalData.eventId,
        type: getApp().globalData.type,
        source: getApp().globalData.source,
        customerServiceType: this.customerServiceType,
        usePaidOrderId: consultType === 'free' ? '' : this.paidOrderId
      })

      // 建立连接
      // 监听websocket状态
      this.socket.onSocketClosed({
        url: this.socketConfig.url,
        success(res) {
          console.log('res:', res)
        },
        fail(err) {
          console.log("onSocketClosed err", err)
        }
      });
      // 监听网络变化
      this.socket.onNetworkChange({
        url: this.socketConfig.url,
        success(res) {
          console.log(res)
        },
        fail(err) {
          console.log("onNetworkChange err", err)
        }
      })
      // 监听服务器返回
      this.socket.onReceivedMsg(res => {
        // 修改语料为：已读
        this.changeMessageStatus();
        const {
          code,
          data,
          msg
        } = JSON.parse(res.data);
        console.log('socket message data', JSON.parse(res.data));
        switch (code) {
          case 7:

          case 17:
            this.lawyerId = data.lawyerId;
            uni.setStorageSync('lawyerId', data.lawyerId);
            this.receiveRole = data.role;
            this.isHuman = true;
            this.isWaited = false
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: msg,
              isLawyerCard: true
            });
            break;
          case 1:
            this.formatIMMessage(data);
            this.workOrderId = data.workOrderId
            if (this.workOrderId && this.myCaseId) {
              this.socket.sendWebSocketMsg({
                data: JSON.stringify({
                  code: 9,
                  caseId: this.myCaseId,
                  workOrderId: this.workOrderId
                }),
                success(res) {
                  console.log('send success:', res)
                }
              })
            }
            break;
            // 留言
          case 16:
            this.isHuman = false;
            this.payConsulting = false;
            this.pushAskList({
              type: QUESTION_TYPE.answer,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
              text: msg,
              isChat: true,
              showLeaveMessageOpt: true
            });
            uni.removeStorageSync('payOrderId');
            this.paidOrderId = '';
            this.socket.closeWebSocket();
            break;
          case 11:
            this.isWaited = true
            this.myCaseId = ''
            this.currentMe = data
            let freeConsultCount = 0
            // 进入排队中，提示免费咨询次数
            this.$u.api.getLoseAskCount({
              userId: getApp().globalData.userId,
              terminalType: 'mp_xfgj'
            }).then(res => {
              freeConsultCount = res.data.count
              this.pushAskList({
                type: QUESTION_TYPE.tip,
                text: msg,
                isQueue: true
              });
              this.pushAskList({
                type: QUESTION_TYPE.answer,
                header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
                text: this.paidOrderId ? '建议您提前把问题告诉我,便于更精准的回复...' : `您有${freeConsultCount}次提问的机会，建议您提前把问题告诉我,便于更精准的回复...`,
                isChat: true,
                showCard: true,
                isBtn: true,
                isWaitDialog: true
              });
            })
            break;
          case 12:
            // 长时间没有消息发送，自动断开提示
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: msg,
              isQueue: false
            });
            /*if(this.isHuman) {
								setTimeout(() => {
									this.isHuman = false;
									this.socket.closeWebSocket();
								}, 30000)
							}*/
            break;
          case 13:
            // 断开
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: '人工咨询已结束，感谢您的使用'
            });
            this.isHuman = false;
            this.showMoreFeature = false;
            this.paidOrderId = '';
            uni.removeStorageSync('payOrderId');
            this.payConsulting = false;
            this.socket.closeWebSocket();
            break;
          case 4:
            this.socket.closeWebSocket();
            this.isHuman = false;
            this.paidOrderId = '';
            uni.removeStorageSync('payOrderId');
            this.payConsulting = false;
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: '人工咨询已结束，感谢您的使用'
            })
            break;
          case 30:
            if (data === 0) {
              // 免费咨询完，要判断是否有过付费
              this.$u.api.getPaidOrderCount({
                userId: getApp().globalData.userId
              }).then(res => {
                // 若为0显示需先付款，大于0可立即使用
                if (res.data.count === 0) {
                  this.pushAskList({
                    type: QUESTION_TYPE.banner_message,
                    bannerImage: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/banner1@2x.png',
                    text: '免费提问次数已用尽，如需进一步了解，可升级付费咨询，将为您提供更全面的法律意见和行动建议。',
                    paidOrderId: ''
                  })
                  this.reachLimit = true
                } else {
                  this.socket.closeWebSocket();
                  this.isHuman = false;
                  this.payConsulting = false;
                  uni.removeStorageSync('payOrderId');
                  this.paidOrderId = '';
                  this.pushAskList({
                    type: QUESTION_TYPE.banner_message,
                    bannerImage: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/banner2@2x.png',
                    text: `您有${res.data.count}次法律咨询未使用`,
                    paidOrderId: res.data.orderId
                  });
                }
              })
            } else {
              this.pushAskList({
                type: QUESTION_TYPE.tip,
                text: msg
              })
              this.reachLimit = false
            }
            break;
          case 31:
            // 服务结束，用户不可提问，客服可回复
            this.payConsulteServiceEnd = true;
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: msg
            })
            this.pushAskList({
              type: QUESTION_TYPE.answer,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
              text: '服务已结束，请对我们的服务进行评价~',
              isChat: true,
              showCard: true,
              isBtn: true,
              paidOrderId: data,
              showOrderComment: true
            });
            this.$u.api.getPaidOrderCount({
              userId: getApp().globalData.userId
            }).then((res) => {
              if (res.data.count === 0) {
                this.pushAskList({
                  type: QUESTION_TYPE.banner_message,
                  bannerImage: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/banner1@2x.png',
                  text: '您可以选择继续咨询',
                  paidOrderId: res.data.orderId
                })
              }
            })
            break;
          case 32:
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: msg
            })
            break;
          case 35:
            if (data.orderId) {
              this.paidOrderId = data.orderId;
            }
            // 付费咨询时间是否已到，若为true需关闭用户提问权限
            if (data.hasTimeUp) {
              this.payConsulteServiceEnd = true;
            }
            this.isHuman = false;
            this.handleLinSocket();
            break;
          case 36:
            // 电话授权
            this.showPopup = true;
            break;
          case 40:
            this.pushAskList({
              type: QUESTION_TYPE.tip,
              text: msg
            })
            break;
        }
      })
    },
    /**
     * 建立、关闭连接
     */
    async handleLinSocket(consultType) {
        return
      const that = this;
      const net = await this.checkNetwork();
      console.log('net:', net);
      if (!net) {
        return;
      }
      const __temp = await this.isLogin();
      if (!__temp) {
        uni.navigateTo({
          url: '/pagesOther/login/index?redirct=pages/qa/main'
        });
        return;
      }
      if (this.isHuman && !this.payResult) {
        Log.saveEvent('20', '取消排队');
        try {
          // 发送断开指令
          this.socket.sendWebSocketMsg({
            data: JSON.stringify({
              sendId: getApp().globalData.userId,
              receiveId: this.lawyerId,
              role: 'xiaofa_user',
              receiveRole: this.receiveRole,
              code: 8
            }),
            success(res) {
              that.socket.isReconnection = false;
              that.socket.heartCheck = false;
              that.socket.closeWebSocket();
              that.socket = null;
              that.isHuman = false;
              that.askAnswerCount = 0;
              that.showMoreFeature = false;
              that.isWaited = false;
              that.reachLimit = false;
              that.showModal = false;
              that.paidOrderId = '';
              that.payConsulting = false;
              that.payConsulteServiceEnd = false;
              that.customerServiceType = 1;
              uni.removeStorageSync('payOrderId');
              uni.removeStorageSync('lawyerId');
              that.pushAskList({
                type: QUESTION_TYPE.tip,
                text: '人工咨询已结束，感谢您的使用'
              })
            }
          })
        } catch (e) {
          console.log('e:', e);
        }
      } else {
        Log.saveEvent('7', `{type: '点击', label: '技能卡', key: '人工咨询'}`);
        console.log('手动连接：')
        // 非工作时间限制
        const onLineTime = await this.$u.api.checkImWorkTime();
        if (onLineTime && !onLineTime.data.isWorkTime) {
          this.pushAskList({
            type: QUESTION_TYPE.answer,
            text: this.payStartConsult ? `sorry(｡ ́︿ ̀｡)法律客服的工作是时间是上午${onLineTime.data.workStartTime} - 晚上${onLineTime.data.workEndTime}。客服上线后会第一时间短信联系您~` : `sorry(｡ ́︿ ̀｡)法律客服的工作是时间是上午${onLineTime.data.workStartTime} - 晚上${onLineTime.data.workEndTime}。你可以给她留言，或者向小法咨询别的问题~`,
            header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
            showLeaveMessageOpt: true,
            isChat: true
          })
          return;
        }
        if (this.payStartConsult) {
          uni.removeStorageSync('startConsultSign');
        }
        // 判断律师是否在线
        const __onLine = await this.$u.api.checkLawyerOnline({
          unitId: getApp().globalData.eventId,
          userId: getApp().globalData.userId

        });
        console.log('__onLine:' + JSON.stringify(__onLine))
        if (!__onLine || __onLine.data === false) {
          if (this.payResult && this.paidOrderId) {
            uni.removeStorageSync('pay-result');
            that.payResult = '';
            that.pushAskList({
              type: QUESTION_TYPE.tip,
              text: '支付成功, 正在为您匹配合适的律师'
            })
            that.pushAskList({
              type: QUESTION_TYPE.answer,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
              text: '小法正在分析您的案情信息，帮您匹配最合适的法律客服，请稍等。(匹配时间不超过3分钟)',
              isChat: true
            })
          }
          this.pushAskList({
            type: QUESTION_TYPE.answer,
            header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
            text: this.paidOrderId && consultType !== 'free' ? '抱歉，当前排队人数较多，等待时间可能较长。平台正在加派客服，上线后会第一时间短息联系您！' : '对不起，暂无法律客服在线，您可以在此留言，我们会尽快回复您。',
            isChat: true,
            showLeaveMessageOpt: true
          });
          return;
        }

        // 判断免费次数
        if (consultType) {
          const freeCont = await this.$u.api.getLoseAskCount({
            userId: getApp().globalData.userId,
            terminalType: 'mp_xfgj'
          })
          if (freeCont.data.count === 0) {
            await this.getIsPayInfo();
            return
          }
        }
        // 客服工作时间内 并从支付页面返回 直接登录
        if (this.payResult && this.paidOrderId) {
          uni.removeStorageSync('pay-result');
          that.payResult = '';
          that.pushAskList({
            type: QUESTION_TYPE.tip,
            text: '支付成功, 正在为您匹配合适的律师'
          })
          that.pushAskList({
            type: QUESTION_TYPE.answer,
            header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
            text: '小法正在分析您的案情信息，帮您匹配最合适的法律客服，请稍等。(匹配时间不超过3分钟)',
            isChat: true
          })
        }
        // socket连接
        // this.socketInit(consultType);
        this.isHuman = false;
        // 当进入人工咨询时，清空联想问题
        this.relateData = [];
        if (!this.paidOrderId) {
          this.pushAskList({
            type: QUESTION_TYPE.tip,
            text: '小法正在帮你连线人工客服，请稍后...'
          })
        }
        this.socket.initWebSocket({
          url: this.socketConfig.url,
          success(res) {
            console.log('websocket success:', res)
          },
          fail(err) {
            console.log("linkWebsocket err", err)
          }
        })
      }
    },

    /**
     * 发送websocket消息
     * @param {Object} content 发送内容
     * @param {Object} type 类型
     */
    async handleSendSocketMessage(content, type) {
      const _param = {
        sendId: getApp().globalData.userId,
        receiveId: this.lawyerId,
        type: type,
        msgContent: content || this.content,
        role: 'xiaofa_user',
        receiveRole: this.receiveRole,
        code: 2
      }
      this.socket.sendWebSocketMsg({
        data: JSON.stringify(_param),
        success(res) {
          console.log('send success:', res)
        }
      })
    },
    /**
     * 格式化IM消息
     */
    formatIMMessage(data) {
      const _type = data.sendId === getApp().globalData.userId ? QUESTION_TYPE.question : QUESTION_TYPE.answer;
      if (data.type === 1) {
        this.pushAskList({
          qId: data.createTime,
          type: _type,
          header: data.avatar,
          text: data.msgContent,
          isChat: true,
          isRead: true
        })
      } else if (data.type === 2) {
        const isImg = RegImg.test(data.msgContent);
        if (isImg) {
          this.pushAskList({
            qId: data.createTime,
            type: _type,
            header: data.avatar,
            text: data.msgContent,
            isChat: true,
            isImg: true,
            isRead: true
          })
        }
      } else if (data.type === 3) {
        this.pushAskList({
          qId: data.createTime,
          type: _type,
          header: data.avatar,
          text: data.msgContent,
          isChat: true,
          isFile: true,
          isRead: true
        })
      } else if (data.type === 5) {
        const {
          orderId,
          lawyerProductId
        } = JSON.parse(data.msgContent);
        this.pushAskList({
          qId: data.createTime,
          type: _type,
          file: {
            img: 'https://public-file.aegis-info.com/ilawpush_wxmini/common/lawyer__into_icon@2x.png',
            orderId,
            lawyerProductId
          },
          isChat: false,
          isOrder: true,
          isRead: true
        })
      } else if (data.type === 7) {
        //todo IM消息中接收知识卡片，缺少recordId，目前暂时搁置
        let msgObj = JSON.parse(data.msgContent)
        console.log('qid:', msgObj.id.split('_')[0])
        let msgText = msgObj.content.replace('<b>', '');
        msgText = msgText.replace('</b>', '');
        msgText = msgText.replace('\\n', '');
        console.log(msgText)
        this.pushAskList({
          qId: msgObj.id.split('_')[0],
          type: QUESTION_TYPE.answer,
          header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa-header-icon@2x.png',
          title: '知识卡片',
          text: msgText,
          isHistory: false,
          cid: msgObj.id,
          recordId: '',
          isCard: true
        })
      } else if (data.type === 8) {
        let msgObj = JSON.parse(data.msgContent)
        switch (msgObj.type) {
          case 1:
            this.pushAskList({
              type: QUESTION_TYPE.tool_image,
              text: msgObj.name + '-文书模板',
              cid: msgObj.type,
              qId: msgObj.value,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E6%96%87%E4%B9%A6%E6%A8%A1%E6%9D%BF%20banner@2x.png'
            })
            break;
          case 2:
            this.pushAskList({
              type: QUESTION_TYPE.tool_image,
              text: msgObj.name + '-计算器',
              cid: msgObj.type,
              qId: msgObj.value,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E8%AE%A1%E7%AE%97%E5%99%A8%20banner@2x.png'
            })
            break;
          case 3:
            this.pushAskList({
              type: QUESTION_TYPE.tool_image,
              text: msgObj.name + '-量刑预测',
              cid: msgObj.type,
              qId: msgObj.value,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E9%87%8F%E5%88%91%E9%A2%84%E6%B5%8B%20banner@2x.png'
            })
            break;
          case 4:
            this.pushAskList({
              type: QUESTION_TYPE.tool_image,
              text: msgObj.name + '-法律问诊',
              cid: msgObj.type,
              qId: msgObj.value,
              header: 'https://public-file.aegis-info.com/ilawpush_wxmini/banner/%E6%B3%95%E5%BE%8B%E9%97%AE%E8%AF%8Abanner@2x.png'
            })
            break;
        }
      }
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
      return this.isRecord ? 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/text_input@2x.png' :
          'https://public-file.aegis-info.com/ilawpush_wxmini/icon/voice@2x.png';
    },
    userHeader() {
      return getApp().globalData.userHeader;
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
  onLoad(opt) {
    // 结构直接进入问答页
    // getApp().globalData.eventId = opt.eventId;
    // 判断是否有未结束的工单
    this.checkIMState();
    this.$u.mpShare.title = getApp().globalData.relay_title;
    this.$u.mpShare.desc = getApp().globalData.relay_desc;
    wx.setNavigationBarTitle({
      title: getApp().globalData.web_title
    })
    wx.updateShareMenu({
      withShareTicket: true,
      isPrivateMessage: true,
      activityId: getApp().globalData.activityId,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onHide() {
    // 清空store状态机
    console.log('hide into')
    // this.$store.commit('emptyState')
  },
  onUnload(){
    Log.saveEvent('-1', '离开页面', 'onUnload');
  },
  async onShow() {
    // 从支付页面返回取订单id
    this.paidOrderId = uni.getStorageSync('payOrderId');
    this.payResult = uni.getStorageSync('pay-result');
    // 商品页面-专业法律客服咨询
    this.payStartConsult = uni.getStorageSync('startConsultSign');
    // 订单详情中联系客服
    const contactCustomer = uni.getStorageSync('contactCustomer');

    if (this.paidOrderId && this.payResult) {
      if (this.socket) {
        await this.socket.closeWebSocket();
      }
      this.isHuman = false;
      this.payConsulteServiceEnd = false;
      this.handleLinSocket();
    }
    if (getApp().globalData.show_order_banner) {
      getApp().globalData.show_order_banner = false;
      // 非工作时间限制
      const onLineTime = await this.$u.api.checkImWorkTime();
      if (onLineTime && !onLineTime.data.isWorkTime) {
        this.pushAskList({
          type: QUESTION_TYPE.answer,
          text: `sorry(｡ ́︿ ̀｡)法律客服的工作是时间是上午${onLineTime.data.workStartTime} - 晚上${onLineTime.data.workEndTime}。客服上线后会第一时间短信联系您~`,
          header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
          showLeaveMessageOpt: true,
          isChat: true
        })
        return
      }
      this.getIsPayInfo();
    }
    // 商品下单-专业法律客服咨询 下单成功后返回问答页，连接IM
    if (this.payStartConsult && this.paidOrderId) {
      this.pushAskList({
        type: QUESTION_TYPE.tip,
        text: '支付成功'
      })
      this.handleLinSocket();
    }
    // 订单详情中联系客服
    if (contactCustomer === 'freeService') {
      this.customerServiceType = '0';
      this.paidOrderId = '';
      this.handleLinSocket();
      uni.removeStorageSync('contactCustomer');
    }
    // 订单详情中去使用
    if (contactCustomer === 'toUseService' && this.paidOrderId) {
      this.handleLinSocket();
      uni.removeStorageSync('contactCustomer');
    }
    this.phone = getApp().globalData.phone;
    this.dateVal = `今天 ${this.$u.timeFormat(new Date().getTime(), 'hh:MM')}`;
    uni.hideTabBar({
      animation: true,
      success() {
        console.log('hide tabbar')
      }
    });
    this.recommendPager = 0;
    if (this.topic) {
      this.level1 = topic;
    }
    const {
      topic,
      topicId,
      subTopicId,
      content,
      subTopic,
      riskId,
      caseId,
    //   isHuman
    } = this.$store.state;
    this.temp_page_into = true;
    this.queryStatus();
    // 暂时没有其他方案解决onshow执行两次的情况，使用变量控制：当咨询内容一致且页面第二次渲染的时候，则直接return
    if (this.temp_page_into === true && this.temp_into_content !== '' && this.temp_into_content === content) {
      return;
    }
    this.topicId = topicId || '';
    this.level1 = topic || '';
    this.level2 = subTopic || '';
    this.riskId = riskId;
    this.temp_into_content = this.content = content;
    // 从专题页面进入，携带专题id
    // 携带问题进入问答
    if (content || riskId) {
      this.lawApi();
    }
    // if (isHuman) {
      // 建立socket连接
    //   this.handleLinSocket();
    // }
    // 案情登记完毕，展示案情登记卡
    this.caseId = caseId || '';
    if (!this.$u.test.isEmpty(this.caseId)) {
      const res = await this.$u.api.getLeaveMessage({
        id: this.caseId
      })
      const {
        data
      } = res;
      this.caseDetailInfo = {
        ...data,
        dateStr: data.createTime.substring(0, 10).replace(/-/gi, '.'),
        emergencyLabel: data.emergencyLevel === '1' ? '紧急' : '特别紧急',
        caseStageLabel: data.caseStage === '3' ? '执行阶段或已结案' : data.caseStage === '2' ? '法院审理阶段' : '未立案'
      };
      // 案情登记卡
      this.pushAskList({
        type: QUESTION_TYPE.answer,
        title: '案情登记卡',
        header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/xiaofa_registration@2x.png',
        text: res.data.message,
        isHistory: false,
        isCard: true,
        isCaseCard: true,
      })
      // 提示信息
      this.pushAskList({
        qId: this.$u.guid(20, false, 8),
        type: QUESTION_TYPE.answer,
        header: 'https://public-file.aegis-info.com/ilawpush_wxmini/icon/seat_icon.png',
        text: '收到，已向法律客服转达~',
        isHistory: false,
        isChat: true
      })
    }
    // this.$nextTick(() => {
    // 	if(this.isPreview){
    // 		this.isPreview = false
    // 		return
    // 	}else{
    // 	    this.scrollBottom()
    // 	}
    // })
    this.getRecommendData();
    // 设置页面缓存
    this.$store.commit('setPagerInfo', {
      name: 'AI法律咨询',
      code: '5',
      url: '/pagesOther/qa/main'
    });
    Log.saveEvent('0', '加载页面', 'onShow');
  },
  /**
   * 分享
   */
  onShareAppMessage() {
    Log.saveEvent('-2', '分享', 'click')
    // 分享埋点
    //1136_zjXDoG585uM36s0Kq5T4jEVXnxxixbbnJp03Vvgib-iBd0bM1XdLa0NtBpTfQ3IJx91KEFre4yMEzvOp
  },
}
</script>

<style lang="scss" scoped>
@import "./index";
</style>
