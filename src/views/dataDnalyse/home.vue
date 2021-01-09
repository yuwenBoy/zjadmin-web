<template>
  <div
    class="page-container"
    v-loading="loading"
    element-loading-background="rgba(0,0,0,.25)"
  >
    <div
      class="dataview-container"
      id="datapage"
    >
      <header class="base-header short">
        <img
          src="../../assets/images/device.png"
          class="base-header__logo"
          style
        />
        <span class="base-header__title u-ellipses">长征云</span>
      </header>
      <nav
        :class="[isMenuShow?'base-nav show':'base-nav']"
        @mouseover="mouseOver"
        @mouseleave="mouseLeave"
      >
        <ul class="base-nav__container">
          <el-tooltip
            effect="dark"
            :content="item.title"
            placement="left"
            v-for="(item,index) in menuRightList"
            :key="index"
          >
            <li class="base-nav__item">
              <a
                href="javascript:void(0)"
                :class="[index===isActive?'base-nav__link router-link-active':'base-nav__link']"
                @click="doMenu(index,item.url)"
              >
                <i
                  class="iconfont"
                  :class="item.icon"
                ></i>
                <span>{{item.title}}</span>
              </a>
            </li>
          </el-tooltip>
        </ul>
      </nav>
      <div class="mainContent">
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <keep-alive>
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import RSS from "./style/screenSize.js";
export default {
  data() {
    return {
      loading: true,
      isMenuShow: false,
      isActive: 0,
      menuRightList: [
        {
          title: "平台首页",
          icon: "el-icon-map-location",
          url: "/dataDnalyse/homeChilder",
        },
        {
          title: "数据分析",
          icon: "el-icon-s-data",
          url: "/dataDnalyse/datafx",
        },
        {
          title: "设备总览",
          icon: "el-icon-share",
          url: "/dataDnalyse/device",
        },
      ],
    };
  },
  created() {
    RSS();
  },
  mounted() {
    this.initLoading();
    //RSS(1920, 969);
    this.doMenu(0, "/dataDnalyse/homeChilder");
  },
  methods: {
    initLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    doMenu(index, url) {
      this.isActive = index;
      this.$router.push(url);
    },
    mouseOver() {
      this.isMenuShow = true;
    },
    mouseLeave() {
      setTimeout(() => {
        this.isMenuShow = false;
      }, 3000);
    },
  },
};
</script>
<style>
@import "./style/datadnalyse.css";
</style>