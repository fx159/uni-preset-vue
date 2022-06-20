import config from './config.js';

const install = (Vue, vm) => {
    // 获取首页机构配置信息
    const getH5Setting = (params = {}) => vm.$u.http.get('https://xiaofa-lawyer.aegis-info.com/xiaofa-manager/h5SettingsApi/h5Settings', params);
    // 获取法律专题
    const getCoreFeatures = (params = {}) => vm.$u.http.post('xiaofa-manager/subjectApi/multi_subject', params);
    // 获取热点资讯
    const getHotPoint = (params = {}) => vm.$u.http.post('xiaofa-manager/subjectApi/hotPoint', params);
    // 热点资讯详情
    const getHotPointDetails = (params = {}) => vm.$u.http.get('https://epide.aegis-info.com/api/getInfoById', params);
    // 推荐问题
    const getRecommend = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_domain}law_inference/simple/recommend`, params);
    // 调用小法问答接口
    const lawApi = (params = {}) => vm.$u.http.post(`${config.domain.xiaofa_domain}law_inference/simple/law_qa`, params);
    // 获取短信验证码
    const getCode = (params = {}) => vm.$u.http.get(`sso/getAuthCode`, params);
    // 登录
    const login = (params = {}) => vm.$u.http.post(`sso/login2`, params, {
        'content-type': 'application/x-www-form-urlencoded'
    });
    // 查询用户是否已被拉黑
    const getBlack = (params = {}) => vm.$u.http.get(`xiaofa-manager/blockListApi/user`, params);
    // 获取咨询类型建议文案（排队填写使用）
    const serviceAdviceText = (params = {}) => vm.$u.http.get(`xiaofa-manager/caseCenterApi/serviceAdviceText`, params);
    // 获取二级专题
    const getSubTopic = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_domain}law_inference/simple/recommend/topic`, params);
    // 案情补充---提交
    const submitAddCase = (params = {}) => vm.$u.http.post(`mall-im/imCase/addCase`, params);
    // 用户给客服留言
    const submitMessage = (params = {}) => vm.$u.http.post(`mall-im/leaveMessage/submit`, params, {
        'content-type': 'application/x-www-form-urlencoded'
    });
    const imSubmitlEAVEMessage = (params = {}) => vm.$u.http.post(`mall-im/imLeaveMessage/submit`, params);
    // 案件查询
    const caseQuery = (params = {}) => vm.$u.http.get(`xiaofa-manager/caseQueryApi/nationCaseQueryDetail`, params);
    // 获取案情登记信息
    const getCaseInfo = (params = {}) => vm.$u.http.get(`mall-im/imCase/getById`, params);
    // 获取留言信息
    const getLeaveMessage = (params = {}) => vm.$u.http.get(`mall-im/leaveMessage/detail`, params);
    // 查询在线律师状态
    const checkLawyerOnline = (params = {}) => vm.$u.http.get(`mall-im/im/checkLawyerOnline`, params);
    // 查询所有的案情登记表
    const getListByUserId = (params = {}) => vm.$u.http.get(`mall-im/imCase/getListByUserId`, params);
    // 获取知识卡片内容
    const getCaseInfoByQId = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_domain}law_inference/simple/card`, params);
    // 小法评价
    const getStar = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_domain}law_inference/simple/star`, params);
    // 历史记录
    const getQuestionHistory = (params = {}) => vm.$u.http.get(`https://xiaofa-lawyer.aegis-info.com/xiaofa-manager/qalogApi/queryMix`, params);
    // const getQuestionHistory = (params = {}) => vm.$u.http.get(`https://r-xiaofa-lawyer.aegis-info.com/mall-im/im/record`, params);
    // 获取律师信息
    const getLawyerInfo = (params = {}) => vm.$u.http.get(`xiaofa-manager/userAgentApi/backendUser`, params);
    // 获取相关案例
    const getSearchCase = (params = {}) => vm.$u.http.get(
        `https://hw-legaldataservice.aegis-info.com/api/case_info/search`, params);
    const getSearchCaseTag = (params = {}) => vm.$u.http.get(
        `https://hw-legaldataservice.aegis-info.com/query/new_case_info/tag`, params);
    // 微信登录- 根据code获取微信信息
    const getWxInfoByCode = (params = {}) => vm.$u.http.get(`xiaofa-manager/mp/code2session/wxd67a4795c8dd484c`, params);
    // 一键登录
    const getWxLogin = (params = {}) => vm.$u.http.post(`xiaofa-manager/mp/phone`, params);
    // 获取未读留言消息
    const getMessageBox = (params = {}) => vm.$u.http.get(`mall-im/messageBox/${params.userId}`);
    // 获取未读留言消息列表
    const getMessageBoxList = (params = {}) => vm.$u.http.get(`mall-im/messageBox/list/${params.userId}`);
    // 获取未读留言消息列表
    const getMessageBoxDetail = (params = {}) => vm.$u.http.get(`mall-im/messageBox/detail`, params);
    // 提交反馈建议
    const submitFeedback = (params = {}) => vm.$u.http.post(`xiaofa-manager/feedbackApi/saveFeedback`, params);
    // 查询IM连接状态
    const getOnlineState = (params = {}) => vm.$u.http.get(`mall-im/im/getOnlineState`, params);
    // 查询IM当前工单的记录
    const getCurrentMsg = (params = {}) => vm.$u.http.get(`mall-im/im/getCurrentMsg`, params);
    // 获取省市
    const getProvinceCityList = (params = {}) => vm.$u.http.get(`xiaofa-manager/eventApi/province_city_list`);
    // 获取用户信息
    const getSsoInfo = (params = {}) => vm.$u.http.get(`sso/info`);
    // 保存用户信息
    const saveSsoInfo = (params = {}) => vm.$u.http.post(`sso/saveUserInfo`, params, {
        'content-type': 'application/x-www-form-urlencoded'
    });
    // 获取首页普法咨询列表
    const getLawConsult = (params = {}) => vm.$u.http.get(`xiaofa-manager/consultantApi/informationDesk`, params);
    // 获取普法详情列表
    const getLawConsultDetail = (params = {}) => vm.$u.http.get(`xiaofa-manager/consultantApi/informationDeskById`, params);
    // 获取我的关注列表
    const getWatchList = (params = {}) => vm.$u.http.get(`xiaofa-manager/consultantApi/watchList`, params);
    // 获取收藏状态
    const getWatchStatus = (params = {}) => vm.$u.http.post(`xiaofa-manager/consultantApi/watchInformationDesk`, params, {
        'content-type': 'application/x-www-form-urlencoded'
    });
    // 获取待使用付费咨询订单数量
    const getPaidOrderCount = (params = {}) => vm.$u.http.get(`mall-im/order/getPaidOrderCount`, params);
    // 校验用户是否授权
    const checkPhoneAuth = (params = {}) => vm.$u.http.get(`mall-im/order/checkPhoneAuth`, params);
    // 电话授权接口
    const phoneAuth = (params = {}) => vm.$u.http.get(`mall-im/order/phoneAuth`, params);
    // 获取用户剩余提问次数
    const getLoseAskCount = (params = {}) => vm.$u.http.get(`mall-im/askCount/getLoseAskCount`, params);
    // 同声传译插件获取到的音频临时文件请求upload
    const upload = (params = {}) => vm.$u.http.post('xiaofa-manager/fileManagementApi/pic/upload', params);
    // 初始化付费咨询订单
    const initPrepayOrder = (params = {}) => vm.$u.http.get(`mall-lawyer/order/initPrepayOrder`, params);
    // 预支付接口【适用小程序和H5】
    const toPay = (params = {}) => vm.$u.http.post(`mall-lawyer/lawyer/toPay`, params);
    // 登录信息留存
    const loginInfoRemain = (params = {}) => vm.$u.http.post(`log/add`, params);
    // //检验/获取客服工作时间（V5.11）
    const checkImWorkTime = (params = {}) => vm.$u.http.get(`mall-im/order/checkImWorkTime`, params);
    // 支付订单评价
    const addComment = (params = {}) => vm.$u.http.post(`mall-lawyer/order/addComment`, params);
    // 会员商品
    const product = (params = {}) => vm.$u.http.get(`xiaofa-manager/productApi/product`, params);
    // 服务协议
    const serviceAgreement = (params = {}) => vm.$u.http.post(`lawService/contract2`, params);
    // 律师列表
    const lawyerList = (params = {}) => vm.$u.http.get(`xiaofa-manager/sso/lawyerList`, params);
    // 商品信息
    const mainPageProduct = (params = {}) => vm.$u.http.get(`xiaofa-manager/productApi/mainPageProduct`, params);
    const productById = (params = {}) => vm.$u.http.get(`xiaofa-manager/productApi/productById`, params);
    // 获取用户的订单列表
    const getOrderList = (params = {}) => vm.$u.http.get(`mall-lawyer/order/userOrderList`, params);
    // 获取订单详情
    const userOrderDetail = (params = {}) => vm.$u.http.get(`mall-lawyer/order/userOrderDetail`, params);
    // 是否有评论
    const hasComment = (params = {}) => vm.$u.http.get(`${config.domain.lawyer_domain}/mall-lawyer/order/hasComment`, params);
    // 根据id查询商品信息
    const getProductById = (params = {}) => vm.$u.http.get(`${config.domain.lawyer_domain}/xiaofa-manager/productApi/productById`, params);
    // 查询服务记录接口
    const findService = (params = {}) => vm.$u.http.get(`${config.domain.lawyer_domain}/mall-lawyer/lawyer/findService`, params);
    // 案件类型
    const caseType = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_domain}law_inference/simple/card/case`, params);
    // 提交案件信息
    const submitCaseInfo = (params = {}) => vm.$u.http.post(`mall-lawyer/order/submitCaseInfo`, params);
    // 查询预支付订单详情
    const prepayUserOrderDetail = (params = {}) => vm.$u.http.get(`mall-lawyer/order/prepayUserOrderDetail`, params);
    const multiSubject = (params = {}) => vm.$u.http.post(`xiaofa-manager/subjectApi/multi_subject`, params);

    const getSign = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawyer/v1.3/rtc/getSign`, params);
    const getRoomId = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawyer/v1.3/rtc/roomId`, params);
    const cancelVideo = (params = {}) => vm.$u.http.post(`mall-im/video/cancleVideo`, params);
    // 获取分享二维码
    const getQRcode = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/qr/getQRCode`, params);
    // 获取激活码
    const getActivationCode = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/order/getActivationCode`, params);
    // 获取用户是否拥有咨询权益
    const getEquity = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/isPaid`, params);
    // 获取用户最近律所
    const getUnitInfo = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/map/getUnitInfo`, params);
    // // 获取订单可用抵扣
    // const getOrderInfo = (params = {}) => vm.$u.http.get(`mall-lawyer/pay/accountInfo`, params)
    // 获取用户权益信息
    const getRightInfo = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getRightInfo`, params);
    // 获取咨询卡商品列表
    const getMemberCardtInfo = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/order/getProducts`, params);
    // 获取咨询卡信息
    const getMemberCardDetail = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getMemberCardDetail`, params);
    //重置免费人工咨询次数
    //const resetAskCount = (params = {}) => vm.$u.http.get(`https://r-xiaofa-lawyer.aegis-info.com/mall-im/demo/resetAskCount`, params);
    const getYuanjiaToken = (params = {}) => vm.$u.http.get(`https://yls.yuanjia101.com/api/app/qingDun/tokenByUnionId/${params}`)

    // 获取案件类型
    const getCaseTypeList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/case/caseTypeList`, params);
    // 提交融资诉讼申请
    const commitAppeal = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/case/commitAppeal`, params);
    // 10、 获取用户是否提交过融资诉讼申请
    const getAppealFlag = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/case/getAppealFlag`, params);
    // 检验激活码合法性
    const checkLegality = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/order/checkLegality`, params);
    // 通过openId查询用户信息
    const getUserInfoByOpenId = (params = {}) => vm.$u.http.get(`xiaofa-manager/mp/getUserInfoByOpenId`, params);
    // 扫码进入小程序
    const scanCode = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/scanCode`, params);
    //查询用户是否绑定小度
    const getBIndXiaoduStatus = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getBindXiaoduStatus`, params);
    //绑定小度信息
    const bindXiaodu = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/bindXiaodu`, params)
    // 获取企业法律顾问商品品列表
    const getLegalCounselSku = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/order/getLegalConsultSku`, params)
    // 获取法律顾问商品详情
    const getLegalConsultSkuDetail = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/order/getLegalConsultSkuDetail`, params)
    // 获取activityId
    const getActivityId = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getActivityId`, params)
    // 添加用户分享记录
    const addShareRecord = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/addShareRecord`, params)
    // 添加律所主页添加图片或视频资源
    const addResourceToLawFirm = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/addOrUpdateResource`, params)
    // 添加律所主页添加图片或视频资源
    const delResourceToLawFirm = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/delResource`, params)
    // 添加或修改合伙人寄语
    const addOrUpdateResource = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/addPartnerMsg`, params)
    // 删除合伙人寄语
    const updatePartnerMsg = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/updatePartnerMsg`, params)
    //  获取排行版
    const getRankingList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/getRankingList`, params)
    //  获取云律所主页
    const getLawfirmDetail = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getLawfirmDetail`, params)
    //  锁时间
    const checkLockDate = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/checkLockDate`, params)
    //  添加预约信息
    const addOrUpdateAppointment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/addOrUpdateAppointment`, params)
    //  获取预约信息
    const getDateAppointment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getDateAppointment`, params)
    //  解锁
    const unLockDate = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/unLockDate`, params)
    //  添加律师评论
    const addLawyerComment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/addComment`, params)
    //  律师评论列表
    const getSpuComment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getSpuComment`, params)
    // 修改头像
    const updateIcon = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/updateIcon`, params)
    // 修改昵称
    const updateNickName = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/updateNickName`, params)
    // 修改手机号
    const updatePhone = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/updatePhone`, params)
    // 获取角色
    const getRoles = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getRoles`, params)
    // 切换角色
    const changeRole = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/changeRole`, params)
    // 获取用户角色资源
    const getRoleResource = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getRoleResource`, params)
    // 添加员工二维码`
    const getStaffQR = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/qr/getStaffQR`, params)
    // 保存更新借款协议auto_call/saveOrUpdateLoanAgreement
    const saveOrUpdateLoanAgreement = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/saveOrUpdateLoanAgreement`, params)
    // 保存更新起诉状
    const saveOrUpdateLawfirmIndictment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/saveOrUpdateLawfirmIndictment`, params)
    // 保存更新律师函
    const saveOrUpdateLawyerLetter = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/saveOrUpdateLawyerLetter`, params)
    // 添加或修改婚前协议
    const addOrUpdatePrenuptialAgreement = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/addOrUpdatePrenuptialAgreement`, params)
    // 添加或修改婚内财产协议
    const addOrUpdateMaritalPropertyAgreement = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/addOrUpdateMaritalPropertyAgreement`, params)
    // 添加或修改离婚协议
    const addOrUpdateDivorceAgreement = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/addOrUpdateDivorceAgreement`, params)
    // 添加或修改婚姻起诉状
    const addOrUpdateLawfirmMarriageIndictment = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/addOrUpdateLawfirmMarriageIndictment`, params)
    // 查看文书详情
    const getDocumentDetail = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/getDocumentDetail`, params)
    // 获取债券类文书详情
    const getOtherDocumentDetail = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getDocumentDetail`, params)
    // 支付完成回显URL
    const backfillFileUrl = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/backfillFileUrl`, params)
    // 获取用户详情
    const getUserDetail = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getUserDetail`, params)
    // 获取云律所列表
    const getBelongLawfirm = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getBelongLawfirm`, params)
    // 获取员工列表
    const getAllEmployeeList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getAllEmployeeList`, params)
    // 获取用户标签
    const getUserLabel = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getUserLabel`, params)
    // 获取用户列表
    const getLawfirmMember = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getLawfirmMember`, params)
    // 获取员工详情信息
    const getMyEmployee = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getMyEmployee`, params)
    // 获取商品分类
    const getLawfirmProductSort = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}auto_call/getLawfirmProductSort`, params)
    // 获取用户订单表
    const getUserOrderList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getOrderList`, params)
    // 获取订单相关签约信息
    const getSignData = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/get_sign_data`, params)

    const getDocumentList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getDocumentList`, params)
    // 获取我的咨询列表
    const getConsultList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getConsultList`, params)
    // 获取所有客服列表
    const getServiceUsers = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getServiceUsers`, params)
    //获取新用户排行榜 {"unit_id":6552}
    const getNewUserRankingList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getNewUserRankingList`, params)
    //获取订单排行榜 {"unit_id":6552}
    const getNewOrderRankingList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getOrderRankingList`, params)
    //查询我的知识卡
    const findMyCardList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/findMyCardList`, params)
    // 验证码校验
    const verifyAuthCode = (params = {}) => vm.$u.http.get(`${config.domain.lawyer_domain}/sso/verifyAuthCode`, params)
    // 更新律所地址
    const addMyCardList = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/addMyCardList`, params)
    //添加我的知识卡
    const updateAddress = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/updateAddr`, params)
    //律师签署
    const lawyerEsign = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/esign/sign`, params)
    //获取合同模板
    const getContractTemplates = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa-esign/v1/tencent/describeTemplates`, params)
    const buildPayQrCode = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa-pay/wx/buildPayQrCode`, params)
    // 删除资源
    const delResourceByUsePlace = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/mainPage/delResourceByUsePlace`, params)
    //  新增用户标签
    const addLawfirmLabel = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/addLawfirmLabel`, params)
    //  删除用户标签
    const deleteUserLabel = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/deleteUserLabel`, params)
    //  关联用户标签
    const relatedUserLabel = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/relatedUserLabel`, params)
    // 保存模板用户信息
    const addContractRecord = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/addContractRecord`, params)
    // 获取模板用户信息
    const getContractRecord = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getContractRecord`, params)
    // 回填订单ID
    const backfillOrderId = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/document/backfillOrderId`, params)
    /*读管理弹窗平台配置
    * @type 弹窗类型：NEW_USER_WINDOW=新用户弹窗；LIVE_WINDOW=直播专用弹窗；
    * @source 来源：MP_C=小程序C端，MP_G=小程序G端，MP_DLY=大律云小程序 */
    const getPopupWindowSettings = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa-manager/popupWindow/list`, params);
    const getBannerSettings = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa-manager/appSettingsApi/bannerList/getAll`, params);

    // 获取合同模板列表
    const describeTemplates = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa-esign/v1/tencent/describeTemplates`, params);
    // 创建合同
    const createFlowsByTemplates = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa-esign/v1/tencent/createFlowsByTemplates`, params);
    // 生产跳转签署链接
    const createSignUrls = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa-esign/v1/tencent/createSignUrls`, params);
    // 运营经理查询视频通话记录
    const getConsultRecord = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getConsultRecord`, params);
    // 运营经理小程序获取大屏列表
    const getBigScreenList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}auto_call/getBigScreenList`, params);
    // 运营经理发起会议
    const launchVideo = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/screen/launchVideo`, params);
    // 运营经理加入会议
    const joinVideo = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/screen/joinVideo`, params);
    // 图文等咨询发送信息
    const saveTalkRecord = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/saveTalkRecord`, params);
    // 获取图文咨询列表
    const getTalkRecordList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}auto_call/getTalkRecordList`, params);
    // 商品权益
    const getProductRight = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getProductRight`, params);
    // 商品权益
    const getRestConsultCount = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/getRestConsultCount`, params);
    // 减少咨询次数
    const reduceServerCount = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/reduceServerCount`, params);
    //getSpuList
    const getSpuList = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getSpuList`, params);
    //getSpuDetail
    const getSpuDetail = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getSpuDetail`, params);
    // getSkuListBySpuId
    const getSkuListBySpuId = (params = {}) => vm.$u.http.get(`${config.domain.gateway_doamin}xiaofa_lawFirm/v1.0/user/getSkuListBySpuId`, params);
    // 获取案由列表
    const getCaseTopics = (params = {}) => vm.$u.http.get(`${config.domain.ilawpush5}/intelligentpretrial/api/v2/statistic/topics/hot`, params);
    // 获取草稿箱
    const getUserContract = (params = {}) => vm.$u.http.get(`${config.domain.xiaofa_business}/userContract/list`, params);
    // 保存文书kindId信息
    const saveOrderDocumentConnection = (params = {}) => vm.$u.http.post(`${config.domain.gateway_doamin}auto_call/saveOrderDocumentConnection`, params);
    vm.$u.api = {
        saveOrderDocumentConnection,
        getUserContract,
        getCaseTopics,
        getSpuList,
        getSpuDetail,
        getSkuListBySpuId,
        reduceServerCount,
        getRestConsultCount,
        getProductRight,
        getTalkRecordList,
        saveTalkRecord,
        joinVideo,
        launchVideo,
        getBigScreenList,
        getConsultRecord,
        addContractRecord,
        getContractRecord,
        createSignUrls,
        createFlowsByTemplates,
        describeTemplates,
        // 获取支付码
        getBannerSettings,
        backfillOrderId,
        lawyerEsign,
        getPopupWindowSettings,
        relatedUserLabel,
        deleteUserLabel,
        addLawfirmLabel,
        delResourceByUsePlace,
        buildPayQrCode,
        updateAddress,
        getSignData,
        addMyCardList,
        getContractTemplates,
        verifyAuthCode,
        getUserOrderList,
        getLawfirmProductSort,
        getMyEmployee,
        getLawfirmMember,
        getUserLabel,
        getAllEmployeeList,
        getBelongLawfirm,
        getUserDetail,
        getConsultList,
        addOrUpdatePrenuptialAgreement,
        addOrUpdateDivorceAgreement,
        backfillFileUrl,
        getOtherDocumentDetail,
        getDocumentDetail,
        addOrUpdateLawfirmMarriageIndictment,
        addOrUpdateMaritalPropertyAgreement,
        saveOrUpdateLawyerLetter,
        saveOrUpdateLawfirmIndictment,
        saveOrUpdateLoanAgreement,
        findMyCardList,
        getNewOrderRankingList,
        getNewUserRankingList,
        delResourceToLawFirm,
        getStaffQR,
        getServiceUsers,
        getDocumentList,
        getRoleResource,
        getRoles,
        getLegalConsultSkuDetail,
        getLegalCounselSku,
        bindXiaodu,
        getBIndXiaoduStatus,
        scanCode,
        getUserInfoByOpenId,
        checkLegality,
        getAppealFlag,
        getH5Setting,
        getCoreFeatures,
        getHotPoint,
        getHotPointDetails,
        getRecommend,
        lawApi,
        getCode,
        login,
        getSubTopic,
        submitAddCase,
        getCaseInfo,
        checkLawyerOnline,
        submitMessage,
        imSubmitlEAVEMessage,
        getListByUserId,
        getLeaveMessage,
        getCaseInfoByQId,
        getSearchCase,
        getSearchCaseTag,
        getStar,
        getQuestionHistory,
        getLawyerInfo,
        getWxInfoByCode,
        getWxLogin,
        getMessageBox,
        getMessageBoxList,
        getMessageBoxDetail,
        submitFeedback,
        getOnlineState,
        getCurrentMsg,
        getProvinceCityList,
        getSsoInfo,
        saveSsoInfo,
        getLawConsult,
        getLawConsultDetail,
        getWatchList,
        getWatchStatus,
        serviceAdviceText,
        caseQuery,
        getBlack,
        getPaidOrderCount,
        checkPhoneAuth,
        phoneAuth,
        getLoseAskCount,
        upload,
        initPrepayOrder,
        toPay,
        loginInfoRemain,
        checkImWorkTime,
        addComment,
        product,
        serviceAgreement,
        lawyerList,
        mainPageProduct,
        getOrderList,
        userOrderDetail,
        hasComment,
        getProductById,
        findService,
        productById,
        caseType,
        submitCaseInfo,
        prepayUserOrderDetail,
        multiSubject,
        getSign,
        getRoomId,
        cancelVideo,
        getQRcode,
        getActivationCode,
        getEquity,
        getUnitInfo,
        getRightInfo,
        getMemberCardtInfo,
        getMemberCardDetail,
        getYuanjiaToken,
        getCaseTypeList,
        commitAppeal,
        getActivityId,
        addShareRecord,
        updateIcon,
        checkLockDate,
        addOrUpdateAppointment,
        getDateAppointment,
        unLockDate,
        addLawyerComment,
        getSpuComment,
        updateNickName,
        updatePhone,
        changeRole,
        addResourceToLawFirm,
        addOrUpdateResource,
        updatePartnerMsg,
        getRankingList,
        getLawfirmDetail,

    }

}
export default {
    install
}
