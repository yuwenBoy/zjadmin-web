<template>
    <el-popconfirm
      :title="title"
      :confirmButtonText="confirmButtonText"
      :cancelButtonText="cancelButtonText"
      icon="el-icon-info"
      iconColor="red"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <slot name="#reference"></slot>
    </el-popconfirm>
  </template>
  
  <script>
  export default {
    name: 'CustomPopconfirm',
    props: {
      title: {
        type: String,
        default: '确定要执行此操作吗？'
      },
      confirmButtonText: {
        type: String,
        default: '确定'
      },
      cancelButtonText: {
        type: String,
        default: '取消'
      }
    },
    methods: {
      handleConfirm() {
        this.$emit('confirm');
      },
      handleCancel() {
        this.$emit('cancel');
      }
    }
  };
  </script>
  