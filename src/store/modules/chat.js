import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";
import { getToken } from "@/utils/storage";
import { getMessageHistory, getChatContactList } from "@/api/im";
import Config from "@/settings";
import Avatar from "@/assets/images/avatar.png";
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
  currentUserStatus: 'offline' // 当前用户状态
};
function getIpcRenderer() {
  // 第1层：判断是否在 Electron 环境
  if (typeof window === "undefined") return null;

  // 第2层：判断是否有 electronAPI（preload 注入）
  if (window.electronAPI && window.electronAPI.ipcRenderer) {
    console.log("以获取 ipcRenderer 方式");
    return window.electronAPI.ipcRenderer;
  }

  // 第3层：判断是否有原生 require（旧方式）
  if (window.require) {
    try {
      console.log("以获取 ipcRenderer 方式");
      return window.require("electron").ipcRenderer;
    } catch (e) {
      console.log("获取 ipcRenderer 失败", e);
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
      // 不是完整URL，拼接baseImgUrl
      message.senderAvatar = message.senderAvatar && message.senderAvatar !== ''
        ?message.senderAvatar
        : Avatar;
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
      console.log('📤 发送待发送消息:', state.pendingMessages.length);
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
        // 检查是否已经是完整URL
        let avatarUrl = senderAvatar && senderAvatar !== '' ?  senderAvatar : Avatar;
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
        // 不是完整URL，拼接baseImgUrl
        message.senderAvatar = message.senderAvatar && message.senderAvatar !== '' ?message.senderAvatar : Avatar;
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
    // 如果已经连接，先断开
    if (state.socket) {
      state.socket.close();
      commit("SET_SOCKET", null);
    }
    
    state.id = rootState.user.user.id;
    let _token = getToken();
    if (!_token) {
      console.log("token为空，无法连接 WebSocket！");
      return;
    }
    if (!state.id) {
      console.log("userId为空，无法连接 WebSocket！");
      return;
    }
    const socket = io(rootState.api.socketApi, {
      path: "/socket.io",
      transports: ["websocket"], // 明确指定传输方式
      auth: { token: _token },
      reconnection: true
    });

    // 监听 WebSocket 连接
    socket.on("connect", () => {
      console.log("WebSocket 已连接");
      commit("SET_CONNECTED", true);
      console.log("userId:", state.id);
      socket.data = { userId: state.id };
    });

    // 监听 WebSocket 断开
    socket.on("disconnect", () => {
      console.log("WebSocket 已断开");
      commit("SET_CONNECTED", false);
    });

    // 监听消息状态更新
    socket.on("message_status_updated", data => {
      console.log("📊 消息状态更新:", data);
      commit("UPDATE_MESSAGE_STATUS", data);
    });

    // 监听新消息
    socket.on("new_message", message => {
      console.log("📨 收到新消息:", message); // 调试用
      
      // 检查是否是自动回复
      if (message.isAutoReply) {
        console.log("🤖 收到自动回复:", message.content);
      }
      
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
        console.log("🤖 发送自动回复");
        const autoReply = {
          receiverId: message.senderId,
          content: '您好，我现在忙碌中，会尽快回复您的消息。',
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
      
      // ✅ 关键：如果是当前会话，立即发送已读回执
      const isCurrentChat =
        state.currentContact &&
        Number(state.currentContact.id) === message.senderId;
      if (isCurrentChat) {
        setTimeout(() => {
          // 当前会话：立即标记已读
          socket.emit("mark_as_read", { messageIds: [message.id] });
          console.log("当前会话，自动发送已读回执:", message.id);
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
      console.log("[Socket] 📦 收到新订单推送 (new_shop_order):", order);
      console.log("[Socket] 订单门店ID:", order.storeId || order.store_id);
      console.log("[Socket] 当前用户ID:", state.id);

      // 触发全局事件，通知订单推送组件
      const eventBus = getEventBus();
      if (eventBus) {
        console.log("[Socket] 触发 new-shop-order 事件到 eventBus");
        eventBus.$emit("new-shop-order", order);
        // 同时触发刷新订单列表和统计
        eventBus.$emit("refresh-order-list");
      } else {
        console.warn("[Socket] eventBus 不存在，无法触发事件");
      }

      // Electron 环境下发送通知
      const ipcRenderer = getIpcRenderer();
      if (ipcRenderer && window.electronAPI) {
        console.log("[Socket] 发送 Electron 通知");
        window.electronAPI.notify("newOrder");
      }
    });

    // ✅ 监听自己发送的消息确认
    socket.on("message_sent", message => {
      console.log("📤 消息发送确认:", message);
      setTimeout(() => {
        socket.emit("mark_as_delivered", { messageIds: [message.id] });
        console.log("自动发送已送达回执:", message.id);
      }, 1000);
      if (state.currentChat) {
        commit("ADD_MESSAGE", message);
      }
    });

    // 监听连接确认
    socket.on("connected", data => {
      console.log("服务器确认:", data);
      socket.data = { userId: data.userId }; // 保存用户ID
      // 更新本地状态
      if (data.status) {
        console.log('服务器返回的初始状态:', data.status);
        // 更新当前用户状态
        commit("UPDATE_CURRENT_USER_STATUS", data.status);
      }
    });
    
    // 监听状态更新
    socket.on("status_updated", data => {
      console.log("状态更新:", data);
      // 更新本地状态
      if (data.userId) {
        commit("UPDATE_USER_STATUS", { userId: data.userId, status: data.status });
      }
    });
    
    // 监听待发送消息发送成功
    socket.on("pending_messages_sent", data => {
      console.log("📤 待发送消息已发送:", data);
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
      console.log("用户状态变更:", data);
      // 更新本地状态
      if (data.userId) {
        commit("UPDATE_USER_STATUS", { userId: data.userId, status: data.status });
      }
    });

    // 调试：监听所有事件
    socket.onAny((event, ...args) => {
      console.log(`[Socket事件: ${event}]`, args);
    });

    commit("SET_SOCKET", socket);
  },

  // 发送私聊消息
  sendPrivateMessage(
    { commit, state },
    { receiverId, content, targetId, targetType }
  ) {
    console.log("发送私聊消息", receiverId, content, targetId, targetType);
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
      console.log("🚀 本地更新消息状态", { targetId, lastMessage, lastTime });
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
