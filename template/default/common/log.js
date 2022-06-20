/**
 * 数据埋点
 * pageName： 页面名称
 * pageCode：页面编码
 * pageUrl：页面路径
 * pageGuid：页面唯一编码
 * eventCode：事件编码
 * eventName：事件释义
 * actionCode：行为名称
 * apiUrl：接口名称
 */
import Config from './config.js';
import Store from '../store/index.js';
var ip = '';
var city = '';

async function requestLog(params = {
	pageName: '',
	pageCode: '',
	pageUrl: '',
	eventCode: '',
	eventName: '',
	actionCode: '',
	apiUrl: '',

}) {
	// if(Config.ENV === 0 ) return
	const system = await wx.getSystemInfo();
	// 组装日志数据
	const log = {
		// platformCode: 'iLawyer', //平台编码
		ua: system&&system.model || '', // 手机配置信息
		project: '侯朝辉法律顾问', // 项目信息
		version: '1.0.0', // 版本信息
		channelCode: 'mp-houlv', // 渠道
		sourceCode: getApp().globalData.unitId, // source
		ip: ip, // ip地址
		cName: city, // ip所属省份
		page: params.pageName, // 页面
		pageCode: params.pageCode, // 页面编码
		pageUrl: params.pageUrl, // 页面地址
		pageGuid: '', // 页面guid
		environment: Config.ENV_LABEL, // 环境
		eventCode: params.eventCode, // 用户操作编码：用户触发行为的唯一事件标记
		event: params.eventName, // 用户操作释义：进入页面、点击【确认】按钮
		activeCode: params.actionCode, // init：初始化， input：输入，click：点击，apiReq：接口请求，apiRes：接口返回，select：选择……
		enterTime: '', // 页面进入时间
		stayTime: '', // 页面停留时间
		time: new Date().getTime().toString(), // 时间戳
		apiUrl: params.apiUrl || '', // 接口地址
		reqParam: '', // 请求参数
		uId: getApp().globalData.unionId || getApp().globalData.temp_user_id, // 用户唯一标识
		phone: getApp().globalData.phone, // 手机号
		unionId: getApp().globalData.unionId || '', // unionid
		openId: getApp().globalData.openId || '' // openid
	}; // log日志对象
	// 拼接参数串
	let args = '';
	// @ts-ignore
	for (let i of Object.keys(log)) {
		if (args !== '') {
			args += '&';
		}
		// @ts-ignore
		args += i + '=' + encodeURIComponent(log[i]);
	}
	wx.request({
		url: `https://point.aegis-info.com/public/aegis/point/1.gif?${ args }`
	})
}
async function saveLog(params = {
	pageName: '',
	pageCode: '',
	pageUrl: '',
	eventCode: '',
	eventName: '',
	actionCode: '',
	apiUrl: ''
}) {
	try {
		if (ip === '') {
			// 获取IP地址
			wx.request({
				url: 'https://open.onebox.so.com/dataApi?type=ip&src=onebox&tpl=0&num=1&query=ip&url=ip',
				complete(res) {
					const {
						data
					} = res;
					if (data) {
						city = data['1'] + '-' + data['2'];
						ip = data.ip;
					}
					requestLog({ ...params,
						ip,
						city
					})
				}
			})
		} else {
			requestLog({ ...params,
				ip,
				city
			})
		}
	} catch (e) {
		console.log("log error:", e)
	}
}

export default {
	/**
	 * 用户触发事件埋点
	 */
	saveEvent(eventCode = '', eventName = '', actionCode = 'button') {
		const pager = Store.state.pager;
		console.log('pager:', pager)
		saveLog({
			pageName: pager.name,
			pageCode: pager.code,
			pageUrl: pager.url,
			eventCode: eventCode,
			eventName: eventName,
			actionCode: actionCode
		});
	}
}
