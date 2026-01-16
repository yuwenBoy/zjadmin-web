<template>
    <el-dialog
      append-to-body
      :wrapperClosable="false"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      direction="rtl"
      width="30%"
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
        >
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="属性名称" prop="attributeName">
                <el-input
                  v-model="form.attributeName"
                  clearable
                  placeholder="请输入属性名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="属性类型">
                    <el-radio-group v-model="form.attributeType">
                      <el-radio-button label="1">文本</el-radio-button>
                      <el-radio-button label="2">级联</el-radio-button>
                      <el-radio-button label="3">下拉</el-radio-button>
                      <el-radio-button label="4">多选</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
          </el-row>
          <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否必填">
                    <el-switch v-model="form.isRequired" :active-value="1"
                    :inactive-value="0"></el-switch>
                  </el-form-item>
                </el-col>
          </el-row>
          <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否标星">
                    <el-switch v-model="form.isStar" active-value="1"
                    inactive-value="0"></el-switch>
                  </el-form-item>
                </el-col>
          </el-row>
          <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.description" type="textarea" />
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
          >保存</el-button
        >
        <el-button
          type="default"
          size="mini"
          icon="el-icon-remove-outline"
          @click="crud.cancelCU"
          >关闭</el-button
        >
      </footer>
    </el-dialog>
  </template>
  
  <script>
  import CRUD, { form } from "@crud/crud";
  const defaultForm = {
    attributeName: "",
    attributeType: "1",
    isRequired: 0,
    isStar:"0",
    description:"",
  };
  export default {
    mixins: [form(defaultForm)],
    data() {
      return {
        rules: {
            attributeName: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        },
      };
    },
    mounted(){
    },
    methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    },
  };
  </script>
  
  <style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  </style>
  