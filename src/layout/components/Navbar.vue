<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"     
      class="hamburger-container"    
      @toggleClick="toggleSideBar"       
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <chat-window ref="platformChat" />
    <div class="right-menu">   
      <template v-if="device !== 'mobile'">
        <!-- <router-link to="/dataDnalyse" target="_blank" class="data">
          数据监控
        </router-link> -->
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <store-menu id="business-store-container" class="business-store-container" v-if="user.userType==2"></store-menu>  
   
        <!-- <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <!-- <size-select id="size-select" class="right-menu-item hover-effect" /> -->
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
            <!-- <img :src="avatarUrl" class="user-avatar" /> -->
            <!-- <user-avatar :src="user.avatar" class="user-avatar" />
            <i class="el-icon-caret-bottom" /> -->
        账号:{{user.username}}
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display: block" @click="show = true">  
            <el-dropdown-item> 布局设置 </el-dropdown-item>
          </span>
          <router-link to="/user/profile">
            <el-dropdown-item> 个人中心 </el-dropdown-item>
          </router-link>
          <span style="display: block" @click="open">
            <el-dropdown-item divided> 退出登录 </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import StoreMenu from "@/components/StoreMenu";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import Search from "@/components/HeaderSearch";
import ChatWindow from "@/components/ChatWindow/index.vue";
import userAvatar from "@/components/System/user/userAvatar.vue";
export default {  
  name: "Navbar",  
  components: {
    Breadcrumb,
    StoreMenu,
    Hamburger,
    Screenfull,
    Search,
    ChatWindow,
    userAvatar,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device", "user", "baseApi"]),
    show: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    open() {
      this.$msg.confirm("确定注销并退出系统吗？", {
        ok: () => {
          this.logout();
        },
      });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        if(this.user.userType==2){
            this.$router.push('/businessLogin');
        }else{
          location.reload();  
        }
      });
    },
  },  
  watch: {
    user(oldVal, newVal) {  
        if(newVal.avatar){
           this.fileName = "/" + newVal.avatar.split("\\")[3]
        }
    },
    deep: true, // 深度监听
    immediate: true, // 第一次改变就执行
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
  
  .hamburger-container {
    margin-right: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 4px;
    
    &:hover {
      background: #f0f2f5;
    }
  }

  .breadcrumb-container {
    flex: 1;
    font-size: 14px;
    color: #606266;
  }

  .right-menu {
    display: flex;
    align-items: center;
    gap: 12px;
    
    &:focus {
      outline: none;
    }

    .right-menu-item {
      padding: 8px 12px;
      font-size: 14px;
      color: #606266;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &.hover-effect {
        cursor: pointer;
        
        &:hover {
          background: #f0f2f5;
          color: #303133;
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        padding: 8px 12px;
        border-radius: 4px;
        background: #f0f2f5;
        transition: all 0.3s ease;
        cursor: pointer;
        font-size: 14px;
        color: #606266;
        
        &:hover {
          background: #e4e7ed;
          color: #303133;
        }
      }
    }
  }
}
</style>
