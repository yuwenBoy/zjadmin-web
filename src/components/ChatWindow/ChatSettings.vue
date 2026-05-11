<template>
  <el-drawer
    title="聊天设置"
    :visible.sync="visible"
    direction="rtl"
    :size="320"
    :before-close="handleClose"
  >
    <div class="settings-content">
      <!-- 快捷回复设置 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-chat-line-round"></i>
          <span>快捷回复</span>
        </div>
        <div class="quick-replies">
          <div
            v-for="(reply, index) in quickReplies"
            :key="index"
            class="quick-reply-item"
            @click="selectQuickReply(reply)"
          >
            <span class="reply-content">{{ reply }}</span>
            <i class="el-icon-copy-document" @click.stop="copyReply(reply)"></i>
          </div>
          <div class="add-reply" @click="showAddReply = true">
            <i class="el-icon-plus"></i>
            <span>添加快捷回复</span>
          </div>
        </div>
      </div>

      <!-- 自动回复设置 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-bot"></i>
          <span>自动回复</span>
        </div>
        <div class="auto-reply-settings">
          <el-switch
            v-model="autoReplyEnabled"
            active-text="开启"
            inactive-text="关闭"
            @change="saveAutoReplySetting"
          />
          <div v-if="autoReplyEnabled" class="auto-reply-content">
            <el-textarea
              v-model="autoReplyContent"
              rows="3"
              placeholder="请输入自动回复内容"
              class="reply-textarea"
            ></el-textarea>
            <el-button size="small" type="primary" @click="saveAutoReply">保存设置</el-button>
          </div>
        </div>
      </div>

      <!-- 消息提醒设置 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-bell"></i>
          <span>消息提醒</span>
        </div>
        <div class="notification-settings">
          <div class="setting-item">
            <span>新消息声音提醒</span>
            <el-switch
              v-model="soundEnabled"
              active-text="开启"
              inactive-text="关闭"
              @change="saveNotificationSetting"
            />
          </div>
          <div class="setting-item">
            <span>弹窗通知</span>
            <el-switch
              v-model="popupEnabled"
              active-text="开启"
              inactive-text="关闭"
              @change="saveNotificationSetting"
            />
          </div>
        </div>
      </div>

      <!-- 聊天背景设置 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-picture"></i>
          <span>聊天背景</span>
        </div>
        <div class="background-settings">
          <div
            v-for="(bg, index) in backgroundOptions"
            :key="index"
            class="bg-item"
            :class="{ active: currentBackground === bg.value }"
            @click="changeBackground(bg.value)"
          >
            <div class="bg-preview" :style="{ background: bg.color }"></div>
            <span>{{ bg.label }}</span>
          </div>
        </div>
      </div>

      <!-- 清除聊天记录 -->
      <div class="settings-section">
        <div class="section-title">
          <i class="el-icon-delete"></i>
          <span>清除记录</span>
        </div>
        <div class="clear-settings">
          <el-button
            size="small"
            type="danger"
            plain
            @click="clearChatHistory"
          >
            清除当前聊天记录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 添加快捷回复弹窗 -->
    <el-dialog
      title="添加快捷回复"
      :visible.sync="showAddReply"
      width="400px"
    >
      <el-input
        v-model="newReply"
        placeholder="请输入快捷回复内容"
        class="reply-input"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddReply = false">取消</el-button>
        <el-button type="primary" @click="addQuickReply">添加</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
export default {
  name: "ChatSettings",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 快捷回复列表
      quickReplies: [
        "您好，请问有什么可以帮助您的？",
        "感谢您的耐心等待，我马上为您处理。",
        "抱歉，让您久等了，正在查询中...",
        "好的，我已经记录下来了，会尽快处理。",
        "请问还有其他问题需要帮助吗？",
      ],
      showAddReply: false,
      newReply: "",
      // 自动回复设置
      autoReplyEnabled: false,
      autoReplyContent: "您好，我现在忙碌中，会尽快回复您的消息。",
      // 消息提醒设置
      soundEnabled: true,
      popupEnabled: true,
      // 聊天背景设置
      currentBackground: "default",
      backgroundOptions: [
        { label: "默认", value: "default", color: "#f5f7fc" },
        { label: "浅色", value: "light", color: "#e8f4f8" },
        { label: "暖色", value: "warm", color: "#fdf6ea" },
        { label: "深色", value: "dark", color: "#2d3748" },
      ],
    };
  },
  methods: {
    selectQuickReply(reply) {
      this.$emit("selectQuickReply", reply);
    },
    copyReply(reply) {
      navigator.clipboard.writeText(reply).then(() => {
        this.$message.success("已复制到剪贴板");
      });
    },
    addQuickReply() {
      if (this.newReply.trim()) {
        this.quickReplies.push(this.newReply.trim());
        this.newReply = "";
        this.showAddReply = false;
        this.$message.success("添加成功");
      }
    },
    saveAutoReplySetting() {
      // 保存到本地存储
      localStorage.setItem("autoReplyEnabled", this.autoReplyEnabled);
      this.$message.success("设置已保存");
    },
    saveAutoReply() {
      localStorage.setItem("autoReplyContent", this.autoReplyContent);
      this.$message.success("自动回复内容已保存");
    },
    saveNotificationSetting() {
      localStorage.setItem("soundEnabled", this.soundEnabled);
      localStorage.setItem("popupEnabled", this.popupEnabled);
      this.$message.success("通知设置已保存");
    },
    changeBackground(value) {
      this.currentBackground = value;
      localStorage.setItem("chatBackground", value);
      this.$emit("changeBackground", value);
      this.$message.success("聊天背景已更改");
    },
    clearChatHistory() {
      this.$confirm("确定要清除当前聊天记录吗？此操作不可恢复。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$emit("clearHistory");
        this.$message.success("聊天记录已清除");
      });
    },
    handleClose(done) {
      done();
    },
  },
  mounted() {
    // 从本地存储加载设置
    const savedAutoReply = localStorage.getItem("autoReplyEnabled");
    if (savedAutoReply !== null) {
      this.autoReplyEnabled = savedAutoReply === "true";
    }
    const savedContent = localStorage.getItem("autoReplyContent");
    if (savedContent) {
      this.autoReplyContent = savedContent;
    }
    const savedSound = localStorage.getItem("soundEnabled");
    if (savedSound !== null) {
      this.soundEnabled = savedSound === "true";
    }
    const savedPopup = localStorage.getItem("popupEnabled");
    if (savedPopup !== null) {
      this.popupEnabled = savedPopup === "true";
    }
    const savedBg = localStorage.getItem("chatBackground");
    if (savedBg) {
      this.currentBackground = savedBg;
    }
  },
};
</script>

<style scoped>
.settings-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.settings-section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-title i {
  margin-right: 8px;
  color: #409eff;
}

/* 快捷回复 */
.quick-replies {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-reply-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-reply-item:hover {
  background: #e8f4fc;
  transform: translateX(-5px);
}

.reply-content {
  flex: 1;
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-reply-item i {
  color: #909399;
  font-size: 16px;
  margin-left: 10px;
}

.add-reply {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  color: #909399;
  font-size: 14px;
  transition: all 0.3s;
}

.add-reply:hover {
  border-color: #409eff;
  color: #409eff;
}

.add-reply i {
  margin-right: 5px;
}

/* 自动回复设置 */
.auto-reply-settings {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.auto-reply-content {
  margin-top: 15px;
}

.reply-textarea {
  margin-bottom: 10px;
}

/* 消息提醒设置 */
.notification-settings {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  color: #606266;
}

.setting-item:not(:last-child) {
  border-bottom: 1px solid #ebeef5;
}

/* 聊天背景设置 */
.background-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.bg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.bg-item:hover {
  transform: scale(1.05);
}

.bg-item.active {
  border: 2px solid #409eff;
}

.bg-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.bg-item span {
  font-size: 12px;
  color: #606266;
}

/* 清除记录 */
.clear-settings {
  padding: 15px;
  background: #fef0f0;
  border-radius: 8px;
}

/* 弹窗样式 */
.reply-input {
  width: 100%;
}
</style>