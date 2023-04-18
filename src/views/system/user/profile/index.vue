<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :span="6" style="margin-bottom: 10px">
        <el-card class="box-card" style="padding: 10px">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img
                  title="点击上传头像"
                  :src="fileName"
                  class="avatar"
                  @click="toggleShow"
                />
                <myUpload
                  v-model="isDisPlay"
                  :headers="headers"
                  url="/basic-api/oss/updateAvatar"
                  @crop-upload-fail="cropUploadFail"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login" />登录账号
                  <div class="user-right">{{ user.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" />姓名
                <div class="user-right">{{ user.cname }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept" />所属部门
                <div class="user-right">
                  {{ user.dept_id.department_name }} |
                  {{ user.position_id.name }}
                </div>
              </li>
              <li>
                <svg-icon icon-class="phone" />手机号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email" />用户邮箱
                <div class="user-right">{{ user.email }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
            <el-tab-pane label="快捷方式" name=""> </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
  
  <style rel="stylesheet/scss" lang="scss" scoped>
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
import Avatar from "@/assets/images/avatar.png";
import { getToken } from "@/utils/storage";
import myUpload from "vue-image-crop-upload";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import store from "@/store";
export default {
  name: "Center",
  components: {
    myUpload,
    resetPwd,
    userInfo,
  },
  data() {
    return {
      isDisPlay: false,
      Avatar: Avatar,
      headers: {
        Authorization: getToken(),
      },
      form: {},
      activeTab: "userinfo",
      fileName: null,
      userInfo: {},
    };
  },

  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.fileName = "/" + this.user.avatar.split("\\")[3];
  },
  methods: {
    toggleShow() {
      this.isDisPlay = !this.isDisPlay;
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch("GetInfo").then(() => {
        setTimeout(() => {
          this.isDisPlay = false;
        }, 500);
        this.fileName = "/" + this.user.avatar.split("\\")[3];
        console.log(this.fileName);
      });
    },
    //上传失败回调
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log("上传失败状态" + status);
      console.log("field: " + field);
    },
  }
};
</script>