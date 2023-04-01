<template>
  <el-drawer
    append-to-body
    :wrapperClosable="false"
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    direction="rtl"
    size="40%"
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
          <el-col :span="12">
            <el-form-item label="账号:" prop="username">
              <el-input
                :disabled="form.id>0"
                v-model="form.username"
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
            <el-form-item label="姓名:" prop="cname">
              <el-input
                v-model="form.cname"
                clearable
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称:" prop="nick_name">
              <el-input
                v-model="form.nick_name"
                clearable
                placeholder="请输入昵称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model.number="form.phone"
                maxlength="11"
                clearable
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                clearable
                placeholder="请输入邮箱"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                style="width: 238px"
                clearable
                :picker-options="pickerOptions0"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="选择机构" prop="deptId.id" ref="deptRef">
              <tree-select
                :data="deptEntity"
                :value="form.deptId.id"
                v-model="form.deptId.id"
                @select="selectTree"
                @clear="clearTree"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位" prop="positionId.id">
              <el-select
                v-model="form.positionId.id"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in positionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
import CRUD, { presenter } from "@crud/crud";
import treeSelect from "@/components/tree-select/tree-select.vue";
import { getDeptAll } from "@/api/system/department";
import { getPositionByDeptId } from "@/api/system/position";
const defaultForm = {
  id: null,
  username: "",
  password: "",
  cname: "",
  email: "",
  phone: "",
  address: "",
  nick_name: "",
  sex: "1",
  disabled: 1,
  avatar:'',
  deptId: {
    id: 0,
  },
  positionId: {
    id: "",
  },
  birthday: "",
};
export default {
  components: { treeSelect },
  mixins: [form(defaultForm)],
  data() {
    // 自定义验证
    // const validPhone = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入电话号码'))
    //   } else if (!isvalidPhone(value)) {
    //     callback(new Error('请输入正确的11位手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; // 如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      rules: {
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        cname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        "positionId.id": [
          { required: true, message: "请选择职位", trigger: "change" },
        ],
        "deptId.id": [
          { required: true, message: "请选择机构", trigger: "change" },
        ],
      },
      positionList: [],
      deptList: [],
      deptEntity: [],
    };
  },
  mounted() {},
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.deptEntity = [];
      this.positionList = [];
      this.getDeptAllApi();

      if (!form.id) {
      } else {
        form.dept_id.type = form.dept_id.department_type;
        form.positionId.id = form.position_id.id;
        this.selectTree(form.dept_id);
      }
    },

    async getDeptAllApi() {
      let response_data = {};
      response_data = await getDeptAll();
      this.deptEntity = response_data.result;
    },

    // 根据机构查询职位
    async selectTree(data) {
      this.crud.form.deptId.id = parseInt(data.id);
      this.$nextTick(() => {
        this.$refs.deptRef.$emit("el.form.change", data.id); // 重点！自定义组件使用element的form表单校验
      });
      if (data.type == 2) {
        let res = {};
        res = await getPositionByDeptId({ deptId: data.id });
        this.positionList = res.result;
      } else {
        this.positionList = [];
      }
    },
    // 根据机构查询职位
    clearTree(data) {
      this.crud.form.deptId.id = data;
      this.$refs.deptRef.$emit("el.form.change", data); // 重点！自定义组件使用element的form表单校验
      this.positionList = [];
    },

    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.dept_id = crud.form.deptId.id;
      crud.form.position_id = crud.form.positionId.id;
      if (!crud.form.dept_id) {
        this.$message({
          message: "机构不能为空",
          type: "warning",
        });
        return false;
      } else if (!crud.form.position_id) {
        this.$message({
          message: "职位不能为空",
          type: "warning",
        });
        return false;
      }
      return true;
    },
  },
};
</script>