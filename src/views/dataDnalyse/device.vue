<template>
  <div class="layout-aside czy-zone">
    <div class="layout-aside__main">
      <div class="section-title u-block-title-bar">
        <div class="block-title">设备使用率</div>
        <div class="block-item tab-link" v-show="activeIndex=='deviceList'">
          <a href="javascript:void(0);" class="nav-item router-link-active">设备使用中心</a>
        </div>
        <div class="u-line-spacer"></div>
        <div class="base-time-range">
          <el-radio-group v-model="type" size="medium" fill="#0bd6cf" @change="typeChange">
            <el-radio-button label="0">日</el-radio-button>
            <el-radio-button label="4">周</el-radio-button>
            <el-radio-button label="1">月</el-radio-button>
            <el-radio-button label="3">季</el-radio-button>
            <el-radio-button label="2">年</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-if="type==='0'"
            type="date"
            align="right"
            v-model="createTime"
            :clearable="false"
            @change="dateChange"
            value-format="yyyy-MM-dd"
            popper-class="el-popper"
            placeholder="选择日期"
          ></el-date-picker>
          <el-date-picker
            v-if="type==='1'"
            type="month"
            align="right"
            v-model="createMonth"
            :clearable="false"
            @change="dateChange"
            value-format="yyyy-MM"
            popper-class="el-popper"
            placeholder="选择日期"
          ></el-date-picker>
          <el-date-picker
            v-if="type==='2'"
            type="year"
            align="right"
            v-model="createYear"
            :clearable="false"
            value-format="yyyy"
            @change="dateChange"
            popper-class="el-popper"
            placeholder="选择日期"
          ></el-date-picker>
          <el-date-picker
            v-if="type==='4'"
            v-model="inputWeek"
            align="right"
            popper-class="el-popper"
            :clearable="false"
            type="week"
            @change="dateChange"
            format="yyyy第WW周"
            placeholder="选择周"
          ></el-date-picker>
          <DateSeason v-if="type==='3'" @showValue="showValue" />
        </div>
        <div class="zone-name block-item iconfont" :class="activeIcon">{{activeName}}</div>
        <button
          type="button"
          class="el-button toggle-side-button el-button--default"
          :class="[isRight?' el-icon-arrow-right':'el-icon-arrow-left']"
          @click="toggleRight"
        ></button>
      </div>
      <div class="device-list el-scrollbar" style="height:100%">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view
              v-if="isRouterAlice"
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-background="rgba(0,0,0,.25)"
            />
          </keep-alive>
        </transition>
      </div>
    </div>
    <!-- 设备分类菜单 -->
    <div class="layout-aside__aside layout-aside__aside--right" v-if="isRight">
      <div class="section-title u-block-title-bar">
        <div class="block-title">设备区域</div>
        <div class="u-line-spacer"></div>
      </div>
      <div class="zone-list el-scrollbar">
        <div class="el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
          <div class="el-scrollbar__view scroll-view scroll-view--zone">
            <div
              :class="[activeIndex==key.value?'zone-list__item active':'zone-list__item']"
              v-for="(key,value) in deviceTypes"
              :key="value"
            >
              <i class="zone-list__item-icon iconfont" :class="key.icon"></i>
              <div class="zone-list__item-name" @click="tabRight(key)">
                {{key.title}}
                <span class="zone-list__count" v-if="key.num>0">{{key.num}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="el-scrollbar__bar is-horizontal">
          <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
        </div>
        <div class="el-scrollbar__bar is-vertical">
          <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
        </div>
      </div>
    </div>
    <!-- 设备分类菜单 -->
  </div>
</template>
<script>
import EConst from "@/api/datafx/dataConst.js"
import {
  formatDate,
  formatWeek,
  formatMonth,
  formatQuarter
} from "@/api/encode/ConstUtils";
import DateSeason from "@/components/DateSeason/index.vue";
export default {
  name: "device",
  provide() {
    return {
      reload: this.reload
    };
  },
  components: { DateSeason },
  data() {
    return {
      fullscreenLoading: false,
      isRouterAlice: true,
      isRight: true,
      inputWeek:new Date(),
      createTime: "",
      createMonth: "",
      createYear: "",
      timeParameter: "",
      activeIndex: "deviceList",
      activeName: "全部设备",
      activeIcon: "el-icon-s-home",
      type: "0",
      deviceTypes: EConst.EchartsBussBy.deviceUseTitle()
    };
  },
  activated() { // 配合keeplive使用
    const defaultUrl = "/dataDnalyse/device/deviceList";
    this.query(defaultUrl, this.type);
  },
  methods: {
    openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    reload() {
      this.isRouterAlice = false;
      this.$nextTick(function() {
        this.isRouterAlice = true;
      });
    },
    requstDate(dateType) {
      var date = "";
      if (dateType === "4") {
        if (this.inputWeek != "") {
          date = this.inputWeek;
        } else {
          date =
            new Date().getFullYear() +
            "第" +
            formatWeek(formatDate(new Date())) +
            "周";
        }
      } else if (dateType === "3") {
        if (this.timeParameter != "") {
          date = this.timeParameter;
        } else {
          date =
            new Date().getFullYear() + formatQuarter(new Date().getMonth() + 1);
        }
      } else if (dateType === "2") {
        if (this.createYear != "") {
          date = this.createYear;
        } else {
          date = new Date().getFullYear() + "";
        }
      } else if (dateType === "1") {
        if (this.createMonth != "") {
          date = this.createMonth;
        } else {
          date = formatMonth(new Date());
        }
      } else if (dateType === "0") {
        if (this.createTime != "") {
          date = this.createTime;
        } else {
          date = formatDate(new Date());
        }
      }
      return date;
    },
    query(url, dateType) {
      this.openFullScreen1();
      this.reload();
      var createTime = this.requstDate(dateType);
      if (dateType === "0") {
        this.createTime = createTime;
      } else if (dateType === "1") {
        this.createMonth = createTime;
      } else if (dateType === "2") {
        this.createYear = createTime;
      } else if (dateType === "3") {
        this.timeParameter = createTime;
      } else if (dateType === "4") {
        this.inputWeek = createTime;
      }
      this.$router.push({
        path: url,
        query: {
          type: dateType,
          timeParameter: createTime
        }
      });
    },
    toggleRight() {
      if (this.isRight) {
        this.isRight = false;
      } else {
        this.isRight = true;
      }
    },
    tabRight(key) {
      this.activeName = key.title;
      this.activeIcon = key.icon;
      this.activeIndex = key.value;
      this.query(key.value, this.type);
    },
    dateChange() {
      this.query(this.$route.path, this.type);
    },
    showValue(val) {
      this.timeParameter = val;
      this.query(this.$route.path, this.type);
    },
    typeChange(val){
      this.query(this.$route.path,val)
    },
  }
};
</script>
<style>
.layout-aside {
  padding: 220px 0 50px;
}
.data-line-bar.empty canvas {
  opacity: 0;
}
.data-line-bar.empty canvas {
  opacity: 0;
}

.layout-aside {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  pointer-events: auto;
}
.layout-aside__main {
  /* background-color: rgba(2, 45, 73, 0.5); */
  margin: 0 50px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-ordinal-group: 3;
  -ms-flex-order: 2;
  order: 2;
}
.layout-aside .layout-aside__aside {
  width: 16.5%;
  min-width: 240px;
  max-width: 400px;
  margin-left: -15px;
  background: rgba(2, 45, 73, 0.5);
}
.layout-aside__aside {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-ordinal-group: 2;
  -ms-flex-order: 1;
  order: 1;
  -webkit-transition: opacity 0.25s, display 0s 0.25s, -webkit-transform 0.25s;
  transition: opacity 0.25s, display 0s 0.25s, -webkit-transform 0.25s;
  transition: transform 0.25s, opacity 0.25s, display 0s 0.25s;
  transition: transform 0.25s, opacity 0.25s, display 0s 0.25s,
    -webkit-transform 0.25s;
}
.layout-aside__aside.v-enter,
.layout-aside__aside.v-leave-to {
  opacity: 0;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
.layout-aside__aside--right {
  -webkit-box-ordinal-group: 4;
  -ms-flex-order: 3;
  order: 3;
}
.layout-aside__aside--right.v-enter,
.layout-aside__aside--right.v-leave-to {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.czy-log__table td,
.czy-log__table th.is-leaf {
  border-bottom-color: #1781b3;
  border-bottom: dashed 1px #1781b3;
}
.dataview-analysis .u-block-title-bar.fix.data-analysis_bar {
  top: 110px;
}
.czy-analysis {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.czy-analysis .param-title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.czy-analysis .stat-box .el-scrollbar__view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  min-height: 100%;
}
.czy-analysis .param-wrap {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}
.czy-analysis.czy-analysis_qua {
  top: 230px;
}
.czy-analysis.czy-analysis_qua .el-table__footer-wrapper tbody td,
.czy-analysis.czy-analysis_qua .el-table__header-wrapper tbody td {
  background-color: #022034;
  color: #fff;
}

.router-link-active {
  background-color: transparent;
}

.czy-zone .u-block-title-bar {
  position: static;
  margin: -62px 0 20px;
}
.czy-zone .u-block-title-bar .block-title.inactive {
  color: rgba(255, 255, 255, 0.3);
}
.czy-zone .u-block-title-bar .block-title.inactive:hover {
  color: #0bd6cf;
}
.czy-zone .u-block-title-bar .block-item.area-map-link {
  margin-right: 10px;
}
.czy-zone .u-block-title-bar .block-item.area-map-link:hover {
  color: #0bd6cf;
}
.czy-zone .u-block-title-bar .block-item.extra-button {
  padding: 0 18px 0 16px;
  margin: 0 8px 0 0;
  color: rgba(255, 255, 255, 0.3);
}
.czy-zone .u-block-title-bar .block-item.extra-button:hover {
  color: #0bd6cf;
}
.czy-zone .u-block-title-bar .block-item.extra-button.active {
  color: #fff;
}
.czy-zone .dev-filter {
  margin-left: 5px;
}
.czy-zone .dev-filter .el-input {
  width: 360px;
  max-width: 360px;
  -webkit-transition: max-width 0.3s, background-color 0.4s;
  transition: max-width 0.3s, background-color 0.4s;
}
.czy-zone .dev-filter .el-input::before {
  position: absolute;
  top: 0;
  width: 50px;
  font-family: element-icons, sans-serif;
  font-size: 20px;
  text-align: center;
  pointer-events: none;
  content: "";
  opacity: 0;
}
.czy-zone .dev-filter:not(.has-value) .el-input:not(.is-focus) {
  max-width: 50px;
  vertical-align: middle;
  background: transparent;
}
.czy-zone
  .dev-filter:not(.has-value)
  .el-input:not(.is-focus)
  .el-input__inner {
  opacity: 0;
}
.czy-zone
  .dev-filter:not(.has-value)
  .el-input:not(.is-focus)
  .el-input__suffix {
  display: none;
}
.czy-zone .dev-filter:not(.has-value) .el-input:not(.is-focus)::before {
  opacity: 0.4;
}
.czy-zone .zone-list {
  padding: 40px 0 20px;
  color: #fff;
}
.czy-zone .zone-list .zone-list__item {
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  padding: 12px 16px 12px 20px;
  font-size: 18px;
  line-height: 28px;
  cursor: pointer;
}
.czy-zone .zone-list .zone-list__item:hover {
  color: #fff;
  background: rgba(2, 45, 73, 0.5);
}
.czy-zone .zone-list .zone-list__item.active {
  color: #fff;
  background: rgba(0, 213, 209, 0.2);
}
.czy-zone .zone-list .zone-list__item-icon {
  margin-right: 8px;
  opacity: 0.4;
}
.czy-zone .zone-list .zone-list__item-name {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  margin-right: 10px;
}
.czy-zone .zone-list .zone-list__count {
  display: inline-block;
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.6);
}
.czy-zone .zone-list .zone-list__count::before,
.czy-zone .zone-list .zone-list__count::after {
  padding: 2px;
  content: "(";
}
.czy-zone .zone-list .zone-list__count::after {
  content: ")";
}
.czy-zone .zone-list .u-fault-count {
  margin: 2px 0 0 6px;
}
.czy-zone .devtype-box {
  position: relative;
  padding: 16px 10px 12px;
  background: rgba(2, 45, 73, 0.5);
}
.czy-zone .devtype-box:not(:first-of-type) {
  margin-top: 40px;
}
.czy-zone .devtype-box:not(:first-of-type)::after {
  position: absolute;
  top: -20px;
  right: 10px;
  left: 10px;
  height: 1px;
  content: "";
  background: rgba(255, 255, 255, 0.2);
}
.czy-zone .devtype__title {
  padding: 10px 10px 16px;
}
.czy-zone .devtype__name {
  margin-right: 20px;
  font-size: 22px;
  font-weight: bold;
}
.czy-zone .scroll-view:empty {
  height: 100%;
  text-align: center;
}

.el-button {
  color: #fff;
  background: rgba(0, 217, 255, 0.15);
  border: 0;
  border-radius: 0;
}
.el-button.el-button--text {
  background: 0 !important;
}
.el-button:hover,
.el-button:focus {
  color: #fff;
  background-color: rgba(0, 217, 255, 0.8);
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background: rgba(77, 185, 204, 0.1);
}
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: #fff;
  background: rgba(0, 217, 255, 0.15);
}
.el-button.is-disabled.is-plain,
.el-button.is-disabled.is-plain:focus,
.el-button.is-disabled.is-plain:hover {
  color: rgba(255, 255, 255, 0.3);
  background: none;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.czy-history-panel .czy-history-cascader .el-scrollbar__wrap {
  min-width: 220px;
}

.czy-zone .devtype__title,
.czy-zone .zone-list__item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.base-time-range {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  pointer-events: auto;
}
.el-radio-button,
.el-radio-button__inner {
  display: inline-block;
  position: relative;
  outline: 0;
}

.el-radio-button__inner {
  line-height: 18px !important;
  color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(0, 217, 255, 0.15) !important;
  border: 0 !important;
  border-radius: 0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.el-radio-button__inner:hover {
  color: #0bd6cf;
}

.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 1px 0 0 1px;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 1px 1px 0;
}
.el-radio-button.is-active .el-radio-button__inner {
  color: rgba(2, 2, 27, 0.6);
  background: #0bd6cf;
}
label.el-radio-button.is-active {
  color: rgba(2, 2, 27, 0.6);
  background: #0bd6cf;
}

.el-picker-panel {
  color: #fff;
}

.el-picker-panel__footer {
  background: none;
  border-top-color: rgba(0, 217, 255, 0.15);
}

.el-picker-panel__sidebar {
  background: rgba(1, 47, 64, 0.9);
  border-right-color: #02021b;
}

.el-date-range-picker__time-header {
  border-color: rgba(0, 217, 255, 0.15);
}

.el-date-range-picker__content.is-left {
  border-right-color: #02021b;
}

.el-picker-panel__shortcut {
  color: #fff;
}
.el-picker-panel__shortcut:hover {
  color: #0bd6cf;
}

.el-picker-panel__icon-btn {
  font-size: 16px;
  color: #fff;
}
.el-picker-panel__icon-btn:hover {
  color: #0bd6cf;
}
.el-picker-panel__icon-btn.is-disabled {
  color: rgba(255, 255, 255, 0.3);
}

.el-picker-panel__icon-btn .el-picker-panel__content td .cell {
  color: #fff;
}
.el-picker-panel__icon-btn .el-picker-panel__content td .cell:hover,
.el-picker-panel__icon-btn .el-picker-panel__content td.today .cell,
.el-picker-panel__icon-btn
  .el-picker-panel__content
  td.current:not(.disabled)
  .cell {
  color: #0bd6cf;
}

.el-date-picker__header-label,
.el-date-picker__header-label.active,
.el-date-picker__header-label:hover {
  color: #fff;
}
.u-block-title-bar .el-input,
.u-block-title-bar .el-input__inner,
.u-block-title-bar .el-button:not(.block-item) {
  height: 38px;
  font-size: 17px;
}
.el-date-editor.el-input {
  width: 180px;
}
.el-input,
.el-range-editor {
  background: rgba(0, 217, 255, 0.15);
  background-clip: content-box;
  border: 0;
}

.el-date-editor .el-input__inner {
  text-align: center;
}
.el-input--prefix .el-input__inner {
  padding-left: 30px;
}
.el-input--suffix .el-input__inner {
  padding-right: 30px;
}

.el-input__inner,
.el-range-editor .el-range-input {
  font-size: 17px;
  color: #fff;
  background: none;
  border: 0;
  border-radius: 0;
}
.el-input__inner::-webkit-input-placeholder,
.el-range-editor .el-range-input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.el-input__inner::-moz-placeholder,
.el-range-editor .el-range-input::-moz-placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.el-input__inner:-ms-input-placeholder,
.el-range-editor .el-range-input:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.el-input__inner::-ms-input-placeholder,
.el-range-editor .el-range-input::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.el-input__inner::placeholder,
.el-range-editor .el-range-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.el-radio-group .el-range-editor {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background: rgba(0, 217, 255, 0.15);
}

.el-input.is-disabled .el-input__inner {
  background: 0;
  border: 0;
}

.el-button {
  color: #fff;
  background: rgba(0, 217, 255, 0.15);
  border: 0;
  border-radius: 0;
}

.el-popper {
  margin-top: 3px !important;
  background: rgba(1, 47, 64, 0.9);
  border: 0;
  border-radius: 0;
}
.el-popper .popper__arrow {
  display: none;
}
.el-popper .el-select-dropdown__item {
  height: 38px;
  font-size: 18px;
  line-height: 38px;
  color: rgba(255, 255, 255, 0.7);
}
.el-popper .el-select-dropdown__item.selected {
  font-weight: bold;
  color: #00d5d1;
  background: rgba(0, 213, 209, 0.1);
}
.el-popper .el-select-dropdown__item.hover {
  color: #fff;
  background: rgba(0, 213, 209, 0.2);
}
.el-popper .el-cascader-panel {
  max-height: 400px;
}
.el-popper .el-cascader-menu {
  border-right-color: #02021b;
}
.el-popper .el-cascader-node {
  height: 40px;
  font-size: 18px;
  color: #fff;
}
.el-popper .el-cascader-node:focus,
.el-popper .el-cascader-node:hover {
  color: #fff;
  background: rgba(0, 213, 209, 0.2);
}
.el-popper .el-cascader-node.in-active-path,
.el-popper .el-cascader-node.is-active {
  font-weight: bold;
  color: #00d5d1;
  background: rgba(255, 255, 255, 0.1);
}
.el-popper .el-cascader__suggestion-list {
  font-size: 18px;
  color: #fff;
}
.el-popper .el-cascader__suggestion-item {
  height: 40px;
}
.el-popper .el-cascader__suggestion-item:focus,
.el-popper .el-cascader__suggestion-item:hover {
  background: rgba(0, 213, 209, 0.2);
}
</style>