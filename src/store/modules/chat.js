import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";
import { getToken } from "@/utils/storage";
import { getMessageHistory,getChatContactList } from '@/api/system/user'
import Config from "@/settings";
Vue.use(Vuex);

const state = {
  socket: null,
  messages: [], // 当前会话消息
  currentChat: null, // { type: 'private'|'group', id: number }
  isConnected: false,
  id: null, // 当前用户ID
  messageStatus: {}, // ✅ 存储消息状态 { messageId: 'sent' }
  contactList:[], // 左侧联系人列表
  currentContact:{}, // 当前联系人
};
// 安全获取 ipcRenderer 的函数
function getIpcRenderer() {
  // 第1层：判断是否在 Electron 环境
  if (typeof window === 'undefined') return null
  
  // 第2层：判断是否有 electronAPI（preload 注入）
  if (window.electronAPI && window.electronAPI.ipcRenderer) {
    console.log('以获取 ipcRenderer 方式')
    return window.electronAPI.ipcRenderer
  }
  
  // 第3层：判断是否有原生 require（旧方式）
  if (window.require) {
    try {
      console.log('以获取 ipcRenderer 方式')
      return window.require('electron').ipcRenderer
    } catch (e) {
      console.log('获取 ipcRenderer 失败', e)
      return null
    }
  }
  
  return null
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

  SET_CONTACT_LIST(state, contactList) {
    state.contactList = contactList;
  },
  SET_CURRENT_CONTACT(state, contact){
    state.currentContact = contact;
  },

  UPDATE_CONTACT_LAST_MSG(state, { contactId, lastMessage, lastTime,isIncoming = false }) {
    // ✅ 类型安全：统一转成数字
    const targetId = Number(contactId);
    // ✅ 查找联系人（如果找不到，自动创建）
    let contact = state.contactList.find(c => Number(c.id) === targetId);
    if (contact) {
      contact.last_message = lastMessage;
      contact.last_time = lastTime;
       // ✅ 根据 isIncoming 更新未读数
      if (isIncoming) {
        contact.unread_count = (parseInt(contact.unread_count) || 0) + 1  // ✅ 收到消息：未读+1
      } else {
        contact.unread_count = 0  // ✅ 自己发的：未读清零
      }
    }
  },
  APPEND_HISTORY_MESSAGES(state, newMessages) {
    console.log('📜追加历史消息',newMessages) 
    if (newMessages) {
         state.messages = [...newMessages, ...state.messages];
    }
  },
  RESET_MESSAGES(state) {
    state.messages = [];
  },
};

const actions = {
  // 登录后初始化 WebSocket 连接
  initSocket({ commit, rootState, state,dispatch }) {
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
     // ✅ 转成左侧列表更新
       commit('UPDATE_CONTACT_LAST_MSG', {
            contactId: message.senderId,
            lastMessage:message.content,
            lastTime:message.createdAt,
            isIncoming: true  // 关键：表示收到消息
        })
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
      let ipcRenderer = getIpcRenderer()
      console.log('ipcRenderer',ipcRenderer)
      if(ipcRenderer){
          console.log('发送新消息通知')
          window.electronAPI.notify('message')
      }
    });

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
  sendPrivateMessage({commit, state }, { receiverId, content,targetId,targetType }) {
    console.log("发送私聊消息", receiverId, content,targetId,targetType);
    state.socket.emit("private_message", {
      receiverId,
      content,
      targetId,
      targetType,
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

  // 更新消息
updateMessage({state, commit }, { targetId, lastMessage, lastTime }) {
  // ✅ 异步通知后端（不影响前端响应）
  state.socket.emit('message_update', messsage=>{
   // ✅ 直接本地更新，不等待后端（假设后端一定会成功）
   commit('UPDATE_CONTACT_LAST_MSG', {...messsage})
   console.log('🚀 本地更新消息状态',messsage)
   return Promise.resolve({ targetId, lastMessage, lastTime })
  })
},

// 获取联系人列表
async loadContacts({ commit, state }) {
    const response = await getChatContactList()
    commit("SET_CONTACT_LIST", response.result);
    if(response.result.length>0){
        commit("SET_CURRENT_CONTACT", response.result[0]);
    }
},

  // 加载历史消息
async loadHistory({ commit }, { type, id, page = 1 }) {
  if (page === 1) {
      commit('RESET_MESSAGES');
    }
    const response = await getMessageHistory({ userId: id, page ,type});
    const messages = response.result || []; //await response.json();
      // 按时间正序排列
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    // ✅ 只有返回有数据时，才追加消息（空数组不处理）
    if (messages.length > 0) {
      commit('APPEND_HISTORY_MESSAGES', messages);
    }
    return messages;
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
