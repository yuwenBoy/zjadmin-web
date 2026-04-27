<template>
  <section class="app-main" :class="{'has-tags-view': hasTagsView}">
    <div :class="isElectron? 'app-client-main-content' : 'app-main-content'">
      <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div  class="chat-btn"  @click="openChat" :class="{ 'active': chatVisible }">
      消息
    </div>
    <chat-window ref="platformChat" />
    </div>
    <!-- <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div> -->
  </section>
</template>

<script>
import ChatWindow from "@/components/ChatWindow/index.vue";
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    },
    hasTagsView() {
      return this.$store.state.settings.tagsView
    },
    key() {
      return this.$route.path
    }
  },
  components: {
    ChatWindow
  },
  data() {
    return {
      chatVisible: false, // 控制聊天窗口显示状态
    };
  },
  mounted() {
    // Electron 特有：监听来自其他窗口的“打开客服”事件
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.on('open-platform-chat', () => {
        this.openChat()
      })
    }
  },
  methods: {
    // 打开聊天窗口
    async openChat() {
      this.chatVisible = true
      await this.$refs.platformChat.openDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  .app-main-content {
    height: calc(100vh - 30px);
    overflow-y: auto;
    background-color: #f5f7fc;
    overflow-x: hidden;
  }
  .app-client-main-content{
    height: calc(100vh - 83px);
    overflow-y: auto;
    background-color: #f5f7fc;
    overflow-x: hidden;
  }
}

.app-main {
  padding-top: 50px; // 默认有固定导航栏

  &.has-tags-view {
    padding-top: 84px; // 有标签页时 50 + 34
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

/* 圆形消息按钮核心样式 */
.chat-btn {
  /* 定位：左侧中下方 */
  position: fixed; /* 固定定位，不随滚动变化 */
  right: 0px; /* 距离左侧20px */
  bottom: 100px; /* 距离底部100px（中下方），可自行调整 */
  z-index: 9999; /* 确保按钮在最上层，不被遮挡 */

  /* 圆形样式 */
  width: 45px;
  height: 45px;
  border-radius: 50%; /* 圆角50%实现圆形 */

  /* 绿色调样式（适配你的界面风格） */
  background-color: #36b37e; /* ElementUI 绿色主色调，可自行调整 */
  color: #ffffff; /* 白色文字 */

  /* 文字居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;

  /* 交互效果 */
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(54, 179, 126, 0.3); /* 绿色系阴影，增强层次感 */
  transition: all 0.3s ease; /* 过渡动画，更丝滑 */
  border: none; /* 去掉边框 */
  outline: none; /* 去掉聚焦轮廓 */
}

/* 鼠标悬浮效果 */
.chat-btn:hover {
  background-color: #2ea06e; /* 深一点的绿色 */
  transform: scale(1.05); /* 轻微放大 */
  box-shadow: 0 4px 15px rgba(54, 179, 126, 0.4);
}

/* 按钮激活状态（聊天窗口打开时） */
.chat-btn.active {
  background-color: #1f7d54; /* 更深的绿色 */
  transform: scale(0.95); /* 轻微缩小，反馈点击状态 */
}
</style>
