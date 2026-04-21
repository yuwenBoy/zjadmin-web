<template>
  <div class="custom-title-bar" v-if="isElectron">
    <div class="bar-left">
       <button class="nav-btn btn-back" @click="goBack">
          <i class="el-icon el-icon-back"></i>
       </button>
      <button class="nav-btn btn-refresh" @click="refresh" title="刷新">
        <i class="el-icon el-icon-refresh-right"></i>
      </button>
           <div class="logo-area">
        <!-- <img v-if="leftLogo" :src="leftLogo" class="logo-img"> -->
        <span class="logo-text">{{ title }}</span>
      </div>
    </div>  
    <div class="bar-title">{{ user.userType == 2 ? "商家版" : "系统端" }}</div>
    <div class="window-controls">
      <button class="control-btn minimize" @click="minimize" title="最小化">
        <i class="el-icon el-icon-minus"></i>
      </button>
      <button class="control-btn maximize" @click="maximize" :title="isMaximized ? '还原' : '最大化'">
        <i :class="['el-icon', isMaximized ? 'el-icon-copy-document' : 'el-icon-full-screen']"></i>
      </button>
      <button class="control-btn close" @click="close" title="关闭">
        <i class="el-icon el-icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from '@/assets/images/logo.png'
import BusinessLogo from '@/assets/images/business_logo.png'

export default {
  data() {
    return {
      canGoBack: false,
      isMaximized: false,
      title: 'JXXQZ后台管理系统',
      logo: Logo,
      businessLogo: BusinessLogo,
      leftLogo: '',
    };
  },
  computed: {
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    },
    ...mapGetters(["user"]),
  },
  mounted() {
    this.updateLogo()
  },
  watch: {
    'user.userType': {
      handler() {
        this.updateLogo()
      }
    }
  },
  mounted() {
    this.updateLogo()
    this.updateNavState();
    this.$router.afterEach(() => {
      this.updateNavState();
    });
    
    // 监听窗口状态变化
    if (this.isElectron && window.electronAPI.onWindowMaximized) {
      window.electronAPI.onWindowMaximized(() => {
        this.isMaximized = true;
      });
      window.electronAPI.onWindowUnmaximized(() => {
        this.isMaximized = false;
      });
    }
  },
  methods: {
    updateLogo() {
      if(this.user && this.user.userType == 2){
        this.title = 'JXXQZ商家端'
        this.leftLogo = this.businessLogo
      } else {
        this.title = 'JXXQZ后台管理系统'
        this.leftLogo = this.logo
      }
    },
    updateNavState() {
      // 排除登录页和首页
      this.canGoBack =
        this.$route.path !== "/" &&
        this.$route.path !== "/login" &&
        window.history.length > 1;
    },
    goBack() {
      if (this.canGoBack) {
         this.$router.back();
      }
    },
    refresh() {
      setTimeout(() => {
        location.reload();
      }, 300);
    },
    minimize() {
      window.electronAPI.minimize();
    },
    maximize() {
      window.electronAPI.maximize();
      // 切换状态
      this.isMaximized = !this.isMaximized;
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
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  -webkit-app-region: drag; /* 整个标题栏可拖拽 */
  user-select: none; /* 禁止选中文本 */
  position: fixed; /* 固定定位，不占页面流 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保在最上层 */
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
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent; /* 背景透明 */
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  outline: none; /* 去掉聚焦边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.control-btn:hover {
  background: hsl(0deg 0% 100% / 50%);
}

.bar-left {
  display: flex;
  align-items: center;
  padding: 0 12px;
  -webkit-app-region: no-drag; /* 关键：让按钮可点击 */
}

/* Logo区域样式 */
.logo-area {
  display: flex;
  align-items: center;
  margin-right: 12px;
  
  .logo-img {
    width: 20px;
    height: 20px;
    margin-right: 6px;
    border-radius: 4px;
    object-fit: contain;
  }
  
  .logo-text {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }
}

/* 导航按钮基础样式 - 与右侧 control-btn 协调 */
.nav-btn {
  width: 30px;
  height: 30px;
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
  outline: none; /* 去掉聚焦边框 */
}

/* 悬浮效果 */
.nav-btn:hover:not(:disabled):not(.is-disabled) {
  color: #FFFFFF; /* ElementUI 主题蓝 */
  background: #f5f5f5ad;
}

/* 刷新按钮旋转动画 */
.nav-btn.btn-refresh:active i {
  transition: transform 0.5s;
  transform: rotate(360deg);
}

/* 确保图标居中 */
.nav-btn i {
  font-size: 18px;
}
</style>