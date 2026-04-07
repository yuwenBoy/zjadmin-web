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
  </div>
</template>
<script>
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
      }
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
    fetchOrders() {
      this.loading = true;
      // 模拟API请求
      setTimeout(() => {
        const mockOrders = [];
        for (let i = 0; i < 10; i++) {
          mockOrders.push({
            orderId: `ORD${Date.now() + i}`,
            customerName: `顾客${i + 1}`,
            customerPhone: `1380013800${i}`,
            orderAmount: (Math.random() * 100 + 20).toFixed(2),
            orderTime: new Date().toISOString(),
            status: Math.floor(Math.random() * 4) + 1
          });
        }
        this.orderList = mockOrders;
        this.pagination.total = 100;
        this.loading = false;
      }, 500);
    },
    viewOrderDetail(order) {
      this.$msg.info(`查看订单详情：${order.orderId}`);
    },
    exportOrder(order) {
      this.$msg.info(`导出订单：${order.orderId}`);
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
</style>