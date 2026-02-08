<!--即时通讯弹出框组件-->
<template>
   <el-dialog title="平台客服" :visible.sync="dialogVisible" width="900px" top="50px" v-if="dialogVisible" :append-to-body="true" :modal-append-to-body="true" :close-on-click-modal="false" custom-class="chat-dialog">
      <div class="chat-container">
        <!-- 左侧联系人列表 -->
        <LeftSidebar ref="leftSidebar" @selectContact="selectContact" />
        <!-- 右侧聊天窗口 -->
        <RightChatWindow v-if="currentContact && currentContact.id" :key="currentContact.id" ref="messageList" @sent="handleSentMessage" chatType="private" :chatId="parseInt(currentContact.id)" :targetId="parseInt(currentContact.id)" :targetType="parseInt(currentContact.user_type)" :name="currentContact.name" />
      </div>  
    </el-dialog>
</template>

<script>
import RightChatWindow from './RightChatWindow.vue';
import LeftSidebar from './LeftSidebar.vue';
import { mapState,mapActions } from 'vuex';
export default {
  components: {
    RightChatWindow,
    LeftSidebar,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
     ...mapState('chat', ['contactList', 'currentContact']),
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  ...mapActions('chat', ['loadContacts']),  
    // 打开弹窗
   async openDialog() {
      this.dialogVisible = true;
    },
    // 选择联系人
    selectContact(contact) {
      this.$store.commit('chat/SET_CURRENT_CONTACT', contact)
      contact.unread_count = 0;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    // 滚动到底部
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
      }
    }, 
    // 发送成功后，本地更新左侧列表
    handleSentMessage(message) {
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
</style>