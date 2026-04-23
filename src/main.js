import 'babel-polyfill'
import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import { getToken } from "@/utils/storage"

import Element from 'element-ui'

import './assets/styles/index.scss'
import './assets/styles/element-variables.scss'

import App from './App.vue'
import router from './router/routers'
import './assets/icons'
import './router/index'
import store from './store'

import './filter/index'
import U from '@/utils/enum'
import alert from '@/utils/alert'

import { handleTree } from '@/utils/index'
Vue.prototype.$enum = U
Vue.prototype.$msg =alert
Vue.prototype.handleTree = handleTree

// 创建全局事件总线
Vue.prototype.$eventBus = new Vue()

import jxxqzhas from './components/Permission'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(jxxqzhas)
Vue.use(Element, {
  size: Cookies.get('size') || 'small'
})
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
/* eslint-disable */
new Vue({
    router,
    store,
    render: h => h(App),
    created() {
    // WebSocket 在 router/index.js 的 GetInfo 成功后初始化
    // 避免在这里初始化时 user 信息还未加载
  },
}).$mount('#app')