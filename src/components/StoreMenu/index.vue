 <template>
  <div class="business-store-container">
    <!-- 门店下拉选择 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ storeInfo.storeName }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in storeList" :key="index"> 
          {{ item.storeName }} 
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 门店状态popover -->
    <el-popover 
      width="316" 
      trigger="click" 
      placement="bottom" 
      :visible-arrow="false" 
      v-model="isPopoverVisible" 
      @show="handlePopoverOpen"
    >
      <div class="storeMenuItem">
        <!-- 门店名称+状态标签 -->
        <div class="store-name">
          {{ shopInfoVO.shopName }}
          <span 
            :style="{
              color: showMainStatus.statusRemarkColor || '#fff',
              backgroundColor: showMainStatus.statusBgColor || '#999',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '2px',
              marginLeft: '8px'
            }"
          >
            {{ showMainStatus.statusRemark || '未知状态' }}
          </span>
        </div>

        <!-- 状态提示区 -->
        <div class="store-down-online-desc">
          <div class="flex">
            <div class="tipsLeft">
              <img src= />
              <span v-html="shopStatusClickDetail.statusDetailContent"></span>
            </div>
          </div>
        </div>

        <!-- 今日营业状态（使用计算属性isTodayOpen） -->
        <div class="flex now-store-status">
           <span class="text-no-job" v-if="isTodayOpen">
                今日营业时间
              <div style="color: #999; font-size: 12px" v-html="shopStatusClickDetail.flexibleServingTimeStrList.toString()"></div>
           </span>
           <span class="text-no-job" v-else>
               今日不营业
           </span>
          <span class="edit" @click="$router.push({name:'info',query:{name:'second'} })">修改</span>
        </div>

        <!-- 分割线 -->
        <div class="divider"></div>

        <!-- 预订单设置 -->
        <div class="flex order-settiing">
          <div class="item-content">
            <div>{{ preOrderInfo.preOrderTitle || '预订单设置' }}</div>
            <div style="color: #999; font-size: 12px">
              {{ preOrderInfo.preOrderContent || '提前0-1天预订，支持休息时预订'}}
            </div>
          </div>
          <span class="edit" @click="$router.push({path:'info'})">修改</span>
        </div>

        <!-- 操作按钮区 -->
        <div v-if="shopStatusClickDetail.operationDetailsForApp && shopStatusClickDetail.operationDetailsForApp.length" class="divider"></div>
        <div class="operation-buttons" v-if="shopStatusClickDetail.operationDetailsForApp && shopStatusClickDetail.operationDetailsForApp.length">
          <el-button 
            v-for="(btn, index) in shopStatusClickDetail.operationDetailsForApp" 
            :key="index"
            :type="btn.code === 1 ? 'primary' : (btn.code === 3 || btn.code === 4 ? 'danger' : 'default')"
            :disabled="btn.setAsh"
            size="small"
            class="operation-btn"
            @click="handleOperation(btn)"
          >
            {{ btn.operationTitle }}
          </el-button>
        </div>
      </div>

      <!-- 状态参考区（动态适配所有状态） -->
      <div slot="reference" class="store-status" style="cursor: pointer;">
        <div class="span-line" :class="getStatusClass()"></div>
        {{ showMainStatus.statusRemark || '门店已下线' }}
        <i 
          style="color: #999; margin-left: 4px;" 
          :class="isPopoverVisible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
        ></i>
      </div>
    </el-popover>

    <el-divider direction="vertical"></el-divider>
    <i class="el-icon-bell right-icon"></i>
    <i class="el-icon-question right-icon"></i>
  </div>
</template>
  
<script>
import { queryShopStatusViewDetail } from "@/api/business/store"; 

// 门店状态枚举（与后端对齐）
const StoreStatusEnum = {
  OFFLINE: 0,        // 已下线
  PENDING_AUDIT: 1,  // 审核中
  AUDIT_APPROVED: 2, // 审核通过
  ONLINE: 3,         // 营业中
  PAUSE: 4,          // 暂停营业
  FORBIDDEN: 5,      // 永久封禁
  AUDIT_REJECTED: 6  // 审核驳回
};

export default {
  name: 'StoreStatus',
  data() {
    return {
      storeList: [],
      storeInfo: {},
      isPopoverVisible: false,
      shopStatusViewDetail: {},
      preOrderInfo: {}, 
      shopInfoVO: {}, 
      shopStatusClickDetail: {}, 
      showMainStatus: {},
      StoreStatusEnum,
    };
  },
  watch: {
    $route(route) {},
  },
  created() {
    // 获取门店列表
    this.storeList = this.$store.state.user.user.business.store || [];
    this.storeInfo = this.storeList.find((t) => t.isDefault == 1) || {};
  },
  mounted() {},
  computed: {
    // ✅ 仅保留computed中的isTodayOpen计算属性
    isTodayOpen() {
      if (!this.shopStatusClickDetail.businessTimeWeeks || !this.shopStatusClickDetail.businessTimeWeeks.length) {
        return false;
      }
      // 后端返回的weeks是1-7（0转7），前端getDay()是0-6
      const today = new Date().getDay();
      const todayAdapt = today === 0 ? 7 : today;
      return this.shopStatusClickDetail.businessTimeWeeks.includes(todayAdapt);
    }
  },
  methods: {
    /**
     * 打开popover加载数据
     */
    async handlePopoverOpen() {
      try {
        // 传递门店ID给接口
        const params = { storeId: this.storeInfo.id };
        const res = await queryShopStatusViewDetail(params);
        
        this.shopStatusViewDetail = res.result || {};
        this.preOrderInfo = this.shopStatusViewDetail.shopStatusView["preOrderInfo"] || {};
        this.showMainStatus = this.shopStatusViewDetail.shopStatusView.showMainStatus || {};
        this.shopInfoVO = this.shopStatusViewDetail.shopInfoVO || {};
        this.shopStatusClickDetail = this.shopStatusViewDetail.shopStatusClickDetail || {};
        
      } catch (error) {
        this.$message.error('加载门店状态失败：' + error.message);
        console.error('加载失败：', error);
      }
    },

    /**
     * 根据状态获取圆点样式类
     */
    getStatusClass() {
      const statusRemark = this.showMainStatus.statusRemark || '';
      switch (true) {
        case /营业中/.test(statusRemark):
          return 'on-line'; // 绿色
        case /审核中/.test(statusRemark):
        case /休息中/.test(statusRemark):
        case /暂停营业/.test(statusRemark):
        case /审核通过/.test(statusRemark):
          return 'pending-line'; // 黄色
        case /已下线/.test(statusRemark):
        case /被平台暂停/.test(statusRemark):
        case /审核驳回/.test(statusRemark):
        case /永久封禁/.test(statusRemark):
          return 'off-line'; // 红色
        default:
          return 'off-line';
      }
    },

    /**
     * 处理操作按钮点击
     */
    async handleOperation(btn) {
      const { code, operationTitle, operationRemark } = btn;
      
      // 确认弹窗
      const confirmText = `${operationRemark ? operationRemark + '，' : ''}确定要${operationTitle}吗？`;
      try {
        await this.$confirm(confirmText, '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: code === 3 || code === 4 ? 'warning' : 'info'
        });

        // 模拟接口调用（替换为真实接口）
        // 根据按钮code区分操作类型
        let apiRes;
        switch (code) {
          case 1: // 立即上线/恢复营业
            // apiRes = await onlineShop({ storeId: this.storeInfo.id });
            this.$message.success(operationTitle + '成功');
            break;
          case 2: // 5分钟后关店
            // apiRes = await closeShopDelay({ storeId: this.storeInfo.id, delay: 5 });
            this.$message.success('已设置5分钟后关店');
            break;
          case 3: // 立即关店
            // apiRes = await closeShopImmediate({ storeId: this.storeInfo.id });
            this.$message.success('门店已立即关店');
            break;
          case 4: // 门店下线
            // apiRes = await offlineShop({ storeId: this.storeInfo.id });
            this.$message.success('门店已下线');
            break;
          default:
            this.$message.info('暂未实现该操作');
            return;
        }

        // 重新加载状态
        await this.handlePopoverOpen();
        
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(operationTitle + '失败：' + (error.message || '操作异常'));
        } else {
          this.$message.info('已取消' + operationTitle);
        }
      }
    }
  },
};
</script>
  
<style lang="scss" scoped>
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
      cursor: pointer;
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
    // 状态圆点样式
    .on-line {
      background: #30b08f; // 营业中-绿色
    }
    .off-line {
      background: #ff4949; // 已下线/封禁-红色
    }
    .pending-line {
      background: #ff9100; // 审核中/暂停/审核通过-黄色
    }
  }

  .right-icon {
    vertical-align: middle;
    font-size: 18px;
    padding-right: 20px;
    cursor: pointer;
  }
}

.storeMenuItem {
  padding: 10px;
  
  .store-name {
    font-size: 14px;
    padding-right: 10px;
    font-weight: 500;
    display: flex;
    align-items: center;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .item-content {
      flex-flow: column;
    }
    
    .edit {
      color: #1a71ff;
      font-weight: 400;
      cursor: pointer;
    }
  }

  // 操作按钮组
  .operation-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    
    .operation-btn {
      width: 100%;
      height: 32px;
      font-size: 14px;
    }
  }
}
</style>