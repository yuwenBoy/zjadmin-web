<template>
  <div class="chat-window">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <span class="contact-name">{{ currentContact.name }}</span>
      <div class="header-actions">
        <el-button type="text" icon="el-icon-phone">语音</el-button>
        <el-button type="text" icon="el-icon-video-camera">视频</el-button>
      </div>
    </div>
    <div v-if="noMoreHistory" class="no-more-tip">已加载全部历史消息</div>
    <!-- 消息列表 -->
    <div class="message-list" ref="messageList" @scroll="handleImScroll">
      <div v-if="isLoadingMore" class="loading-tip">加载更多消息...</div>
      <!-- 首次加载时显示骨架屏 -->
      <div v-if="isFirstLoad && messages.length === 0" class="skeleton-list">
        <div v-for="i in 10" :key="i" class="skeleton-item">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content"></div>
        </div>
      </div>
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="{ 'message-sent': msg.senderId === user.id }"
        :data-message-id="msg.id"
        :data-sender-id="msg.senderId"
      >
        <div class="message-time">
          {{ formatChatTimestamp(Date.parse(msg.createdAt)) }}
        </div>
        <div
          :class="msg.senderId === user.id ? 'sender-box' : 'receiver-box'"
          style="display: flex"
        >
          <el-avatar :src="msg.senderAvatar" :size="40"></el-avatar>
          <div class="userinfo">
            <span class="sender cname"
              >{{ msg.senderId === user.id ? "我" : msg.senderUsername }}（{{
                msg.senderId
              }}）</span
            >
            <div class="message-content">{{ msg.content }}</div>
            <span class="message-status" v-if="msg.senderId === user.id">
              {{ getMessageStatusText(msg) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="im_send_container">
      <div class="im_send_icon">
        <i class="el-icon-edit"></i>
      </div>
      <div class="input-area">
        <el-input
          type="textarea"
          :rows="3"
          autofocus
          resize="none"
          v-model="newMessage"
          @keyup.enter.native="sendMessage"
          placeholder="请输入消息..."
        ></el-input>
      </div>
      <div class="send-btn">
        <el-button
          type="primary"
          :disabled="!newMessage.trim()"
          @click="sendMessage"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { formatChatTimestamp } from "@/utils";
export default {
  name: "RightChatWindow",
  props: {
    chatType: {
      type: String, // 'private' 或 'group'
      required: true,
    },
  },
  data() {
    return {
      newMessage: "",
      pageNum: 1,
      pageSize: 19,
      isLoadingMore: false,
      noMoreHistory: false,
      scrollDebounce: null,
      isLoadingHistory: false,
      isFirstLoad: true,
    };
  },
  computed: {
    ...mapState("chat", ["messages", "currentContact"]),
    ...mapGetters(["user"]),
  },
  mounted() {
    // 初始化当前会话
    this.$store.commit("chat/SET_CURRENT_CHAT", {
      type: this.chatType,
      id: this.currentContact.id,
    });

    // 首次加载+手动滚到底部
    this.loadHistoryMessages(1).then(() => {
      this.$nextTick(() => {
        setTimeout(() => {
          // 首次加载后手动标记已读（只执行一次）
          this.scrollToBottom(true);
        }, 50);
      });
    });
    // 如果是群聊，加入房间
    if (this.chatType === "group") {
      this.$store.state.chat.socket.emit(
        "join_room",
        `group_${this.currentContact.id}`
      );
    }
    this.autoMarkAsRead();
  },
  methods: {
    async loadHistoryMessages(pageNum) {
      if (this.isLoadingMore || this.noMoreHistory) return;
      const el = this.$refs.messageList;
      // ✅ 记录第一个可见消息的 ID 和位置
      const firstVisibleMsg = Array.from(el.children).find((child) => {
        const rect = child.getBoundingClientRect();
        return rect.top >= 0; // 第一个在视口内的消息
      });

      const anchorId = firstVisibleMsg && firstVisibleMsg.dataset.messageId;
      const anchorOffset = firstVisibleMsg
        ? firstVisibleMsg.offsetTop - el.scrollTop
        : 0;
      this.isFirstLoad = false;  
      this.isLoadingMore = true;
      this.isLoadingHistory = true; // 标记开始加载历史消息
      try {
        const list = await this.$store.dispatch("chat/loadHistory", {
          type: this.chatType,
          id: this.currentContact.id,
          page:pageNum,
          pageSize: this.pageSize,
        });

        // ✅ 核心：只要返回数量 < 页大小，就标记“无更多”（包括返回0的情况）
        if (list.length < this.pageSize) {
          this.noMoreHistory = true;
        }
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const anchorMsg = Array.from(el.children).find(
              (child) => child.dataset.messageId === anchorId
            );
            if (anchorMsg) {
              // 精确恢复：锚点消息的 offsetTop - 之前的相对偏移
              el.scrollTop = anchorMsg.offsetTop - anchorOffset;
            } else {
              // fallback
              el.scrollTop = el.scrollHeight * 0.1; // 显示顶部 10%
            }
            this.isLoadingHistory = false; // 标记结束加载历史消息
          });
        });
      } catch (error) {
        console.error("加载失败:", error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    handleImScroll() {
      // ✅ 清空原有防抖定时器
      clearTimeout(this.scrollDebounce);
      // ✅ 防抖时间改为500ms，避免快速滚动多次触发
      this.scrollDebounce = setTimeout(() => {
        const el = this.$refs.messageList;
        if (!el) return;

        const isAtTop = el.scrollTop <= 100;
        const canLoad = !this.isLoadingMore && !this.noMoreHistory;
        if (isAtTop && canLoad) {
          this.pageNum++  
          this.loadHistoryMessages(this.pageNum);
        }
      }, 500);
    },
    // 发送消息
    async sendMessage() {
      if (!this.newMessage.trim()) return;
      const payload = {
        content: this.newMessage,
      };

      if (this.chatType === "private") {
        payload.receiverId = this.currentContact.id;
        payload.targetId = this.currentContact.id;
        payload.targetType = this.currentContact.user_type;
        await this.$store.dispatch("chat/sendPrivateMessage", payload);
        const message = {
          targetId: this.currentContact.id,
          lastMessage: this.newMessage,
          lastTime: new Date().toISOString(),
        };
        await this.$store.dispatch("chat/updateMessage", message);
        this.$emit("sent", message);
      } else {
        payload.groupId = this.currentContact.id;

        await this.$store.dispatch("chat/sendGroupMessage", {});
      }
      this.newMessage = "";
      // 强制滚动
      this.scrollToBottom(true);
    },
    formatChatTimestamp,
    // 滚动到底部(发送消息时用)
    scrollToBottom(force = false) {
      this.$nextTick(() => {
        setTimeout(() => {
          const el = this.$refs.messageList;
          if (!el) return;

          // 判断是否已经在底部（允许100px误差）
          const isAtBottom =
            el.scrollHeight - el.clientHeight - el.scrollTop < 100;
          // 强制滚动 或 已在底部
          if (force || isAtBottom) {
            el.scrollTop = el.scrollHeight + 9999;
          }
        }, 50);
      });
    },
    getMessageStatusText(message) {
      const status =
        this.$store.state.chat.messageStatus[message.id] || message.status;
      switch (status) {
        case 1:
          return "已发送"; // 已发送（灰色）
        case 2:
          return "已读"; // 已送达（灰色双勾）
        case 3:
          return "发送失败"; // 已读（蓝色双勾）
        default:
          return "未读"; // 未读
      }
    },

    // 自动标记已读
    autoMarkAsRead() {
      this.$store.dispatch("chat/autoMarkAsRead");
    },
  },
  watch: {
    // ✅ 监听消息变化，自动滚动到底部
    messages: {
      handler(newVal, oldVal) {
        if (this.isLoadingHistory) return;
        if (newVal.length > oldVal.length) {
          // 强制滚动
          this.scrollToBottom(true);
        }
      },
      deep: true,
    },
    //  currentContact: {
    //     handler() {
    //       this.page = 1;
    //       this.noMoreHistory = false;
    //       this.loadHistoryMessages(1);
    //     },
    //     deep: true
    //  }
  },
};
</script>

<style scoped>
.chat-window {
  height: 500px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fc !important;
}
/* 聊天头部 */
.chat-header {
  height: 40px;
  padding: 0 14px;
  background-color: #f5f7fc !important;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header .contact-name {
  font-size: 16px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  scroll-behavior: smooth;
}
.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  width: 45%;
}
.message-sent {
  align-items: flex-end;
}
.im_send_icon {
  padding: 0 10px;
}
.message,
.message-time {
  width: 100%;
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
  text-align: center;
}
.message-content {
  background: rgb(231.9, 243.9, 255);
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
  line-height: 24px;
  display: inline-block;
}
.message-sent .message-content {
  background: #1890ff;
  color: white;
  text-align: left;
}
.message .receiver-box,
.sender-box {
  display: flex;
  width: 100%;
}
.message .sender-box > .userinfo {
  text-align: right;
  padding-right: 6px;
}
.message .sender-box {
  flex-direction: row-reverse;
}
.messsage-list,
.userinfo {
  padding-left: 6px;
  text-align: left;
  position: relative;
}
.messsage-list,
.userinfo,
.cname {
  font-size: 14px;
  width: 100%;
  padding-left: 5px;
  color: #606060;
  margin-bottom: 5px;
  display: inline-block;
}
.im_send_container {
  height: 140px;
  width: 100%;
  display: flex;
  flex-flow: column;
  background-color: #f5f7fc !important;
  border-top: 1px solid #e5e5e5;
}
.im_send_containe,
.im_send_icon {
  height: 32px;
  line-height: 32px;
}
.im_send_container,
.input-area {
  display: flex;
  width: 100%;
  flex-flow: column;
}
.im_send_container > .send-btn {
  text-align: right;
  padding-right: 10px;
}
>>> .el-textarea__inner {
  background-color: #f5f7fc !important;
  border: none;
  padding: 8px 10px;
  margin: 0px;
  font-size: 14px;
  color: #333;
}
button {
  padding: 8px 20px;
  font-size: 14px;
}

.message-status {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
  position: absolute;
  right: 10px;
  bottom: -15px;
}
.message-status.read {
  color: #1890ff; /* 已读蓝色 */
}
.loading-tip {
  text-align: center;
  padding: 6px 0;
  color: #999;
  font-size: 12px;
}
.no-more-tip {
  text-align: center;
  padding: 6px 0;
  color: #ccc;
  font-size: 12px;
}

.skeleton-item {
  display: flex;
  padding: 10px;
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
  border-radius: 4px;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

</style>
