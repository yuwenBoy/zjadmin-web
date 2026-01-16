<template>
    <el-dialog
      :title="title"
      :width="width"
      :visible="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :show-close="showClose"
      @close="handleClose"
    >
      <!-- 内容插槽 -->
      <slot name="content"></slot>
  
      <!-- 底部操作按钮 -->
      <template #footer>
        <slot name="footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </slot>
      </template>
    </el-dialog>
  </template>
<script>
export default {
    name:'my-dialog',
    props: {
  // 控制显示状态（支持 v-model）
  visible: {
    type: Boolean,
    default: false
  },
  // 对话框标题
  title: {
    type: String,
    default: '提示'
  },
  // 对话框宽度
  width: {
    type: String,
    default: '50%'
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true
  }
},
  data() {
    return {
      showDialog: false,
      formData: {
        username: ''
      }
    }
  },
  
  methods: {
    handleConfirm() {
    this.$emit('confirm')
  },
  handleCancel() {
    this.$emit('update:visible', false) // 关闭对话框
    this.$emit('cancel')
  },
  handleClose() {
    this.$emit('update:visible', false)
  }
  }
}
</script>