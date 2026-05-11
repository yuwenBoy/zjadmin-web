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
                    <i class="el-icon el-icon-setting" @click="openSettings"></i>
                    <i class="el-icon el-icon-close" @click="closeDialog"></i>
                </div>  
             </div> 
      </slot>
      <!-- 设置面板 - 在对话框最外层，覆盖整个对话框 -->
      <div class="settings-panel" :class="{ 'open': showSettings }">
          <div class="settings-panel-header">
            <span class="settings-title">消息设置</span>
            <i class="el-icon-close settings-close" @click="closeSettings"></i>
          </div>
          
          <!-- 标签页导航 -->
          <div class="settings-tabs">
            <div 
              v-for="(tab, index) in settingsTabs" 
              :key="index"
              class="tab-item"
              :class="{ active: activeTab === index }"
              @click="activeTab = index"
            >
              {{ tab.name }}
            </div>
          </div>

          <!-- 设置内容 -->
          <div class="settings-content">
            <!-- 消息设置 -->
            <div v-if="activeTab === 0" class="tab-content">
              <div class="setting-section">
                <div class="section-title">在线联系</div>
                <div class="setting-row">
                  <span class="setting-desc">开启后，您可以与顾客和骑手在线沟通</span>
                  <div class="setting-toggle">
                    <span class="toggle-option" :class="{ active: onlineEnabled }" @click="onlineEnabled = true">开启</span>
                    <span class="toggle-option" :class="{ active: !onlineEnabled }" @click="onlineEnabled = false">关闭</span>
                  </div>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">忙碌状态自动回复</div>
                <div class="setting-row">
                  <template v-if="editingField === 'busyAutoReply'">
                    <textarea v-model="editValue" class="edit-textarea" placeholder="请输入忙碌状态自动回复内容"></textarea>
                    <div class="edit-actions">
                      <span class="edit-btn cancel" @click="cancelEdit">取消</span>
                      <span class="edit-btn save" @click="saveBusyReply">保存</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="setting-value">{{ busyAutoReply || '未设置' }}</span>
                    <span class="setting-edit" @click="startEdit('busyAutoReply', busyAutoReply)">编辑</span>
                  </template>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">门店打烊自动回复</div>
                <div class="setting-row">
                  <template v-if="editingField === 'closeAutoReply'">
                    <textarea v-model="editValue" class="edit-textarea" placeholder="请输入门店打烊自动回复内容"></textarea>
                    <div class="edit-actions">
                      <span class="edit-btn cancel" @click="cancelEdit">取消</span>
                      <span class="edit-btn save" @click="saveCloseReply">保存</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="setting-value">{{ closeAutoReply || '未设置' }}</span>
                    <span class="setting-edit" @click="startEdit('closeAutoReply', closeAutoReply)">编辑</span>
                  </template>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">系统通知设置</div>
                <div class="setting-row">
                  <span class="setting-desc">订单通知</span>
                  <div class="toggle-switch" :class="{ active: systemNoticeEnabled }" @click="systemNoticeEnabled = !systemNoticeEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                </div>
                <div class="setting-row">
                  <span class="setting-desc">消息通知</span>
                  <div class="toggle-switch" :class="{ active: auditLogEnabled }" @click="auditLogEnabled = !auditLogEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 聊天消息提醒设置 -->
            <div v-if="activeTab === 1" class="tab-content">
              <div class="setting-section">
                <div class="section-title">新消息声音提醒</div>
                <div class="setting-row">
                  <div class="toggle-switch" :class="{ active: soundEnabled }" @click="soundEnabled = !soundEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                  <span class="setting-desc">{{ soundEnabled ? '开启' : '关闭' }}</span>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">弹窗通知</div>
                <div class="setting-row">
                  <div class="toggle-switch" :class="{ active: popupEnabled }" @click="popupEnabled = !popupEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                  <span class="setting-desc">{{ popupEnabled ? '开启' : '关闭' }}</span>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">聊天背景</div>
                <div class="background-options">
                  <div
                    v-for="(bg, index) in backgroundOptions"
                    :key="index"
                    class="bg-option"
                    :class="{ active: currentBackground === bg.value }"
                    @click="changeBackground(bg.value)"
                  >
                    <div class="bg-preview" :style="{ background: bg.color }"></div>
                    <span>{{ bg.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 智能回复设置 -->
            <div v-if="activeTab === 2" class="tab-content">
              <div class="setting-section">
                <div class="section-title">智能回复</div>
                <div class="setting-row">
                  <div class="toggle-switch" :class="{ active: smartReplyEnabled }" @click="smartReplyEnabled = !smartReplyEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                  <span class="setting-desc">{{ smartReplyEnabled ? '开启' : '关闭' }}</span>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">回复延迟</div>
                <div class="setting-row">
                  <span class="setting-desc">智能回复发送前等待时间</span>
                  <el-select v-model="smartReplyDelay" class="delay-select">
                    <el-option label="1 秒" :value="1"></el-option>
                    <el-option label="3 秒" :value="3"></el-option>
                    <el-option label="5 秒" :value="5"></el-option>
                    <el-option label="10 秒" :value="10"></el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <!-- 常用语设置 -->
            <div v-if="activeTab === 3" class="tab-content">
              <div class="quick-replies-header">
                <span class="section-title">常用语列表</span>
                <span class="add-reply-btn" @click="addQuickReplyItem">+ 添加</span>
              </div>
              <div class="quick-replies-list">
                <div
                  v-for="(reply, index) in quickReplies"
                  :key="index"
                  class="quick-reply-item"
                >
                  <template v-if="editingField === 'quickReply_' + index">
                    <input v-model="editValue" class="edit-input" placeholder="请输入常用语" />
                    <div class="edit-actions">
                      <span class="edit-btn cancel" @click="cancelEdit">取消</span>
                      <span class="edit-btn save" @click="saveQuickReplyItem(index)">保存</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="reply-content">{{ reply }}</span>
                    <div class="reply-actions">
                      <span class="action-btn edit" @click="startEdit('quickReply_' + index, reply)">编辑</span>
                      <span class="action-btn delete" @click="deleteQuickReply(index)">删除</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- 订单送达消息提醒 -->
            <div v-if="activeTab === 4" class="tab-content">
              <div class="setting-section">
                <div class="section-title">订单送达提醒</div>
                <div class="setting-row">
                  <div class="toggle-switch" :class="{ active: deliveryReminderEnabled }" @click="deliveryReminderEnabled = !deliveryReminderEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                  <span class="setting-desc">{{ deliveryReminderEnabled ? '开启' : '关闭' }}</span>
                </div>
              </div>

              <div class="setting-section">
                <div class="section-title">提醒方式</div>
                <div class="setting-row">
                  <span class="setting-desc">订单送达时</span>
                  <div class="toggle-switch" :class="{ active: deliverySoundEnabled }" @click="deliverySoundEnabled = !deliverySoundEnabled">
                    <div class="toggle-dot"></div>
                  </div>
                  <span class="setting-desc">{{ deliverySoundEnabled ? '播放提示音' : '仅消息提醒' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div class="im-main-list" :class="{ 'show-settings': showSettings }">
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
import { mapState, mapGetters } from 'vuex';
export default {
  components: {
    RightChatWindow,
    LeftSidebar,
  },
  data() {
    return {
      dialogVisible: false,
      showStatusMenu: false,
      // 设置面板
      showSettings: false,
      activeTab: 0,
      // 设置标签页根据用户类型动态生成
      settingsTabs: [],
      // 消息设置
      onlineEnabled: true,
      busyAutoReply: '',
      closeAutoReplyEnabled: true,
      closeAutoReply: '亲亲，小店已打烊，不能及时回复您，请在营业时间再联系哦 [比心]',
      // 通知设置
      soundEnabled: true,
      popupEnabled: true,
      // 聊天背景
      currentBackground: 'default',
      backgroundOptions: [
        { label: '默认', value: 'default', color: '#f5f7fc' },
        { label: '浅色', value: 'light', color: '#e8f4f8' },
        { label: '暖色', value: 'warm', color: '#fdf6ea' },
        { label: '深色', value: 'dark', color: '#2d3748' },
      ],
      // 智能回复
      smartReplyEnabled: false,
      smartReplyDelay: 3,
      // 快捷回复
      quickReplies: [
        '您好，请问有什么可以帮助您的？',
        '感谢您的耐心等待，我马上为您处理。',
        '抱歉，让您久等了，正在查询中...',
        '好的，我已经记录下来了，会尽快处理。',
        '请问还有其他问题需要帮助吗？',
      ],
      // 订单送达提醒
      deliveryReminderEnabled: true,
      deliverySoundEnabled: true,
      // 管理员端设置
      systemNoticeEnabled: true,
      auditLogEnabled: true,
      userActionEnabled: true,
      logEnabled: true,
      // 内联编辑状态
      editingField: '',
      editValue: '',
    };
  },
  computed: {
     ...mapState('chat', ['currentContact', 'currentUserStatus']),
     ...mapGetters(["user"]),
     statusClass() {
       switch(this.currentUserStatus) {
         case 'online': return 'online';
         case 'busy': return 'busy';
         case 'offline': return 'offline';
         default: return 'offline';
       }
     },
     storePhone() {
       if (this.user && this.user.userType === 2) {
         // 尝试从 business.store 获取门店电话
         if (this.user.business && this.user.business.store && this.user.business.store.length > 0) {
           const defaultStore = this.user.business.store.find(item => item.isDefault);
           if (defaultStore && defaultStore.contactInfo) {
             return defaultStore.contactInfo;
           }
           return this.user.business.store[0].contactInfo || '';
         }
         // 如果没有 store 信息，尝试从 business 获取联系电话
         if (this.user.business && this.user.business.contactPhone) {
           return this.user.business.contactPhone;
         }
       }
       return '';
     },
     busyAutoReplyContent() {
       if (this.user && this.user.userType === 1) {
         return '您好，我现在忙碌中，会尽快回复您的消息。';
       } else {
         const phone = this.storePhone || '门店电话';
         return `亲亲，现在是出餐高峰期，不能及时回复您，如有急事请直接拨打${phone}`;
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
  mounted() {
    this.getInitialStatus();
    // 先初始化标签页和自动回复内容
    this.initSettingsTabs();
    this.initBusyAutoReply();
    // 再加载 localStorage 设置（如果用户自定义过）
    this.loadSettings();
  },
  watch: {
    'user': {
      handler() {
        this.initSettingsTabs();
        this.initBusyAutoReply();
      },
      deep: true
    },
    'user.userType': {
      handler() {
        this.initSettingsTabs();
        this.initBusyAutoReply();
      },
      deep: true
    },
    'user.business': {
      handler() {
        this.initBusyAutoReply();
      },
      deep: true
    }
  },
  methods: {
    initSettingsTabs() {
      // 所有用户都显示相同的设置项（移除系统权限相关）
      this.settingsTabs = [
        { name: '消息设置', key: 'message' },
        { name: '聊天消息提醒设置', key: 'notification' },
        { name: '智能回复设置', key: 'smart' },
        { name: '常用语设置', key: 'quick' },
        { name: '订单送达消息提醒', key: 'delivery' },
      ];
    },
    initBusyAutoReply() {
      // 所有用户都使用相同的自动回复格式
      if (!this.busyAutoReply || this.busyAutoReply.trim() === '') {
        const phone = this.storePhone || '门店电话';
        this.busyAutoReply = `亲亲，现在是出餐高峰期，不能及时回复您，如有急事请直接拨打${phone}`;
      }
    },
    getInitialStatus() {
      if (this.$store.state.chat.socket) {
        this.$store.state.chat.socket.emit('get_status', (response) => {
          if (response && response.status) {
            this.$store.commit('chat/UPDATE_CURRENT_USER_STATUS', response.status);
          }
        });
      }
    },
    loadSettings() {
      const saved = localStorage.getItem('chatSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        // 只加载用户自定义过的非空设置，不覆盖动态生成的值
        Object.keys(settings).forEach(key => {
          if (settings[key] !== null && settings[key] !== undefined && settings[key] !== '') {
            this[key] = settings[key];
          }
        });
      }
    },
    saveSettings() {
      const settings = {
        onlineEnabled: this.onlineEnabled,
        busyAutoReply: this.busyAutoReply,
        closeAutoReplyEnabled: this.closeAutoReplyEnabled,
        closeAutoReply: this.closeAutoReply,
        soundEnabled: this.soundEnabled,
        popupEnabled: this.popupEnabled,
        currentBackground: this.currentBackground,
        smartReplyEnabled: this.smartReplyEnabled,
        smartReplyDelay: this.smartReplyDelay,
        quickReplies: this.quickReplies,
        deliveryReminderEnabled: this.deliveryReminderEnabled,
        deliverySoundEnabled: this.deliverySoundEnabled,
      };
      localStorage.setItem('chatSettings', JSON.stringify(settings));
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
        this.dialogVisible = false;
        this.$store.commit('chat/SET_CURRENT_CONTACT', {})
        this.showStatusMenu = false;
        this.showSettings = false;
     },
    toggleStatusMenu(event) {
      event.stopPropagation();
      this.showStatusMenu = !this.showStatusMenu;
    },
    selectContact(contact) {
      this.$store.commit('chat/SET_CURRENT_CONTACT', contact)
      
      if (contact.unread_count > 0) {
        contact.unread_count = 0;
        if (this.$store.state.chat.socket) {
          this.$store.state.chat.socket.emit('mark_conversation_read', { 
            targetId: contact.id,
            targetType: contact.user_type || 2
          });
        }
      }
      
      this.$nextTick(() => {
        if (this.$refs.messageList && this.$refs.messageList.scrollToBottom) {
          this.$refs.messageList.scrollToBottom(true);
        }
      });
    },
    setStatus(status) {
      this.showStatusMenu = false;
      this.$store.commit('chat/UPDATE_CURRENT_USER_STATUS', status);
      if (this.$store.state.chat.socket) {
        this.$store.state.chat.socket.emit('update_status', { status });
      }
    },
    openSettings() {
      this.showSettings = true;
    },
    closeSettings() {
      this.showSettings = false;
      this.editingField = '';
      this.saveSettings();
    },
    // 开始内联编辑
    startEdit(field, value) {
      this.editingField = field;
      this.editValue = value;
    },
    // 取消编辑
    cancelEdit() {
      this.editingField = '';
      this.editValue = '';
    },
    // 保存忙碌状态自动回复
    saveBusyReply() {
      if (!this.editValue.trim()) {
        this.$message.warning('请输入回复内容');
        return;
      }
      this.busyAutoReply = this.editValue.trim();
      this.cancelEdit();
      this.$message.success('保存成功');
    },
    // 保存门店打烊自动回复
    saveCloseReply() {
      if (!this.editValue.trim()) {
        this.$message.warning('请输入回复内容');
        return;
      }
      this.closeAutoReply = this.editValue.trim();
      this.cancelEdit();
      this.$message.success('保存成功');
    },
    // 保存常用语
    saveQuickReplyItem(index) {
      if (!this.editValue.trim()) {
        this.$message.warning('请输入常用语内容');
        return;
      }
      this.quickReplies[index] = this.editValue.trim();
      this.cancelEdit();
      this.$message.success('保存成功');
    },
    // 添加常用语
    addQuickReplyItem() {
      this.quickReplies.push('');
      const newIndex = this.quickReplies.length - 1;
      this.startEdit('quickReply_' + newIndex, '');
    },
    // 删除常用语
    deleteQuickReply(index) {
      this.$confirm('确定要删除这条常用语吗？', '提示', {
        type: 'warning',
      }).then(() => {
        this.quickReplies.splice(index, 1);
        this.$message.success('删除成功');
      });
    },
    // 更改聊天背景
    changeBackground(value) {
      this.currentBackground = value;
      const rightWindow = this.$refs.messageList;
      if (rightWindow && rightWindow.handleBackgroundChange) {
        rightWindow.handleBackgroundChange(value);
      }
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
                        }
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
.im-main-list {
  display: flex;
  height: calc(100% - 68px);
  overflow: hidden;
  position: relative;
  
  &.show-settings {
    .settings-panel {
      transform: translateX(0);
    }
  }
}
.no-contact{display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;font-size: 16px;color: #999;}

// 设置面板样式 - 在对话框最外层，覆盖整个对话框
.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 623px;
  height: 100%;
  background: #fff;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e5e5e5;
  
  &.open {
    transform: translateX(0);
  }
}

.settings-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  
  .settings-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
  
  .settings-close {
    font-size: 18px;
    color: #909399;
    cursor: pointer;
    padding: 4px;
    &:hover {
      color: #606266;
    }
  }
}

.settings-tabs {
  display: flex;
  padding: 0 12px;
  border-bottom: 1px solid #e5e5e5;
  overflow-x: auto;
  background: #fafafa;
  
  .tab-item {
    padding: 12px 10px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    transition: color 0.2s;
    
    &:hover {
      color: #409eff;
    }
    
    &.active {
      color: #409eff;
      font-weight: 500;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 10px;
        right: 10px;
        height: 2px;
        background: #409eff;
      }
    }
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.setting-section {
  margin-bottom: 20px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }
}

.setting-desc {
  flex: 1;
  font-size: 13px;
  color: #606266;
}

.setting-value {
  flex: 1;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.setting-edit {
  font-size: 13px;
  color: #409eff;
  cursor: pointer;
  
  &:hover {
    color: #67c23a;
  }
}

// 内联编辑输入框
.edit-textarea {
  flex: 1;
  min-height: 60px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #409eff;
  }
}

.edit-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  
  &:focus {
    outline: none;
    border-color: #409eff;
  }
}

// 编辑操作按钮
.edit-actions {
  display: flex;
  gap: 10px;
  margin-left: 12px;
}

.edit-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &.cancel {
    background: #f5f7fa;
    color: #606266;
    
    &:hover {
      background: #e4e7ed;
    }
  }
  
  &.save {
    background: #409eff;
    color: #fff;
    
    &:hover {
      background: #67b8ff;
    }
  }
}

// 开关切换
.toggle-switch {
  width: 40px;
  height: 22px;
  background: #d9d9d9;
  border-radius: 11px;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;
  margin-right: 10px;
  
  &.active {
    background: #409eff;
    
    .toggle-dot {
      transform: translateX(18px);
    }
  }
  
  .toggle-dot {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s;
  }
}

// 选项切换（开启/关闭）
.setting-toggle {
  display: flex;
  gap: 6px;
  
  .toggle-option {
    padding: 3px 12px;
    border-radius: 10px;
    font-size: 12px;
    color: #909399;
    background: #f5f7fa;
    cursor: pointer;
    transition: all 0.3s;
    
    &.active {
      background: #409eff;
      color: #fff;
    }
  }
}

// 聊天背景选项
.background-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  .bg-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &.active {
      border: 2px solid #409eff;
    }
    
    .bg-preview {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      margin-bottom: 4px;
    }
    
    span {
      font-size: 11px;
      color: #606266;
    }
  }
}

// 快捷回复列表
.quick-replies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .add-reply-btn {
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
    padding: 3px 10px;
    border: 1px dashed #409eff;
    border-radius: 4px;
    
    &:hover {
      background: #e8f4fc;
    }
  }
}

.quick-replies-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-reply-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  
  .reply-content {
    flex: 1;
    font-size: 13px;
    color: #606266;
  }
  
  .reply-actions {
    display: flex;
    gap: 12px;
    
    .action-btn {
      font-size: 12px;
      cursor: pointer;
      
      &.edit {
        color: #409eff;
      }
      
      &.delete {
        color: #f56c6c;
      }
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 延迟选择器
.delay-select {
  width: 90px;
}
</style>