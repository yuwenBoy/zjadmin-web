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
    <div v-if="noMoreHistory" class="no-more-tip">
           已加载全部历史消息
    </div>
    <!-- 消息列表 -->
    <div class="message-list" ref="messageList" @scroll="handleMessageScroll">
      <div v-if="isLoadingMore" class="loading-tip">
        加载更多消息...
      </div>
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
      pageNum: 1,
      pageSize: 19,
      isLoadingMore: false,
      noMoreHistory: false,
      scrollDebounce:null,
      isFirstLoad: true, // 标记是否是首次加载（控制滚动）
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

   // 首次加载+手动滚到底部
    this.loadHistoryMessages(1).then(() => {
      this.$nextTick(() => {
        this.scrollToBottom();
        this.isFirstLoad = false;
        // 首次加载后手动标记已读（只执行一次）
        this.autoMarkAsRead();
      });
    });
    // 如果是群聊，加入房间
    if (this.chatType === 'group') {
      this.$store.state.chat.socket.emit('join_room', `group_${this.currentContact.id}`);
    }
  },
  methods: {
    async loadHistoryMessages(pageNum) {
      if (this.isLoadingMore || this.noMoreHistory) return;
       const el = this.$refs.messageList;
      this.lastScrollTop = el.scrollTop;
        console.log('📝 加载前滚动位置：', this.lastScrollTop);
      this.isLoadingMore = true; // 立即标记加载中，防止重复请求
      try {
        const count = await this.$store.dispatch('chat/loadHistory', {
          type: this.chatType,
          id: this.currentContact.id,
          page:pageNum,
          pageSize: this.pageSize,
        });

        console.log(`第${pageNum}页加载了${count}条消息`); // 调试日志
        
        // ✅ 核心：只要返回数量 < 页大小，就标记“无更多”（包括返回0的情况）
        if (count < this.pageSize) {
          this.noMoreHistory = true;
        }

        // // 滚动位置调整（保留）
        // if (pageNum > 1) {
        //   this.$nextTick(() => {
        //     const el = this.$refs.messageList;
        //     if (el) {
        //       el.scrollTop = el.scrollHeight - el.clientHeight - 50;
        //     }
        //   });
        // }
      } catch (error) {
        console.error('加载失败:', error);
      } finally {
        this.isLoadingMore = false; // 无论成功失败，都取消加载中
      }
    },
    handleMessageScroll() {
      // ✅ 清空原有防抖定时器
      clearTimeout(this.scrollDebounce);
      // ✅ 防抖时间改为500ms，避免快速滚动多次触发
      this.scrollDebounce = setTimeout(() => {
        const el = this.$refs.messageList;
        if (!el) return;

        // ✅ 只有“滚动到顶部（<10px）+ 非加载中 + 有更多数据”才触发
        const isAtTop = el.scrollTop <= 10;
        const canLoad = !this.isLoadingMore && !this.noMoreHistory;
        
        if (isAtTop && canLoad) {
          this.pageNum++;
          console.log(`准备加载第${this.pageNum}页`); // 调试日志
          this.loadHistoryMessages(this.pageNum);
        }
      }, 500);
    },
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
          // ✅ 只有「首次加载」或「非分页加载」（发送新消息）时，才滚到底部
          if (this.isFirstLoad || !this.isLoadingMore) {
            this.scrollToBottom();
            this.isFirstLoad = false;
          } else {
            // ✅ 分页加载时：恢复到加载前的滚动位置 + 微调显示新加载的内容
            const el = this.$refs.messageList;
            if (el && this.lastScrollTop > 0) {
              // 新加载的内容高度 = 新scrollHeight - 旧scrollHeight
              const newContentHeight = el.scrollHeight - (el.scrollHeight - this.lastScrollTop - el.clientHeight);
              // 恢复滚动位置 + 偏移新加载内容的高度（避免顶到最上面）
              el.scrollTop = this.lastScrollTop + newContentHeight - 20;
            }
          }
        });
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
</style>
