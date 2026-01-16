<template>
  <div class="chat-window">
    <!-- 消息列表 -->
    <div class="message-list" ref="messageList">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="{ 'message-sent': msg.senderId === currentUserId }"
      >
        <div class="message-content">
          <span class="sender">{{ msg.senderId }}:</span>
          {{ msg.content }}
        </div>
        <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ChatWindow',
  props: {
    chatType: {
      type: String, // 'private' 或 'group'
      required: true,
    },
    chatId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newMessage: '',
    };
  },
  computed: {
    ...mapState('chat', ['messages']),
    currentUserId() {
      return parseInt(localStorage.getItem('userId'));
    },
  },
  async mounted() {
    // 初始化当前会话
    this.$store.commit('chat/SET_CURRENT_CHAT', {
      type: this.chatType,
      id: this.chatId,
    });

    // 加载历史消息
    await this.$store.dispatch('chat/loadHistory', {
      type: this.chatType,
      id: this.chatId,
    });

    // 如果是群聊，加入房间
    if (this.chatType === 'group') {
      this.$store.state.chat.socket.emit('join_room', `group_${this.chatId}`);
    }

    this.scrollToBottom();
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const payload = {
        content: this.newMessage,
      };

      if (this.chatType === 'private') {
        payload.receiverId = this.chatId;
        await this.$store.dispatch('chat/sendPrivateMessage', payload);
      } else {
        payload.groupId = this.chatId;
        await this.$store.dispatch('chat/sendGroupMessage', payload);
      }

      this.newMessage = '';
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
    scrollToBottom() {
      const el = this.$refs.messageList;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.message-sent {
  align-items: flex-end;
}
.message-content {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 60%;
}
.message-sent .message-content {
  background: #1890ff;
  color: white;
}
.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}
input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  margin-left: 10px;
  padding: 8px 20px;
}
</style>
