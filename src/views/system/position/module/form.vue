<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="职位名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="职位编号" prop="code">
        <el-input v-model="form.code" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="所属部门" prop="dept.id">
        <Department
          :isLazy="isLazy"
          v-model="form.dept.id"
          @input="updateLyDeptId"
          :placeholder="placeholder"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
      >确定</el-button>
      <el-button type="default" @click="crud.cancelCU" size="mini" icon="el-icon-remove-outline">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from "@crud/crud";
import Department from "@/components/Department/index.vue"
const defaultForm = {
  id: null,
  name: "",
  code: "",
  dept:{
    id:''
  }
};
export default {
  mixins: [form(defaultForm)],
  components:{Department},
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入职位名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入职位编号", trigger: "blur" }],
        'dept.id': [{ required: true, message: "请选择部门", trigger: "change" }],
      },
      placeholder: "请选择部门",
      isLazy: false,
    };
  },
   methods:{
       updateLyDeptId(data){
         this.dept.id=data;
      }
   }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
