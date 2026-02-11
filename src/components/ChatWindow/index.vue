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
                    <i class="el-icon el-icon-close" @click="closeDialog"></i>
                </div>  
             </div> 
      </slot>
      <div class="im-main-list">
        <!-- 左侧联系人列表 -->
        <LeftSidebar ref="leftSidebar" @selectContact="selectContact" />
        <!-- 右侧聊天窗口 -->
        <RightChatWindow v-if="currentContact && currentContact.id" :key="currentContact.id" ref="messageList" chatType="private" :chatId="parseInt(currentContact.id)" :targetId="parseInt(currentContact.id)" :targetType="parseInt(currentContact.user_type)" :name="currentContact.name" />
        <!-- 右侧聊天窗口 -->
        <div v-else class="no-contact">开启美好的一天</div>
      </div>  
    </el-dialog>
</template>

<script>
import RightChatWindow from './RightChatWindow.vue';
import LeftSidebar from './LeftSidebar.vue';
import { mapState } from 'vuex';
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
     ...mapState('chat', ['currentContact']),
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    // 打开弹窗
   async openDialog() {
      this.dialogVisible = true;
    },
    // 关闭弹窗
    closeDialog() {
        this.dialogVisible = false;
        this.$store.commit('chat/SET_CURRENT_CONTACT', {})
        console.log('关闭弹窗');
        // 看下currentContact里的数据
        console.log('看下currentContact里的数据', this.$store.state.chat.currentContact);
     },
    // 切换当前聊天对象
    selectContact(contact) {
      console.log('切换当前聊天对象', contact);
      this.$store.commit('chat/SET_CURRENT_CONTACT', contact)
       // 2. 如果有未读消息，发送已读回执（关键！）
      if (contact.unread_count > 0) {
        // 获取该联系人的未读消息ID列表
        const unreadMessages = this.$store.state.chat.messages.filter(m => m.senderId == contact.id && m.status == 0)
        if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(m => m.id);
        
        // 发送已读回执到服务端
        this.$store.state.chat.socket.emit('mark_as_read', { messageIds });
             console.log('发送已读回执:', messageIds);
        }
        
        // 3. 本地清零未读数
        contact.unread_count = 0;
        this.$store.commit('chat/markAsRead', contact.id);
    }
    
    // 4. 滚动到底部（使用RightChatWindow的方法）
    this.$nextTick(() => {
        if (this.$refs.messageList && this.$refs.messageList.scrollToBottom) {
          this.$refs.messageList.scrollToBottom(true); // 强制滚动
        }
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
.no-contact{display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;font-size: 16px;color: #999;}
</style>