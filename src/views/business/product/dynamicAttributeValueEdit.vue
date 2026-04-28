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
          size="small"
          label-width="120px"
        >
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="属性值名称">
                <el-input
                  v-model="form.value"
                  clearable
                  placeholder="请输入属性值名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-show="form.parent_id>0">
              <el-col :span="24">
                <el-form-item label="上级品类名称" ref="deptRef">
                  <tree-select
                    :data="treeEntity"
                    :value="form.parent_id"
                    v-model="form.parent_id"
                    @select="selectTree"
                    @clear="clearTree"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="排序" prop="sort">
                  <el-slider v-model="form.sort"></el-slider>
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
  import treeSelect from "@/components/tree-select/tree-select.vue";
  import { getCategoryAll } from "@/api/system/dynamicAttributeValue";
  const defaultForm = {
    id:null,
    value: "",
    attributeId:null,
    sort: 99,
    parent_id: 0,
  };
  export default {
    components: { treeSelect},
    props:{
        attributeId:{
            type:Number,
            default:null
        }
    },
    mixins: [form(defaultForm)],
    data() {
      return {
        treeEntity: [],
      };
    },
    methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
        form.attributeId = this.attributeId;
        this.treeEntity = [];
        this.getTreeAllApi(this.attributeId);
    },
    // 新增取消之前
    [CRUD.HOOK.beforeAddCancel](crud, form){
        crud.defaultForm.parent_id = 0;
    },
    // 新增取消之后
    [CRUD.HOOK.afterAddCancel](crud, form){
        crud.defaultForm.parent_id = 0;
    },
    async getTreeAllApi(attributeId) {
        let response_data = {};
      
        response_data = await getCategoryAll({attributeId});
        this.treeEntity = response_data.result;
      },
  
      // 根据机构查询职位
      async selectTree(data) {
        this.crud.form.parent_id = parseInt(data.id);
      },  // 根据机构查询职位
      clearTree(data) {
        this.crud.form.parent_id = data;
        this.$refs.deptRef.$emit("el.form.change", data); // 重点！自定义组件使用element的form表单校验
      },
    },
  };
  </script>
  
  <style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  </style>
  