import 'babel-polyfill'
import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'

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
import T from '@/utils/tips'
import utils from '@/utils/utils'

Vue.prototype.$enum = U
Vue.prototype.$alert = T
Vue.prototype.$utils = utils

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
}).$mount('#app')