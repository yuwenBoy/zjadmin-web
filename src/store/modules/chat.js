import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";
import { getToken } from "@/utils/storage";
import { getMessageHistory, getChatContactList } from "@/api/im";
import Config from "@/settings";
import Avatar from "@/assets/images/avatar.png";
import { getFullImageUrl } from "@/utils";
Vue.use(Vuex);

// 获取 eventBus 的辅助函数
function getEventBus() {
  return Vue.prototype.$eventBus;
}

const state = {
  socket: null,
  messages: [], // 当前会话消息
  currentChat: null, // 当前会话对象
  isConnected: false,
  id: null, // 当前用户ID
  messageStatus: {}, // ✅ 存储消息状态 { messageId: 'sent' }
  contactList: [], // 左侧联系人列表
  currentContact: {}, // 当前联系人
  userStatus: {}, // 用户状态映射 { userId: 'online' | 'busy' | 'offline' }
  pendingMessages: [], // 待发送消息队列（关闭状态下的消息）
  currentUserStatus: 'offline', // 当前用户状态
  autoRepliedUsers: {} // ✅ 记录已发送自动回复的用户 { userId: timestamp }
};
function getIpcRenderer() {
  // 第1层：判断是否在 Electron 环境
  if (typeof window === "undefined") return null;

  // 第2层：判断是否有 electronAPI（preload 注入）
  if (window.electronAPI && window.electronAPI.ipcRenderer) {
    return window.electronAPI.ipcRenderer;
  }

  // 第3层：判断是否有原生 require（旧方式）
  if (window.require) {
    try {
      return window.require("electron").ipcRenderer;
    } catch (e) {
      return null;
    }
  }
  return null;
}

const mutations = {
  SET_SOCKET(state, socket) {
    state.socket = socket;
  },
  SET_CONNECTED(state, status) {
    state.isConnected = status;
  },
  SET_CURRENT_CHAT(state, chat) {
    state.currentChat = chat;
    state.messages = []; // 切换会话时清空消息
  },
  ADD_MESSAGE(state, message) {
      message.senderAvatar = getFullImageUrl(message.senderAvatar, Avatar);
    state.messages.push(message);
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  SET_MESSAGE_STATUS(state, { messageId, status }) {
    state.messageStatus = {
      ...state.messageStatus,
      [messageId]: status
    };
  },

  UPDATE_MESSAGE_STATUS(state, { messageId, status, readAt }) {
    const message = state.messages.find(m => m.id === messageId);
    if (message) {
      message.status = status;
      if (readAt) message.readAt = readAt;
    }

    state.messageStatus = {
      ...state.messageStatus,
      [messageId]: status
    };
  },

  SET_CONTACT_LIST(state, contactList) {
    state.contactList = contactList;
  },
  SET_CURRENT_CONTACT(state, contact) {
    state.currentContact = contact;
  },
  
  // 更新用户状态
  UPDATE_USER_STATUS(state, { userId, status }) {
    state.userStatus = {
      ...state.userStatus,
      [userId]: status
    };
  },

  // 更新当前用户状态
  UPDATE_CURRENT_USER_STATUS(state, status) {
    const previousStatus = state.currentUserStatus;
    state.currentUserStatus = status;
    
    // 如果从关闭状态切换到在线状态，发送待发送的消息
    if (previousStatus === 'offline' && status !== 'offline' && state.pendingMessages.length > 0) {
      // 逐个发送待发送的消息
      state.pendingMessages.forEach(pendingMessage => {
        state.socket.emit('private_message', {
          receiverId: pendingMessage.receiverId,
          content: pendingMessage.content,
          targetId: pendingMessage.targetId,
          targetType: pendingMessage.targetType
        });
        
        // 更新本地消息状态
        const message = state.messages.find(m => m.id === pendingMessage.id);
        if (message) {
          message.status = 1; // 更新为已发送状态
        }
      });
      state.pendingMessages = [];
    }
  },

  // 添加待发送消息
  ADD_PENDING_MESSAGE(state, message) {
    state.pendingMessages.push(message);
  },
  
  // 记录已发送自动回复的用户
  SET_AUTO_REPLIED(state, { userId }) {
    state.autoRepliedUsers = {
      ...state.autoRepliedUsers,
      [userId]: Date.now()
    };
  },
  
  UPDATE_CONTACT_LAST_MSG(
    state,
    {
      contactId,
      lastMessage,
      lastTime,
      isIncoming = false,
      senderName,
      senderAvatar
    }
  ) {
    // ✅ 类型安全：统一转成数字
    const targetId = Number(contactId);
    let contact = state.contactList.find(c => Number(c.id) === targetId);
    const isCurrentChat =
      state.currentContact &&
      Number(state.currentContact.id) === parseInt(targetId);
    // ✅ 查找联系人（如果找不到，自动创建）
    if (contact) {
      contact.last_message = lastMessage;
      contact.last_time = lastTime;
      // ✅ 根据 isIncoming 更新未读数
      if (isIncoming) {
        if (!isCurrentChat) {
          contact.unread_count = (parseInt(contact.unread_count) || 0) + 1;
        }
      } else {
        contact.unread_count = 0; // ✅ 自己发的：未读清零
      }
    } else {
        let avatarUrl = getFullImageUrl(senderAvatar, Avatar);
        contact = {
          id: targetId,
          name: senderName || `用户${targetId}`,
          avatar: avatarUrl,
          last_message: lastMessage,
          last_time: lastTime,
          unread_count: isIncoming && !isCurrentChat ? 1 : 0
        };
        state.contactList.push(contact);
      }
  },
  APPEND_HISTORY_MESSAGES(state, newMessages) {
    if (newMessages) {
      // 处理每条消息的头像
      const processedMessages = newMessages.map(message => {
        message.senderAvatar = getFullImageUrl(message.senderAvatar, Avatar);
        return message;
      });
      state.messages = [...processedMessages, ...state.messages];
    }
  },
  RESET_MESSAGES(state) {
    state.messages = [];
  }
};

const actions = {
  // 登录后初始化 WebSocket 连接
  initSocket({ commit, rootState, state, dispatch }) {
    // 如果已经连接，先断开并清理事件监听器
    if (state.socket) {
      state.socket.removeAllListeners();
      state.socket.close();
      commit("SET_SOCKET", null);
    }
    
    state.id = rootState.user.user.id;
    let _token = getToken();
    if (!_token) {
      return;
    }
    if (!state.id) {
      return;
    }
    const socket = io(rootState.api.socketApi, {
      path: "/socket.io",
      transports: ["websocket"], // 明确指定传输方式
      auth: { token: _token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    // 监听 WebSocket 连接
    socket.on("connect", () => {
      commit("SET_CONNECTED", true);
      socket.data = { userId: state.id };
    });

    // 监听 WebSocket 断开
    socket.on("disconnect", () => {
      commit("SET_CONNECTED", false);
    });

    // 监听连接错误（包括认证失败 401）
    socket.on("connect_error", async (error) => {
      commit("SET_CONNECTED", false);
      // 检查是否是认证错误（Token过期）
      if (error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
        try {
          // 尝试刷新 Token
          const refreshRes = await Vue.prototype.$http.post("/auth/updateToken");
          if (refreshRes && refreshRes.result) {
            const { accessToken, refreshToken } = refreshRes.result;
            setToken(accessToken, refreshToken);
            // Token 刷新成功，重新初始化 Socket 连接
            dispatch("initSocket");
          }
        } catch (e) {
          // Token 刷新失败，提示用户重新登录
          Vue.prototype.$message.error('登录已过期，请重新登录');
        }
      }
    });

    // 监听认证失败事件
    socket.on("unauthorized", (error) => {
      commit("SET_CONNECTED", false);
      // 尝试刷新 Token 并重连
      dispatch("handleTokenExpired", { socket });
    });

    // 监听消息状态更新
    socket.on("message_status_updated", data => {
      commit("UPDATE_MESSAGE_STATUS", data);
    });

    // 监听新消息
    socket.on("new_message", message => {
      // ✅ 转成左侧列表更新
      commit("UPDATE_CONTACT_LAST_MSG", {
        contactId: message.senderId,
        lastMessage: message.content,
        lastTime: message.createdAt,
        isIncoming: !message.isAutoReply && message.senderId !== state.id, // 关键：只有非自动回复且不是自己发送的消息才视为收到的消息
        senderName: message.senderCname,
        senderAvatar: message.senderAvatar
      });
      commit("ADD_MESSAGE", message);
      
      // 如果当前用户是忙碌状态，自动回复
      if (state.currentUserStatus === 'busy' && !message.isAutoReply) {
        // ✅ 检查是否已经给该用户发送过自动回复（5分钟内不再回复）
        const FIVE_MINUTES = 5 * 60 * 1000;
        const lastReplyTime = state.autoRepliedUsers[message.senderId];
        if (lastReplyTime && Date.now() - lastReplyTime < FIVE_MINUTES) {
          // 5分钟内已经回复过，不再重复回复
          return;
        }
        
        // 记录已回复
        commit("SET_AUTO_REPLIED", { userId: message.senderId });
        
        // 从localStorage读取忙碌状态自动回复内容
        let busyAutoReply = '您好，我现在忙碌中，会尽快回复您的消息。';
        try {
          const savedSettings = localStorage.getItem('chatSettings');
          if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.busyAutoReply) {
              busyAutoReply = settings.busyAutoReply;
            }
          }
        } catch (e) {
          // 读取自动回复设置失败已在上层处理
        }
        
        // 如果没有设置，则根据用户类型生成默认回复
         if (!busyAutoReply || busyAutoReply.trim() === '') {
           const user = Vue.prototype.$store ? Vue.prototype.$store.state.user.user : null;
           if (user && user.userType === 1) {
             busyAutoReply = '您好，我现在忙碌中，会尽快回复您的消息。';
           } else if (user && user.userType === 2 && user.business && user.business.store && user.business.store.length > 0) {
             const defaultStore = user.business.store.find(item => item.isDefault);
             let phone = '';
             if (defaultStore && defaultStore.contactInfo) {
               phone = defaultStore.contactInfo;
             } else {
               phone = user.business.store[0].contactInfo || '';
             }
             busyAutoReply = `亲亲，现在是出餐高峰期，不能及时回复您，如有急事请直接拨打${phone}`;
           }
         }
        
        const autoReply = {
          receiverId: message.senderId,
          content: busyAutoReply,
          targetId: message.senderId,
          targetType: 2 // 假设发送者是顾客
        };
        
        // 延迟1秒发送自动回复，避免太突兀
        setTimeout(() => {
          socket.emit('private_message', autoReply);
          
          // 在本地显示自动回复消息
          const autoReplyMessage = {
            id: `auto_${Date.now()}`,
            senderId: state.id,
            receiverId: message.senderId,
            content: autoReply.content,
            targetId: autoReply.targetId,
            targetType: autoReply.targetType,
            createdAt: new Date().toISOString(),
            senderUsername: '我',
            senderAvatar: '',
            isAutoReply: true,
            status: 1
          };
          commit("ADD_MESSAGE", autoReplyMessage);
          
          // 更新联系人列表的最后消息
          commit("UPDATE_CONTACT_LAST_MSG", {
            contactId: message.senderId,
            lastMessage: autoReply.content,
            lastTime: new Date().toISOString(),
            isIncoming: false,
            senderName: '我',
            senderAvatar: ''
          });
        }, 1000);
      }
      

      // 监听在线用户列表
    socket.on('online_users_response', (res) => {
      // ✅ 这里才是真实在线人数
      this.stats.onlineCount = res.onlineUsers.length;
    });

      // ✅ 关键：如果是当前会话，立即发送已读回执
      const isCurrentChat =
        state.currentContact &&
        Number(state.currentContact.id) === message.senderId;
      if (isCurrentChat) {
        setTimeout(() => {
          // 当前会话：立即标记已读
          socket.emit("mark_as_read", { messageIds: [message.id] });
        }, 1000);
      } else {
        let ipcRenderer = getIpcRenderer();
        if (ipcRenderer) {
          window.electronAPI.notify("message");
        }
      }
    });

    // ==============================
    // 🔥 监听【新订单推送】给商家
    // ==============================
    socket.on("new_shop_order", order => {
      // 触发全局事件，通知订单推送组件
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.$emit("new-shop-order", order);
        // 同时触发刷新订单列表和统计
        eventBus.$emit("refresh-order-list");
      } else {
        // eventBus 不存在，事件已通过其他方式处理
      }

      // Electron 环境下发送通知
      const ipcRenderer = getIpcRenderer();
      if (ipcRenderer && window.electronAPI) {
        window.electronAPI.notify("newOrder");
      }
    });

    // ✅ 监听自己发送的消息确认（已发送）
    socket.on("message_sent", message => {
      // 更新状态为已发送（1）
      commit("UPDATE_MESSAGE_STATUS", { messageId: message.id, status: 1 });
      
      // 发送已送达确认请求
      setTimeout(() => {
        socket.emit("mark_as_delivered", { messageIds: [message.id] });
      }, 1000);
      
      if (state.currentChat) {
        // 检查是否已经存在相同的消息（避免重复添加，比如自动回复消息）
        const exists = state.messages.find(m => m.id === message.id || 
          (m.senderId === message.senderId && m.content === message.content && m.createdAt === message.createdAt));
        if (!exists) {
          commit("ADD_MESSAGE", message);
        }
      }
    });
    
    // ✅ 监听已送达确认
    socket.on("message_delivered", data => {
      if (data.messageIds && data.messageIds.length > 0) {
        data.messageIds.forEach(messageId => {
          commit("UPDATE_MESSAGE_STATUS", { messageId, status: 2 });
        });
      }
    });
    
    // ✅ 监听已读确认（当对方阅读消息后，服务器推送已读状态）
    socket.on("message_read", data => {
      if (data.messageIds && data.messageIds.length > 0) {
        data.messageIds.forEach(messageId => {
          commit("UPDATE_MESSAGE_STATUS", { messageId, status: 3, readAt: data.readAt || Date.now() });
        });
      }
    });
    
    // ✅ 监听消息状态同步响应
    socket.on("message_status_sync", data => {
      if (data.statusMap) {
        Object.entries(data.statusMap).forEach(([messageId, statusData]) => {
          const status = statusData.status;
          const readAt = statusData.readAt;
          commit("UPDATE_MESSAGE_STATUS", { messageId: parseInt(messageId), status, readAt });
        });
      }
    });

    // 监听连接确认
    socket.on("connected", data => {
      socket.data = { userId: data.userId }; // 保存用户ID
      // 更新本地状态
      if (data.status) {
        // 更新当前用户状态
        commit("UPDATE_CURRENT_USER_STATUS", data.status);
      }
    });
    
    // 监听状态更新
    socket.on("status_updated", data => {
      // 更新本地状态
      if (data.userId) {
        commit("UPDATE_USER_STATUS", { userId: data.userId, status: data.status });
      }
    });
    
    // 监听待发送消息发送成功
    socket.on("pending_messages_sent", data => {
      // 更新本地消息状态
      data.messageIds.forEach(messageId => {
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          message.status = 1; // 更新为已发送状态
        }
      });
    });
    
    // 监听用户状态变更
    socket.on("user_status_changed", data => {
      // 更新本地状态
      if (data.userId) {
        commit("UPDATE_USER_STATUS", { userId: data.userId, status: data.status });
      }
    });

    commit("SET_SOCKET", socket);
  },

  // 发送私聊消息
  sendPrivateMessage(
    { commit, state },
    { receiverId, content, targetId, targetType }
  ) {
    state.socket.emit("private_message", {
      receiverId,
      content,
      targetId,
      targetType
    });
    // 暂时用时间戳作为临时ID
    const tempId = `temp_${Date.now()}`;
    commit("SET_MESSAGE_STATUS", {
      messageId: tempId,
      status: 0
    });
  },

  // 发送群聊消息
  sendGroupMessage({ state }, { groupId, content }) {
    state.socket.emit("group_message", {
      groupId,
      content
    });
  },

  // 更新消息
  updateMessage({ state, commit }, { targetId, lastMessage, lastTime }) {
    // ✅ 异步通知后端（不影响前端响应）
    state.socket.emit("message_update", { targetId, lastMessage, lastTime }, () => {
      // ✅ 直接本地更新，不等待后端（假设后端一定会成功）
      commit("UPDATE_CONTACT_LAST_MSG", { contactId: targetId, lastMessage, lastTime, isIncoming: false });
    });
    return Promise.resolve({ targetId, lastMessage, lastTime });
  },

  // 获取联系人列表
  async loadContacts({ commit, state }, { type }) {
    const response = await getChatContactList({ type });
    commit("SET_CONTACT_LIST", response.result);
    // if (response.result.length > 0) {
    //   commit("SET_CURRENT_CONTACT", response.result[0]);
    // }
  },

  // 加载历史消息
  async loadHistory({ commit }, { type, id, page = 1 }) {
    if (page === 1) {
      commit("RESET_MESSAGES");
    }
    const response = await getMessageHistory({ userId: id, page, type });
    const messages = response.result || [];
    // 按时间正序排列
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // ✅ 只有返回有数据时，才追加消息（空数组不处理）
    if (messages.length > 0) {
      commit("APPEND_HISTORY_MESSAGES", messages);
    }
    return messages;
  },

  // /**
  //  * ✅ 标记消息为已送达（发送方调用）
  //  */
  // markAsDelivered({ state }, messageIds) {
  //   state.socket.emit("mark_as_delivered", { messageIds });
  // },

  /**
   * ✅ 标记消息为已读（接收方调用）
   */
  markAsRead({ state }, messageIds) {
    state.socket.emit("mark_as_read", { messageIds });
  },

  /**
   * ✅ 自动标记可见消息为已读
   */
  async autoMarkAsRead({ state, dispatch }) {
    if (!state.currentChat || !state.messages.length) return;

    const unreadMessageIds = state.messages
      .filter(m => !m.isRead && m.senderId !== state.id)
      .map(m => m.id);

    if (unreadMessageIds.length > 0) {
      dispatch("markAsRead", unreadMessageIds);
    }
  },

  /**
   * ✅ 处理 Token 过期，刷新并重连
   */
  async handleTokenExpired({ dispatch }) {
    try {
      // 尝试刷新 Token
      const refreshRes = await Vue.prototype.$http.post("/auth/updateToken");
      if (refreshRes && refreshRes.result) {
        const { accessToken, refreshToken } = refreshRes.result;
        setToken(accessToken, refreshToken);
        // Token 刷新成功，重新初始化 Socket 连接
        dispatch("initSocket");
      }
    } catch (e) {
      // Token 刷新失败，提示用户重新登录
      Vue.prototype.$message.error('登录已过期，请重新登录');
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
