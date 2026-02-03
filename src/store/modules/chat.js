import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";
import { getToken } from "@/utils/storage";
import axios from "axios";
import { BASE_API } from '@/config/api.js';
import Config from "@/settings";
Vue.use(Vuex);

const state = {
  socket: null,
  messages: [], // 当前会话消息
  currentChat: null, // { type: 'private'|'group', id: number }
  isConnected: false,
  id: null, // 当前用户ID
  messageStatus: {}, // ✅ 存储消息状态 { messageId: 'sent' }
};

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
    message.senderAvatar = Config.baseImgUrl + message.senderAvatar;
    state.messages.push(message);
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
  SET_MESSAGE_STATUS(state, { messageId, status }) {
    state.messageStatus = {
      ...state.messageStatus,
      [messageId]: status,
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
      [messageId]: status,
    };
  },
};

const actions = {
  // 登录后初始化 WebSocket 连接
  initSocket({ commit, rootState, state }) {
    state.id = rootState.user.user.id;
    let _token = getToken();
    if (!_token) {
      console.log("token为空，无法连接 WebSocket！");
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
    socket.on('message_status_updated', (data) => {
      console.log('📊 消息状态更新:', data);
      commit('UPDATE_MESSAGE_STATUS', data);
    });

    // 监听新消息
    socket.on("new_message", message => {
      console.log("📨 收到新消息:", message); // 调试用
      setTimeout(() => {
        socket.emit('mark_as_read', { messageIds: [message.id] });
        console.log('发送已读回执'); // ✅ 必须有
        //  // ✅ 标记为已送达
        // commit('SET_MESSAGE_STATUS', { 
        //     messageId: message.id, 
        //     status: 1
        // });
    }, 1000);
      commit("ADD_MESSAGE", message);
    });

    // // ✅ 监听新消息（关键）
    // socket.on('new_message', (message) => {
    //   console.log('📨 收到新消息:', message);

    //   // ✅ 只添加到当前会话的消息列表
    //   if (state.currentChat) {
    //     const belongsToCurrentChat =
    //       (state.currentChat.type === 'private' &&
    //        ((message.senderId === state.currentChat.id && message.receiverId === socket.data.userId) ||
    //         (message.receiverId === state.currentChat.id && message.senderId === socket.data.userId))) ||
    //       (state.currentChat.type === 'group' && message.groupId === state.currentChat.id);

    //     if (belongsToCurrentChat) {
    //       commit('ADD_MESSAGE', message);
    //     }
    //   }

    //   // ✅ 更新未读计数（如果不在当前会话）
    // //   dispatch('handleNewMessageNotification', message);
    // });

    // ✅ 监听自己发送的消息确认
    socket.on("message_sent", message => {
      console.log("📤 消息发送确认:", message);
      if (state.currentChat) {
        commit("ADD_MESSAGE", message);
      }
    });

    // 监听连接确认
    socket.on("connected", data => {
      console.log("服务器确认:", data);
      socket.data = { userId: data.userId }; // 保存用户ID
    });

    // 调试：监听所有事件
    socket.onAny((event, ...args) => {
      console.log(`[Socket事件: ${event}]`, args);
    });

    commit("SET_SOCKET", socket);
  },

  // 发送私聊消息
  sendPrivateMessage({commit, state }, { receiverId, content,targetId }) {
    console.log("发送私聊消息", receiverId, content,targetId);
    state.socket.emit("private_message", {
      receiverId,
      content,
      targetId,
    });
    // 暂时用时间戳作为临时ID
    const tempId = `temp_${Date.now()}`;
    commit('SET_MESSAGE_STATUS', { 
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

  // 加载历史消息
  async loadHistory({ commit, rootState }, { type, id, page = 1 }) {
    let _token = getToken();
    let url = "";
    if (type === "private") {
      url = `${BASE_API}/messages/private?userId=${id}&page=${page}`;
    } else {
      url = `${BASE_API}/messages/group?groupId=${id}&page=${page}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: _token
      }
    });

    const messages = response.data.result; //await response.json();
    // 按时间正序排列
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    commit("SET_MESSAGES", messages);
  },
  
  /**
   * ✅ 标记消息为已送达（发送方调用）
   */
  markAsDelivered({ state }, messageIds) {
    state.socket.emit('mark_as_delivered', { messageIds });
  },

  /**
   * ✅ 标记消息为已读（接收方调用）
   */
  markAsRead({ state }, messageIds) {
    state.socket.emit('mark_as_read', { messageIds });
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
      dispatch('markAsRead', unreadMessageIds);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
