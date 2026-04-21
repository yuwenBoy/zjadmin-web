<template>
  <div class="navbar">
    <!-- Logo区域 -->
    <div class="logo-container">
      <router-link class="logo-link" to="/">
        <!-- <img v-if="leftLogo" :src="leftLogo" class="logo-img"> -->
        <h1 class="logo-title">{{ title }}</h1>
      </router-link>
    </div>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <chat-window ref="platformChat" />
    <div class="right-menu">   
      <template v-if="device !== 'mobile'">
        <store-menu id="business-store-container" class="business-store-container" v-if="user.userType==2"></store-menu>  
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
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
import ChatWindow from "@/components/ChatWindow/index.vue";
import Logo from '@/assets/images/logo.png'
import BusinessLogo from '@/assets/images/business_logo.png'

export default {  
  name: "Navbar",  
  components: {
    Breadcrumb,
    StoreMenu,
    ChatWindow,
  },
  data() {
    return {
      title: 'JXXQZ后台管理系统',
      logo: Logo,
      businessLogo: BusinessLogo,
      leftLogo: '',
    };
  },
  mounted() {
    this.updateLogo()
  },
  watch: {
    'user.userType': {
      handler() {
        this.updateLogo()
      }
    },
    user: {
      handler(oldVal, newVal) {  
        if(newVal && newVal.avatar){
           this.fileName = "/" + newVal.avatar.split("\\")[3]
        }
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapGetters(["device", "user", "baseApi"]),
    isElectron() {
      return window.electronAPI && window.electronAPI.isElectron;
    },
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
    updateLogo() {
      if(this.user && this.user.userType == 2){
        this.title = 'JXXQZ商家端'
        this.leftLogo = this.businessLogo
      } else {
        this.title = 'JXXQZ后台管理系统'
        this.leftLogo = this.logo
      }
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
  padding: 0 20px 0 0;
  
  // Logo区域样式
  .logo-container {
    width: 224px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left:16px;
    flex-shrink: 0;
    
    .logo-link {
      display: flex;
      align-items: center;
      height: 22px;
      width: 100%;
      padding-right: 12px;
      border-right: 2px solid #e8e8e8;
      text-decoration: none;
      
      .logo-img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        object-fit: contain;
        flex-shrink: 0;
        border-radius: 4px;
      }
      
      .logo-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        margin: 0;
      }
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
