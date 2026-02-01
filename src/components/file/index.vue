<template>
    <div>
      <el-upload
        class="pic-uploader-component"
        :action="imagesUploadApi"
        :headers="headers"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :before-upload="beforeAvatarUpload"
        :limit="parseInt(maxUploadCount)"
        :on-exceed="handleExceed"
        :auto-upload="true"
        multiple
        :file-list="fileList"
      >
        <i v-for="file in [{}]" :key="file.uid || 'placeholder'" class="el-icon-plus pic-uploader-icon"></i>
        <div v-for="(file, index) in fileList" :key="file.uid" class="pic-list-item">
           <div slot="tip"  v-if="index===0" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <img :src="file.url" class="pic" />
          <span class="el-icon-close" @click="handleRemove(file)"></span>
        </div>
        <p class="maxUploadCount">添加图片{{ fileList.length || 0 }}/{{ maxUploadCount }}</p>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getToken } from "@/utils/storage";
  import { mapGetters } from "vuex";
  import { getFileName } from "@/utils/index";
  
  export default {
    props: {
      value: {
        type: [String, Array],
        default: () => [],
      },
      maxUploadCount: {
        default: 1,
        type: Number,
      },
    },
    data() {
      return {
        resourcesUrl: "http://image.jxxqz.com:3001/", // 设置图片资源的前缀域名
        headers: {
          Authorization: getToken(),
        },
        fileList: [],
        dialogImageUrl: "",
        dialogVisible: false,
      };
    },
    computed: {
      ...mapGetters(["imagesUploadApi"]),
    },
    watch: {
      value(newVal) {
        this.updateFileList(newVal);
      },
    },
    methods: {
      updateFileList(newVal) {
       if(newVal){
        if (newVal instanceof Array) {
          this.fileList = newVal.map((item, index) => ({
            uid: `uid-${index}`, // 确保每个文件有唯一的uid
            name: item.name || getFileName(item.location),
            url:item.location,
            response: { result: [{ location: item.location }] },
          }));
        } else if (typeof newVal === "string") {
          this.fileList =newVal.split(',').map((item, index) => (
            {
              uid: "uid-"+index,
              name: getFileName(item),
              url:item,
              response: { result: [{ location: item }] },
            }
          ))
        } else {
          this.fileList = [];
        }
       }
      },
      handleUploadSuccess(response, file, fileList) {
        const newFile = {
          uid: file.uid,
          name: file.name,
          url: this.resourcesUrl + getFileName(file.response.result[0].location),
          response: file.response,
        };
        this.fileList.push(newFile);
        this.$emit("input", this.fileList.map(t => ({ name: t.name, location: t.url })));
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      handleRemove(file, fileList) {
        const index = this.fileList.findIndex(f => f.uid === file.uid);
        this.fileList.splice(index, 1);
        this.$emit("input", this.fileList.map(f => ({ name: f.name, location: f.response.result[0].location })));
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 ${this.maxUploadCount} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    },
    mounted() {
      this.updateFileList(this.value);
    },
  };
  </script>
  
  <style lang="scss">
  .pic-uploader-component .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }
  
    .pic-list-item {
      position: relative;
      width: 178px;
      height: 178px;
      margin-right: 10px;
      margin-bottom: 10px;
  
      .pic {
        width: 100%;
        height: 100%;
        display: block;
        border: 2px solid transparent; // 默认无边框
      }
  
      .main-pic {
        border: 2px solid #409eff; // 主图样式
      }
  
      .el-icon-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: red;
        line-height: 20px;
        text-align: center;
        font-size: 18px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
      }
    }
  
    .maxUploadCount {
      color: #8c939d;
      position: absolute;
      left: 30%;
      top: 10px;
      font-size: 12px;
    }
  }
  
  .pic-uploader-component .el-upload:hover {
    border-color: #409eff;
  }
  </style>
  