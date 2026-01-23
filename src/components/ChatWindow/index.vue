<template>
  <div class="chat-window">
    <!-- 消息列表 -->
    <div class="message-list" ref="messageList">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="{ 'message-sent': msg.senderId === user.id }"
        :data-message-id="msg.id"
        :data-sender-id="msg.senderId"
      >
        <div class="message-time">{{ formatChatTimestamp(Date.parse(msg.createdAt)) }}</div>
        <div :class="msg.senderId === user.id? 'sender-box' : 'receiver-box'" style="display:flex">
            <el-avatar :size="40" :src="msg.senderAvatar"></el-avatar>
            <div class="userinfo">
                 <span class="sender cname">{{ msg.senderId === user.id? '我' : msg.senderUsername }}（{{ msg.senderId }}）</span>
                 <div class="message-content">{{ msg.content }}</div>
                  <span class="message-status" v-if="msg.senderId === user.id" >
                   {{ getMessageStatusText(msg) }}
                  </span>
            </div>
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="input-area">
      <el-input v-model="newMessage" @keyup.enter.native="sendMessage" placeholder="输入消息..."></el-input>
      <el-button type="success" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex';
import { formatChatTimestamp } from '@/utils'

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
    ...mapGetters(["user"]),
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

    this.autoMarkAsRead();
    this.scrollToBottom();
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
        setTimeout(() => {
            this.autoMarkAsRead(); 
        }, 500);
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
    // formatChatTimestamp(timestamp) {
    //   return new Date(timestamp).toLocaleTimeString();
    // },
    formatChatTimestamp,
    scrollToBottom() {
      const el = this.$refs.messageList;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },
    getMessageStatusText(message) {
      const status = this.$store.state.chat.messageStatus[message.id] || message.status;
      switch (status) {
        case 1:
          return '已发送';        // 已发送（灰色）
        case 2:
          return '已读';       // 已送达（灰色双勾）
        case 3:
          return '发送失败';       // 已读（蓝色双勾）
        default:
          return '发送中';        // 发送中
      }
    },
    
    // 自动标记已读
    autoMarkAsRead() {
      this.$store.dispatch('chat/autoMarkAsRead');
    },
  },
  watch: {
    // ✅ 监听消息变化，自动滚动到底部
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 500px;
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
  width: 45%;
}
.message-sent {
  align-items: flex-end;
}
.message ,.message-time {
    width: 100%;
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
    text-align: center;
}
.message-content {
  background: rgb(231.9,243.9,255);
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 40%;
  line-height: 24px;
  display: inline-block;
}
.message-sent .message-content {
  background: #1890ff;
  color: white;
  text-align: left;
}
.message .receiver-box,.sender-box{
    display: flex;
    width: 100%;
}
.message .sender-box>.userinfo{
    text-align: right;
     padding-right: 6px;
}
.message .sender-box{
    flex-direction: row-reverse;
}
.messsage-list ,.userinfo{
    padding-left: 6px;
    text-align: left;
    position: relative;
}
.messsage-list ,.userinfo ,.cname{
   font-size: 14px;
    width: 100%;
    padding-left: 5px;
    color: #606060;
    margin-bottom: 5px;
    display: inline-block;
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

.message-status {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
  position: absolute;
  right: 10px;
  top: 66px;
}
.message-status.read {
  color: #1890ff; /* 已读蓝色 */
}
</style>
