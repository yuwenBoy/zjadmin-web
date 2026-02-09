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
    <!-- 消息列表 -->
    <div class="message-list" ref="messageList">
      <div v-for="(msg,index) in messages"
        :key="index"
        class="message"
        :class="{ 'message-sent': msg.senderId === user.id }"
        :data-message-id="msg.id"
        :data-sender-id="msg.senderId"
      >
        <div class="message-time">{{ formatChatTimestamp(Date.parse(msg.createdAt)) }}</div>
        <div :class="msg.senderId === user.id? 'sender-box' : 'receiver-box'" style="display:flex">
            <el-avatar :src="msg.senderAvatar" :size="40"></el-avatar>
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
  name: 'RightChatWindow',
  props: {
    chatType: {
      type: String, // 'private' 或 'group'
      required: true,
    },
  },
  data() {
    return {
      newMessage: '',
    };
  },
  computed: {
    ...mapState('chat', ['messages','currentContact']),
    ...mapGetters(["user"]),
  },
   mounted() {
    // 初始化当前会话
    this.$store.commit('chat/SET_CURRENT_CHAT', {
      type: this.chatType,
      id: this.currentContact.id,
    });
    // 加载历史消息
     this.$store.dispatch('chat/loadHistory', {
      type: this.chatType,
      id: this.currentContact.id,
    });
    console.log('在右侧组件看下，左侧的当前联系人信息是谁',this.currentContact)
    // 如果是群聊，加入房间
    if (this.chatType === 'group') {
      this.$store.state.chat.socket.emit('join_room', `group_${this.currentContact.id}`);
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
        payload.receiverId = this.currentContact.id;
        payload.targetId = this.currentContact.id;
        payload.targetType = this.currentContact.user_type;
        await this.$store.dispatch('chat/sendPrivateMessage', payload);
        const message = {
          targetId: this.currentContact.id,
          lastMessage: this.newMessage,
          lastTime: new Date().toISOString()
        };
        await this.$store.dispatch('chat/updateMessage',message);
        this.$emit('sent', message);
      } else {
        payload.groupId = this.currentContact.id;
        
        await this.$store.dispatch('chat/sendGroupMessage', {});
      }
      this.newMessage = '';
    },
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
          return '未读';        // 未读
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
  /* display: flex;
  flex-direction: column; */
  height: 500px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #F5F7FC !important;
}
/* 聊天头部 */
.chat-header {
  height: 40px;
  padding: 0 14px;
  background-color: #F5F7FC !important;
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
  max-height:300px;
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
