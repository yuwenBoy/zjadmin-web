<!-- sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="search-box">
      <el-input
        placeholder="搜索联系人"
        prefix-icon="el-icon-search"
        size="small"
        clearable
        v-model="searchKeyword"
      />
    </div>
    <div class="contact-list">
      <div
        v-for="(merchant, index) in contactList"
        :key="index"
        class="merchant-item"
        :class="{ active: currentContact && currentContact.id === merchant.id }"
        @click="selectContact(merchant)"
      >
        <el-badge
          :value="merchant.unread_count"
          :hidden="
            !merchant.unread_count || parseInt(merchant.unread_count) === 0
          "
          class="badge"
        >
          <el-avatar :src="merchant.avatar" size="medium" />
        </el-badge>
        <div class="contact-info">
          <div class="merchant-name">{{ merchant.name }}</div>
          <div class="last-message">{{ merchant.last_message }}</div>
        </div>
        <div class="last-time">
          {{ formatChatTimestamp(merchant.last_time) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatChatTimestamp } from "@/utils";
import { mapState,mapActions } from 'vuex';
export default {
  name: "LeftSidebar",
  data() {
    return {
      searchKeyword: "",
    };
  },
  computed: {
     ...mapState('chat', ['currentContact', 'contactList'])
  },
  watch: {
  },
  async mounted() {
      await this.loadContacts();
  },
  methods: {
    formatChatTimestamp,
     ...mapActions('chat', ['loadContacts']),  
    // 选择联系人
    selectContact(contact) {
      this.$emit("selectContact", contact);
    },
  },
};
</script>
<style scoped>
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

.contact-list {
  flex: 1;
  overflow-y: auto;
  min-height: 350px;
  max-height: 500px;
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

.contact-info {
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
.message-time {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.avatar {
  margin: 0 10px;
  flex-shrink: 0;
}
</style>
