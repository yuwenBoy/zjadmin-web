<template>
  <section class="app-main" :class="{'has-tags-view': hasTagsView}">
    <div :class="isElectron? 'app-client-main-content' : 'app-main-content'">
      <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div class="chat-btn" @click="openChat" :class="[chatBtnClass, { 'active': chatVisible }]">
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
    },
    // 根据在线状态返回按钮样式类
    chatBtnClass() {
      const status = this.$store.state.chat.currentUserStatus;
      switch (status) {
        case 'online':
          return 'status-online';
        case 'busy':
          return 'status-busy';
        case 'offline':
        default:
          return 'status-offline';
      }
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
  .app-main-content {
    height: calc(100vh - 50px);
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

  /* 默认样式 */
  color: #ffffff; /* 白色文字 */

  /* 文字居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;

  /* 交互效果 */
  cursor: pointer;
  transition: all 0.3s ease; /* 过渡动画，更丝滑 */
  border: none; /* 去掉边框 */
  outline: none; /* 去掉聚焦轮廓 */
}

/* 在线状态 - 绿色 */
.chat-btn.status-online {
  background-color: #67C23A;
  box-shadow: 0 2px 10px rgba(103, 194, 58, 0.3);
}

.chat-btn.status-online:hover {
  background-color: #5EB838;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(103, 194, 58, 0.4);
}

.chat-btn.status-online.active {
  background-color: #4CAE4C;
  transform: scale(0.95);
}

/* 忙碌状态 - 橙色 */
.chat-btn.status-busy {
  background-color: #E6A23C;
  box-shadow: 0 2px 10px rgba(230, 162, 60, 0.3);
}

.chat-btn.status-busy:hover {
  background-color: #D99532;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(230, 162, 60, 0.4);
}

.chat-btn.status-busy.active {
  background-color: #C9842A;
  transform: scale(0.95);
}

/* 关闭状态 - 灰色 */
.chat-btn.status-offline {
  background-color: #909399;
  box-shadow: 0 2px 10px rgba(144, 147, 153, 0.3);
}

.chat-btn.status-offline:hover {
  background-color: #83878E;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(144, 147, 153, 0.4);
}

.chat-btn.status-offline.active {
  background-color: #767A80;
  transform: scale(0.95);
}
</style>
