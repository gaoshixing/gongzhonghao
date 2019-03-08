import Vue from 'vue';
import App from './App.vue';
import Axios from 'axios';
import vueAxios from 'vue-axios';
import MintUI from 'mint-ui';
import VueLazyload from 'vue-lazyload';
import 'mint-ui/lib/style.css';
import 'lib-flexible';
import 'normalize.css';
import JSSDK from 'lib/plugins/jssdk/index.js';
import router from 'routes/index.js';
import store from 'store/index.js';
import  './lib/script/polyfill.js';
import AxiosHooks from 'lib/script/apiHook.js'

const baseURL = process.env.NODE_ENV === 'development' ? '/spoc-market/a/ws' : 'http://ewechattest.ivygate.cn/spoc-market/a/ws';

const axios = Axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
});

Vue.prototype.wxAxios = Axios.create({
  baseURL: '/a',
  timeout: 20000,
  withCredentials: true,
});
Vue.prototype.schoolAxios = Axios.create({
  baseURL: '/spoc-choiceschool/a/ws',
  timeout: 20000,
  withCredentials: true,
});

Vue.prototype.wxCrm = Axios.create({
  baseURL: '/spoc-crm/a/ws',
  timeout: 20000,
  withCredentials: true,
});

Vue.use(vueAxios, axios);

new AxiosHooks(axios, Vue.prototype.wxAxios, Vue.prototype.schoolAxios, Vue.prototype.wxCrm);

// 引入mockjs
// if (process.env.NODE_ENV !== 'production') {
//     require('./mock/index.js');
// }

Vue.use(VueLazyload);
Vue.use(MintUI);
Vue.use(JSSDK, {
  store: store,
});

Vue.config.productionTip = false;

// meta.setAttribute('content', 'initial-scale=' + 1/dpr + ', maximum-scale=' + 1/dpr + ', minimum-scale=' + 1/dpr + ', user-scalable=no');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
