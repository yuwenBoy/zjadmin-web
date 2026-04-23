<template>
  <div class="order-processing-container">
    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="16">
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick(1)">
            <div class="stat-value stat-pending">{{ statistics.pendingAccept }}</div>
            <div class="stat-label">待接单</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick(2)">
            <div class="stat-value stat-preparing">{{ statistics.preparing }}</div>
            <div class="stat-label">备货中</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick(3)">
            <div class="stat-value stat-delivery">{{ statistics.pendingDelivery }}</div>
            <div class="stat-label">待配送</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick(4)">
            <div class="stat-value stat-delivering">{{ statistics.delivering }}</div>
            <div class="stat-label">配送中</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick(5)">
            <div class="stat-value stat-completed">{{ statistics.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card" @click="handleStatClick('6,7')">
            <div class="stat-value stat-canceled">{{ statistics.canceled }}</div>
            <div class="stat-label">已取消</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card">
            <div class="stat-value stat-unpaid">{{ statistics.pendingPay }}</div>
            <div class="stat-label">待支付</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="stat-card">
            <div class="stat-value stat-total">{{ totalOrderCount }}</div>
            <div class="stat-label">总订单</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 订单列表 -->
    <div class="order-list-container">
      <el-tabs v-model="activeStatus" @tab-click="handleTabChange" type="border-card">
        <el-tab-pane label="全部" name="all">
          <span slot="label"><i class="el-icon-s-order"></i> 全部</span>
        </el-tab-pane>
        <el-tab-pane label="待接单" name="1">
          <span slot="label"><i class="el-icon-bell"></i> 待接单</span>
        </el-tab-pane>
        <el-tab-pane label="备货中" name="2">
          <span slot="label"><i class="el-icon-box"></i> 备货中</span>
        </el-tab-pane>
        <el-tab-pane label="待配送" name="3">
          <span slot="label"><i class="el-icon-truck"></i> 待配送</span>
        </el-tab-pane>
        <el-tab-pane label="配送中" name="4">
          <span slot="label"><i class="el-icon-position"></i> 配送中</span>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="5">
          <span slot="label"><i class="el-icon-check"></i> 已完成</span>
        </el-tab-pane>
        <el-tab-pane label="已取消" name="6,7">
          <span slot="label"><i class="el-icon-close"></i> 已取消</span>
        </el-tab-pane>
      </el-tabs>

      <el-table
        v-loading="loading"
        :data="orderList"
        style="width: 100%"
        border
        stripe
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="order-expand-form">
              <el-form-item label="订单编号">
                <span>{{ props.row.orderNo }}</span>
              </el-form-item>
              <el-form-item label="收货人">
                <span>{{ props.row.addressName }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.addressPhone }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.addressDetail }}</span>
              </el-form-item>
              <el-form-item label="订单备注">
                <span>{{ props.row.remark || '无' }}</span>
              </el-form-item>
              <el-form-item label="配送时间">
                <span>{{ props.row.deliveryTime || '尽快送达' }}</span>
              </el-form-item>
              <el-form-item label="骑手信息" v-if="props.row.riderName">
                <span>{{ props.row.riderName }} {{ props.row.riderPhone }}</span>
              </el-form-item>
            </el-form>
            <div class="order-items">
              <div class="items-title">商品明细：</div>
              <el-table :data="props.row.items" size="small" border>
                <el-table-column prop="goodsName" label="商品名称" min-width="150" />
                <el-table-column prop="specName" label="规格" width="120" />
                <el-table-column prop="quantity" label="数量" width="80" />
                <el-table-column prop="unitPrice" label="单价" width="100">
                  <template slot-scope="scope">¥{{ scope.row.unitPrice }}</template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="小计" width="100">
                  <template slot-scope="scope">¥{{ scope.row.totalPrice }}</template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="orderNo" label="订单号" width="180" show-overflow-tooltip />
        <el-table-column prop="addressName" label="顾客姓名" width="100" />
        <el-table-column prop="addressPhone" label="顾客电话" width="130" />
        <el-table-column prop="finalTotal" label="订单金额" width="100">
          <template slot-scope="scope">
            <span class="price">¥{{ scope.row.finalTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsTotal" label="商品总额" width="100">
          <template slot-scope="scope">¥{{ scope.row.goodsTotal }}</template>
        </el-table-column>
        <el-table-column prop="deliveryFee" label="配送费" width="80">
          <template slot-scope="scope">¥{{ scope.row.deliveryFee }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="160">
          <template slot-scope="scope">{{ formatDateTime(scope.row.createdAt) }}</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.orderStatus)">
              {{ getStatusText(scope.row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <!-- 待接单 -->
            <template v-if="scope.row.orderStatus === 1">
              <el-button type="primary" size="mini" @click="handleAccept(scope.row)">
                <i class="el-icon-check"></i> 接单
              </el-button>
              <el-button type="danger" size="mini" @click="handleReject(scope.row)">
                <i class="el-icon-close"></i> 拒单
              </el-button>
            </template>
            <!-- 备货中 -->
            <template v-if="scope.row.orderStatus === 2">
              <el-button type="success" size="mini" @click="handleFinishPrepare(scope.row)">
                <i class="el-icon-box"></i> 备货完成
              </el-button>
            </template>
            <!-- 待配送 -->
            <template v-if="scope.row.orderStatus === 3">
              <el-button type="warning" size="mini" @click="handleAssignRider(scope.row)">
                <i class="el-icon-user"></i> 分配骑手
              </el-button>
            </template>
            <!-- 配送中 -->
            <template v-if="scope.row.orderStatus === 4">
              <el-button type="primary" size="mini" @click="handleComplete(scope.row)">
                <i class="el-icon-finished"></i> 确认送达
              </el-button>
            </template>
            <el-button type="info" size="mini" plain @click="viewOrderDetail(scope.row)">
              <i class="el-icon-view"></i> 详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </div>

    <!-- 拒单对话框 -->
    <el-dialog title="拒绝接单" :visible.sync="rejectDialogVisible" width="400px">
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
        <el-button type="primary" @click="confirmReject">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配骑手对话框 -->
    <el-dialog title="分配骑手" :visible.sync="riderDialogVisible" width="400px">
      <el-form :model="riderForm" label-width="100px" :rules="riderRules" ref="riderForm">
        <el-form-item label="骑手姓名" prop="riderName">
          <el-input v-model="riderForm.riderName" placeholder="请输入骑手姓名" />
        </el-form-item>
        <el-form-item label="骑手电话" prop="riderPhone">
          <el-input v-model="riderForm.riderPhone" placeholder="请输入骑手电话" />
        </el-form-item>
        <el-form-item label="骑手ID">
          <el-input-number v-model="riderForm.riderId" :min="1" placeholder="骑手ID" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="riderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssignRider">确定</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.orderStatus)">
              {{ getStatusText(currentOrder.orderStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="顾客姓名">{{ currentOrder.addressName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentOrder.addressPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.addressDetail }}</el-descriptions-item>
          <el-descriptions-item label="商品总额">¥{{ currentOrder.goodsTotal }}</el-descriptions-item>
          <el-descriptions-item label="配送费">¥{{ currentOrder.deliveryFee }}</el-descriptions-item>
          <el-descriptions-item label="店铺优惠">-¥{{ currentOrder.discount }}</el-descriptions-item>
          <el-descriptions-item label="优惠券">-¥{{ currentOrder.couponDiscount }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">
            <span class="price-highlight">¥{{ currentOrder.finalTotal }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payMethod }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formatDateTime(currentOrder.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="订单备注" :span="2">{{ currentOrder.remark || '无' }}</el-descriptions-item>
          <el-descriptions-item label="骑手信息" :span="2" v-if="currentOrder.riderName">
            {{ currentOrder.riderName }} {{ currentOrder.riderPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="取消原因" :span="2" v-if="currentOrder.cancelReason">
            {{ currentOrder.cancelReason }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="detail-section">
          <div class="section-title">商品明细</div>
          <el-table :data="currentOrder.items" border size="small">
            <el-table-column prop="goodsName" label="商品名称" min-width="150" />
            <el-table-column prop="specName" label="规格" width="120" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="unitPrice" label="单价" width="100">
              <template slot-scope="scope">¥{{ scope.row.unitPrice }}</template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="小计" width="100">
              <template slot-scope="scope">¥{{ scope.row.totalPrice }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  acceptOrder,
  rejectOrder,
  finishPreparation,
  assignRider,
  completeDelivery,
  getOrderStatistics
} from "@/api/business/order";

// 订单状态映射
const OrderStatus = {
  UNPAID: 0, // 待支付
  PENDING_ACCEPT: 1, // 待接单
  ACCEPTED_PREPARE: 2, // 备货中
  DAIPEISONG: 3, // 待配送
  PEISONGZHONG: 4, // 配送中
  YIWANCHENG: 5, // 已完成
  CANCELED_MANUAL: 6, // 人工取消
  CANCELED_TIMEOUT: 7, // 超时关闭
  REFUND_ALL_PART: 8 // 全额/部分退款
};

// 状态文本映射
const OrderStatusText = {
  [OrderStatus.UNPAID]: "待支付",
  [OrderStatus.PENDING_ACCEPT]: "待接单",
  [OrderStatus.ACCEPTED_PREPARE]: "备货中",
  [OrderStatus.DAIPEISONG]: "待配送",
  [OrderStatus.PEISONGZHONG]: "配送中",
  [OrderStatus.YIWANCHENG]: "已完成",
  [OrderStatus.CANCELED_MANUAL]: "已取消",
  [OrderStatus.CANCELED_TIMEOUT]: "超时关闭",
  [OrderStatus.REFUND_ALL_PART]: "已退款"
};

export default {
  name: "OrderProcessing",
  data() {
    return {
      activeStatus: "all",
      loading: false,
      orderList: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      statistics: {
        pendingPay: 0,
        pendingAccept: 0,
        preparing: 0,
        pendingDelivery: 0,
        delivering: 0,
        completed: 0,
        canceled: 0
      },
      // 拒单对话框
      rejectDialogVisible: false,
      rejectForm: {
        orderId: null,
        cancelReason: ""
      },
      // 骑手对话框
      riderDialogVisible: false,
      riderForm: {
        orderId: null,
        riderId: null,
        riderName: "",
        riderPhone: ""
      },
      riderRules: {
        riderName: [{ required: true, message: "请输入骑手姓名", trigger: "blur" }],
        riderPhone: [{ required: true, message: "请输入骑手电话", trigger: "blur" }]
      },
      // 详情对话框
      detailDialogVisible: false,
      currentOrder: null
    };
  },
  computed: {
    totalOrderCount() {
      return (
        this.statistics.pendingPay +
        this.statistics.pendingAccept +
        this.statistics.preparing +
        this.statistics.pendingDelivery +
        this.statistics.delivering +
        this.statistics.completed +
        this.statistics.canceled
      );
    }
  },
  created() {
    this.fetchOrders();
    this.fetchStatistics();
    // 监听刷新订单列表事件（来自订单推送组件）
    if (this.$eventBus) {
      this.$eventBus.$on("refresh-order-list", this.handleRefresh);
    }
  },
  beforeDestroy() {
    // 移除事件监听
    if (this.$eventBus) {
      this.$eventBus.$off("refresh-order-list", this.handleRefresh);
    }
  },
  methods: {
    // 获取订单列表
    async fetchOrders() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        };
        // 处理状态筛选
        if (this.activeStatus !== "all") {
          if (this.activeStatus.includes(",")) {
            // 多个状态（如已取消包含6,7）
            params.statusList = this.activeStatus.split(",").map(Number);
          } else {
            params.status = parseInt(this.activeStatus);
          }
        }
        const res = await getOrderList(params);
        if (res.code === 0 || res.success) {
          let list = (res.result && res.result.list) || (res.data && res.data.list) || [];
          // 转换数据格式：将后端返回的 goods 转换为前端需要的 items
          list = list.map(order => {
            if (order.goods && Array.isArray(order.goods)) {
              order.items = order.goods.map(good => ({
                goodsName: good.productName || good.goodsName || '',
                specName: good.specName || '',
                quantity: good.count || good.quantity || 0,
                unitPrice: good.price || good.unitPrice || '0.00',
                totalPrice: (parseFloat(good.price || 0) * parseInt(good.count || 0)).toFixed(2),
                // 兼容多种图片字段名：img、image、imageUrl、picUrl、productImage、goodsImage
                img: good.img || good.image || good.imageUrl || good.picUrl || good.productImage || good.goodsImage || good.cover || ''
              }));
            }
            return order;
          });
          this.orderList = list;
          this.pagination.total = (res.result && res.result.pagination && res.result.pagination.total) || (res.data && res.data.pagination && res.data.pagination.total) || 0;
        } else {
          this.$message.error(res.message || "获取订单列表失败");
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
        this.$message.error("获取订单列表失败");
      } finally {
        this.loading = false;
      }
    },

    // 获取订单统计
    async fetchStatistics() {
      try {
        const res = await getOrderStatistics({});
        if (res.code === 0 || res.success) {
          this.statistics = res.result || res.data || this.statistics;
        }
      } catch (error) {
        console.error("获取订单统计失败:", error);
      }
    },

    // 标签切换
    handleTabChange() {
      this.pagination.page = 1;
      this.fetchOrders();
    },

    // 统计卡片点击
    handleStatClick(status) {
      this.activeStatus = String(status);
      this.pagination.page = 1;
      this.fetchOrders();
    },

    // 分页大小改变
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchOrders();
    },

    // 页码改变
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.fetchOrders();
    },

    // 接单
    handleAccept(row) {
      this.$confirm("确定要接单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await acceptOrder({ orderId: row.id });
            if (res.code === 0 || res.success) {
              this.$message.success("接单成功");
              this.fetchOrders();
              this.fetchStatistics();
            } else {
              this.$message.error(res.message || "接单失败");
            }
          } catch (error) {
            this.$message.error("接单失败");
          }
        })
        .catch(() => {});
    },

    // 拒单
    handleReject(row) {
      this.rejectForm.orderId = row.id;
      this.rejectForm.cancelReason = "";
      this.rejectDialogVisible = true;
    },

    // 确认拒单
    async confirmReject() {
      if (!this.rejectForm.cancelReason.trim()) {
        this.$message.warning("请输入取消原因");
        return;
      }
      try {
        const res = await rejectOrder({
          orderId: this.rejectForm.orderId,
          cancelReason: this.rejectForm.cancelReason
        });
        if (res.code === 0 || res.success) {
          this.$message.success("已拒绝接单");
          this.rejectDialogVisible = false;
          this.fetchOrders();
          this.fetchStatistics();
        } else {
          this.$message.error(res.message || "操作失败");
        }
      } catch (error) {
        this.$message.error("操作失败");
      }
    },

    // 备货完成
    handleFinishPrepare(row) {
      this.$confirm("确定备货已完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await finishPreparation({ orderId: row.id });
            if (res.code === 0 || res.success) {
              this.$message.success("备货完成");
              this.fetchOrders();
              this.fetchStatistics();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          } catch (error) {
            this.$message.error("操作失败");
          }
        })
        .catch(() => {});
    },

    // 分配骑手
    handleAssignRider(row) {
      this.riderForm = {
        orderId: row.id,
        riderId: null,
        riderName: "",
        riderPhone: ""
      };
      this.riderDialogVisible = true;
    },

    // 确认分配骑手
    async confirmAssignRider() {
      this.$refs.riderForm.validate(async valid => {
        if (valid) {
          try {
            const res = await assignRider({
              orderId: this.riderForm.orderId,
              riderId: this.riderForm.riderId,
              riderName: this.riderForm.riderName,
              riderPhone: this.riderForm.riderPhone
            });
            if (res.code === 0 || res.success) {
              this.$message.success("骑手分配成功");
              this.riderDialogVisible = false;
              this.fetchOrders();
              this.fetchStatistics();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          } catch (error) {
            this.$message.error("操作失败");
          }
        }
      });
    },

    // 确认送达
    handleComplete(row) {
      this.$confirm("确定订单已送达吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await completeDelivery({ orderId: row.id });
            if (res.code === 0 || res.success) {
              this.$message.success("订单已完成");
              this.fetchOrders();
              this.fetchStatistics();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          } catch (error) {
            this.$message.error("操作失败");
          }
        })
        .catch(() => {});
    },

    // 查看订单详情
    viewOrderDetail(row) {
      this.currentOrder = row;
      this.detailDialogVisible = true;
    },

    // 获取状态文本
    getStatusText(status) {
      return OrderStatusText[status] || "未知状态";
    },

    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        [OrderStatus.UNPAID]: "info",
        [OrderStatus.PENDING_ACCEPT]: "danger",
        [OrderStatus.ACCEPTED_PREPARE]: "warning",
        [OrderStatus.DAIPEISONG]: "",
        [OrderStatus.PEISONGZHONG]: "primary",
        [OrderStatus.YIWANCHENG]: "success",
        [OrderStatus.CANCELED_MANUAL]: "info",
        [OrderStatus.CANCELED_TIMEOUT]: "info",
        [OrderStatus.REFUND_ALL_PART]: "info"
      };
      return typeMap[status] || "";
    },

    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleString("zh-CN");
    },
    
    // 处理刷新事件
    handleRefresh() {
      this.fetchOrders();
      this.fetchStatistics();
    }
  }
};
</script>

<style scoped>
.order-processing-container {
  padding: 20px;
}

/* 统计卡片样式 */
.statistics-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 8px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-pending {
  color: #f56c6c;
}
.stat-preparing {
  color: #e6a23c;
}
.stat-delivery {
  color: #409eff;
}
.stat-delivering {
  color: #67c23a;
}
.stat-completed {
  color: #909399;
}
.stat-canceled {
  color: #c0c4cc;
}
.stat-unpaid {
  color: #f56c6c;
}
.stat-total {
  color: #303133;
}

/* 订单列表样式 */
.order-list-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.price-highlight {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 展开行样式 */
.order-expand-form {
  padding: 10px 20px;
}

.order-expand-form label {
  width: 90px;
  color: #99a9bf;
}

.order-expand-form .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.order-items {
  margin: 15px 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.items-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #606266;
}

/* 详情样式 */
.order-detail {
  padding: 10px;
}

.detail-section {
  margin-top: 20px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
