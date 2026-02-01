<template>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            size="small"
            label-width="80px"
          >
            <el-form-item label="分组名称" prop="name">
                  <el-input
                    v-model="form.name"
                    clearable
                    placeholder="请输入分组名称"
                  />
                </el-form-item>
           <el-form-item label="排序" prop="sort">
                  <el-slider v-model="form.sort"></el-slider>
                </el-form-item>
            <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" />
                    </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="default"  @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary"  @click="crud.submitCU">确定</el-button>
        </div>
      </el-dialog>
</template>
<script>
import CRUD, { presenter,form } from "@crud/crud";
// import {getStoreList} from '@/api/business/store';
const defaultForm = {
    id: null,
    name: "",
    sort: 99,
    description: "",
    storeId:"",
};
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
          name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
          sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
        },
    };
  },
  methods: {
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
