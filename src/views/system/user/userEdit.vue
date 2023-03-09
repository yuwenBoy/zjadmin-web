<template>
  <!-- <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="700px"
  > -->
  <el-drawer
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    direction="rtl"
    size="40%"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="top"
      label-width="80px"
      style="padding: 15px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="账号:" prop="userName">
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
          <el-form-item label="姓名:" prop="cname">
            <el-input v-model="form.cname" clearable placeholder="请输入姓名" />
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
              max="11"
              clearable
              placeholder="请输入手机号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" clearable placeholder="请输入邮箱" />
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
        <!-- <el-col :span="12">
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
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="dept.id">
            <Department
              v-model="form.dept.id"
              :is-lazy="isLazy"
              :width="width"
              :placeholder="placeholder"
              @input="updateLyDeptId"
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="选择机构">
            <treeselect
              v-model="form.pid"
              style="width:270px;"
              :options="deptList"
              :load-options="loadMenus"
              placeholder="选择机构"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.disabled">
              <el-radio-button label="0">启用</el-radio-button>
              <el-radio-button label="1">锁定</el-radio-button>
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
      </el-row> -->
    </el-form>
    <div slot="footer" class="demo-drawer__footer">
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
    </div>
  </el-drawer>
  <!-- </el-dialog> -->
</template>

<script>
import { form } from "@crud/crud";
import { isvalidPhone } from "@/utils/validate";
import CRUD, { presenter } from "@crud/crud";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { getDeptTree } from "@/api/system/department";
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
  disabled: 0,
  dept: { id: "" },
  position: { id: "" },
  birthday: "",
};
export default {
  components: { Treeselect },
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
        userName: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        cname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // email: [
        //   { required: true, message: "请输入邮箱地址", trigger: "blur" },
        //   { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        // ],
        // phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
        "position.id": [
          { required: true, message: "请选择职位", trigger: "change" },
        ],
        "dept.id": [
          { required: true, message: "请选择机构", trigger: "change" },
        ],
      },
      placeholder: "请选择部门",
      isLazy: false,
      width: "238",
      positionList: [],
      deptList: []
    };
  },
  mounted() {
    // getPositionList()
    //   .then((res) => {
    //     if (res.success) {
    //       this.positionList = res.result
    //     }
    //   })
    //   .catch((error) => {
    //     reject(error)
    //   })
    // this.getDeptTree();
  },
  methods: {
    // updateLyDeptId(data) {
    //   // 父组件获取子组件的数据
    //   this.dept.id = data
    // },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (!form.id) {
        console.log("新增");
        this.getDeptTree();
      } else {
        console.log("編輯");
      }
    },

    /**
     * 处理机构展示方式
     */
    async getDeptTree() {
      let response_data = {};
      response_data =  await getDeptTree(); 
      const toTree = (list, pid) => {
        const menu = [];
        list.forEach((item) => {
          if (item.parent_id == pid) {
            const obj = { id: "", pid: "", label: "", children: [] };
            obj.id = item.id;
            obj.pid = item.parent_id;
            obj.label = item.department_name;
            obj.children = toTree(list, item.id);
            menu.push(obj);
            return menu;
          }
        });
        console.log(menu);
        this.deptList = menu;
      };
      toTree(response_data.result, 0);
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        const params = { id: parentNode.id };
        getDeptTree(params).then((res) => {
          parentNode.children = res.result.map(function (obj) {
            if (!obj.leaf) {
              obj.children = null;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 100);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// ::v-deep .el-input-number .el-input__inner {
//   text-align: left;
// }
</style>
