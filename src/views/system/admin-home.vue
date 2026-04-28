<template>
  <div class="dashboard admin-dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section admin">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，{{ userName }}</h1>
        <p class="welcome-desc">{{ greeting }}，今天也要加油哦！</p>
      </div>
      <div class="system-status">
        <div class="status-item">
          <span class="status-dot online"></span>
          <span>系统运行正常</span>
        </div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" @click="goToBusiness">
        <div class="stat-icon business">
          <i class="el-icon-building"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ businessCount }}</p>
          <p class="stat-label">商家总数</p>
          <p class="stat-change positive">+12%</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToUsers">
        <div class="stat-icon users">
          <i class="el-icon-user"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ userCount }}</p>
          <p class="stat-label">用户总数</p>
          <p class="stat-change positive">+8.5%</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToOrders">
        <div class="stat-icon orders">
          <i class="el-icon-shopping-cart"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ orderCount }}</p>
          <p class="stat-label">今日订单</p>
          <p class="stat-change positive">+15%</p>
        </div>
      </div>
      
      <div class="stat-card" @click="goToRevenue">
        <div class="stat-icon revenue">
          <i class="el-icon-money"></i>
        </div>
        <div class="stat-info">
          <p class="stat-value">¥{{ revenue.toLocaleString() }}</p>
          <p class="stat-label">今日营收</p>
          <p class="stat-change positive">+23%</p>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧：商家审核列表 -->
      <div class="business-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-building"></i>
            待审核商家
          </h2>
          <a href="#" class="view-all" @click.prevent="goToBusiness">查看全部</a>
        </div>
        <div class="business-list">
          <div class="business-item" v-for="business in pendingBusiness" :key="business.id" @click="goToBusinessDetail(business.id)">
            <div class="business-avatar">
              <img :src="business.avatar" :alt="business.name" />
            </div>
            <div class="business-info">
              <div class="business-name">{{ business.name }}</div>
              <div class="business-contact">{{ business.contact }} | {{ business.phone }}</div>
              <div class="business-address">{{ business.address }}</div>
            </div>
            <div class="business-meta">
              <span class="apply-time">{{ business.applyTime }}</span>
              <span class="status pending">待审核</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：系统信息和快捷操作 -->
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
            <div class="quick-item" @click="goToBusiness">
              <div class="quick-icon business">
                <i class="el-icon-plus"></i>
              </div>
              <span>商家审核</span>
            </div>
            <div class="quick-item" @click="goToUsers">
              <div class="quick-icon users">
                <i class="el-icon-user"></i>
              </div>
              <span>用户管理</span>
            </div>
            <div class="quick-item" @click="goToOrders">
              <div class="quick-icon orders">
                <i class="el-icon-s-order"></i>
              </div>
              <span>订单管理</span>
            </div>
            <div class="quick-item" @click="goToLogs">
              <div class="quick-icon logs">
                <i class="el-icon-document"></i>
              </div>
              <span>系统日志</span>
            </div>
            <div class="quick-item" @click="goToSettings">
              <div class="quick-icon settings">
                <i class="el-icon-setting"></i>
              </div>
              <span>系统设置</span>
            </div>
            <div class="quick-item" @click="goToData">
              <div class="quick-icon data">
                <i class="el-icon-s-data"></i>
              </div>
              <span>数据统计</span>
            </div>
          </div>
        </div>

        <!-- 系统状态 -->
        <div class="system-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-cpu"></i>
              系统状态
            </h2>
          </div>
          <div class="system-stats">
            <div class="system-stat">
              <div class="stat-header">
                <span class="stat-label">服务器</span>
                <span class="status-badge online">正常</span>
              </div>
              <div class="stat-detail">CPU: 23% | 内存: 45%</div>
            </div>
            <div class="system-stat">
              <div class="stat-header">
                <span class="stat-label">数据库</span>
                <span class="status-badge online">正常</span>
              </div>
              <div class="stat-detail">连接数: 12 | 响应: 15ms</div>
            </div>
            <div class="system-stat">
              <div class="stat-header">
                <span class="stat-label">Redis</span>
                <span class="status-badge online">正常</span>
              </div>
              <div class="stat-detail">内存: 128MB | 命中率: 98%</div>
            </div>
          </div>
        </div>

        <!-- 最近操作日志 -->
        <div class="logs-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-time"></i>
              最近操作
            </h2>
          </div>
          <div class="logs-list">
            <div class="log-item" v-for="(log, idx) in recentLogs" :key="idx">
              <div class="log-icon" :class="log.type">
                <i :class="log.icon"></i>
              </div>
              <div class="log-content">
                <p class="log-text">{{ log.text }}</p>
                <p class="log-time">{{ log.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      userName: '系统管理员',
      businessCount: 128,
      userCount: 3568,
      orderCount: 1256,
      revenue: 185600,
      greeting: '',
      pendingBusiness: [
        {
          id: 1,
          name: '美味餐厅',
          contact: '张经理',
          phone: '138****8888',
          address: '北京市朝阳区建国路88号',
          avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=restaurant%20logo%20elegant%20food&image_size=square',
          applyTime: '10分钟前'
        },
        {
          id: 2,
          name: '鲜果超市',
          contact: '李老板',
          phone: '139****6666',
          address: '上海市浦东新区陆家嘴环路100号',
          avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20fruit%20store%20logo%20colorful&image_size=square',
          applyTime: '30分钟前'
        },
        {
          id: 3,
          name: '快乐零食铺',
          contact: '王店长',
          phone: '137****5555',
          address: '广州市天河区珠江新城',
          avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20snack%20shop%20logo%20candy&image_size=square',
          applyTime: '1小时前'
        }
      ],
      recentLogs: [
        { type: 'success', icon: 'el-icon-check', text: '审核通过商家「美味餐厅」', time: '10分钟前' },
        { type: 'warning', icon: 'el-icon-alert', text: '用户「张三」登录异常', time: '25分钟前' },
        { type: 'info', icon: 'el-icon-edit', text: '修改系统配置参数', time: '1小时前' },
        { type: 'success', icon: 'el-icon-plus', text: '新增管理员账户', time: '2小时前' }
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
    goToBusiness() {
      this.$router.push('/business/businessManagerList')
    },
    goToBusinessDetail(id) {
      this.$router.push('/system/business/detail/' + id)
    },
    goToUsers() {
      this.$router.push('/system/user')
    },
    goToOrders() {
      this.$router.push('/system/order')
    },
    goToRevenue() {
      this.$router.push('/system/data')
    },
    goToLogs() {
      this.$router.push('/system/logs')
    },
    goToSettings() {
      this.$router.push('/system/settings')
    },
    goToData() {
      this.$router.push('/system/data')
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
  &.admin {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 20px;
  color: white;

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

  .system-status {
    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      font-size: 14px;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.online {
          background: #67c23a;
        }
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

      &.business {
        background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      }

      &.users {
        background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
      }

      &.orders {
        background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
      }

      &.revenue {
        background: linear-gradient(135deg, #f5222d 0%, #cf1322 100%);
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

  .business-section {
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
      color: #1890ff;
    }
  }

  .view-all {
    font-size: 13px;
    color: #1890ff;
    text-decoration: none;

    &:hover {
      color: #096dd9;
    }
  }
}

/* 商家列表 */
.business-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .business-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      background: #fafafa;
    }

    .business-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #f0f0f0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .business-info {
      flex: 1;

      .business-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
      }

      .business-contact {
        font-size: 13px;
        color: #666;
        margin-bottom: 3px;
      }

      .business-address {
        font-size: 12px;
        color: #999;
      }
    }

    .business-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;

      .apply-time {
        font-size: 12px;
        color: #999;
      }

      .status {
        font-size: 12px;
        padding: 3px 10px;
        border-radius: 12px;

        &.pending {
          background: #fff7e6;
          color: #e6a23c;
        }
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

        &.business {
          background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
        }

        &.users {
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
        }

        &.orders {
          background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
        }

        &.logs {
          background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
        }

        &.settings {
          background: linear-gradient(135deg, #13c2c2 0%, #08979c 100%);
        }

        &.data {
          background: linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%);
        }
      }

      span {
        font-size: 13px;
        color: #666;
      }
    }
  }
}

/* 系统状态 */
.system-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .system-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .system-stat {
      padding: 12px;
      background: #fafafa;
      border-radius: 8px;

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .status-badge {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 10px;

          &.online {
            background: #f0f9eb;
            color: #67c23a;
          }

          &.offline {
            background: #fff1f0;
            color: #f56c6c;
          }
        }
      }

      .stat-detail {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

/* 操作日志 */
.logs-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .logs-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .log-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: #f5f7fc;
      }

      .log-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        flex-shrink: 0;

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

      .log-content {
        flex: 1;

        .log-text {
          font-size: 13px;
          color: #333;
          margin-bottom: 2px;
        }

        .log-time {
          font-size: 11px;
          color: #999;
        }
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
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>