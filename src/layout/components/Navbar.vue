<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <router-link to="/dataDnalyse" target="_blank" class="data">
          数据监控
        </router-link> -->
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <!-- <size-select id="size-select" class="right-menu-item hover-effect" /> -->
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="fileName" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
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
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import Search from "@/components/HeaderSearch";
import Avatar from "@/assets/images/avatar.png";
import Config from "@/settings";
import { getFileName } from "@/utils/index";
export default {
  name: "Navbar",
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search,
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false,
      fileName: null,
    };
  },
  mounted() {
    this.fileName = Config.baseImgUrl + getFileName(this.user.avatar);
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
        location.reload();
      });
    },
  },
  watch: {
    user(oldVal, newVal) {
      this.fileName = "/" + newVal.avatar.split("\\")[3];
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
  background: #00d1d3;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .data {
      position: absolute;
      right: 392px;
    }
    .data:hover {
      border: 1px solid red;
      transition: all 0.3s;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 40px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
