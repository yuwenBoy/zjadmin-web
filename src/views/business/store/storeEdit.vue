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
              <el-form-item label="门店名称" prop="storeName">
                <el-input
                  v-model="form.storeName"
                  clearable
                  placeholder="请输入门店名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="门店联系方式" prop="contactInfo">
                <el-input
                  v-model="form.contactInfo"
                  clearable
                  placeholder="请输入联系方式"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="门店地址" prop="address">
                <el-input
                  v-model="form.address"
                  clearable
                  placeholder="请输入门店地址"
                />
              </el-form-item>
            </el-col>
          </el-row>
        <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="门店经度" prop="latitude">
                <el-input
                  v-model="form.latitude"
                  clearable
                  placeholder="请输入门店经度"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="门店纬度" prop="longitude">
                <el-input
                  v-model="form.longitude"
                  clearable
                  placeholder="请输入门店纬度"
                />
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
    </el-drawer>
  </template>
  
  <script>
  import { form } from "@crud/crud";
  const defaultForm = {
    id: null,
    storeName: "",
    contactInfo:"",
    address:"",
    latitude:'',
    longitude:'',
    status:0,
    online:0,
    createdAt:undefined,
    updatedAt:undefined,
    avatarImg:'', // 门店头像
    notice:'你好，欢迎光临',
    remark:'新店开业，请多多支持，谢谢！',
  };
  export default {
    mixins: [form(defaultForm)],
    data() {
      return {
        rules: {
            storeName: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
            contactInfo: [{ required: true, message: "请输入门店联系方式", trigger: "blur" }],
            address: [{ required: true, message: "请输入门店地址", trigger: "blur" }],
            latitude: [{ required: true, message: "请输入门店经度", trigger: "blur" }],
            longitude: [{ required: true, message: "请输入门店纬度", trigger: "blur" }],
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
  