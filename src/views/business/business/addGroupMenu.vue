<template>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="500px">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            size="small"
            label-width="80px"
          >
          <el-row :gutter="24">
          <el-col :span="24">
                <el-form-item label="所属门店" prop="storeId">
              <el-select
                v-model="form.storeId"
                placeholder="请选择"
                clearable style="width: 100%;"
                :disabled="isBusinessDisabled"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.id"
                  :label="item.storeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="分组名称" prop="name">
                  <el-input
                    v-model="form.name"
                    clearable
                    placeholder="请输入分组名称"
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
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" />
                    </el-form-item>
                </el-col>
             </el-row>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="default"  @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary"  @click="crud.submitCU">确定</el-button>
        </div>
      </el-dialog>
</template>
<script>
import CRUD, { presenter,form } from "@crud/crud";
import {getStoreList} from '@/api/business/store';
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
          storeId: [{ required: true, message: "请选择门店", trigger: "blur" }],
        },
        storeList:[],
        isBusinessDisabled:false, // 是否禁用商家下拉
    };
  },
  methods: {
       // 新增与编辑前做的操作
       [CRUD.HOOK.afterToCU](crud, form) {  
        this.storeList = [];
        let _storeId = this.form.id>0 ? this.form.store.id : this.$store.getters.user.business.store.find(t=>t.isDefault==1).id;
        this.form.storeId = _storeId;
        this.getStoreList();
        this.isBusinessDisabled = this.$store.getters.user.userType==2 ? true :false;
      },
      async getStoreList(){
        let res = await getStoreList();
        this.storeList = res.result;
      },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
