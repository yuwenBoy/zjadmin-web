<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="leftLogo" :src="leftLogo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="leftLogo" :src="leftLogo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Logo from '@/assets/images/logo.png'

import BusinessLogo from '@/assets/images/business_logo.png'

import StoreLogo from '@/assets/images/business_logo.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'JXXQZ后台管理系统',
      logo: Logo,
      businessLogo:BusinessLogo,
      storeLogo:StoreLogo,
      userInfo:{},
      leftLogo:'',
    }
  },
  mounted(){
    this.userInfo = this.$store.state.user.user;
    if(this.userInfo.userType == 2){
        this.title ='JXXQZ商家端'; 
        this.leftLogo = this.businessLogo;
    }else{
        this.leftLogo = this.logo;
    }
    // this.$forceUpdate(); // 强制触发视图更新
    console.log(this.leftLogo);
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 140px;
    height: 50px;
    line-height: 50px;
    text-align: left;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #e4e7ed;
    box-sizing: border-box;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 12px;

    & .sidebar-logo {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #303133;
      font-weight: 600;
      line-height: 50px;
      font-size: 12px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
