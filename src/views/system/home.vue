 <template>
  <div>
    <!-- 触发按钮 -->
    <el-button type="primary" @click="openChat">打开客服消息</el-button>
    <chat-window ref="platformChat" />
   <!-- 给用户merchant(userId=191)发私信 -->
    <!-- <ChatWindow chatType="private" :chatId="199" :targetId="4"/> -->
    <!-- 聊天弹窗 -->
  </div>
</template>

<script>
import ChatWindow from "@/components/ChatWindow/index.vue";
export default {
  components: {
    ChatWindow
  },
  data() {
    return {
        chatVisible: false,
    };
  },
  computed: {
   
  },
  mounted(){
     // Electron 特有：监听来自其他窗口的“打开客服”事件
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.on('open-platform-chat', () => {
        this.openChat()
      })
    }
  },
  watch: {
    
  },
  methods: {
    // 打开聊天窗口
    async openChat() {
      this.chatVisible = true
      await this.$refs.platformChat.openDialog()
    }
  }
};
</script>

<style scoped>
</style>