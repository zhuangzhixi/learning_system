
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 如此配置即可

//导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http

//配置请求根路径
// $http.baseUrl = 'https://api-ugo-web.itheima.net'
$http.baseUrl = 'http://localhost:3007'

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
  ...App
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
