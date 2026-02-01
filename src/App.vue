<template>
  <div id="app">
    <div class="load_box"></div>
     <TitleBar v-if="isElectron" />
      <div :class="isElectron ? 'main-content':'web-content'">
        <router-view />
      </div>
  </div>
</template>
<script>
import TitleBar from '@/components/electron/TitleBar/index.vue'
export default {
  name: 'App',
  components: { TitleBar },
  computed: {
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    }
  },
  async mounted(){
    // 延迟检测，确保 preload 注入完成
  setTimeout(() => {
    console.log('检测 window.electronAPI:', window.electronAPI);
    
    if (window.electronAPI && window.electronAPI.isElectron) {
      console.log('🎉 成功运行在 Electron 桌面端！');
       window.electronAPI.onNavAction((action) => {
        if (action === 'back') {
          this.handleBack();
        } else if (action === 'forward') {
          this.handleForward();
        }
      });
    } else {
      console.log('⚠️ 当前运行在浏览器环境');
    }
  }, 500); // 延迟 500ms
  },
  methods: {
    exitApp() {
       // 调用 electronAPI 退出
      if (window.electronAPI && window.electronAPI.quitApp) {
           window.electronAPI.quitApp()
      }
    },
    handleBack() {
      // 判断边界：不能返回登录页或空页面
      if (this.$route.path === '/login' || window.history.length <= 1) {
        return;
      }
      this.$router.back();
    },
    handleForward() {
      this.$router.forward();
    }
 }
}
</script>
<style lang="scss" scoped>
#app {
  background: #f5f5f5;
  .load_box {
    background-color: #000;
    z-index: 99;
    position: fixed;
    opacity: 0.6;
    top: 0;
    left: 0;
  }
}
/* table */
.el-table {
    color: #353535;
    font-size: 12px;
}
.el-table td, .el-table th {
  padding:5px 0;
}
.el-table thead {
  font-size: 12px;
  padding: 5px 0;
  background-color: #ebeef5 !important;
  color: #333;
}
.el-table thead tr{background: none;
}
.el-table th{ background: none;
}
/* 弹出框 */
.el-dialog__title {
  font-size: 14px;
  font-weight: 700;
}
.el-dialog {
  margin-top: 10vh !important;
}
.el-dialog__header {
  border-bottom: 1px solid #e8e8e8;
}
/* 为标题栏留出空间 */
.main-content {
  padding-top: 42px;  /* 与 TitleBar 高度一致 */
  height: 100%;
  overflow: auto;
}
.web-content{
  height: 100%;
  overflow: auto;
}
</style>
