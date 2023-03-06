<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="8"
        :lg="6"
        :xl="5"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img
                  title="点击上传头像"
                  :src="!user.avatar ? Avatar : fileName"
                  class="avatar"
                  @click="toggleShow"
                />
                <myUpload
                  v-model="show"
                  :headers="headers"
                  :url="uploadApi"
                  @crop-upload-fail="cropUploadFail"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login" />登录账号
                  <div class="user-right">{{ form.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" />姓名
                <div class="user-right">{{ form.cname }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept" />所属部门
                <div class="user-right">{{ form.departmentName }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone" />手机号码
                <div class="user-right">{{ form.phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email" />用户邮箱
                <div class="user-right">{{ form.email }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq" />安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  &nbsp; &nbsp;
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<style rel="stylesheet/scss" lang="scss">
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;
    a {
      color: #317ef3;
    }
  }
}
</style>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import Avatar from "@/assets/images/avatar.png";
import { getToken } from "@/utils/auth";
import myUpload from "vue-image-crop-upload";
import { updateUploadUrl } from "@/api/index";
import Config from '@/settings'
export default {
  name: "Center",
  components: {
    myUpload,
  },
  data() {
    return {
      show: false,
      Avatar: Avatar,
      headers: {
        Authorization: getToken(),
      },
      form: {},
      uploadApi: updateUploadUrl,
      fileName:null
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    this.form = {
      id: this.user.id,
      username: this.user.username,
      cname: this.user.cname,
      email: this.user.email,
      phone: this.user.phone,
      departmentName: this.user.dept.departmentName,
    };
    if(this.user.avatar){
      console.log(Config)
        this.fileName='http://localhost:81/img/avatar/'+ this.user.avatar
    }
    store.dispatch("GetInfo").then(() => {});
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch("GetInfo").then(() => {});
    },
    //上传失败回调
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log("上传失败状态" + status);
      console.log("field: " + field);
    },
  },
};
</script>