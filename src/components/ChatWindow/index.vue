<!--即时通讯弹出框组件-->
<template>
   <el-dialog :visible.sync="dialogVisible" custom-class="IM-Window" v-if="dialogVisible" :append-to-body="true" :modal-append-to-body="true" :close-on-click-modal="false" 
              :style="dialogStyle">
       <slot name="title">
            <div class="im-header-list">
                <div class="left-online">
                    <div class="status-container">
                        <div class="avatar">
                            <i class="el-icon-user"></i>
                        </div>
                        <div class="status-dropdown">
                            <div class="status-indicator" :class="statusClass" @click="toggleStatusMenu"></div>
                            <div class="status-menu" v-if="showStatusMenu">
                                <div class="status-item" @click="setStatus('online')">
                                    <div class="status-dot online"></div>
                                    <span>在线</span>
                                    <i v-if="currentUserStatus === 'online'" class="el-icon el-icon-check"></i>
                                </div>
                                <div class="status-item" @click="setStatus('busy')">
                                    <div class="status-dot busy"></div>
                                    <div class="status-content">
                                        <div class="status-title">忙碌</div>
                                        <div class="status-desc">自动回复顾客首条需回复消息，后续消息仍需处理</div>
                                    </div>
                                    <i v-if="currentUserStatus === 'busy'" class="el-icon el-icon-check"></i>
                                </div>
                                <div class="status-item divider"></div>
                                <div class="status-item" @click="setStatus('offline')">
                                    <div class="status-dot offline"></div>
                                    <div class="status-content">
                                        <div class="status-title">关闭</div>
                                        <div class="status-desc">关闭后，不能与顾客和骑手在线沟通</div>
                                    </div>
                                    <i v-if="currentUserStatus === 'offline'" class="el-icon el-icon-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>

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
      showStatusMenu: false
    };
  },
  computed: {
     ...mapState('chat', ['currentContact', 'currentUserStatus']),
     statusClass() {
       switch(this.currentUserStatus) {
         case 'online': return 'online';
         case 'busy': return 'busy';
         case 'offline': return 'offline';
         default: return 'offline';
       }
     },
     statusText() {
       switch(this.currentUserStatus) {
         case 'online': return '在线';
         case 'busy': return '忙碌';
         case 'offline': return '关闭';
         default: return '关闭';
       }
     },
     dialogStyle() {
       let backgroundColor = '#ffffff';
       switch (this.currentUserStatus) {
         case 'online':
           backgroundColor = '#e6f7ff';
           break;
         case 'busy':
           backgroundColor = '#fff7e6';
           break;
         case 'offline':
           backgroundColor = '#f5f5f5';
           break;
       }
       return {
         width: '912px',
         height: '580px',
         minWidth: '710px',
         minHeight: '500px',
         position: 'fixed',
         inset: 'auto 80px 24px auto',
         backgroundColor: backgroundColor,
         border: '1px solid rgb(241, 241, 241)',
         borderRadius: '8px',
         overflow: 'hidden',
         boxSizing: 'border-box',
         boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 24px 0px'
       };
     }
  },
  watch: {
  },
  mounted() {
    // 从WebSocket连接中获取初始状态
    this.getInitialStatus();
  },
  methods: {
    // 获取初始状态
    getInitialStatus() {
      // 如果WebSocket已连接，获取当前用户状态
      if (this.$store.state.chat.socket) {
        this.$store.state.chat.socket.emit('get_status', (response) => {
          if (response && response.status) {
            this.$store.commit('chat/UPDATE_CURRENT_USER_STATUS', response.status);
          }
        });
      }
    },
    // 打开弹窗
    async openDialog() {
      this.dialogVisible = true;
    },
    // 关闭弹窗
    closeDialog() {
        this.dialogVisible = false;
        this.$store.commit('chat/SET_CURRENT_CONTACT', {})
        this.showStatusMenu = false;
     },
    // 点击状态指示器
    toggleStatusMenu(event) {
      event.stopPropagation();
      this.showStatusMenu = !this.showStatusMenu;
    },
    // 切换当前聊天对象
    selectContact(contact) {
      this.$store.commit('chat/SET_CURRENT_CONTACT', contact)
       // 2. 如果有未读消息，发送已读回执（关键！）
      if (contact.unread_count > 0) {
        // 获取该联系人的未读消息ID列表
        const unreadMessages = this.$store.state.chat.messages.filter(m => m.senderId == contact.id && m.status == 0)
        if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(m => m.id);
        // 3. 本地清零未读数
        contact.unread_count = 0;
        // 发送已读回执到服务端
        this.$store.state.chat.socket.emit('mark_as_read', { messageIds });
        }
    }
    
    // 4. 滚动到底部（使用RightChatWindow的方法）
    this.$nextTick(() => {
        if (this.$refs.messageList && this.$refs.messageList.scrollToBottom) {
          this.$refs.messageList.scrollToBottom(true); // 强制滚动
        }
      });
    },
    // 设置状态
    setStatus(status) {
      this.showStatusMenu = false;
      // 更新Vuex中的当前用户状态
      this.$store.commit('chat/UPDATE_CURRENT_USER_STATUS', status);
      // 通过WebSocket发送状态变更
      if (this.$store.state.chat.socket) {
        this.$store.state.chat.socket.emit('update_status', { status });
      } else {
        console.error('WebSocket未连接，无法发送状态变更');
      }
    }
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
        .left-online {
            display: flex;
            align-items: center;
            gap: 16px;
            .status-container {
                position: relative;
                width: 45px;
                height: 45px;
                .avatar {
                    width: 45px;
                    height: 45px;
                    margin: 0px;
                    background-color: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #666;
                }
                .status-dropdown {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    .status-indicator {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: 2px solid white;
                        cursor: pointer;
                        &.online {
                            background-color: #67C23A;
                        }
                        &.busy {
                            background-color: #E6A23C;
                        }
                        &.offline {
                            background-color: #909399;
                        }
                    }
                    .status-menu {
                        position: absolute;
                        top: 5px;
                        left: -35px;
                        margin-top: 8px;
                        background-color: white;
                        border: 1px solid #e4e7ed;
                        border-radius: 4px;
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                        z-index: 9999;
                        min-width: 280px;
                        .status-item {
                            padding: 10px 16px;
                            cursor: pointer;
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                            &:hover {
                                background-color: #f5f7fa;
                            }
                            &.divider {
                                border-top: 1px solid #e4e7ed;
                                margin: 5px 0;
                                padding: 0px;
                            }
                            .status-dot {
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                margin-top: 2px;
                                &.online {
                                    background-color: #67C23A;
                                }
                                &.busy {
                                    background-color: #E6A23C;
                                }
                                &.offline {
                                    background-color: #909399;
                                }
                            }
                            span {
                                flex: 1;
                            }
                            .status-content {
                                flex: 1;
                                .status-title {
                                    font-size: 14px;
                                    color: #303133;
                                    margin-bottom: 4px;
                                }
                                .status-desc {
                                    font-size: 12px;
                                    color: #909399;
                                    white-space: normal;
                                    line-height: 1.4;
                                    margin-top: 4px;
                                }
                            }
                            i {
                                color: #409EFF;
                                font-size: 14px;
                                margin-left: 8px;
                                margin-top: 2px;
                            }
                            small {
                                font-size: 12px;
                                color: #909399;
                                white-space: normal;
                                line-height: 1.4;
                            }
                        }
                    }
                }
            }
            .status-info {
                .status-text {
                    font-size: 14px;
                    font-weight: 500;
                    color: #303133;
                    margin-bottom: 4px;
                }
                .reply-rate,
                .unlock {
                    font-size: 12px;
                    color: #909399;
                    margin-bottom: 2px;
                    cursor: pointer;
                    &:hover {
                        color: #409EFF;
                    }
                }
            }
        }
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