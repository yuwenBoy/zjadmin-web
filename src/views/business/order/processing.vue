<template>
  <div class="processing-contrainer">
    <el-tabs
      v-model="activeStatus"
      @tab-click="handleTabChange"
      style="margin-bottom: 0"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.value"
        v-for="(item, index) in statusList"
        :key="index"
      >
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
                v-if="scope.row.status === 1"
                type="primary"
                size="small"
                @click="handleOrderAction(scope.row, 'accept')"
              >
                接单
              </el-button>
              <el-button
                v-else-if="scope.row.status === 2"
                type="success"
                size="small"
                @click="handleOrderAction(scope.row, 'process')"
              >
                出餐
              </el-button>
              <el-button
                v-else-if="scope.row.status === 3"
                type="warning"
                size="small"
                @click="handleOrderAction(scope.row, 'deliver')"
              >
                配送
              </el-button>
              <el-button
                v-else-if="scope.row.status === 8"
                type="danger"
                size="small"
                @click="handleOrderAction(scope.row, 'refund')"
              >
                处理退款
              </el-button>
              <el-button
                type="info"
                size="small"
                @click="viewOrderDetail(scope.row)"
              >
                详情
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "Processing",
  data() {
    return {
      activeStatus: "1,2,3,4",
      statusList: [
        { label: "进行中", value: "1,2,3,4" },
        { label: "待接单", value: "1" },
        { label: "待出餐", value: "2" },
        { label: "待配送", value: "3" },
        { label: "顾客退款", value: "8" },
      ],
      loading: false,
      orderList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    handleTabChange() {
      this.pagination.currentPage = 1;
      this.fetchOrders();
    },
    fetchOrders() {
      this.loading = true;
      // 模拟API请求
      setTimeout(() => {
        const mockOrders = [];
        for (let i = 0; i < 10; i++) {
          const status = this.activeStatus.split(',')[0];
          mockOrders.push({
            orderId: `ORD${Date.now() + i}`,
            customerName: `顾客${i + 1}`,
            customerPhone: `1380013800${i}`,
            orderAmount: (Math.random() * 100 + 20).toFixed(2),
            orderTime: new Date().toISOString(),
            status: parseInt(status)
          });
        }
        this.orderList = mockOrders;
        this.pagination.total = 50;
        this.loading = false;
      }, 500);
    },
    handleOrderAction(order, action) {
      this.$msg.confirm(`确定要${this.getActionText(action)}该订单吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API请求
        setTimeout(() => {
          this.$msg.success(`${this.getActionText(action)}成功`);
          this.fetchOrders();
        }, 500);
      }).catch(() => {});
    },
    viewOrderDetail(order) {
      this.$msg.info(`查看订单详情：${order.orderId}`);
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
      return new Date(cellValue).toLocaleString();
    },
    formatStatus(row, column, cellValue) {
      const statusMap = {
        1: '待接单',
        2: '待出餐',
        3: '待配送',
        4: '已完成',
        8: '顾客退款'
      };
      return statusMap[cellValue] || '未知状态';
    },
    getActionText(action) {
      const actionMap = {
        accept: '接单',
        process: '出餐',
        deliver: '配送',
        refund: '处理退款'
      };
      return actionMap[action] || '';
    }
  },
};
</script>
<style scoped>
.processing-contrainer {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 15px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
