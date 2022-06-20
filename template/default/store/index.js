/**
 * @Author: chensi
 * @Date: 2020-09-27 18:43:22
 * @LastEditors: chensi
 * @LastEditTime: 2020-09-28 10:54:40
 * @Description: file content
 */
 import Vue from 'vue';
 import Vuex from 'vuex';
 
 Vue.use(Vuex);
 
 const store = new Vuex.Store({
   state: {
     // 问答页携带入参
     topic: '',
     topicId: '',
     subTopicId: '',
     subTopic: '',
     content: '',
     riskId: '',
     caseId: '',
     isHuman: false,
     pager: {
       name: '', // 名称
       code: '', // 编码
       url: '', // 地址
       guid: '' // guid
     }, // 页面信息【用于数据埋点】
     queryList: {}, // 案件查询结果信息
     consultDetailBanner:{},
     lawInfo: {}, // 设置的律所的信息
     law:{} // 传递的律所电话名字信息
   },
   mutations: {
     // 专题名称
     setTopic(state, topic) {
       state.topic = topic;
     },
     // 专题id
     setTopicId(state, topicId) {
       state.topicId = topicId;
     },
     // 二级专题id
     setSubTopicId(state, subTopicId) {
       state.subTopicId = subTopicId;
     },
     // 二级专题
     setSubTopic(state, subTopic) {
       state.subTopic = subTopic;
     },
     // 问题内容
     setContent(state, content) {
       state.content = content;
     },
     // 风险评估id
     setRiskId(state, riskId) {
       state.riskId = riskId;
     },
     // 风险评估id
     setCaseId(state, caseId) {
       state.caseId = caseId;
     },
     // 是否连接人工
     setisHuman(state, isHuman) {
       state.isHuman = isHuman;
     },
     // 设置页面信息
     setPagerInfo (state, val) {
       state.pager = {
         name: val.name,
         code: val.code,
         url: val.url,
         guid: val.guid
       }
     },
     queryList(state, list) {
       state.queryList = list
     },
     // 清空状态机
     emptyState(state) {
       state.topic = '';
       state.topicId = '';
       state.subTopicId = '';
       state.subTopic = '';
       state.content = '';
       state.riskId = '';
       state.caseId = '';
       state.isHuman = false
     },
     setConsultDetailBanner(state, val){
       Object.assign(state.consultDetailBanner,val)
     },
     setLawInfo(state,val){
       state.lawInfo = val
     },
     setLaw(state,val){
       state.law = val
     }
   }
 })
 
 export default store;
 