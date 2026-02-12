<!-- sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="tabs-nav-wrap">
      <el-tabs v-model="imTabActive" @tab-click="handleImTabClick">
        <el-tab-pane :label="item.label" :name="item.name" :key="index" v-for="(item,index) in imTabsList">
            <div class="contact-list" v-if="contactList.length>0">
                <div v-for="(merchant, index) in contactList"
                    :key="index"
                    class="merchant-item"
                    :class="{ active: currentContact && currentContact.id === merchant.id }"
                    @click="selectContact(merchant)">
                    <el-badge :value="merchant.unread_count" :hidden="!merchant.unread_count || parseInt(merchant.unread_count) === 0" class="badge">
                        <user-avatar :src="merchant.avatar" />
                    </el-badge> 
                    <div class="contact-info">
                       <div class="merchant-name">{{ user.userType == 1? merchant.name : merchant.role_name ? (merchant.role_name  +'-'+ merchant.name): merchant.name }}</div>
                       <div class="last-message">{{ merchant.last_message }}</div>
                    </div>
                    <div class="last-time">
                    {{ merchant.last_time && formatChatTimestamp(merchant.last_time) }}
                    </div>
                </div>
             </div>
             <div v-else class="no-contact" style="margin-top:10px;font-size:14px;">暂无会话</div>
        </el-tab-pane>
     </el-tabs>
    </div>
  </div>
</template>
<script>
import { formatChatTimestamp } from "@/utils";
import { mapState,mapGetters } from 'vuex';
import userAvatar from "@/components/System/user/userAvatar.vue";
export default {
  name: "LeftSidebar",
  data() {
    return {
      imTabActive: "NEEDED",
      imTabsList: [{ label: "需回复", name: "NEEDED" }, { label: "顾客消息", name: "CUSTMSG" }, { label: "平台会话", name: "ADMIN" }],
    };
  },
  components:{userAvatar},
  computed: {
     ...mapState('chat', ['currentContact', 'contactList']),
      ...mapGetters(["user"]),
  },
  watch: {
  },
  async mounted() {
      if(this.user.userType == 1){
        this.imTabsList = [{ label: "需回复", name: "NEEDED" }, { label: "顾客消息", name: "CUSTMSG" }, { label: "商家消息", name: "BUSSINESS" }]
      } 
      await this.$store.dispatch("chat/loadContacts", {
        type: this.imTabActive,
      })
  },
  methods: {
    formatChatTimestamp,
    // 选择联系人
    selectContact(contact) {
      this.$emit("selectContact", contact);
    },
   async handleImTabClick(tab, event){
        this.imTabActive = tab.name;
        await this.$store.dispatch("chat/loadContacts", {
        type: this.imTabActive,
      })
    },
  },
};
</script>
<style lang="scss">
/* 左侧边栏 */
.sidebar {
  width: 288px;
  min-width: 288px;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
}

.tabs-nav-wrap {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  .el-tabs{margin:0;padding:0px;height: 40px;line-height: 40px;width: 100%;
    .el-tabs__nav-wrap::after{
        height: 0px !important;
    }
   .el-tabs__header{margin:0;}
   .el-tabs__item{padding: 0 13px !important;}
}
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
  padding: 10px 8px;
  height: 62px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  position: relative;
}

.merchant-item:hover {
  background-color: #f5f7fa;
}

.merchant-item.active {
  background-color: #F5F7FC !important;
}

.contact-info {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
}

.merchant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message {
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-time {
  font-size: 12px;
  color: #888;
  position: absolute;
  right: 15px;
  top: 0;
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
