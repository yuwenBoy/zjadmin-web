<template>
    <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar 
      :class="['sidebar-container',isElectron && 'top42']"
      @submenu-toggle="handleSubmenuToggle"
    />
    <div :class="{hasTagsView:needTagsView}" class="main-container" :style="mainContainerStyle">
      <div :class="{'fixed-header':fixedHeader,'top42':isElectron}" :style="fixedHeaderStyle">
        <navbar />
        <tags-view v-if="needTagsView" :style="tagsViewStyle" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <!--  防止刷新后主题丢失  -->
    <Theme v-show="false" ref="theme" />
    <!-- 订单推送通知组件 -->
    <order-push-notification />
    </div>
</template>


<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import Theme from '@/components/ThemePicker'
import Cookies from 'js-cookie'
import OrderPushNotification from '@/components/OrderPush'
export default {
  name: 'Layout',
  components: {
     RightPanel,
    AppMain,
    Navbar,
    Settings,
    Sidebar,
    TagsView,
    Theme,
    OrderPushNotification
  },
  mixins: [ResizeMixin],
  data() {
    return {
      submenuPanelWidth: 0 // 子菜单面板宽度
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      isElectron() {
         return window.electronAPI && window.electronAPI.isElectron;
      },
      user: state => state.user.user
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    // 主内容区域样式
    mainContainerStyle() {
      const baseWidth = 110 // 左侧导航栏宽度
      const panelWidth = this.submenuPanelWidth
      return {
        marginLeft: `${baseWidth + panelWidth}px`
      }
    },
    // 固定头部样式
    fixedHeaderStyle() {
      return {
        width: '100%'
      }
    },
    // 标签页容器样式
    tagsViewStyle() {
      const baseWidth = 110 // 左侧导航栏宽度
      const panelWidth = this.submenuPanelWidth
      return {
        width: `calc(100% - ${baseWidth + panelWidth}px)`,
        marginLeft: `${baseWidth + panelWidth}px`
      }
    }
  },
  mounted() {
    if (Cookies.get('theme')) {
      this.$refs.theme.theme = Cookies.get('theme')
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: Cookies.get('theme')
      })
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 处理子菜单展开/收起
    handleSubmenuToggle(isOpen) {
      this.submenuPanelWidth = isOpen ? 114 : 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: width 0.28s;
    padding: 0;
  }
  .top42{
    top:42px !important;
  }
</style>
