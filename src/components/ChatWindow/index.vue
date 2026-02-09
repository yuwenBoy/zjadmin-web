<!--即时通讯弹出框组件-->
<template>
   <el-dialog :visible.sync="dialogVisible" custom-class="IM-Window" v-if="dialogVisible" :append-to-body="true" :modal-append-to-body="true" :close-on-click-modal="false" 
              style="width:912px;height:580px;min-width:710px;min-height:500px;position:fixed;inset:auto 80px 24px auto;background-color: rgb(255, 255, 255);
                    border: 1px solid rgb(241, 241, 241);
                    border-radius: 8px;
                    overflow: hidden;
                    box-sizing: border-box;
                    box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px 0px;">
       <slot name="title">
            <div class="im-header-list">
                <div class="left-online">
                    <span class="contact-name"></span>
                 </div> 
                <div class="right-btn">
                    <i class="el-icon el-icon-setting"></i>
                    <i class="el-icon el-icon-close" @click="dialogVisible=false"></i>
                </div>  
             </div> 
      </slot>
      <div class="im-main-list">
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

<style lang="scss">
.IM-Window{
    width: 100% !important;
    height: 100%;
    margin-top: 0px !important;
    margin: 0px !important;
     .el-dialog__body{
      padding:0 !important;
      margin:0 !important;
      height: 100%;
    }
    .el-dialog__header{display: none;;}
    .im-header-list{
        padding: 18px;
        height: 68px;
        border:1px solid #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right-btn{
            width: 80px;
            display: flex;
            align-content: center;
            justify-content: space-around;
            .el-icon-close{font-size: 24px;cursor: pointer;}
            .el-icon-setting{font-size: 22px;cursor: pointer;}
        }
    }
}
/* 聊天弹窗整体样式 */
/* 聊天容器 */
.im-main-list {
  display: flex;
  height: calc(100% - 68px);
  overflow: hidden;
}
</style>