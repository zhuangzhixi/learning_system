
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入 store 的实例对象
import store from './store/store.js'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 如此配置即可

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

//导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http

//配置请求根路径

// $http.baseUrl = 'http://localhost:3007'
// $http.baseUrl = 'http://192.168.137.1:3007'
// $http.baseUrl = 'https://4f44fd0f.r5.vip.cpolar.cn'

//请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}
//响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
const app1 = getApp();
$http.baseUrl = app1.globalData.site_h5url.slice(0, -1);
// console.log(app1.globalData.site_h5url);