<template>
    <el-upload
  class="avatar-uploader"
  :headers="headers"
  :action="upload_url"
  :show-file-list="false"
  :limit="1"
  accept=".jpeg,.gif,.png"
  :on-remove="handleRemove"
  name="avatar"
  :data="{id:1}"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="url?'http://localhost:81/img/avatar/'+url:imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 85px;
    height: 85px;
    line-height: 85px;
    text-align: center;
  }
  .avatar {
    width: 85px;
    height: 85px;
    display: block;
  }
</style>

<script>
import { uploadUrl } from "@/api/index"
import { getToken } from "@/utils/auth"
  export default {
    props:{
      url:{
        type:String,
        default(){
          return ""
        }
      }
    },
    data() {
      return {
        imageUrl: '',
        upload_url:uploadUrl,
        headers: {
           Authorization: getToken(),
          }
      }
    },
    mounted(){
      this.imageUrl = this.url
    },
    methods: {
      handleAvatarSuccess(res, file) {
        console.log(res)
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$emit('back',file.response.result.avatar.split('\\')[6])
      },
      beforeAvatarUpload(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpeg,image/gif,image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG,gif,png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleRemove(file) {
        console.log(file);
      },
    }
  }
</script>