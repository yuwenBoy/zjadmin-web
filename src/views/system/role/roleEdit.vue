<template>
  <el-drawer
    append-to-body
    :wrapperClosable="false"
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    direction="rtl"
    size="30%"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
  >
    <div class="xin-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input
                v-model="form.name"
                clearable
                placeholder="请输入角色名称"
              />
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="角色编码" prop="code">
              <el-input
                v-model="form.code"
                clearable
                placeholder="请输入角色编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <footer class="xin-footer">
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
        >提交</el-button
      >
      <el-button
        type="default"
        size="mini"
        icon="el-icon-remove-outline"
        @click="crud.cancelCU"
        >关闭</el-button
      >
    </footer>
  </el-drawer>
</template>

<script>
import { form } from "@crud/crud";
const defaultForm = {
  id: null,
  name: "",
  code: "",
  remark: "",
};
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
      },
    };
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
