<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="账号" prop="username">
      <el-input v-model="user.username" maxlength="30" />
    </el-form-item>
    <el-form-item label="姓名" prop="cname">
      <el-input v-model="user.cname" maxlength="30" />
    </el-form-item>
    <el-form-item label="用户昵称">
      <el-input v-model="user.nick_name" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <!-- <el-button type="danger" size="mini" @click="close">关闭</el-button> -->
    </el-form-item>
  </el-form>
</template>
  
  <script>
import { edit } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      // 表单校验
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        cname: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          edit({
            id:this.user.id,
            username: this.user.username,
            cname: this.user.cname,
            nick_name: this.user.nick_name,
            phone: this.user.phone,
            email: this.user.email,
            sex:this.user.sex,
          }).then((response) => {
            if (response.success) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
            }
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    },
  },
};
</script>
  