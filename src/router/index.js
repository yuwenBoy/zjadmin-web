import router from './routers'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import { getModuleAll } from '@/api/system/module'
import { filterAsyncRouter } from '@/store/modules/permission'
import Config from '@/settings'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + '-' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        //  判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取userInfo
          loadMenus(next, to)
          console.log('获取user信息')
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // next()
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(res => {})
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  getModuleAll().then(res => {
    const asyncRouter = filterAsyncRouter(res.result)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  NProgress.done()
})
