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


import jxxqzhas from './components/Permission'



Vue.use(jxxqzhas)
Vue.use(Element, {
    size: Cookies.get('size') || 'small'
})
Vue.config.productionTip = false
    /* eslint-disable */
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')