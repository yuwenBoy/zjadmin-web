<template>
  <el-upload
    class="upload-list"
    :action="imagesUploadApi"
    :headers="headers"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    list-type="picture"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <!-- <div slot="tip" class="el-upload__tip">
      只能上传jpg/png文件，且不超过500kb
    </div> -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-upload>
</template>
<script>
import { getToken } from "@/utils/storage";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      headers: {
        Authorization: getToken(),
      },
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["imagesUploadApi"]),
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style>
.el-upload-list.el-upload-list--picture {
    display: flex;
    flex-wrap: wrap;
  }
  .el-upload-list__item {
    flex: 0 0 350px;
    margin-right: 10px;
    margin-bottom: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100px;
  }
  .el-upload-list__item-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>