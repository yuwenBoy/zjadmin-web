<template>
  <div class="dashboard business-dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，{{ storeName }}</h1>
        <p class="welcome-desc">{{ greeting }}，今天也要加油哦！</p>
      </div>
      <div class="quick-actions">
        <div class="action-btn primary" @click="goToOrder">
          <i class="el-icon-s-order"></i>
          <span>处理订单</span>
        </div>
        <div class="action-btn" @click="goToProduct">
          <i class="el-icon-s-goods"></i>
          <span>管理商品</span>
        </div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" @click="goToOrder">
        <div class="stat-icon orders">
          <i class="el-icon-shopping-cart"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ todayOrders }}</p>
          <p class="stat-label">今日订单</p>
          <p class="stat-change positive">+12%</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToOrder">
        <div class="stat-icon sales">
          <i class="el-icon-money"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">¥{{ todaySales.toLocaleString() }}</p>
          <p class="stat-label">今日销售额</p>
          <p class="stat-change positive">+8.5%</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToProduct">
        <div class="stat-icon products">
          <i class="el-icon-box"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ productCount }}</p>
          <p class="stat-label">在售商品</p>
          <p class="stat-change">328款</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToStore">
        <div class="stat-icon visitors">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ visitors }}</p>
          <p class="stat-label">今日访客</p>
          <p class="stat-change positive">+23%</p>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧：订单列表 -->
      <div class="order-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-s-order"></i>
            最近订单
          </h2>
          <a href="#" class="view-all" @click.prevent="goToOrder">查看全部</a>
        </div>
        <div class="order-list">
          <div class="order-item" v-for="order in recentOrders" :key="order.id" @click="goToOrderDetail(order.id)">
            <div class="order-header">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-status" :class="order.statusClass">{{ order.status }}</span>
            </div>
            <div class="order-items">
              <div class="order-product" v-for="(product, idx) in order.products" :key="idx">
                <img :src="product.image" :alt="product.name" class="product-img" />
                <div class="product-info">
                  <p class="product-name">{{ product.name }}</p>
                  <p class="product-spec">{{ product.spec }}</p>
                </div>
                <span class="product-qty">x{{ product.quantity }}</span>
              </div>
            </div>
            <div class="order-footer">
              <span class="order-total">共{{ order.totalQty }}件 实付 ¥{{ order.amount }}</span>
              <span class="order-time">{{ order.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：快捷操作和店铺信息 -->
      <div class="side-panel">
        <!-- 快捷操作 -->
        <div class="quick-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-menu"></i>
              快捷操作
            </h2>
          </div>
          <div class="quick-grid">
            <div class="quick-item" @click="goToProduct">
              <div class="quick-icon product">
                <i class="el-icon-plus"></i>
              </div>
              <span>新增商品</span>
            </div>
            <div class="quick-item" @click="goToCategory">
              <div class="quick-icon category">
                <i class="el-icon-folder"></i>
              </div>
              <span>商品分类</span>
            </div>
            <div class="quick-item" @click="goToPromotion">
              <div class="quick-icon promotion">
                <i class="el-icon-tag"></i>
              </div>
              <span>营销活动</span>
            </div>
            <div class="quick-item" @click="goToCoupon">
              <div class="quick-icon coupon">
                <i class="el-icon-ticket"></i>
              </div>
              <span>优惠券</span>
            </div>
            <div class="quick-item" @click="goToStore">
              <div class="quick-icon store">
                <i class="el-icon-setting"></i>
              </div>
              <span>店铺设置</span>
            </div>
            <div class="quick-item" @click="goToData">
              <div class="quick-icon data">
                <i class="el-icon-s-data"></i>
              </div>
              <span>数据中心</span>
            </div>
          </div>
        </div>

        <!-- 店铺信息 -->
        <div class="store-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-shop"></i>
              店铺信息
            </h2>
          </div>
          <div class="store-info">
            <div class="store-avatar">
              <img :src="storeAvatar" alt="店铺头像" />
            </div>
            <div class="store-detail">
              <h3 class="store-name">{{ storeName }}</h3>
              <p class="store-level">店铺等级：{{ storeLevel }}</p>
              <p class="store-rating">评分：<span class="rating-value">{{ storeRating }}</span>分</p>
            </div>
          </div>
          <div class="store-stats">
            <div class="store-stat">
              <p class="stat-num">{{ storeOrders }}</p>
              <p class="stat-name">累计订单</p>
            </div>
            <div class="store-stat">
              <p class="stat-num">{{ storeFans }}</p>
              <p class="stat-name">店铺粉丝</p>
            </div>
            <div class="store-stat">
              <p class="stat-num">{{ storeRating }}%</p>
              <p class="stat-name">好评率</p>
            </div>
          </div>
          <button class="edit-store-btn" @click="goToStore">
            <i class="el-icon-edit"></i>
            编辑店铺
          </button>
        </div>

        <!-- 待办提醒 -->
        <div class="todo-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-bell"></i>
              待办提醒
              <span class="badge">{{ todoCount }}</span>
            </h2>
          </div>
          <div class="todo-list">
            <div class="todo-item" v-for="(todo, idx) in todoList" :key="idx">
              <div class="todo-dot" :class="todo.type"></div>
              <div class="todo-content">
                <p class="todo-title">{{ todo.title }}</p>
                <p class="todo-time">{{ todo.time }}</p>
              </div>
              <span class="todo-num" v-if="todo.num">{{ todo.num }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessDashboard',
  data() {
    return {
      storeName: '快乐零食铺',
      storeAvatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20cartoon%20snack%20shop%20logo%20with%20colorful%20candy%20and%20chips&image_size=square',
      storeLevel: '钻石店铺',
      storeRating: 4.9,
      storeOrders: 12580,
      storeFans: 8650,
      todayOrders: 156,
      todaySales: 28560,
      productCount: 156,
      visitors: 1238,
      greeting: '',
      todoCount: 3,
      todoList: [
        { title: '待发货订单', time: '刚刚', type: 'warning', num: '3' },
        { title: '待处理售后', time: '5分钟前', type: 'danger', num: '2' },
        { title: '商品库存不足', time: '1小时前', type: 'info', num: '8' }
      ],
      recentOrders: [
        {
          id: 1,
          orderNo: 'DD20240115001',
          status: '待发货',
          statusClass: 'pending',
          totalQty: 2,
          amount: 68.8,
          time: '10分钟前',
          products: [
            { name: '薯片大礼包', spec: '原味/500g', quantity: 1, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=potato%20chips%20snack%20package%20orange%20color&image_size=square' },
            { name: '可乐饮料', spec: '500ml/瓶', quantity: 1, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cola%20drink%20bottle%20red%20color&image_size=square' }
          ]
        },
        {
          id: 2,
          orderNo: 'DD20240115002',
          status: '已完成',
          statusClass: 'success',
          totalQty: 1,
          amount: 35.5,
          time: '30分钟前',
          products: [
            { name: '坚果礼盒', spec: '混合口味/1kg', quantity: 1, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mixed%20nuts%20gift%20box%20elegant&image_size=square' }
          ]
        },
        {
          id: 3,
          orderNo: 'DD20240115003',
          status: '待付款',
          statusClass: 'warning',
          totalQty: 3,
          amount: 128.0,
          time: '1小时前',
          products: [
            { name: '巧克力饼干', spec: '200g/盒', quantity: 3, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chocolate%20cookies%20box%20delicious&image_size=square' }
          ]
        },
        {
          id: 4,
          orderNo: 'DD20240115004',
          status: '配送中',
          statusClass: 'info',
          totalQty: 1,
          amount: 45.0,
          time: '2小时前',
          products: [
            { name: '进口糖果', spec: '什锦口味/300g', quantity: 1, image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colorful%20candy%20assorted%20sweet&image_size=square' }
          ]
        }
      ]
    }
  },
  created() {
    this.setGreeting()
  },
  methods: {
    setGreeting() {
      const hour = new Date().getHours()
      if (hour < 12) {
        this.greeting = '早上好'
      } else if (hour < 18) {
        this.greeting = '下午好'
      } else {
        this.greeting = '晚上好'
      }
    },
    goToOrder() {
      this.$router.push('/business/order/processing')
    },
    goToOrderDetail(orderId) {
      this.$router.push('/business/order/processing')
    },
    goToProduct() {
      this.$router.push('/business/product')
    },
    goToCategory() {
      this.$router.push('/business/product/categoryList')
    },
    goToPromotion() {
      this.$router.push('/business/product')
    },
    goToCoupon() {
      this.$router.push('/business/product')
    },
    goToStore() {
      this.$router.push('/business/store/info')
    },
    goToData() {
      this.$router.push('/business/store/info')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fc;
  height: calc(100vh - 50px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 20px;
  color: white;
  box-shadow: 0 4px 20px rgba(238, 90, 90, 0.3);

  .welcome-content {
    .welcome-title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .welcome-desc {
      font-size: 16px;
      opacity: 0.9;
    }
  }

  .quick-actions {
    display: flex;
    gap: 15px;

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      &.primary {
        background: white;
        color: #ff6b6b;
      }

      i {
        font-size: 16px;
      }
    }
  }
}

/* 数据统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;

      &.orders {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.sales {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.products {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.visitors {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
        margin-bottom: 4px;
      }

      .stat-change {
        font-size: 12px;
        color: #999;

        &.positive {
          color: #67c23a;
        }

        &.negative {
          color: #f56c6c;
        }
      }
    }
  }
}

/* 主内容区域 */
.main-content {
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden;

  .order-section {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
  }

  .side-panel {
    width: 360px;
    overflow-y: auto;
    padding-right: 5px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

/* 通用区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    i {
      color: #667eea;
    }
  }

  .view-all {
    font-size: 13px;
    color: #667eea;
    text-decoration: none;

    &:hover {
      color: #764ba2;
    }
  }

  .badge {
    background: #f56c6c;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
  }
}

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .order-item {
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
      background: #fafafa;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .order-no {
        font-size: 13px;
        color: #666;
      }

      .order-status {
        font-size: 12px;
        padding: 3px 10px;
        border-radius: 12px;

        &.pending {
          background: #fff7e6;
          color: #e6a23c;
        }

        &.success {
          background: #f0f9eb;
          color: #67c23a;
        }

        &.warning {
          background: #fff7e6;
          color: #e6a23c;
        }

        &.info {
          background: #e6f7ff;
          color: #409eff;
        }
      }
    }

    .order-items {
      .order-product {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .product-img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .product-info {
          flex: 1;

          .product-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }

          .product-spec {
            font-size: 12px;
            color: #999;
          }
        }

        .product-qty {
          font-size: 13px;
          color: #666;
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #e8e8e8;

      .order-total {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .order-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

/* 快捷操作网格 */
.quick-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .quick-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #f5f7fc;
        transform: translateY(-2px);
      }

      .quick-icon {
        width: 45px;
        height: 45px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: white;

        &.product {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.category {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.promotion {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.coupon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        &.store {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.data {
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
        }
      }

      span {
        font-size: 13px;
        color: #666;
      }
    }
  }
}

/* 店铺信息 */
.store-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .store-info {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;

    .store-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #f0f0f0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .store-detail {
      flex: 1;

      .store-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
      }

      .store-level {
        font-size: 13px;
        color: #e6a23c;
        margin-bottom: 5px;
      }

      .store-rating {
        font-size: 13px;
        color: #666;

        .rating-value {
          color: #ff6b6b;
          font-weight: 600;
        }
      }
    }
  }

  .store-stats {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;

    .store-stat {
      text-align: center;

      .stat-num {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .stat-name {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .edit-store-btn {
    width: 100%;
    height: 40px;
    background: #f5f7fc;
    border: none;
    border-radius: 8px;
    color: #667eea;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #eef2ff;
    }

    i {
      margin-right: 5px;
    }
  }
}

/* 待办提醒 */
.todo-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #f5f7fc;
      }

      .todo-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.warning {
          background: #e6a23c;
        }

        &.danger {
          background: #f56c6c;
        }

        &.info {
          background: #409eff;
        }
      }

      .todo-content {
        flex: 1;

        .todo-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 2px;
        }

        .todo-time {
          font-size: 12px;
          color: #999;
        }
      }

      .todo-num {
        font-size: 12px;
        color: #f56c6c;
        font-weight: 500;
        background: #fef0f0;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    flex-direction: column;

    .side-panel {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;

    .quick-actions {
      width: 100%;
      justify-content: center;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>