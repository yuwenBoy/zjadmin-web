<template>
  <div class="custom-title-bar" v-if="isElectron">
    <div class="bar-title">商家管理端</div>
    <div class="window-controls">
      <button class="control-btn minimize" @click="minimize">−</button>
      <button class="control-btn maximize" @click="maximize">□</button>
      <button class="control-btn close" @click="close">×</button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    }
  },
  methods: {
    minimize() { window.electronAPI.minimize(); },
    maximize() { window.electronAPI.maximize(); },
    close() { window.electronAPI.close(); }
  }
};
</script>

<style scoped>
.custom-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background: #2c3e50;
  color: white;
  -webkit-app-region: drag;  /* 整个标题栏可拖拽 */
  user-select: none;          /* 禁止选中文本 */
  position: fixed;            /* 固定定位，不占页面流 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;              /* 确保在最上层 */
}

.bar-title {
  width: 180px;
  font-size: 14px;
  text-align: center;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;  /* 按钮区域不可拖拽 */
}

.control-btn {
  width: 45px;
  height: 32px;
  border: none;                 /* 去掉边框 */
  background: transparent;      /* 背景透明 */
  color: white;
  font-size: 16px;
  cursor: pointer;
  outline: none;                /* 去掉聚焦边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.minimize:hover, .maximize:hover {
  background: #3498db;
}

.close:hover {
  background: #e74c3c;
}
</style>