<template>
  <div class="order-push-container">
    <!-- 订单推送弹窗 -->
    <transition-group name="order-push" tag="div">
      <div
        v-for="order in orderList"
        :key="order.orderId"
        class="order-push-card"
        :class="{ 'is-closing': order.isClosing }"
      >
        <!-- 头部 -->
        <div class="push-header">
          <div class="header-left">
            <i class="el-icon-bell bell-icon"></i>
            <span class="header-title">新订单提醒</span>
          </div>
          <div class="header-right">
            <div class="countdown-text" :class="{ 'urgent': order.countdownPercent < 30 }">
              <i class="el-icon-time"></i>
              <span class="countdown-label">剩余</span>
              <span class="countdown-value">{{ formatCountdown(order) }}</span>
            </div>
            <i class="el-icon-close close-btn" @click="closeOrder(order)"></i>
          </div>
        </div>

        <!-- 订单内容 - 添加点击跳转 -->
        <div class="push-content" @click="goToOrderDetail(order)">
          <!-- 订单编号 -->
          <div class="order-no-row">
            <i class="el-icon-document"></i>
            <span class="label">订单号:</span>
            <span class="value order-no">{{ order.orderNo || order.orderId }}</span>
          </div>
          <div class="customer-info">
            <div class="info-item">
              <i class="el-icon-user"></i>
              <span class="label">顾客:</span>
              <span class="value">{{ order.addressName }}</span>
            </div>
            <div class="info-item">
              <i class="el-icon-phone"></i>
              <span class="label">电话:</span>
              <span class="value">{{ order.addressPhone }}</span>
            </div>
            <div class="info-item address">
              <i class="el-icon-location"></i>
              <span class="label">地址:</span>
              <span class="value" :title="order.addressDetail">{{ order.addressDetail }}</span>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="goods-list">
            <div class="goods-title">商品明细:</div>
            <div class="goods-items">
              <div
                v-for="(item, index) in (order.items || []).slice(0, 3)"
                :key="index"
                class="goods-item"
              >
                <span class="goods-name">{{ item.goodsName }}</span>
                <span class="goods-spec" v-if="item.specName">({{ item.specName }})</span>
                <span class="goods-quantity">x{{ item.quantity }}</span>
              </div>
              <div v-if="(order.items || []).length > 3" class="goods-more">
                等 {{ order.items.length }} 件商品
              </div>
            </div>
          </div>

          <!-- 订单金额 -->
          <div class="order-amount">
            <span class="amount-label">实付金额:</span>
            <span class="amount-value">¥{{ order.finalTotal }}</span>
          </div>

          <!-- 备注 -->
          <div class="order-remark" v-if="order.remark">
            <i class="el-icon-info"></i>
            <span>备注: {{ order.remark }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="push-actions">
          <el-button
            type="danger"
            size="small"
            plain
            @click="handleReject(order)"
            :loading="order.rejectLoading"
          >
            <i class="el-icon-close"></i> 拒单
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleAccept(order)"
            :loading="order.acceptLoading"
          >
            <i class="el-icon-check"></i> 接单
          </el-button>
        </div>

        <!-- 倒计时条 -->
        <div class="countdown-bar" v-if="order.autoClose">
          <div
            class="countdown-progress"
            :class="{ 'urgent': order.countdownPercent < 30 }"
            :style="{ width: order.countdownPercent + '%' }"
          ></div>
        </div>
      </div>
    </transition-group>

    <!-- 拒单原因弹窗 -->
    <el-dialog
      title="拒绝接单"
      :visible.sync="rejectDialogVisible"
      width="400px"
      append-to-body
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="取消原因" required>
          <el-input
            type="textarea"
            v-model="rejectForm.cancelReason"
            placeholder="请输入取消原因"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject" :loading="rejectLoading">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { acceptOrder, rejectOrder } from "@/api/business/order";

export default {
  name: "OrderPushNotification",
  data() {
    return {
      orderList: [],
      maxOrders: 3, // 最多同时显示3个订单
      autoCloseTime: 60000, // 自动关闭时间（60秒）
      countdownInterval: null,
      
      // 拒单弹窗
      rejectDialogVisible: false,
      rejectForm: {
        orderId: null,
        cancelReason: ""
      },
      rejectLoading: false
    };
  },
  created() {
    // 监听新订单事件
    if (this.$eventBus) {
      this.$eventBus.$on("new-shop-order", this.handleNewOrder);
    } else {
    }
    // 开始倒计时
    this.startCountdown();
    
    // 挂载全局测试方法
    if (typeof window !== 'undefined') {
      window.testOrderPush = this.testOrderPush;
    }
  },
  beforeDestroy() {
    if (this.$eventBus) {
      this.$eventBus.$off("new-shop-order", this.handleNewOrder);
    }
    this.stopCountdown();
    // 清理全局测试方法
    if (typeof window !== 'undefined' && window.testOrderPush) {
      delete window.testOrderPush;
    }
  },
  methods: {
    // 数据适配：将不同格式的订单数据转换为统一格式
    adaptOrderData(data) {
      if (!data) return null;
      
      // 如果数据被包装在 order 字段中
      const rawData = data.order || data;
      
      // 尝试从 address 对象中获取信息（有些接口返回 address 嵌套对象）
      const addressObj = rawData.address || rawData.userAddress || rawData.user_address || {};
      
      // 字段映射：支持蛇形命名和驼峰命名
      const adapted = {
        // 订单基本信息
        orderId: rawData.orderId || rawData.order_id || rawData.id,
        orderNo: rawData.orderNo || rawData.order_no || rawData.orderNumber || rawData.order_number,
        
        // 顾客信息（多种可能的字段名 + 嵌套 address 对象）
        addressName: rawData.addressName || rawData.address_name || 
                     rawData.customerName || rawData.customer_name || 
                     rawData.receiverName || rawData.receiver_name || 
                     rawData.receiver || rawData.consignee ||
                     addressObj.name || addressObj.receiverName || addressObj.receiver_name || 
                     addressObj.consignee || addressObj.contactName || '未知顾客',
        
        addressPhone: rawData.addressPhone || rawData.address_phone || 
                      rawData.customerPhone || rawData.customer_phone || 
                      rawData.receiverPhone || rawData.receiver_phone || 
                      rawData.phone || rawData.mobile || rawData.tel ||
                      addressObj.phone || addressObj.mobile || addressObj.tel || 
                      addressObj.receiverPhone || addressObj.receiver_phone || '无电话',
        
        addressDetail: rawData.addressDetail || rawData.address_detail || 
                       rawData.customerAddress || rawData.customer_address || 
                       rawData.receiverAddress || rawData.receiver_address || 
                       rawData.address || rawData.fullAddress || rawData.full_address ||
                       addressObj.detail || addressObj.fullAddress || addressObj.full_address || 
                       addressObj.address || addressObj.street || '无地址',
        
        // 金额信息
        finalTotal: rawData.finalTotal || rawData.final_total || 
                    rawData.totalAmount || rawData.total_amount || 
                    rawData.total || rawData.payAmount || rawData.pay_amount || 
                    rawData.pay_amount || rawData.actualAmount || rawData.actual_amount || 
                    rawData.orderAmount || rawData.order_amount || 0,
        
        // 商品列表
        items: this.adaptItems(rawData.items || rawData.orderItems || rawData.order_items || 
                               rawData.goodsList || rawData.goods_list || 
                               rawData.products || rawData.productList || 
                               rawData.product_list || rawData.orderGoods || []),
        
        // 备注
        remark: rawData.remark || rawData.notes || rawData.comment || 
                rawData.orderRemark || rawData.order_remark || 
                rawData.buyerRemark || rawData.buyer_remark || ''
      };
      
      return adapted;
    },
    
    // 适配商品列表
    adaptItems(items) {
      if (!Array.isArray(items)) return [];
      
      return items.map(item => ({
        goodsName: item.goodsName || item.goods_name || item.name || item.productName || 
                   item.product_name || item.title || item.goodsTitle || item.goods_title || '商品',
        specName: item.specName || item.spec_name || item.spec || item.skuName || 
                  item.sku_name || item.sku || item.specification || '',
        quantity: item.quantity || item.qty || item.num || item.count || item.amount || 1,
        unitPrice: item.unitPrice || item.unit_price || item.price || item.unit_price || 0,
        totalPrice: item.totalPrice || item.total_price || item.subtotal || item.total || 0
      }));
    },

    // 测试弹窗方法 - 模拟后端推送格式
    testOrderPush() {
      // 模拟后端 Socket 推送的数据格式
      const testOrder = {
        orderId: Date.now(),
        orderNo: "TEST" + Date.now().toString().slice(-6),
        // 模拟嵌套 address 对象格式
        address: {
          name: "张三",
          phone: "13800138000",
          detail: "北京市朝阳区测试街道123号"
        },
        finalTotal: 99.99,
        remark: "多加辣，不要葱",
        items: [
          { goodsName: "红烧肉饭", specName: "大份", quantity: 1 },
          { goodsName: "可乐", specName: "冰镇", quantity: 2 }
        ]
      };
      this.handleNewOrder(testOrder);
      return "✅ 测试订单弹窗已触发，请查看右上角";
    },

    // 处理新订单
    handleNewOrder(orderData) {
      // 数据适配：处理可能的不同字段名格式
      const adaptedData = this.adaptOrderData(orderData);
      
      // 检查订单数据有效性
      if (!adaptedData || !adaptedData.orderId) {
        console.warn("[OrderPush] 订单数据无效，原始数据:", orderData);
        return;
      }
      
      // 检查关键字段是否为空
      if (!adaptedData.addressName || adaptedData.addressName === '未知顾客') {
        console.warn("[OrderPush] ⚠️ 顾客姓名为空，请检查后端返回字段名");
      }
      if (!adaptedData.addressPhone || adaptedData.addressPhone === '无电话') {
        console.warn("[OrderPush] ⚠️ 顾客电话为空，请检查后端返回字段名");
      }
      
      // 检查是否已存在
      const exists = this.orderList.some(o => o.orderId === adaptedData.orderId);
      if (exists) {
        return;
      }

      // 格式化订单数据
      const order = {
        ...adaptedData,
        isClosing: false,
        acceptLoading: false,
        rejectLoading: false,
        createTime: Date.now(),
        autoClose: true,
        countdownPercent: 100
      };

      // 如果超过最大数量，移除最早的
      if (this.orderList.length >= this.maxOrders) {
        this.orderList.shift();
      }

      this.orderList.push(order);

      // 显示浏览器通知（如果支持）
      this.showBrowserNotification(order);
    },

    // 显示浏览器通知
    showBrowserNotification(order) {
      if (!("Notification" in window)) {
        console.warn('[OrderPush] 浏览器不支持 Notification API');
        return;
      }
      
      const title = "新订单提醒";
      const body = `订单号: ${order.orderNo || order.orderId || '未知'}\n顾客: ${order.addressName || '未知顾客'}\n金额: ¥${order.finalTotal || 0}`;
      
      // 修复图标路径：使用绝对路径确保在 Electron 中正常显示
      const getIconPath = () => {
        // 尝试多种方式获取图标路径
        const possiblePaths = [
          window.location.origin + '/favicon.ico',
          window.location.protocol + '//' + window.location.host + '/favicon.ico',
          '/favicon.ico'
        ];
        
        // 在 Electron file:// 协议下，使用绝对路径
        if (window.location.protocol === 'file:') {
          // 对于 Electron，尝试使用应用目录下的图标
          return possiblePaths[0];
        }
        return possiblePaths[1];
      };
      
      const notificationOptions = {
        body: body,
        icon: getIconPath(),
        tag: order.orderId,
        requireInteraction: true, // 保持通知直到用户交互
        silent: false // 播放提示音
      };
      
      const showNotification = () => {
        try {
          const notification = new Notification(title, notificationOptions);
          
          // 添加点击事件 - 跳转到订单详情
          notification.onclick = () => {
            // 聚焦到当前窗口
            window.focus();
            // 跳转到订单详情
            this.goToOrderDetail(order);
            // 关闭通知
            notification.close();
          };
          
        } catch (err) {
          console.error('[OrderPush] 显示浏览器通知失败:', err);
        }
      };
      
      // 检查并请求通知权限
      if (Notification.permission === "granted") {
        showNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            showNotification();
          }
        }).catch(err => {
          console.error('[OrderPush] 请求通知权限失败:', err);
        });
      } else {
        console.warn('[OrderPush] 通知权限被拒绝');
      }
    },

    // 跳转到订单详情页
    goToOrderDetail(order) {
      // 关闭当前通知卡片
      this.closeOrder(order);
      
      // 尝试获取订单处理页面的实际路由路径
      const targetPath = this.findOrderProcessingPath() || '/business/order/processing';
      
      // 使用 Vue Router 跳转到订单处理页面
      // 传递订单ID作为查询参数，目标页面可以根据此参数自动打开详情弹窗
      this.$router.push({
        path: targetPath,
        query: { 
          orderId: order.orderId,
          highlight: 'true'
        }
      });
      
      // 发送事件通知订单列表高亮显示该订单
      if (this.$eventBus) {
        this.$eventBus.$emit('highlight-order', order.orderId);
      }
    },
    
    // 查找订单处理页面的实际路径（支持动态路由配置）
    findOrderProcessingPath() {
      const routers = (this.$store && this.$store.getters && this.$store.getters.permission_routers) || [];
      
      for (const route of routers) {
        // 检查一级路由
        if (route.path && route.path.includes('business') && route.children) {
          for (const child of route.children) {
            // 匹配包含 processing 或 order 的子路由
            const childPath = child.path || '';
            const component = child.component || '';
            if (childPath.includes('processing') || 
                (typeof component === 'string' && component.includes('order/processing'))) {
              // 拼接完整路径
              const basePath = route.path.endsWith('/') ? route.path : route.path + '/';
              const fullPath = childPath.startsWith('/') ? childPath : basePath + childPath;
              return fullPath;
            }
          }
        }
        // 递归检查子路由
        if (route.children) {
          for (const child of route.children) {
            if (child.path && child.path.includes('processing')) {
              const fullPath = route.path + '/' + child.path;
              return fullPath;
            }
          }
        }
      }
      return null;
    },

    // 开始倒计时
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        const now = Date.now();
        this.orderList.forEach(order => {
          const elapsed = now - order.createTime;
          const remaining = Math.max(0, this.autoCloseTime - elapsed);
          order.countdownPercent = (remaining / this.autoCloseTime) * 100;
          
          // 自动关闭
          if (remaining <= 0 && order.autoClose) {
            this.closeOrder(order);
          }
        });
      }, 100);
    },

    // 停止倒计时
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    },

    // 格式化倒计时时间
    formatCountdown(order) {
      const elapsed = Date.now() - order.createTime;
      const remaining = Math.max(0, this.autoCloseTime - elapsed);
      const seconds = Math.ceil(remaining / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // 关闭订单卡片
    closeOrder(order) {
      order.isClosing = true;
      setTimeout(() => {
        const index = this.orderList.findIndex(o => o.orderId === order.orderId);
        if (index > -1) {
          this.orderList.splice(index, 1);
        }
      }, 300);
    },

    // 接单
    async handleAccept(order) {
      order.acceptLoading = true;
      try {
        const res = await acceptOrder({ orderId: order.orderId });
        if (res.code === 0 || res.success) {
          this.$message.success("接单成功");
          this.closeOrder(order);
          // 刷新订单列表
          if (this.$eventBus) {
            this.$eventBus.$emit("refresh-order-list");
          }  
        } else {
          this.$message.error(res.message || "接单失败");
        }
      } catch (error) {
        this.$message.error("接单失败");
      } finally {
        order.acceptLoading = false;
      }
    },

    // 拒单
    handleReject(order) {
      this.rejectForm.orderId = order.orderId;
      this.rejectForm.cancelReason = "";
      this.rejectDialogVisible = true;
      // 暂停自动关闭
      order.autoClose = false;
    },

    // 确认拒单
    async confirmReject() {
      if (!this.rejectForm.cancelReason.trim()) {
        this.$message.warning("请输入取消原因");
        return;
      }
      
      this.rejectLoading = true;
      try {
        const res = await rejectOrder({
          orderId: this.rejectForm.orderId,
          cancelReason: this.rejectForm.cancelReason
        });
        if (res.code === 0 || res.success) {
          this.$message.success("已拒绝接单");
          this.rejectDialogVisible = false;
          
          // 关闭对应的订单卡片
          const order = this.orderList.find(o => o.orderId === this.rejectForm.orderId);
          if (order) {
            this.closeOrder(order);
          }
          
          // 刷新订单列表
          if (this.$eventBus) {
            this.$eventBus.$emit("refresh-order-list");
          }
        } else {
          this.$message.error(res.message || "操作失败");
        }
      } catch (error) {
        this.$message.error("操作失败");
      } finally {
        this.rejectLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.order-push-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-push-card {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  position: relative;
}

.order-push-card.is-closing {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 头部 */
.push-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bell-icon {
  font-size: 18px;
  animation: bellRing 1s ease-in-out infinite;
}

@keyframes bellRing {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(8deg); }
  20%, 40%, 60%, 80% { transform: rotate(-8deg); }
}

.header-title {
  font-size: 15px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 倒计时文字样式 - 淘宝闪购风格 */
.countdown-text {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.countdown-text.urgent {
  background: rgba(255, 255, 255, 0.9);
  color: #f56c6c;
  animation: pulse 0.8s ease-in-out infinite;
}

.countdown-text i {
  font-size: 14px;
}

.countdown-label {
  font-size: 12px;
  opacity: 0.9;
}

.countdown-value {
  font-size: 16px;
  font-weight: bold;
  font-family: 'DIN Alternate', 'Helvetica Neue', Arial, sans-serif;
  min-width: 44px;
  text-align: center;
  letter-spacing: 1px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.close-btn {
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* 内容区域 */
.push-content {
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.push-content:hover {
  background-color: #f5f7fa;
}

/* 订单编号行 */
.order-no-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e4e7ed;
  font-size: 13px;
}

.order-no-row i {
  color: #409eff;
  font-size: 14px;
}

.order-no-row .label {
  color: #909399;
  min-width: 52px;
}

.order-no-row .value.order-no {
  color: #409eff;
  font-weight: 600;
  font-family: 'DIN Alternate', 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.5px;
}

.customer-info {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #606266;
}

.info-item i {
  color: #909399;
  font-size: 14px;
  width: 16px;
}

.info-item .label {
  color: #909399;
  min-width: 40px;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

.info-item.address .value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 280px;
}

/* 商品列表 */
.goods-list {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.goods-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  margin-bottom: 4px;
}

.goods-name {
  color: #303133;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-spec {
  color: #909399;
  font-size: 12px;
}

.goods-quantity {
  color: #f56c6c;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.goods-more {
  font-size: 12px;
  color: #909399;
  text-align: center;
  padding-top: 4px;
  border-top: 1px dashed #dcdfe6;
  margin-top: 4px;
}

/* 订单金额 */
.order-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}

.amount-label {
  font-size: 13px;
  color: #606266;
}

.amount-value {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

/* 备注 */
.order-remark {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #e6a23c;
  background: #fdf6ec;
  padding: 6px 10px;
  border-radius: 4px;
}

.order-remark i {
  font-size: 14px;
}

/* 操作按钮 */
.push-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  background: #fafafa;
}

.push-actions .el-button {
  min-width: 80px;
}

/* 倒计时条 */
.countdown-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
}

.countdown-progress {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #67c23a 100%);
  transition: width 0.1s linear;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.5);
}

.countdown-progress.urgent {
  background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 50%, #ff4d4f 100%);
  background-size: 200% 100%;
  animation: shimmer 1s linear infinite, blink 0.5s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(255, 77, 79, 0.8);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 过渡动画 */
.order-push-enter-active,
.order-push-leave-active {
  transition: all 0.3s ease;
}

.order-push-enter {
  opacity: 0;
  transform: translateX(100%);
}

.order-push-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
