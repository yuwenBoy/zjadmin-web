import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';

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
    const token = localStorage.getItem('token');
    const socket = io(process.env.VUE_APP_WS_URL + '/chat', {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('WebSocket 已连接');
      commit('SET_CONNECTED', true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket 已断开');
      commit('SET_CONNECTED', false);
    });

    // 监听新消息
    socket.on('new_message', (message) => {
      commit('ADD_MESSAGE', message);
    });

    commit('SET_SOCKET', socket);
  },

  // 发送私聊消息
  sendPrivateMessage({ state }, { receiverId, content }) {
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
    const token = localStorage.getItem('token');
    let url = '';

    if (type === 'private') {
      url = `/api/messages/private?userId=${id}&page=${page}`;
    } else {
      url = `/api/messages/group?groupId=${id}&page=${page}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const messages = await response.json();
    // 按时间正序排列
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    commit('SET_MESSAGES', messages);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
