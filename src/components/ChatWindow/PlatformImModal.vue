<!--即时通讯弹出框组件-->
<template>
    <div class="platform-im-modal">
     <el-dialog title="平台客服" :visible.sync="dialogVisible" width="900px" top="50px" v-if="dialogVisible" :append-to-body="true" :modal-append-to-body="true" :close-on-click-modal="false" custom-class="chat-dialog">
      <div class="chat-container">
        <!-- 左侧联系人列表 -->
        <div class="sidebar">
          <div class="search-box">
            <el-input
              placeholder="搜索联系人"
              prefix-icon="el-icon-search"
              size="small"
              clearable
              v-model="searchKeyword"
            />
          </div>
          
          <div class="contact-list">
            <div
              v-for="(merchant, index) in filteredContactList"
              :key="index"
              class="merchant-item"
              :class="{ active: currentContact && currentContact.id === merchant.id }"
              @click="selectMerchant(merchant)"
            >
              <el-badge :value="merchant.unread_count" :hidden="!merchant.unread_count || parseInt(merchant.unread_count) === 0" class="badge">
                <el-avatar :src="merchant.avatar" size="medium" />
              </el-badge>
              <div class="contact-info">
                <div class="merchant-name">{{ merchant.name }}</div>
                <div class="last-message">{{ merchant.last_message }}</div>
              </div>
              <div class="last-time">{{ formatChatTimestamp(merchant.last_time) }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧聊天窗口 -->
        <div class="chat-window">
          <!-- 聊天头部 -->
          <div class="chat-header" v-if="currentContact">
            <span class="merchant-name">{{ currentContact.name }}{{ currentContact.user_type}}</span>
            <div class="header-actions">
              <el-button type="text" icon="el-icon-phone">语音</el-button>
              <el-button type="text" icon="el-icon-video-camera">视频</el-button>
            </div>
          </div>
          <!-- 消息列表 -->
           <ChatWindow v-if="currentContact" :key="currentContact.id" ref="messageList" @sent="handleSentMessage" chatType="private" :chatId="parseInt(currentContact.id)" :targetId="parseInt(currentContact.id)" :targetType="parseInt(currentContact.user_type)" />
        </div>
      </div>  
    </el-dialog>
    </div>
</template>

<script>
import { getChatContactList } from '@/api/system/user'
import ChatWindow from './index.vue';
import { formatChatTimestamp } from '@/utils'
export default {
  components: {
    ChatWindow
  },
  data() {
    return {
      dialogVisible: false,
      searchKeyword: '',
      currentContact: null,
      inputMessage: '',
      contactList: [
        // {
        //   id: 1,
        //   name: '张记快餐',
        //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        //   last_message: '好的，我这就处理',
        //   lastTime: '10:23',
        //   unread_count: 2
        // },
        // {
        //   id: 2,
        //   name: '李记烧烤',
        //   avatar: 'https://wpimg.wallstcn.com/577965b9-5e0d-44e0-9c5c-2e8c2d6b5c6a.jpg',
        //   last_message: '请问这个订单可以退款吗？',
        //   lastTime: '昨天',
        //   unread_count: 0
        // },
        // {
        //   id: 3,
        //   name: '王记水果店',
        //   avatar: 'https://wpimg.wallstcn.com/34b9e7dc-55b0-4e5a-8f2e-3e8c8b6a7c4e.png',
        //   last_message: '已收到，谢谢！',
        //   lastTime: '昨天',
        //   unread_count: 5
        // }
      ],
      messages: []
    };
  },
  computed: {
    filteredContactList() {
      if (!this.searchKeyword) return this.contactList;
      return this.contactList.filter(m => 
        m.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  watch: {
    dialogVisible(val) {
      if (val && this.contactList.length > 0) {
        this.selectMerchant(this.contactList[0]);
      }
    }
  },
  mounted() {
    // // 初始消息更新
    //  const message = {
    //       targetId: 19,
    //       lastMessage: '你好，我是平台客服，有什么可以帮助您？',
    //       lastTime: new Date().toISOString()
    //     };
    // this.$store.dispatch('chat/updateMessage',message);
  },
  methods: {
    formatChatTimestamp,
    openDialog() {
      this.dialogVisible = true;
      this.loadContacts();
    },
    async loadContacts(){
      const data = await getChatContactList();
      this.contactList = data.result
      this.currentContact = this.contactList[0];
    },
    selectMerchant(merchant) {
      this.currentContact = merchant;
      // 清空未读数
      merchant.unread_count = 0;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    },
    // 发送成功后，本地更新左侧列表
    handleSentMessage(message) {
      console.log(message)
      // ✅ 找到当前会话，立即更新最后一条消息和时间
      const contact = this.contactList.find(c => c.id === this.currentContact.id);
      if (contact) {
        contact.last_message = message.lastMessage;
        contact.last_time = message.lastTime;
        contact.unread_count = 0; // ✅ 清空未读
      }
      
      // ✅ 重新排序：把当前会话置顶
      this.contactList.sort((a, b) => {
        if (a.id === this.currentContact.id) return -1;
        if (b.id === this.currentContact.id) return 1;
        return 0;
      });
    },
  }
};
</script>

<style scoped>
/* 聊天弹窗整体样式 */
.chat-dialog .el-dialog__body {
  padding: 0;
  height: 600px;
}

/* 聊天容器 */
.chat-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* 左侧边栏 */
.sidebar {
  width: 280px;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  min-height: 350px;
  max-height: 500px;
}

.merchant-item {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  position: relative;
}

.merchant-item:hover {
  background-color: #f5f7fa;
}

.merchant-item.active {
  background-color: #e6f7ff;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.merchant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-time {
  font-size: 12px;
  color: #ccc;
  position: absolute;
  right: 15px;
  top: 15px;
}

/* 未读消息气泡 */
.badge ::v-deep .el-badge__content {
  transform: translateY(-50%) translateX(100%);
}

/* 右侧聊天窗口 */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 聊天头部 */
.chat-header {
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header .merchant-name {
  font-size: 16px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.message-time {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.avatar {
  margin: 0 10px;
  flex-shrink: 0;
}
</style>