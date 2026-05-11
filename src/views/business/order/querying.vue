<template>
  <div class="querying-container">
    <el-card shadow="hover">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="searchForm.orderId" placeholder="请输入订单号" />
          </el-form-item>
          <el-form-item label="顾客姓名">
            <el-input v-model="searchForm.customerName" placeholder="请输入顾客姓名" />
          </el-form-item>
          <el-form-item label="顾客电话">
            <el-input v-model="searchForm.customerPhone" placeholder="请输入顾客电话" />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择订单状态">
              <el-option label="全部" value="" />
              <el-option label="待接单" value="1" />
              <el-option label="待出餐" value="2" />
              <el-option label="待配送" value="3" />
              <el-option label="已完成" value="4" />
              <el-option label="顾客退款" value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        :data="orderList"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="orderId"
          label="订单号"
          width="180"
        />
        <el-table-column
          prop="customerName"
          label="顾客姓名"
          width="120"
        />
        <el-table-column
          prop="customerPhone"
          label="顾客电话"
          width="150"
        />
        <el-table-column
            prop="orderAmount"
            label="订单金额"
            width="120"
            :formatter="formatPrice"
          />
          <el-table-column
            prop="orderTime"
            label="下单时间"
            width="180"
            :formatter="formatDateTime"
          />
          <el-table-column
            prop="status"
            label="订单状态"
            width="120"
            :formatter="formatStatus"
          />
        <el-table-column
          label="操作"
          width="180"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              @click="viewOrderDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="exportOrder(scope.row)"
            >
              导出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号">{{ currentOrder.orderNo || currentOrder.orderId }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.orderStatus || currentOrder.status)">
              {{ formatStatus(null, null, currentOrder.orderStatus || currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="顾客姓名">{{ currentOrder.addressName || currentOrder.customerName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentOrder.addressPhone || currentOrder.customerPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.addressDetail }}</el-descriptions-item>
          <el-descriptions-item label="商品总额">¥{{ currentOrder.goodsTotal || currentOrder.orderAmount }}</el-descriptions-item>
          <el-descriptions-item label="配送费">¥{{ currentOrder.deliveryFee || 0 }}</el-descriptions-item>
          <el-descriptions-item label="店铺优惠">-¥{{ currentOrder.discount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="优惠券">-¥{{ currentOrder.couponDiscount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">
            <span class="price-highlight">¥{{ currentOrder.finalTotal || currentOrder.orderAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payMethod || '在线支付' }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formatDateTime(null, null, currentOrder.createdAt || currentOrder.orderTime) }}</el-descriptions-item>
          <el-descriptions-item label="订单备注" :span="2">{{ currentOrder.remark || '无' }}</el-descriptions-item>
          <el-descriptions-item label="骑手信息" :span="2" v-if="currentOrder.riderName">
            {{ currentOrder.riderName }} {{ currentOrder.riderPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="取消原因" :span="2" v-if="currentOrder.cancelReason">
            {{ currentOrder.cancelReason }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="detail-section" v-if="currentOrder.items && currentOrder.items.length > 0">
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
import { getOrderList } from "@/api/business/order";

// 订单状态映射（与 processing.vue 保持一致）
const OrderStatusText = {
  0: "待支付",
  1: "待接单",
  2: "备货中",
  3: "待配送",
  4: "配送中",
  5: "已完成",
  6: "已取消",
  7: "超时关闭",
  8: "已退款"
};

export default {
  name: "Querying",
  data() {
    return {
      searchForm: {
        orderId: '',
        customerName: '',
        customerPhone: '',
        status: '',
        dateRange: []
      },
      loading: false,
      orderList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 订单详情对话框
      detailDialogVisible: false,
      currentOrder: null
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    handleSearch() {
      this.pagination.currentPage = 1;
      this.fetchOrders();
    },
    resetForm() {
      this.searchForm = {
        orderId: '',
        customerName: '',
        customerPhone: '',
        status: '',
        dateRange: []
      };
      this.pagination.currentPage = 1;
      this.fetchOrders();
    },
    async fetchOrders() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        };
        // 处理搜索条件
        if (this.searchForm.orderId) {
          params.orderNo = this.searchForm.orderId;
        }
        if (this.searchForm.status) {
          params.status = parseInt(this.searchForm.status);
        }
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          params.startDate = this.searchForm.dateRange[0];
          params.endDate = this.searchForm.dateRange[1];
        }
        const res = await getOrderList(params);
        if (res.code === 0 || res.success) {
          const list = (res.result && res.result.list) || (res.data && res.data.list) || [];
          // 转换数据格式以匹配表格字段，同时转换 goods 为 items
          this.orderList = list.map(item => {
            // 转换 goods 为 items（用于详情显示）
            if (item.goods && Array.isArray(item.goods)) {
              item.items = item.goods.map(good => ({
                goodsName: good.productName || good.goodsName || '',
                specName: good.specName || '',
                quantity: good.count || good.quantity || 0,
                unitPrice: good.price || good.unitPrice || '0.00',
                totalPrice: (parseFloat(good.price || 0) * parseInt(good.count || 0)).toFixed(2),
                // 兼容多种图片字段名：img、image、imageUrl、picUrl、productImage、goodsImage
                img: good.img || good.image || good.imageUrl || good.picUrl || good.productImage || good.goodsImage || good.cover || ''
              }));
            }
            return {
              orderId: item.orderNo || item.id,
              customerName: item.addressName,
              customerPhone: item.addressPhone,
              orderAmount: item.finalTotal,
              orderTime: item.createdAt,
              status: item.orderStatus,
              // 保存完整数据用于详情显示
              rawData: item
            };
          });
          this.pagination.total = (res.result && res.result.pagination && res.result.pagination.total) || 
                                   (res.data && res.data.pagination && res.data.pagination.total) || 0;
        } else {
          this.$message.error(res.message || "获取订单列表失败");
        }
      } catch (error) {
        this.$message.error("获取订单列表失败");
      } finally {
        this.loading = false;
      }
    },
    viewOrderDetail(order) {
      this.currentOrder = order.rawData || order;
      this.detailDialogVisible = true;
    },
    exportOrder(order) {
      this.$message.info(`导出订单：${order.orderId}`);
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchOrders();
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current;
      this.fetchOrders();
    },
    formatPrice(row, column, cellValue) {
      return `¥${cellValue}`;
    },
    formatDateTime(row, column, cellValue) {
      if (!cellValue) return '-';
      return new Date(cellValue).toLocaleString('zh-CN');
    },
    formatStatus(row, column, cellValue) {
      return OrderStatusText[cellValue] || '未知状态';
    },
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        0: "info",
        1: "danger",
        2: "warning",
        3: "",
        4: "primary",
        5: "success",
        6: "info",
        7: "info",
        8: "info"
      };
      return typeMap[status] || "";
    }
  },
};
</script>
<style scoped>
.querying-container {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 15px;
}
.search-form {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 订单详情样式 */
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

.price-highlight {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}
</style>