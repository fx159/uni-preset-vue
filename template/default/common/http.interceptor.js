import config from './config.js';
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: config.domain.lawyer_domain, // 请求的本域名
		dataType: 'json',
		showLoading: true, // 是否显示请求中的loading
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 500, // 在此时间内，接口未返回，就显示加载中动画，单位ms
		originalData: false, // 是否在拦截器中返回服务器的原始数据
		loadingMask: true, // 展示loading的时候，是否加一个蒙层，防止触摸穿透
		header: {
			'content-type': 'application/json;charset=UTF-8'
		} // 配置头信息
	});
	// 请求拦截部分
	Vue.prototype.$u.http.interceptor.request = (config) => {
		if (config.method === 'GET') {
			config.header['content-type'] = 'application/json;charset=UTF-8'
		}
		// 获取token信息
		const userInfo = uni.getStorageSync('user-info');
		if ((userInfo && userInfo.token) || getApp().globalData.skipToken) {
			config.header['Authorization'] =  userInfo.token || getApp().globalData.skipToken ;
		}
		config.header['appVersion'] = 'MP_Steven_law_V1.0'
		config.header['channel'] = 'MP_Steven_law_V1.0'
		// console.log('getApp().globalData.skipToken:'+getApp().globalData.skipToken)
		return config;
	};
	// 响应拦截
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if (res.code === 200 || res.code === 0 || (res.data && typeof res.data === 'object' && res.data.length > 0)) {
			return res;
		} else if (res.code === 401) {
			// 401 token校验失败，跳转到登录环节
			vm.$u.toast('验证失败，请重新登录');
			setTimeout(() => {
			uni.removeStorageSync('user-info');
				vm.$u.route({
					type: 'redirectTo',
					url: 'pagesOther/login/index'
				})
			}, 1500)
			return false;
		} else {
			// 如果返回false，则会调用Promise的reject回调
			uni.showModal({
				title: '提示',
				content: res.message|| res.msg || '网络繁忙，接口失败！',
				showCancel: false,
				confirmText: '知道了',
				confirmColor: '#007AFF'
			})
			return false;
		}
	};
}

export default {
	install
}
