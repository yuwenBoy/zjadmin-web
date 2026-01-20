import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import { getToken } from "@/utils/storage";
import axios from "axios";

Vue.use(Vuex);

const state = {
  socket: null,
  messages: [], // 当前会话消息
  currentChat: null, // { type: 'private'|'group', id: number }
  isConnected: false,
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
    state.messages.push(message);
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
};

const actions = {
  // 初始化 WebSocket 连接
  initSocket({ commit, rootState }) {
    let _token = getToken()
    if(!_token){
        console.log('token为空，无法连接 WebSocket！')
        return
    }
    // 推荐使用 URL 类拼接，避免手动错误
    const wsUrl = `${process.env.VUE_APP_URL}/chat`
    const socket = io(wsUrl, {
        path: '/socket.io',  
        transports: ['websocket'], // 明确指定传输方式
        auth: { token:getToken() },
        reconnection: true,
    })

    socket.on('connect', () => {
      console.log('WebSocket 已连接');
      commit('SET_CONNECTED', true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket 已断开');
      commit('SET_CONNECTED', false);
    });

    // // 监听新消息
    // socket.on('new_message', (message) => {
    //   console.log('📨 收到新消息:', message); // 调试用
    //   commit('ADD_MESSAGE', message);
    // });
    // ✅ 监听新消息（关键）
    socket.on('new_message', (message) => {
      console.log('📨 收到新消息:', message);
      
      // ✅ 只添加到当前会话的消息列表
      if (state.currentChat) {
        const belongsToCurrentChat = 
          (state.currentChat.type === 'private' && 
           ((message.senderId === state.currentChat.id && message.receiverId === socket.data.userId) ||
            (message.receiverId === state.currentChat.id && message.senderId === socket.data.userId))) ||
          (state.currentChat.type === 'group' && message.groupId === state.currentChat.id);

        if (belongsToCurrentChat) {
          commit('ADD_MESSAGE', message);
        }
      }

      // ✅ 更新未读计数（如果不在当前会话）
    //   dispatch('handleNewMessageNotification', message);
    });
    
    // ✅ 监听自己发送的消息确认
    socket.on('message_sent', (message) => {
      console.log('📤 消息发送确认:', message);
      commit('ADD_MESSAGE', message);
    });

    // 监听连接确认
    socket.on('connected', (data) => {
      console.log('服务器确认:', data);
      socket.data = { userId: data.userId }; // 保存用户ID
    });

    commit('SET_SOCKET', socket);
  },

  // 发送私聊消息
  sendPrivateMessage({ state }, { receiverId, content }) {
    console.log('发送私聊消息', receiverId, content)
    console.log('state', state)
    state.socket.emit('private_message', {
      receiverId,
      content,
    });
  },

  // 发送群聊消息
  sendGroupMessage({ state }, { groupId, content }) {
    state.socket.emit('group_message', {
      groupId,
      content,
    });
  },

  // 加载历史消息
  async loadHistory({ commit, rootState }, { type, id, page = 1 }) {
    console.log('加载历史消息', type, id, page)
    const token = getToken()
    console.log('token', token)
    let url = '';

    if (type === 'private') {
      url = `/basic-api/messages/private?userId=${id}&page=${page}`;
    } else {
      url = `/basic-api/messages/group?groupId=${id}&page=${page}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: getToken(),
      },
    })

    const messages =response.data.result //await response.json();
    // 按时间正序排列
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    commit('SET_MESSAGES', messages);
  },


  
//    // ✅ 处理新消息通知（更新未读数）
//   handleNewMessageNotification({ state, commit }, message) {
//     if (!state.currentChat || message.senderId !== state.socket?.data?.userId) {
//       // 不在当前会话，或未读消息
//       const chatKey = message.groupId 
//         ? `group_${message.groupId}` 
//         : `user_${message.senderId}`;
      
//       const currentCount = state.unreadCounts[chatKey] || 0;
//       commit('SET_UNREAD_COUNT', { chatKey, count: currentCount + 1 });
//     }
//   },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
