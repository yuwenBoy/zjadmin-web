import Vue from 'vue'
import Router from 'vue-router'

import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [{
  path: '/login',
  meta: { title: '登录', noCache: true },
  component: (resolve) => require(['@/views/system/login'], resolve),
  hidden: true
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
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: (resolve) => require(['@/views/system/home'], resolve),
    name: 'Dashboard',
    meta: { title: '首页', icon: 'index', affix: true, noCache: true }
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
{
  path: '/dataDnalyse',
  component: () => import('@/views/dataDnalyse/home'),
  hidden: true,
  children: [
    {
      path: '/dataDnalyse/homeChilder',
      component: () => import('@/views/dataDnalyse/home_childer.vue'),
      name: 'homeChilder'
      // meta: { title: '首页', icon: 'index', affix: true, noCache: true }
    },
    {
      path: '/dataDnalyse/datafx',
      component: () => import('@/views/dataDnalyse/datafx.vue'),
      name: 'datafx',
      children: [
        {
          path: 'numberTotal',
          component: () => import('@/views/dataDnalyse/pages/numberTotal.vue'),
          name: '产量统计'
        },
        {
          path: 'planTotal',
          component: () => import('@/views/dataDnalyse/pages/planTotal.vue'),
          name: '计划完成率'
        },
        {
          path: 'punctual',
          component: () => import('@/views/dataDnalyse/pages/punctual.vue'),
          name: '准时交付率'
        },
        {
          path: 'jobTimeTotal',
          component: () => import('@/views/dataDnalyse/pages/jobTimeTotal.vue'),
          name: '装调工时统计'
        },
        {
          path: 'qualityTotal',
          component: () => import('@/views/dataDnalyse/pages/qualityTotal.vue'),
          name: '质量数据统计'
        },
        {
          path: 'stockTotal',
          component: () => import('@/views/dataDnalyse/pages/stockTotal.vue'),
          name: '物料库存统计'
        },
        {
          path: 'reportTotal',
          component: () => import('@/views/dataDnalyse/pages/reportTotal.vue'),
          name: '告警数据统计'
        }
      ]
    },
    {
      path: '/dataDnalyse/device',
      component: () => import('@/views/dataDnalyse/device.vue'),
      name: 'device',
      children: [
        {
          path: 'deviceList',
          component: () => import('@/views/dataDnalyse/pages/deviceList.vue'),
          name: '全部设备'
        },
        {
          path: 'agv',
          component: () => import('@/views/dataDnalyse/pages/agv.vue'),
          name: 'agv'
        },
        {
          path: 'centerOpt',
          component: () => import('@/views/dataDnalyse/pages/centerOpt.vue'),
          name: '氦吹中央控制系统'
        },
        {
          path: 'privateTest',
          component: () => import('@/views/dataDnalyse/pages/privateTest.vue'),
          name: '导通绝缘测试仪'
        },
        {
          path: 'countTest',
          component: () => import('@/views/dataDnalyse/pages/countTest.vue'),
          name: '总成测试仪'
        },
        {
          path: 'floorSource',
          component: () => import('@/views/dataDnalyse/pages/floorSource.vue'),
          name: '地面能源'
        },
        {
          path: 'floorPower',
          component: () => import('@/views/dataDnalyse/pages/floorPower.vue'),
          name: '地面电源'
        },
        {
          path: 'workPosition',
          component: () => import('@/views/dataDnalyse/pages/workPosition.vue'),
          name: '喷管工位'
        },
        {
          path: 'autoDevice',
          component: () => import('@/views/dataDnalyse/pages/autoDevice.vue'),
          name: '自动化压装设备'
        }
      ]
    }
  ]
}
]
export default new Router({
  mode: 'hash', // history
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
