<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="700px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="公告标题" prop="title">
            <el-input
              v-model="form.title"
              clearable
              placeholder="请输入公告标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告类型" prop="type">
            <el-select v-model="form.type" style="width: 238px" placeholder="请选择" clearable>
              <el-option v-for="(val,key) in $enum.noticeType" :key="key" :label="val" :value="key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="级别">
            <el-radio-group v-model="form.priority">
              <el-radio-button label="0">紧急</el-radio-button>
              <el-radio-button label="1">高</el-radio-button>
              <el-radio-button label="2">普通</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="公告内容">
            <el-input v-model="form.content" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
      >提交</el-button>
      <el-button
        type="default"
        size="mini"
        icon="el-icon-remove-outline"
        @click="crud.cancelCU"
      >关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
const defaultForm = {
  id: null,
  title: '',
  priority: '2',
  content: '',
  type: ''
}
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
