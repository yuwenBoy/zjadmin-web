 <template>
  <div>
    <!-- 触发按钮 -->
    <el-button type="primary" @click="openMessageDialog">打开客服消息</el-button>
   <!-- 给用户merchant(userId=191)发私信 -->
    <!-- <ChatWindow chatType="private" :chatId="199" :targetId="4"/> -->
    <!-- 聊天弹窗 -->
    <el-dialog
      title="平台客服"
      :visible.sync="dialogVisible"
      width="900px"
      top="50px"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      custom-class="chat-dialog"
    >
      <div class="chat-container">
        <!-- 左侧商家列表 -->
        <div class="sidebar">
          <div class="search-box">
            <el-input
              placeholder="搜索商家"
              prefix-icon="el-icon-search"
              size="small"
              clearable
              v-model="searchKeyword"
            />
          </div>
          
          <div class="merchant-list">
            <div
              v-for="merchant in filteredMerchantList"
              :key="merchant.id"
              class="merchant-item"
              :class="{ active: currentMerchant && currentMerchant.id === merchant.id }"
              @click="selectMerchant(merchant)"
            >
              <el-badge :value="merchant.unreadCount" :hidden="!merchant.unreadCount" class="badge">
                <el-avatar :src="merchant.avatar" size="medium" />
              </el-badge>
              <div class="merchant-info">
                <div class="merchant-name">{{ merchant.name }}</div>
                <div class="last-message">{{ merchant.lastMessage }}</div>
              </div>
              <div class="last-time">{{ merchant.lastTime }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧聊天窗口 -->
        <div class="chat-window">
          <!-- 聊天头部 -->
          <div class="chat-header" v-if="currentMerchant">
            <span class="merchant-name">{{ currentMerchant.name }}</span>
            <div class="header-actions">
              <el-button type="text" icon="el-icon-phone">语音</el-button>
              <el-button type="text" icon="el-icon-video-camera">视频</el-button>
            </div>
          </div>
          <!-- 消息列表 -->
           <ChatWindow v-if="currentMerchant" :key="currentMerchant.id" ref="messageList" chatType="private" :chatId="parseInt(currentMerchant.user_id)" :targetId="parseInt(currentMerchant.id)" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBussinessUserList } from '@/api/system/user'
import ChatWindow from "@/components/ChatWindow/index.vue"
export default {
  components: {
    ChatWindow
  },
  data() {
    return {
      dialogVisible: false,
      searchKeyword: '',
      currentMerchant: null,
      inputMessage: '',
      merchantList: [
        // {
        //   id: 1,
        //   name: '张记快餐',
        //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        //   lastMessage: '好的，我这就处理',
        //   lastTime: '10:23',
        //   unreadCount: 2
        // },
        // {
        //   id: 2,
        //   name: '李记烧烤',
        //   avatar: 'https://wpimg.wallstcn.com/577965b9-5e0d-44e0-9c5c-2e8c2d6b5c6a.jpg',
        //   lastMessage: '请问这个订单可以退款吗？',
        //   lastTime: '昨天',
        //   unreadCount: 0
        // },
        // {
        //   id: 3,
        //   name: '王记水果店',
        //   avatar: 'https://wpimg.wallstcn.com/34b9e7dc-55b0-4e5a-8f2e-3e8c8b6a7c4e.png',
        //   lastMessage: '已收到，谢谢！',
        //   lastTime: '昨天',
        //   unreadCount: 5
        // }
      ],
      messages: []
    };
  },
  computed: {
    filteredMerchantList() {
      if (!this.searchKeyword) return this.merchantList;
      return this.merchantList.filter(m => 
        m.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  watch: {
    dialogVisible(val) {
      console.log('监听')
      if (val && this.merchantList.length > 0) {
        this.selectMerchant(this.merchantList[0]);
      }
    }
  },
  methods: {
    openMessageDialog() {
      this.dialogVisible = true;
      this.getBussinessUserList();
    },
    async getBussinessUserList(){
      const result = await getBussinessUserList();
      console.log(result);
      this.merchantList = result.result
      this.currentMerchant = this.merchantList[0];
    },
    selectMerchant(merchant) {
      console.log(merchant)
      this.currentMerchant = merchant;
      // 清空未读数
      merchant.unreadCount = 0;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
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

.merchant-list {
  flex: 1;
  overflow-y: auto;
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

.merchant-info {
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

/* 消息列表 */
.message-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.message-item {
  margin-bottom: 20px;
}

.message-time {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.message-content-wrap {
  display: flex;
  align-items: flex-start;
}

.message-item.sent .message-content-wrap {
  flex-direction: row-reverse;
}

.avatar {
  margin: 0 10px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 8px;
  word-wrap: break-word;
  word-break: break-all;
}

.message-item.received .message-bubble {
  background-color: #fff;
  border: 1px solid #e6e6e6;
}

.message-item.sent .message-bubble {
  background-color: #409eff;
  color: #fff;
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
}

/* 输入区域 */
.input-area {
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
}

.input-area .el-textarea__inner {
  border: none;
  background-color: #f5f5f5;
  padding: 10px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.input-actions .el-button--text {
  color: #666;
  font-size: 18px;
}

.input-actions .el-button--text:hover {
  color: #409eff;
}

/* 滚动条美化 */
.sidebar ::v-deep ::-webkit-scrollbar,
.message-list::-webkit-scrollbar {
  width: 6px;
}

.sidebar ::v-deep ::-webkit-scrollbar-thumb,
.message-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
</style>