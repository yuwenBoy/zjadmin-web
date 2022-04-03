<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="800px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="广告位" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio-button label="1">首页轮播图</el-radio-button>
              <el-radio-button label="2">首页中位广告位</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="广告名称" prop="phone">
            <el-input
              v-model.number="form.phone"
              clearable
              max="50"
              placeholder="请输入广告名称"
            />
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
      >确定</el-button>
      <el-button type="default" size="mini" icon="el-icon-remove-outline" @click="crud.cancelCU">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
const defaultForm = {
  id: null,
  name: '',
  code: ''
}
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入职位编号', trigger: 'blur' }]
      }

    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
