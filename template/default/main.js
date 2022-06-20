import Vue from 'vue';
import App from './App';
import store from './store/index.js';
import uView from 'uview-ui';
// import uView from "uview-ui";
// const mpShare = require('./uview-ui/libs/mixin/mpShare.js')

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.use(uView);
// Vue.mixin(mpShare)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
import HttpInterceptor from '@/common/http.interceptor.js';
import HttpApi from '@/common/http.api.js';
import Utils from '@/common/utils.js';
import Log from '@/common/log.js';
Vue.use(HttpInterceptor, app);
Vue.prototype.$eventBus = new Vue();
// http接口API集中管理引入部分
Vue.use(HttpApi, app);

Vue.use(Utils, app);

Vue.use(Log, app);

app.$mount()
