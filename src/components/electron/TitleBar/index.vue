<template>
  <div class="custom-title-bar" v-if="isElectron">
    <button class="nav-btn btn-back" @click="goBack">
      <i class="el-icon el-icon-back"></i>
    </button>
    <button class="nav-btn btn-refresh" @click="refresh" title="刷新">
      <i class="el-icon el-icon-refresh-right"></i>
    </button>
    <div class="bar-title">{{ user.userType == 2 ? "商家版" : "系统端" }}</div>
    <div class="window-controls">
      <button class="control-btn minimize" @click="minimize">−</button>
      <button class="control-btn maximize" @click="maximize">□</button>
      <button class="control-btn close" @click="close">×</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      canGoBack: false,
    };
  },
  computed: {
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    },
    ...mapGetters(["user"]),
  },
  mounted() {
    this.updateNavState();
    this.$router.afterEach(() => {
      this.updateNavState();
    });
  },
  methods: {
    updateNavState() {
      // 排除登录页和首页
      this.canGoBack =
        this.$route.path !== "/" &&
        this.$route.path !== "/login" &&
        window.history.length > 1;
    },
    goBack() {
      console.log("goBack");
      if (this.canGoBack) {
         this.$router.back();
        // 或者用 Electron API：window.electronAPI?.goBack()
      }
    },
    refresh() {
      console.log("刷新");
      // ElementUI 加载中提示
      const loading = this.$loading({
        lock: true,
        text: "刷新中...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });

      setTimeout(() => {
        location.reload();
        // 或者 Electron 方式：window.location.reload();
        loading.close();
      }, 300);
    },
    minimize() {
      window.electronAPI.minimize();
    },
    maximize() {
      window.electronAPI.maximize();
    },
    close() {
      window.electronAPI.close();
    },
  },
};
</script>

<style scoped>
.custom-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  background: #13ce66;
  color: white;
  -webkit-app-region: drag; /* 整个标题栏可拖拽 */
  user-select: none; /* 禁止选中文本 */
  position: fixed; /* 固定定位，不占页面流 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999; /* 确保在最上层 */
}

.bar-title {
  width: 180px;
  font-size: 14px;
  text-align: center;
}

.window-controls {
  display: flex;
  padding-right: 15px;
  -webkit-app-region: no-drag; /* 按钮区域不可拖拽 */
}

.control-btn {
  width: 45px;
  height: 32px;
  border: none; /* 去掉边框 */
  background: transparent; /* 背景透明 */
  color: white;
  font-size: 16px;
  cursor: pointer;
  outline: none; /* 去掉聚焦边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  -webkit-app-region: no-drag; /* 关键：让按钮可点击 */
}

/* 导航按钮基础样式 - 与右侧 control-btn 协调 */
.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #FFFFFF; /* ElementUI 默认文字色 */
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  outline: none;
}

/* 深色标题栏适配（如果你整体是深色） */
.bar-left .nav-btn {
  color: #dcdcdc;
}

/* 悬浮效果 */
.nav-btn:hover:not(:disabled):not(.is-disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: #409eff; /* ElementUI 主题蓝 */
}

/* 深色模式悬浮 */
.dark-mode .nav-btn:hover:not(:disabled):not(.is-disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #409eff;
}

/* 点击反馈 */
.nav-btn:active:not(:disabled):not(.is-disabled) {
  transform: scale(0.9);
}

/* 禁用状态（无法返回时） */
.nav-btn.is-disabled,
.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
  color: #909399;
}

/* 刷新按钮旋转动画 */
.nav-btn.btn-refresh:active i {
  transition: transform 0.5s;
  transform: rotate(360deg);
}

/* 确保图标居中 */
.nav-btn i {
  font-weight: bold;
  font-size: 18px;
}
</style>