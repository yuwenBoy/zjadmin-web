<template>
  <div class="sidebar-wrapper">
    <!-- 左侧菜单栏 -->
    <div class="sidebar-nav has-search">
      <!-- 搜索框 -->
      <div class="menu-search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索菜单"
          prefix-icon="el-icon-search"
          size="small"
          clearable
          @focus="showSearchResult = true"
          @blur="handleSearchBlur"
        />
        <!-- 搜索结果下拉 -->
        <div v-show="showSearchResult && filteredMenus.length > 0" class="search-result-dropdown">
          <div
            v-for="(item, idx) in filteredMenus"
            :key="idx"
            class="search-result-item"
            @mousedown.prevent="handleSearchSelect(item)"
          >
            <span class="result-title">{{ item.title }}</span>
          </div>
        </div>
        <div v-show="showSearchResult && searchKeyword && filteredMenus.length === 0" class="search-result-dropdown no-result">
          <div class="search-result-item">无搜索结果</div>
        </div>
      </div>
      
      <div class="nav-menu-container">
        <div
          v-for="(route, index) in visibleRoutes" 
          :key="index"
          class="nav-item"
          :class="{
            'is-active': isRouteActive(route),
            'is-opened': openedRoute === route
          }"
          @click="handleNavClick(route)"
        >
          <div class="nav-content">
            <!-- 优先使用当前路由的 meta，如果没有则使用第一个子路由的 meta -->
            <template v-if="route.meta">
              <svg-icon v-if="route.meta.icon" :icon-class="route.meta.icon" class="nav-icon"/>
              <span v-else class="nav-icon-placeholder">{{ route.meta.title ? route.meta.title.charAt(0) : '' }}</span>
              <span class="nav-title">{{ route.meta.title }}</span>
            </template>
            <template v-else-if="getFirstVisibleChildMeta(route)">
              <!-- 使用第一个可见子路由的 meta -->
              <svg-icon v-if="getFirstVisibleChildMeta(route).icon" :icon-class="getFirstVisibleChildMeta(route).icon" class="nav-icon"/>
              <span v-else class="nav-icon-placeholder">{{ getFirstVisibleChildMeta(route).title ? getFirstVisibleChildMeta(route).title.charAt(0) : '' }}</span>
              <span class="nav-title">{{ getFirstVisibleChildMeta(route).title }}</span>
            </template>
            <template v-else>
              <span class="nav-icon-placeholder">{{ route.path ? route.path.charAt(0) : 'R' }}</span>
              <span class="nav-title">{{ route.path || '未命名' }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧子菜单面板 -->
    <div 
      v-if="openedRoute && hasChildren(openedRoute)" 
      class="submenu-panel"
      :class="{'is-visible': !!openedRoute}"
    >
      <div class="submenu-header">
        <span class="submenu-title">{{ openedRoute.meta && openedRoute.meta.title }}</span>
      </div>
      <div class="submenu-content-wrapper">
        <div class="submenu-content">
          <div
            v-for="child in getVisibleChildren(openedRoute)"
            :key="child.path"
            class="submenu-item"
            :class="{'is-active': isChildActive(child, openedRoute.path)}"
            @click="handleChildClick(child, openedRoute)"
          >
            <span class="submenu-item-title">{{ child.meta && child.meta.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import './index.scss'

export default {
  components: {},
  data() {
    return {
      openedRoute: null,
      searchKeyword: '',
      showSearchResult: false
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    // 过滤掉 hidden 的路由
    visibleRoutes() {
      return this.permission_routers.filter(route => !route.hidden)
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // 所有二级菜单列表（用于搜索）
    allSecondMenus() {
      const menus = []
      this.visibleRoutes.forEach(route => {
        if (route.children && route.children.length > 0) {
          route.children.forEach(child => {
            if (!child.hidden && child.meta && child.meta.title) {
              menus.push({
                path: this.resolvePath(child.path, route.path),
                title: child.meta.title,
                parentTitle: (route.meta && route.meta.title) || '',
                icon: (child.meta && child.meta.icon) || ''
              })
            }
          })
        }
      })
      return menus
    },
    // 过滤后的菜单
    filteredMenus() {
      if (!this.searchKeyword.trim()) {
        return []
      }
      const keyword = this.searchKeyword.toLowerCase()
      return this.allSecondMenus.filter(menu => 
        menu.title.toLowerCase().includes(keyword)
      )
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler() {
        // 根据当前路由自动展开对应的一级菜单
        this.autoOpenCurrentRoute()
      }
    },
    'openedRoute'(newVal) {
      // 通知父组件子菜单面板状态变化
      this.$emit('submenu-toggle', !!newVal && this.hasChildren(newVal))
    }
  },
  methods: {
    // 判断路由是否激活（当前展开的面板或当前路由所属的一级菜单）
    isRouteActive(route) {
      const currentPath = this.$route.path
      // 如果当前路由直接匹配该路由
      if (currentPath === route.path) return true
      
      // 如果该路由是当前展开的面板，高亮它
      if (this.openedRoute === route) return true
      
      // 检查当前路由是否属于该路由的子菜单
      if (route.children) {
        const visibleChildren = route.children.filter(child => !child.hidden)
        // 如果有多个子菜单，只有当前展开时才高亮
        if (visibleChildren.length > 1) {
          return this.openedRoute === route
        }
        // 只有一个子菜单，检查是否匹配当前路由
        if (visibleChildren.length === 1) {
          const childPath = this.resolvePath(visibleChildren[0].path, route.path)
          return currentPath === childPath || currentPath.startsWith(childPath + '/')
        }
      }
      return false
    },
    // 判断是否有子菜单（排除只有一个子菜单的情况，如首页）
    hasChildren(route) {
      if (!route.children || route.children.length === 0) return false
      // 过滤掉隐藏的子菜单
      const visibleChildren = route.children.filter(child => !child.hidden)
      // 如果只有一个可见子菜单，视为无子菜单（点击直接跳转）
      if (visibleChildren.length === 1) return false
      return visibleChildren.length > 1
    },
    // 获取可见的子菜单
    getVisibleChildren(route) {
      if (!route.children) return []
      return route.children.filter(child => !child.hidden)
    },
    // 判断是否子菜单激活 - 传入父路由路径
    isChildActive(child, parentPath) {
      const currentPath = this.$route.path
      const childPath = child.path || ''

      // 解析子菜单完整路径
      let fullPath
      if (childPath.startsWith('/')) {
        fullPath = childPath
      } else {
        fullPath = this.resolvePath(childPath, parentPath || '')
      }

      // 检查1：当前路由是否等于子菜单路径
      if (currentPath === fullPath) {
        return true
      }

      // 检查2：当前路由是否以子菜单完整路径开头
      if (fullPath.length > 1 && currentPath.startsWith(fullPath + '/')) {
        return true
      }

      // 检查3：当前路由是否以父路径开头，且下一级路径匹配子菜单第一级
      if (parentPath && parentPath !== '/' && currentPath.startsWith(parentPath + '/')) {
        const afterParent = currentPath.slice(parentPath.length + 1) // 去掉父路径和斜杠
        const currentFirstSeg = afterParent.split('/')[0] // 当前路由的第一级
        const childFirstSeg = childPath.split('/')[0] // 子菜单路径的第一级
        // 子菜单路径可能是 'productList'，当前路由可能是 'productList' 开头
        if (currentFirstSeg && childFirstSeg && currentFirstSeg === childFirstSeg) {
          return true
        }
      }

      // 检查4：使用标准化的路径进行比较（去掉首尾斜杠）
      const normalize = (path) => {
        if (!path) return ''
        return path.replace(/^\/+|\/+$/g, '') // 去掉开头和结尾的斜杠
      }
      const normCurrent = normalize(currentPath)
      const normFullPath = normalize(fullPath)
      const normChildPath = normalize(childPath)

      // 完全匹配
      if (normCurrent === normFullPath) {
        return true
      }
      // 当前路由以子菜单完整路径开头
      if (normFullPath && normCurrent.startsWith(normFullPath + '/')) {
        return true
      }
      // 当前路由第一级匹配子菜单路径第一级
      const currentSegments = normCurrent.split('/')
      const childSegments = normChildPath.split('/')
      if (currentSegments[0] && childSegments[0] && currentSegments[0] === childSegments[0]) {
        return true
      }

      // 检查5：父路径匹配 - 只要当前路由属于这个父路由下，且子菜单是该父路由的默认/第一个子菜单
      // 这处理一些路径命名不一致的情况
      if (parentPath && parentPath !== '/') {
        const normParent = normalize(parentPath)
        // 如果当前路由以父路径开头
        if (normCurrent.startsWith(normParent + '/') || normCurrent === normParent) {
          // 获取当前路由在父路径后的第一段
          const afterParent = normCurrent.slice(normParent.length).replace(/^\//, '')
          const currentSeg = afterParent.split('/')[0]
          // 如果子菜单路径包含当前路由段，或者子菜单路径为空（index路由）
          if (!normChildPath || normChildPath === currentSeg || normChildPath.startsWith(currentSeg + '/')) {
            return true
          }
          // 特殊处理：如果子菜单是 index 或空路径，匹配所有该父路由下的页面
          if ((childPath === '' || childPath === '/' || normChildPath === 'index') && afterParent) {
            // 检查是否还有其他子菜单能更精确匹配，如果没有则这个匹配
            const siblings = this.getVisibleChildren({ path: parentPath, children: this.openedRoute ? this.openedRoute.children : [] })
            const hasBetterMatch = siblings.some(sibling => {
              if (sibling === child) return false
              const sibPath = normalize(sibling.path || '')
              return sibPath && (sibPath === currentSeg || sibPath.startsWith(currentSeg + '/'))
            })
            if (!hasBetterMatch) {
              return true
            }
          }
        }
      }

      return false
    },
    // 解析路径
    resolvePath(routePath, basePath) {
      if (!routePath) return basePath || ''
      if (routePath.startsWith('/')) return routePath
      const base = basePath || ''
      // 使用简单的路径拼接，避免 path.resolve 的行为差异
      if (base.endsWith('/')) {
        return base + routePath
      }
      return base + '/' + routePath
    },
    // 获取第一个可见子菜单
    getFirstVisibleChild(route) {
      if (!route.children || route.children.length === 0) return null
      return route.children.find(child => !child.hidden)
    },
    // 获取第一个可见子菜单的meta信息
    getFirstVisibleChildMeta(route) {
      const child = this.getFirstVisibleChild(route)
      return child ? child.meta : null
    },
    // 点击导航项
    handleNavClick(route) {
      if (this.hasChildren(route)) {
        // 有多个子菜单，展开面板并跳转到第一个子菜单
        const visibleChildren = this.getVisibleChildren(route)
        if (visibleChildren.length > 0) {
          const firstChild = visibleChildren[0]
          const fullPath = this.resolvePath(firstChild.path, route.path)
          
          // 切换展开的面板
          if (this.openedRoute === route) {
            // 如果已经展开，只跳转不关闭
            this.$router.push(fullPath)
          } else {
            this.openedRoute = route
            this.$emit('submenu-toggle', true)
            this.$router.push(fullPath)
          }
        }
      } else {
        // 只有一个子菜单或没有子菜单，直接跳转到第一个子菜单
        this.openedRoute = null
        this.$emit('submenu-toggle', false)
        const firstChild = this.getFirstVisibleChild(route)
        if (firstChild) {
          // 处理子菜单路径：支持相对路径和绝对路径
          let fullPath
          if (firstChild.path && firstChild.path.startsWith('/')) {
            // 绝对路径直接使用
            fullPath = firstChild.path
          } else {
            // 相对路径拼接父路由路径
            fullPath = this.resolvePath(firstChild.path, route.path)
          }
          this.$router.push(fullPath)
        } else if (route.path) {
          this.$router.push(route.path)
        }
      }
    },
    // 点击子菜单项
    handleChildClick(child, parentRoute) {
      if (child.path) {
        // 解析完整路径
        const fullPath = this.resolvePath(child.path, parentRoute.path)
        this.$router.push(fullPath)
      }
    },
    // 根据当前路由自动展开
    autoOpenCurrentRoute() {
      const currentPath = this.$route.path
      
      // 查找当前路由属于哪个父路由的子菜单（包括只有一个子菜单的情况）
      for (const route of this.visibleRoutes) {
        const visibleChildren = this.getVisibleChildren(route)
        if (visibleChildren.length > 0) {
          // 检查当前路由是否匹配该父路由下的任何子菜单
          // 或当前路由以父路由路径开头（同一模块下的其他页面）
          const isChildRoute = visibleChildren.some(child => {
            const childFullPath = this.resolvePath(child.path, route.path)
            return currentPath === childFullPath || currentPath.startsWith(childFullPath + '/')
          })
          // 额外检查：当前路由是否以父路由路径开头（处理添加/编辑页面等情况）
          const isSameModule = currentPath.startsWith(route.path + '/') && route.path !== '/'
          
          if (isChildRoute || isSameModule) {
            // 如果有多个子菜单，展开面板并设置openedRoute
            if (visibleChildren.length > 1) {
              this.openedRoute = route
              this.$emit('submenu-toggle', true)
            } else {
              // 只有一个子菜单，不展开面板
              this.openedRoute = null
              this.$emit('submenu-toggle', false)
            }
            return
          }
        }
      }
      
      // 没有找到匹配的父路由，关闭面板
      this.openedRoute = null
      this.$emit('submenu-toggle', false)
    },
    // 搜索框失去焦点
    handleSearchBlur() {
      setTimeout(() => {
        this.showSearchResult = false
      }, 200)
    },
    // 选择搜索结果
    handleSearchSelect(item) {
      this.searchKeyword = ''
      this.showSearchResult = false
      this.$router.push(item.path)
    }
  }
}
</script>
