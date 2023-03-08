<template>
  <div id="app">
    <div class="load_box"></div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
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
</style>
