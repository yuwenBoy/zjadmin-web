<template>
  <div>
    <el-upload
      class="pic-uploader-component"
      :style="uploadStyle"
      :action="imagesUploadApi"
      :headers="headers"
      :list-type="listType"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :before-upload="beforeAvatarUpload"
      :limit="parseInt(maxUploadCount)"
      :on-exceed="handleExceed"
      :auto-upload="true"
      :show-file-list="false"
      multiple
      :file-list="fileList"
    >
      <!-- 提示文字 -->
      <!-- <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过2MB
      </div> -->

      <!-- 自定义文件列表（当使用非 picture-card 时） -->
      <template v-if="listType !== 'picture-card'">
        <div
          v-for="(file, index) in fileList"
          :key="file.uid"
          class="pic-list-item"
          :style="itemStyle"
        >
          <img
            :src="file.url"
            class="pic"
            :class="{ 'main-pic': index === 0 }"
          />
          <span class="el-icon-close" @click.stop="handleRemove(file)"></span>
          <!-- <span v-if="index === 0" class="main-tag">主图</span> -->
        </div>
      </template>

      <!-- 上传按钮 -->
      <div
        class="upload-trigger"
        :style="triggerStyle"
        v-if="fileList.length < maxUploadCount"
      >
        <i class="el-icon-plus pic-uploader-icon"></i>
        <p class="upload-text">
          {{
            maxUploadCount > 1
              ? `添加图片 ${fileList.length}/${maxUploadCount}`
              : "上传图片"
          }}
        </p>
      </div>
    </el-upload>

    <!-- 预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/storage";
import { mapGetters } from "vuex";
import { getFileName } from "@/utils/index";
import request from "@/utils/request";
export default {
  name: "PicUploader",
  props: {
    value: {
      type: [String, Array],
      default: () => [],
    },
    maxUploadCount: {
      default: 1,
      type: Number,
    },
    // 自定义宽高
    css: {
      type: Object,
      default: () => ({ width: "178px", height: "178px" }),
    },
    // 是否使用 picture-card 模式
    usePictureCard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      resourcesUrl: "http://image.jxxqz.com:3001/",
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

    // 计算 list-type
    listType() {
      return this.usePictureCard ? "picture-card" : "text";
    },

    // 上传组件整体样式
    uploadStyle() {
      return {
        "--upload-width": this.css.width || "178px",
        "--upload-height": this.css.height || "178px",
      };
    },

    // 列表项样式
    itemStyle() {
      return {
        width: this.css.width || "178px",
        height: this.css.height || "178px",
      };
    },

    // 上传按钮样式
    triggerStyle() {
      return {
        width: this.css.width || "178px",
        height: this.css.height || "178px",
      };
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.updateFileList(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    updateFileList(newVal) {
      if (!newVal) {
        this.fileList = [];
        return;
      }

      if (Array.isArray(newVal)) {
        this.fileList = newVal.map((item, index) => ({
          uid: item.uid || `uid-${index}-${Date.now()}`,
          name: item.name || getFileName(item.location || item.url),
          url: item.location || item.url,
          response: item.response || {
            result: [{ location: item.location || item.url }],
          },
        }));
      } else if (typeof newVal === "string") {
        this.fileList = newVal
          .split(",")
          .filter(Boolean)
          .map((item, index) => ({
            uid: `uid-${index}-${Date.now()}`,
            name: getFileName(item),
            url: item,
            response: { result: [{ location: item }] },
          }));
      } else {
        this.fileList = [];
      }
    },

    handleUploadSuccess(response, file, fileList) {
      const location = response.result.data || ""; // response.result[0].location || file.url;
      const newFile = {
        uid: file.uid,
        name: file.name,
        url: location, //location.startsWith('http') ? location : this.resourcesUrl + getFileName(location),
        response: response,
      };
      this.fileList.push(newFile);
      this.emitChange();
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("只能上传 JPG/PNG 格式的图片!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },

    async handleRemove(file) {
      // 1. 调用后端删除七牛图片
      await request({
        url: "/oss/removeImg",
        method: "post",
        params: {
          imageUrl: file.url,
        },
      });
      const index = this.fileList.findIndex((f) => f.uid === file.uid);
      if (index > -1) {
        this.fileList.splice(index, 1);
        this.emitChange();
      }
    },

    emitChange() {
      const result = this.fileList.map((f) => ({
        name: f.name,
        location: f.url,
      }));
      this.$emit("input", result.map((r) => r.location).toString());
      this.$emit("change", result.map((r) => r.location).toString());
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传 ${this.maxUploadCount} 张图片`);
    },
  },
};
</script>

<style lang="scss" scoped>
.pic-uploader-component {
  ::v-deep {
    // 覆盖 el-upload 的默认样式
    .el-upload-list {
      display: flex;
      flex-wrap: wrap;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: var(--upload-width, 178px);
      height: var(--upload-height, 178px);
      line-height: var(--upload-height, 178px);
    }

    // 隐藏默认的 picture-card 样式（当使用自定义时）
    .el-upload-list--picture-card {
      .el-upload-list__item {
        border: none;
        margin: 0 10px 10px 0;
      }
    }
  }
}

// 自定义列表项
.pic-list-item {
  position: relative;
  margin: 0 10px 10px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
  display: inline-block;
  vertical-align: top;

  .pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border: 2px solid transparent;
    box-sizing: border-box;

    &.main-pic {
      border-color: #409eff;
    }
  }

  .el-icon-close {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      background: #f56c6c;
    }
  }

  &:hover .el-icon-close {
    opacity: 1;
  }

  .main-tag {
    position: absolute;
    top: 0;
    left: 0;
    background: #409eff;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 0 0 6px 0;
  }
}

// 上传按钮
.upload-trigger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
  background: #fbfdff;
  vertical-align: top;
  margin-bottom: 10px;

  &:hover {
    border-color: #409eff;
  }

  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    margin-bottom: 8px;
  }

  .upload-text {
    color: #8c939d;
    font-size: 12px;
    margin: 0;
  }
}

.el-upload__tip {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}
</style>
