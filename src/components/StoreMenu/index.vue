<template>
  <div>
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ storeInfo.storeName }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in storeList" :key="index"> {{ item.storeName }} </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-popover width="316" trigger="click" placement="bottom" :visible-arrow="false" v-model="isPopoverVisible" @show="handlePopoverOpen">
      <div class="storeMenuItem">
        <div class="store-name">
          {{ shopInfoVO.shopName }}
          <span :style="{color:showMainStatus.statusRemarkColor,backgroundColor:showMainStatus.statusBgColor,fontSize:'12px'}">{{ showMainStatus.statusRemark}}</span>
        </div>
        <div class="store-down-online-desc">
          <div class="flex">
            <div class="tipsLeft">
              <img src="@/assets/icons/warning.png" />
              <span v-html="shopStatusClickDetail.statusDetailContent"></span>
            </div>
          </div>
        </div>
        <div class="flex now-store-status">
           <span class="text-no-job" v-if="shopStatusClickDetail.businessTimeWeeks && shopStatusClickDetail.businessTimeWeeks.includes(new Date().getDay())">
                今日营业时间
              <div style="color: #999; font-size: 12px" v-html="shopStatusClickDetail.flexibleServingTimeStrList.toString()"></div>
           </span>
           <span class="text-no-job" v-else>
               今日不营业
           </span>
          <span class="edit" @click="$router.push({name:'info',query:{name:'second'} })">修改</span>
        </div>
        <div class="divider"></div>
        <div class="flex order-settiing">
          <div class="item-content">
            <div>{{ preOrderInfo.preOrderTitle || '预订单设置' }}</div>
            <div style="color: #999; font-size: 12px">
              {{ preOrderInfo.preOrderContent || '提前0-1天预订，支持休息时预订'}}
            </div>
          </div>
          <span class="edit" @click="$router.push({path:'info'})">修改</span>
        </div>
      </div>
      <div slot="reference" class="store-status">
        <div class="span-line off-line"></div> 门店已下线
         <i style="color: #999" :class="isPopoverVisible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
      </div>
    </el-popover>
    <el-divider direction="vertical"></el-divider>
    <i class="el-icon-bell right-icon"></i>
    <i class="el-icon-question right-icon"></i>
  </div>
</template>
  
<script>
import { queryShopStatusViewDetail } from "@/api/business/store"; // 引入接口方法
export default {
  data() {
    return {
      storeList: [],
      storeInfo: {},
      isPopoverVisible: false,
      shopStatusViewDetail:{},
      preOrderInfo:{}, // 预订单设置
      shopInfoVO:{}, // 门店信息
      shopStatusClickDetail:{}, // 门店下线原因详情
      showMainStatus:{}, // 门店状态
    };
  },
  watch: {
    $route(route) {},
  },
  created() {
    this.storeList = this.$store.state.user.user.business.store;
    this.storeInfo = this.$store.state.user.user.business.store.find(
      (t) => t.isDefault == 1
    );
  },
  mounted() {},
  methods: {
    async handlePopoverOpen() {
      const  res = await queryShopStatusViewDetail()
      this.shopStatusViewDetail = res.result
      this.preOrderInfo = this.shopStatusViewDetail.shopStatusView["preOrderInfo"]
      this.showMainStatus = this.shopStatusViewDetail.shopStatusView.showMainStatus
      this.shopInfoVO = this.shopStatusViewDetail.shopInfoVO
      this.shopStatusClickDetail = this.shopStatusViewDetail.shopStatusClickDetail
    },
  },
};
</script>
  
  <style lang="scss">
.business-store-container {
  display: inline-block;
  cursor: pointer;
  vertical-align: text-bottom;
  color: #333333;
  font-size: 14px;
  .el-dropdown {
    padding-right: 10px;
    .el-dropdown-link {
      color: #333333;
    }
  }
  .store-status {
    display: inline-block;
    .span-line {
      width: 4px;
      height: 4px;
      display: inline-block;
      border-radius: 50%;
      padding-bottom: 3px;
      padding-right: 4px;
      vertical-align: middle;
    }
    .on-line {
      background: #30b08f;
    }
    .off-line {
      background: #ff4949;
    }
  }
  .right-icon {
    vertical-align: middle;
    font-size: 18px;
    padding-right: 20px;
  }
}

.storeMenuItem {
  padding: 10px;
  .store-name {
    font-size: 14px;
    padding-right: 10px;
  }
  .store-down-online-desc {
    background-color: rgb(253, 246, 234);
    margin-top: 12px;
    border-radius: 8px;
    font-size: 12px;
    padding: 6px 8px;
    .tipsLeft {
      img {
        width: 12px;
        height: 12px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    font {
      color: rgb(255, 145, 0);
      font-size: 12px;
    }
  }
  .now-store-status {
    margin-top: 15px;
    font-size: 14px;
    color: #333;
    .edit {
      color: #1a71ff;
      font-weight: 400;
      cursor: pointer;
    }
  }
  .divider {
    height: 1px;
    width: 100%;
    vertical-align: middle;
    background-color: #dcdfe6;
    margin: 12px 0;
  }
  .order-settiing {
    font-size: 14px;
    color: #333;
    .item-content {
      flex-flow: column;
    }
    .edit {
      color: #1a71ff;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
  