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
          <el-form-item label="登录账号" prop="userName">
            <el-input
              v-model="form.userName"
              clearable
              placeholder="请输入登录账号"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="密码">
            <el-input type="password" v-model="form.password" clearable placeholder="默认密码jxxqz123" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="姓名" prop="cname">
            <el-input v-model="form.cname" clearable placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio-button label="1">男</el-radio-button>
              <el-radio-button label="2">女</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model.number="form.phone"
              clearable
              placeholder="请输入手机号"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" clearable placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              style="width: 238px"
              clearable
              :picker-options="pickerOptions0"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="职位" prop="position.id">
            <el-select
              v-model="form.position.id"
              style="width: 238px"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in positionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="dept.id">
            <Department
              :isLazy="isLazy"
              :width="width"
              v-model="form.dept.id"
              @input="updateLyDeptId"
              :placeholder="placeholder"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户状态">
            <el-radio-group v-model="form.isdisabled">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="2">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="地址">
            <el-input v-model="form.address" clearable />
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
      >确定</el-button
    >
    <el-button
      type="default"
      @click="crud.cancelCU"
      size="mini"
      icon="el-icon-remove-outline"
      >关闭</el-button
    >
    </div>
  </el-dialog>
</template>


<script>
import { form } from "@crud/crud";
import { isvalidPhone } from "@/utils/validate";
import Department from "@/components/Department/index.vue";
import { getPositionList } from "@/api/system/position";
const defaultForm = {
  id: null,
  userName: "",
  password: "",
  cname: "",
  email: "",
  phone: "",
  address: "",
  sex: "1",
  isdisabled: "1",
  dept: { id: "" },
  position: { id: "" },
  birthday: "",
};
export default {
  components: { Department },
  mixins: [form(defaultForm)],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      rules: {
        userName: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        cname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, validator: validPhone, trigger: "blur" }],
        "position.id": [
          { required: true, message: "请选择职位", trigger: "change" },
        ],
        "dept.id": [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
      },
      placeholder: "请选择部门",
      isLazy: false,
      width: "238",
      positionList: [],
    };
  },
  mounted() {
    getPositionList()
      .then((res) => {
        if (res.success) {
          this.positionList = res.result;
        }
      })
      .catch((error) => {
        reject(error);
      });
  },
  methods: {
    updateLyDeptId(data) {
      // 父组件获取子组件的数据
      this.dept.id = data;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
