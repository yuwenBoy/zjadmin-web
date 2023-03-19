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
        label-position="top"
        label-width="80px"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="组织名称" ref="deptRef" prop="deptId">
              <tree-select
                :data="deptEntity"
                :value="form.deptId"
                v-model="form.deptId"
                @select="selectTree"
                @clear="clearTree"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="职位名称" prop="name" >
              <el-input v-model="form.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="职位编号" prop="code">
              <el-input v-model="form.code" />
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
import CRUD, { presenter, form } from "@crud/crud";
import { getDeptTree } from "@/api/system/department";
import treeSelect from "@/components/tree-select/tree-select.vue";
const defaultForm = {
  id: null,
  name: "",
  code: "",
  deptId:0,
  sort:0,
};
export default {
  mixins: [form(defaultForm)],
  components: {treeSelect },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入职位编号", trigger: "blur" }],
        deptId: [
          { required: true, message: "请选择组织名称", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请选择排序", trigger: "blur" },
        ],
      },
      deptEntity: [],
    };
  },
  
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.deptEntity = [];
      this.getDeptAll();
    },
    async getDeptAll() {
      let response_data = {};
      response_data = await getDeptTree();
      this.deptEntity = response_data.result;
    },

    // 根据机构查询职位
    async selectTree(data) {
      this.crud.form.deptId = parseInt(data.id);
    },
    // 根据机构查询职位
    clearTree(data) {
      this.crud.form.deptId = data;
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
