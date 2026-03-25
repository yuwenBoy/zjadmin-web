<template>
  <div class="modifyShopAvatar">
    <div class="header">
      <i class="el-icon-back" @click="goBack"></i
      ><span style="padding-left: 10px">门店头像 </span>
    </div>
    <div class="content">
      <div class="title">
        <div>
          基础头像 <el-tag type="danger" v-if="!avatarUrl">未配置</el-tag
          ><el-tag type="success" v-else>已配置</el-tag>
        </div>
        <!-- <el-link type="primary" :underline="false">驳回记录</el-link> -->
      </div>
      <div class="avatar">
        <pic-upload
          v-model="avatarUrl"
          :css="{ width: '120px', height: '120px' }"
        />
      </div>
      <div class="footer">
        <div class="description" v-if="$route.query.avatarUrl">目前门店头像已生效</div>
        <el-button type="primary" size="small" @click="saveShopAvatar"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import picUpload from "@/components/file";
import { detail, modifyShopAvatar } from "@/api/business/store";
export default {
  components: { picUpload },
  data() {
    return {
      avatarUrl: "", // 门店头像
      storeId: null, // 门店id
    };
  },
  mounted() {
    this.avatarUrl = this.$route.query.avatarUrl;
    this.storeId = this.$route.query.storeId;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    saveShopAvatar() {
      if (!this.avatarUrl) {
        this.$message.error("请上传门店头像");
        return false;
      }
      this.$confirm("确定要保存头像吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        modifyShopAvatar({storeId:this.storeId,avatarUrl:this.avatarUrl}).then((res) => {
          this.$message.success("修改成功");
          this.$router.replace("info");
        });
      });
    },
  },
};
</script>
<style lang="scss">
.modifyShopAvatar {
  height: 100%;
  overflow: auto;
  padding: 15px;
  .header {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding: 15px;

    i:hover {
      cursor: pointer;
    }
  }
  .content {
    padding: 15px;
    background-color: #ffffff;
    max-width: 500px;
    .title {
      display: flex;
      font-size: 18px;
      justify-content: space-between;
    }
    .avatar {
      text-align: center;
      margin: 30px 0;
    }
    .footer {
        .description{line-height:32px}
      background-color: #e8f0ff;
      padding: 10px;
      display: flex;
      justify-content:space-between;
    }
  }
}
</style>
