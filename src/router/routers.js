import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'
Vue.use(Router)
export const constantRouterMap = [{
  path: '/login',
  meta: { title: '登录选择', noCache: true },
  component: (resolve) => require(['@/views/system/loginType'], resolve),
  hidden: true
},
{
    path: '/businessLogin',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/business/login'], resolve),
    hidden: true
},
{
  path: '/adminLogin',
  meta: { title: '登录', noCache: true },
  component: (resolve) => require(['@/views/login'], resolve),
  hidden: true
},
{
    path: '/merchantApplication',
    meta: { title: '商家入驻申请', noCache: false },
    component: (resolve) => require(['@/views/business/business/merchantApplication'], resolve),
    hidden: true
},
{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children:[{
        path: 'dashboard',
        component: (resolve) => require(['@/views/system/home'], resolve),
        name: 'dashboard',
        meta: { title: '系统首页', icon: 'index', affix: true, noCache: true }
      }]
},
{
  path: '/404',
  component: (resolve) => require(['@/views/features/404'], resolve),
  hidden: true
},
{
  path: 'redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: (resolve) => require(['@/views/features/redirect'], resolve)
  }]
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'profile',
    component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
    name: '个人中心',
    meta: { title: '个人中心' }
  }]
},
]

// 必须改成 hash 模式，否则 Electron 加载会白屏
export default new Router({
  mode: 'hash', // history
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
