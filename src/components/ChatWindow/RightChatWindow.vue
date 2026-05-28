<template>
  <div class="chat-window" :class="`bg-${chatBackground}`">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-left">
        <user-avatar :src="currentContact.avatar" class="contact-avatar" />
        <div class="contact-info">
          <span class="contact-name">{{ contactDisplayName }}</span>
          <div class="status-row">
            <span class="contact-status" :class="contactOnlineStatus">
              {{ contactStatusText }}
            </span>
            <span class="status-divider">|</span>
            <span class="connection-status" :class="connectionStatusClass">
              <i class="el-icon-circle"></i>
              {{ connectionStatusText }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="text" icon="el-icon-phone" @click="handleVoiceCall" title="语音通话">
          <i class="el-icon-phone"></i>
        </el-button>
        <el-button type="text" icon="el-icon-video-camera" @click="handleVideoCall" title="视频通话">
          <i class="el-icon-video-camera"></i>
        </el-button>
        <el-button type="text" icon="el-icon-more" @click="toggleMoreMenu" title="更多">
          <i class="el-icon-more"></i>
        </el-button>
      </div>
      <!-- 更多菜单 -->
      <div class="more-menu" v-if="showMoreMenu">
        <div class="menu-item" @click="handleViewProfile">查看资料</div>
        <div class="menu-item" @click="handleClearHistory">清空记录</div>
        <div class="menu-item danger" @click="handleBlock">拉黑</div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageList" @scroll="handleImScroll">
      <div v-if="isLoadingMore" class="loading-tip">加载更多消息...</div>
      <div v-if="noMoreHistory && messages.length > 0" class="no-more-tip">已加载全部历史消息</div>
      <div v-if="isFirstLoad && messages.length === 0" class="skeleton-list">
        <div v-for="i in 10" :key="i" class="skeleton-item">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content"></div>
        </div>
      </div>
      <div
        v-for="(msg, index) in messages"
        :key="msg.id || index"
        class="message"
        :class="{ 'message-sent': msg.senderId === user.id }"
        :data-message-id="msg.id"
        :data-sender-id="msg.senderId"
      >
        <div class="message-time" v-if="showTime(index)">
          {{ formatChatTimestamp(Date.parse(msg.createdAt)) }}
        </div>
        <div
          :class="msg.senderId === user.id ? 'sender-box' : 'receiver-box'"
          class="message-box"
        >
          <user-avatar :src="msg.senderAvatar || currentContact.avatar" class="msg-avatar"></user-avatar>
          <div class="message-content-wrapper">
            <span class="sender-name" v-if="msg.senderId !== user.id">
              {{ msg.senderUsername || currentContact.name }}
            </span>
            <span class="sender-name sender-self" v-if="msg.senderId === user.id">
              {{ user.username + '(我)' || '我' }}
            </span>
            <div
              class="message-bubble"
              :class="{ 'sent': msg.senderId === user.id, 'received': msg.senderId !== user.id }"
              @contextmenu.prevent="showMessageMenu($event, msg)"
            >
              <span class="message-text">{{ msg.content }}</span>
            </div>
            <div class="message-meta" v-if="msg.senderId === user.id">
              <span class="message-status" :class="getMessageStatusClass(msg)" :title="getMessageStatusText(msg)">
                <i :class="getMessageStatusIcon(msg)"></i>
                <i v-if="isDeliveredOrRead(msg)" class="el-icon-check status-second-check"></i>
              </span>
            </div>
          </div>
        </div>
        <div
          class="message-context-menu"
          v-if="contextMenuVisible && contextMenuMessage && contextMenuMessage.id === msg.id"
          :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
        >
          <div class="menu-option" @click="copyMessage(msg)">复制</div>
          <div class="menu-option" @click="replyMessage(msg)">回复</div>
          <div class="menu-option" v-if="msg.senderId === user.id && canRecall(msg)" @click="recallMessage(msg)">撤回</div>
          <div class="menu-option danger" @click="deleteMessage(msg)">删除</div>
        </div>
      </div>
    </div>

    <!-- 快捷回复悬浮提示 -->
    <div class="quick-reply-popup" v-if="showQuickReplyPopup">
      <div
        v-for="(reply, index) in quickReplies"
        :key="index"
        class="quick-reply-item"
        @click="insertQuickReply(reply)"
      >
        {{ reply }}
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="reply-tip" v-if="replyingMessage">
        <span class="reply-label">回复</span>
        <span class="reply-content">{{ replyingMessage.content }}</span>
        <span class="reply-close" @click="cancelReply">×</span>
      </div>

      <div class="toolbar">
        <div class="tool-group left">
          <el-button type="text" @click="toggleQuickReply" class="tool-btn">
            <i class="el-icon-edit"></i>
          </el-button>
        </div>
      </div>

      <div class="input-area">
        <el-input
          type="textarea"
          :rows="3"
          resize="none"
          v-model="newMessage"
          @keyup.enter.native="sendMessage"
          @keydown.ctrl.enter.native="sendMessage"
          placeholder="请输入消息..."
          class="message-input"
          :maxlength="1000"
        ></el-input>
        <div class="input-footer">
          <span class="char-count">{{ newMessage.length }}/1000</span>
          <div class="send-area">
            <el-button
              type="primary"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
              class="send-btn"
              :loading="isSending"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <ChatSettings
      ref="chatSettings"
      :visible="showSettings"
      @selectQuickReply="insertQuickReply"
      @changeBackground="handleBackgroundChange"
      @clearHistory="handleClearHistory"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { formatChatTimestamp } from "@/utils";
import userAvatar from "@/components/System/user/userAvatar.vue";
import ChatSettings from "./ChatSettings.vue";

export default {
  name: "RightChatWindow",
  components: {
    userAvatar,
    ChatSettings,
  },
  props: {
    chatType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newMessage: "",
      pageNum: 1,
      pageSize: 20,
      isLoadingMore: false,
      noMoreHistory: false,
      scrollDebounce: null,
      isLoadingHistory: false,
      isFirstLoad: true,
      isSending: false,
      quickReplies: [
        "您好，请问有什么可以帮助您的？",
        "感谢您的耐心等待，我马上为您处理。",
        "抱歉，让您久等了，正在查询中...",
        "好的，我已经记录下来了，会尽快处理。",
        "请问还有其他问题需要帮助吗？",
      ],
      showQuickReplyPopup: false,
      showEmojiPicker: false,
      emojiList: ["\\u{1F600}", "\\u{1F602}", "\\u{1F923}", "\\u{1F60A}", "\\u{1F60D}", "\\u{1F970}", "\\u{1F60E}", "\\u{1F914}", "\\u{1F605}", "\\u{1F622}", "\\u{1F62D}", "\\u{1F624}", "\\u{1F917}", "\\u{1F44D}", "\\u{1F44E}", "\\u{1F44F}", "\\u{1F389}", "\\u{2764}", "\\u{1F525}", "\\u{2728}", "\\u{1F4AA}"],
      showAtPicker: false,
      showSettings: false,
      showMoreMenu: false,
      chatBackground: "default",
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 },
      contextMenuMessage: null,
      replyingMessage: null,
    };
  },
  computed: {
    ...mapState("chat", ["messages", "currentContact", "contactList", "userStatus", "isConnected"]),
    ...mapGetters(["user"]),
    contactOnlineStatus() {
      const status = this.userStatus[this.currentContact.id];
      return status || "offline";
    },
    contactStatusText() {
      const status = this.userStatus[this.currentContact.id];
      switch (status) {
        case "online":
          return "在线";
        case "busy":
          return "忙碌";
        default:
          return "离线";
      }
    },
    connectionStatusClass() {
      return this.isConnected ? 'connected' : 'disconnected';
    },
    connectionStatusText() {
      return this.isConnected ? '已连接' : '连接中...';
    },
    contactDisplayName() {
      const contact = this.currentContact;
      if (!contact) return '';
      // 默认显示 name
      return contact.name || contact.nick_name || '未知';
    },
  },
  mounted() {
    this.$store.commit("chat/SET_CURRENT_CHAT", {
      type: this.chatType,
      id: this.currentContact.id,
    });

    this.loadHistoryMessages(1).then(() => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToBottom(true);
        }, 50);
      });
    });

    if (this.chatType === "group") {
      this.$store.state.chat.socket.emit("join_room", "group_" + this.currentContact.id);
    }

    const savedBg = localStorage.getItem("chatBackground");
    if (savedBg) {
      this.chatBackground = savedBg;
    }
  },
  watch: {
    isConnected(newVal, oldVal) {
      if (oldVal !== undefined) {
        if (!newVal) {
          this.$message.warning('连接已断开，正在尝试重连...');
        } else {
          this.$message.success('连接已恢复');
        }
      }
    }
  },
  methods: {
    async loadHistoryMessages(pageNum) {
      if (this.isLoadingMore || this.noMoreHistory) return;
      const el = this.$refs.messageList;
      const firstVisibleMsg = Array.from(el.children).find((child) => {
        const rect = child.getBoundingClientRect();
        return rect.top >= 0;
      });

      const anchorId = firstVisibleMsg && firstVisibleMsg.dataset.messageId;
      const anchorOffset = firstVisibleMsg ? firstVisibleMsg.offsetTop - el.scrollTop : 0;

      this.isFirstLoad = false;
      this.isLoadingMore = true;
      this.isLoadingHistory = true;

      try {
        const list = await this.$store.dispatch("chat/loadHistory", {
          type: this.chatType,
          id: this.currentContact.id,
          page: pageNum,
          pageSize: this.pageSize,
        });

        if (list.length < this.pageSize) {
          this.noMoreHistory = true;
        }

        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const anchorMsg = Array.from(el.children).find(
              (child) => child.dataset.messageId === anchorId
            );
            if (anchorMsg) {
              el.scrollTop = anchorMsg.offsetTop - anchorOffset;
            } else {
              el.scrollTop = el.scrollHeight * 0.1;
            }
            this.isLoadingHistory = false;
          });
        });
      } catch (error) {
        // 加载失败已在上层处理
      } finally {
        this.isLoadingMore = false;
        this.isLoadingHistory = false;
      }
    },
    handleImScroll() {
      clearTimeout(this.scrollDebounce);
      this.scrollDebounce = setTimeout(() => {
        const el = this.$refs.messageList;
        if (!el) return;

        const isAtTop = el.scrollTop <= 100;
        const canLoad = !this.isLoadingMore && !this.noMoreHistory;
        if (isAtTop && canLoad) {
          this.pageNum++;
          this.loadHistoryMessages(this.pageNum);
        }
      }, 500);
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      this.isSending = true;
      const currentUserStatus = this.$store.state.chat.currentUserStatus;
      const payload = {
        content: this.newMessage,
        replyTo: this.replyingMessage ? this.replyingMessage.id : null,
      };

      try {
        if (this.chatType === "private") {
          payload.receiverId = this.currentContact.id;
          payload.targetId = this.currentContact.id;
          payload.targetType = this.currentContact.user_type;

          if (currentUserStatus === "offline") {
            const tempId = "temp_" + Date.now();
            const pendingMessage = {
              ...payload,
              id: tempId,
              senderId: this.user.id,
              senderName: this.user.name,
              senderAvatar: this.user.avatar || "",
              createdAt: new Date().toISOString(),
              status: "pending",
            };
            this.$store.commit("chat/ADD_PENDING_MESSAGE", pendingMessage);

            const localMessage = {
              id: tempId,
              ...pendingMessage,
              senderId: this.user.id,
              senderUsername: this.user.name,
              senderAvatar: this.user.avatar || "",
              status: 0,
            };
            this.$store.commit("chat/ADD_MESSAGE", localMessage);

            const message = {
              targetId: this.currentContact.id,
              lastMessage: this.newMessage,
              lastTime: new Date().toISOString(),
            };
            await this.$store.dispatch("chat/updateMessage", message);
            this.handleSentMessage(message);
          } else {
            await this.$store.dispatch("chat/sendPrivateMessage", payload);
            const message = {
              targetId: this.currentContact.id,
              lastMessage: this.newMessage,
              lastTime: new Date().toISOString(),
            };
            await this.$store.dispatch("chat/updateMessage", message);
            this.handleSentMessage(message);
          }
        } else {
          payload.groupId = this.currentContact.id;
          await this.$store.dispatch("chat/sendGroupMessage", payload);
          const message = {
            targetId: this.currentContact.id,
            lastMessage: this.newMessage.trim(),
            lastTime: new Date().toISOString()
          };
          await this.$store.dispatch("chat/updateMessage", message);
          this.handleSentMessage(message);
        }
      } finally {
        this.newMessage = "";
        this.replyingMessage = null;
        this.isSending = false;

        setTimeout(() => {
          this.scrollToBottom(true);
        }, 100);
      }
    },
    formatChatTimestamp,
    scrollToBottom(force = false) {
      this.$nextTick(() => {
        const el = this.$refs.messageList;
        if (!el) return;

        if (force) {
          el.scrollTop = el.scrollHeight;
        } else {
          const isAtBottom = el.scrollHeight - el.clientHeight - el.scrollTop < 100;
          if (isAtBottom) {
            el.scrollTop = el.scrollHeight;
          }
        }
      });
    },
    getMessageStatusText(message) {
      const status = this.$store.state.chat.messageStatus[message.id] || message.status;
      switch (status) {
        case 0:
          return "待发送";
        case 1:
          return "已发送";
        case 2:
          return "已送达";
        case 3:
          return "已读";
        default:
          return "未发送";
      }
    },
    getMessageStatusIcon(message) {
      const status = this.$store.state.chat.messageStatus[message.id] || message.status;
      switch (status) {
        case 0:
          return "el-icon-loading";
        case 1:
        case 2:
        case 3:
          return "el-icon-check";
        default:
          return "el-icon-warning-outline";
      }
    },
    getMessageStatusClass(message) {
      const status = this.$store.state.chat.messageStatus[message.id] || message.status;
      switch (status) {
        case 0:
          return "status-pending";
        case 1:
          return "status-sent";
        case 2:
          return "status-delivered";
        case 3:
          return "status-read";
        default:
          return "status-failed";
      }
    },
    isDeliveredOrRead(message) {
      const status = this.$store.state.chat.messageStatus[message.id] || message.status;
      return status === 2 || status === 3;
    },
    handleSentMessage(message) {
      const contact = this.contactList.find((c) => c.id === this.currentContact.id);
      if (contact) {
        contact.last_message = message.lastMessage;
        contact.last_time = message.lastTime;
        contact.unread_count = 0;
      }

      this.contactList.sort((a, b) => {
        if (a.id === this.currentContact.id) return -1;
        if (b.id === this.currentContact.id) return 1;
        return 0;
      });
    },
    toggleQuickReply() {
      this.showQuickReplyPopup = !this.showQuickReplyPopup;
      this.showEmojiPicker = false;
      this.showAtPicker = false;
    },
    insertQuickReply(reply) {
      this.newMessage = reply;
      this.showQuickReplyPopup = false;
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
      this.showQuickReplyPopup = false;
      this.showAtPicker = false;
    },
    insertEmoji(emoji) {
      this.newMessage += emoji;
    },
    toggleAtPicker() {
      this.showAtPicker = !this.showAtPicker;
      this.showEmojiPicker = false;
      this.showQuickReplyPopup = false;
    },
    openSettings() {
      this.showSettings = true;
    },
    handleBackgroundChange(bg) {
      this.chatBackground = bg;
    },
    toggleMoreMenu() {
      this.showMoreMenu = !this.showMoreMenu;
      if (!this.showMoreMenu) {
        document.removeEventListener("click", this.handleClickOutside);
      } else {
        document.addEventListener("click", this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      const target = event.target;
      if (!target.closest(".header-actions")) {
        this.showMoreMenu = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    handleViewProfile() {
      this.showMoreMenu = false;
      this.$message.info("查看 " + this.currentContact.name + " 的资料");
    },
    handleClearHistory() {
      this.showMoreMenu = false;
      this.$confirm("确定要清空当前聊天记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.$store.commit("chat/RESET_MESSAGES");
        this.pageNum = 1;
        this.noMoreHistory = false;
        this.$message.success("聊天记录已清空");
      });
    },
    handleBlock() {
      this.showMoreMenu = false;
      this.$confirm("确定要拉黑该用户吗？拉黑后将无法接收该用户的消息。", "提示", {
        type: "warning",
      }).then(() => {
        this.$message.success("已拉黑");
      });
    },
    handleVoiceCall() {
      this.$message.info("语音通话功能开发中");
    },
    handleVideoCall() {
      this.$message.info("视频通话功能开发中");
    },
    handleImageUpload() {
      this.$message.info("图片上传功能开发中");
    },
    handleFileUpload() {
      this.$message.info("文件上传功能开发中");
    },
    showMessageMenu(event, msg) {
      this.contextMenuMessage = msg;
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.contextMenuVisible = true;
      document.addEventListener("click", this.hideContextMenu);
    },
    hideContextMenu() {
      this.contextMenuVisible = false;
      document.removeEventListener("click", this.hideContextMenu);
    },
    copyMessage(msg) {
      navigator.clipboard.writeText(msg.content).then(() => {
        this.$message.success("已复制");
      });
      this.hideContextMenu();
    },
    replyMessage(msg) {
      this.replyingMessage = msg;
      this.hideContextMenu();
    },
    cancelReply() {
      this.replyingMessage = null;
    },
    canRecall(msg) {
      const now = new Date();
      const msgTime = new Date(msg.createdAt);
      const diff = now.getTime() - msgTime.getTime();
      return diff < 2 * 60 * 1000;
    },
    recallMessage(msg) {
      if (this.$store.state.chat.socket) {
        this.$store.state.chat.socket.emit("recall_message", { messageId: msg.id });
        const index = this.messages.findIndex((m) => m.id === msg.id);
        if (index > -1) {
          this.messages.splice(index, 1);
        }
        this.$message.success("消息已撤回");
      }
      this.hideContextMenu();
    },
    deleteMessage(msg) {
      const index = this.messages.findIndex((m) => m.id === msg.id);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
      this.$message.success("消息已删除");
      this.hideContextMenu();
    },
    showTime(index) {
      if (index === 0) return true;
      const currentTime = new Date(this.messages[index].createdAt).getTime();
      const prevTime = new Date(this.messages[index - 1].createdAt).getTime();
      return currentTime - prevTime > 5 * 60 * 1000;
    },
  },
  beforeDestroy() {
    clearTimeout(this.scrollDebounce);
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("click", this.hideContextMenu);
  },
  watch: {
    messages: {
      handler(newVal, oldVal) {
        if (this.isLoadingHistory) return;
        if (newVal.length > oldVal.length) {
          this.scrollToBottom(true);
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.chat-window {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bg-default {
  background-color: #f5f7fc;
}

.bg-light {
  background-color: #e8f4f8;
}

.bg-warm {
  background-color: #fdf6ea;
}

.bg-dark {
  background-color: #2d3748;
}

.bg-dark .message-text {
  color: #fff;
}

.chat-header {
  height: 50px;
  padding: 0 15px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.contact-status {
  font-size: 12px;
  color: #909399;
}

.contact-status.online {
  color: #67c23a;
}

.contact-status.busy {
  color: #e6a23c;
}

.status-divider {
  font-size: 12px;
  color: #e4e7ed;
}

.connection-status {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
}

.connection-status i {
  font-size: 8px;
  margin-right: 3px;
  animation: pulse 2s infinite;
}

.connection-status.connected {
  color: #67c23a;
}

.connection-status.connected i {
  animation: none;
}

.connection-status.disconnected {
  color: #e6a23c;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.header-actions {
  display: flex;
  gap: 15px;
}

.header-actions .el-button {
  padding: 0;
  width: 36px;
  height: 36px;
  line-height: 36px;
  color: #606266;
}

.header-actions .el-button:hover {
  color: #409eff;
  background: #e8f4fc;
  border-radius: 50%;
}

.more-menu {
  position: absolute;
  right: 0;
  top: 50px;
  width: 150px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.menu-item {
  padding: 10px 15px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-item.danger {
  color: #f56c6c;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  scroll-behavior: smooth;
}

.message {
  margin-bottom: 15px;
}

.message-time {
  text-align: center;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.message-box {
  display: flex;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 2px solid #fff;
  transition: transform 0.2s ease;
}

.msg-avatar:hover {
  transform: scale(1.05);
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin: 0 10px;
}

.sender-box {
  flex-direction: row-reverse;
}

.sender-box .message-content-wrapper {
  align-items: flex-end;
}

.receiver-box .message-content-wrapper {
  align-items: flex-start;
}

.sender-name {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
  padding: 0 4px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.message-bubble {
  background: #fff;
  padding: 10px 14px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  position: relative;
  max-width: 100%;
  word-break: break-all;
  transition: all 0.2s ease;
}

.message-bubble:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-bubble.sent {
  background: linear-gradient(135deg, #409eff 0%, #1677ff 100%);
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  background: #fff;
  border-bottom-left-radius: 4px;
  border: 1px solid #f0f0f0;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.message-bubble.sent .message-text {
  color: #fff;
}

.message-meta {
  display: flex;
  align-items: center;
  margin-top: 4px;
  margin-right: 2px;
}

.message-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  font-size: 10px;
}

.message-status i {
  font-size: 9px;
  font-weight: bold;
}

.status-second-check {
  position: absolute;
  left: 5px;
  font-size: 9px;
}

.status-pending {
  background: #f5f5f5;
  color: #bfbfbf;
  animation: spin 1s linear infinite;
}

.status-pending i {
  font-size: 10px;
}

.status-sent {
  background: rgba(82, 196, 26, 0.15);
  color: rgba(82, 196, 26, 0.7);
}

.status-delivered {
  background: rgba(82, 196, 26, 0.2);
  color: rgba(82, 196, 26, 0.9);
}

.status-delivered .status-second-check {
  color: rgba(82, 196, 26, 0.9);
}

.status-read {
  background: rgba(82, 196, 26, 0.15);
  color: #52c41a;
}

.status-read .status-second-check {
  color: #52c41a;
}

.status-failed {
  background: rgba(255, 77, 79, 0.15);
  color: #ff4d4f;
  cursor: pointer;
}

.status-failed:hover {
  background: rgba(255, 77, 79, 0.25);
  color: #ff7875;
}

.sender-self {
  font-weight: 600;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.message-context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.menu-option {
  padding: 10px 20px;
  font-size: 14px;
  color: #606266;
  min-width: 100px;
  cursor: pointer;
}

.menu-option:hover {
  background: #f5f7fa;
}

.menu-option.danger {
  color: #f56c6c;
}

.input-container {
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 8px 12px;
}

.reply-tip {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 3px solid #409eff;
}

.reply-label {
  font-size: 12px;
  color: #409eff;
  font-weight: 500;
  margin-right: 8px;
}

.reply-content {
  flex: 1;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reply-close {
  font-size: 16px;
  color: #909399;
  margin-left: 10px;
  cursor: pointer;
  padding: 0 4px;
}

.reply-close:hover {
  color: #606266;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 6px 0;
}

.tool-group {
  display: flex;
  gap: 8px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #606266;
  font-size: 18px;
  transition: all 0.2s;
}

.tool-btn:hover {
  color: #409eff;
  background: #e8f4fc;
}

.emoji-picker {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-category {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.emoji-item {
  font-size: 26px;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.emoji-item:hover {
  background: #f5f7fa;
  transform: scale(1.1);
}

.quick-reply-popup {
  position: absolute;
  bottom: 160px;
  left: 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
}

.quick-reply-item {
  padding: 14px 16px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.quick-reply-item:last-child {
  border-bottom: none;
}

.quick-reply-item:hover {
  background: #e8f4fc;
  color: #409eff;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-input {
  border: 1px solid #e5e5e5;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s;
}

.message-input:focus {
  background: #fff;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #909399;
  padding-left: 4px;
}

.send-area {
  display: flex;
  align-items: center;
}

.send-btn {
  padding: 8px 28px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  min-width: 80px;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.loading-tip,
.no-more-tip {
  text-align: center;
  padding: 10px;
  font-size: 12px;
  color: #909399;
}

.skeleton-list {
  padding: 10px;
}

.skeleton-item {
  display: flex;
  padding: 15px 0;
  animation: pulse 1.5s infinite;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
}

.skeleton-content {
  flex: 1;
  height: 60px;
  margin-left: 10px;
  background: #e0e0e0;
  border-radius: 8px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>