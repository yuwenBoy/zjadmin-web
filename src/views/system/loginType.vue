 <template>
  <div class="login-select-container">
    <!-- 背景装饰元素 -->
    <div class="decor-circle circle-1"></div>
    <div class="decor-circle circle-2"></div>
    <div class="decor-circle circle-3"></div>

    <!-- 登录选择卡片（带入场动画） -->
    <transition name="card-fade">
      <div class="login-select-card">
        <!-- Logo/标题区域 -->
        <div class="login-header">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <i class="el-icon-s-data"></i>
            </div>
          </div>
          <h2 class="main-title">欢迎登录管理系统</h2>
          <p class="sub-title">请选择您的登录身份</p>
        </div>

        <!-- 选择按钮区域 -->
        <div class="login-btn-group">
          <!-- 商家登录卡片按钮 -->
          <div class="login-card-item" @click="goToMerchantLogin">
            <div class="card-icon merchant-icon">
              <i class="el-icon-user-solid"></i>
            </div>
            <h3>商家登录</h3>
            <p>店铺运营管理</p>
            <div class="card-arrow">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>

          <!-- 平台管理员登录卡片按钮 -->
          <div class="login-card-item" @click="goToAdminLogin">
            <div class="card-icon admin-icon">
              <i class="el-icon-s-tools"></i>
            </div>
            <h3>平台管理员登录</h3>
            <p>系统后台管理</p>
            <div class="card-arrow">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>

        <!-- 底部版权信息 -->
        <div class="login-footer">
          <span>© 2026 管理系统 版权所有</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'LoginSelectPage',
  data() {
    return {}
  },
  methods: {
    // 跳转到商家登录页
    goToMerchantLogin() {
      // 替换为你的商家登录页路由路径
      this.$router.push('/businessLogin')
    },

    // 跳转到平台admin登录页
    goToAdminLogin() {
      // 替换为你的平台admin登录页路由路径
      this.$router.push('/adminLogin')
    }
  },
}
</script>

<style scoped>
/* 页面整体容器 - 全屏居中 + 渐变背景 */
.login-select-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(120deg, #f0f9f4 0%, #e6f7ef 50%, #d7f2e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 背景装饰圆形 */
.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(54, 179, 126, 0.08);
  z-index: 0;
}
.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}
.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -150px;
}
.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
}

/* 卡片入场动画 */
.card-fade-enter-active {
  animation: cardFadeIn 0.6s ease-out;
}
@keyframes cardFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 登录选择卡片 */
.login-select-card {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 16px;
  padding: 50px 40px;
  box-shadow: 0 8px 32px rgba(54, 179, 126, 0.12);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 头部区域 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}
.logo-wrapper {
  margin-bottom: 20px;
}
.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #36b37e 0%, #26a69a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(54, 179, 126, 0.2);
}
.logo-icon i {
  font-size: 36px;
  color: #ffffff;
}
.main-title {
  color: #234e3f;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.sub-title {
  color: #6b8e80;
  font-size: 16px;
  margin: 0;
}

/* 按钮组容器 */
.login-btn-group {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}

/* 登录选项卡片 */
.login-card-item {
  flex: 1;
  padding: 30px 20px;
  border-radius: 12px;
  background: #f8fcf9;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}
.login-card-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(54, 179, 126, 0.05), transparent);
  transition: all 0.6s ease;
}
.login-card-item:hover {
  border-color: #36b37e;
  background: #ffffff;
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(54, 179, 126, 0.1);
}
.login-card-item:hover::before {
  left: 100%;
}

/* 选项卡片内元素 */
.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.merchant-icon {
  background: rgba(38, 166, 154, 0.1);
  color: #26a69a;
}
.admin-icon {
  background: rgba(54, 179, 126, 0.1);
  color: #36b37e;
}
.card-icon i {
  font-size: 28px;
}
.login-card-item h3 {
  color: #234e3f;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 8px 0;
}
.login-card-item p {
  color: #6b8e80;
  font-size: 14px;
  text-align: center;
  margin: 0 0 16px 0;
}
.card-arrow {
  text-align: center;
  color: #36b37e;
  opacity: 0.6;
  transition: all 0.3s ease;
}
.login-card-item:hover .card-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 底部版权 */
.login-footer {
  text-align: center;
  color: #99a9a0;
  font-size: 13px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .login-btn-group {
    flex-direction: column;
    gap: 16px;
  }
  .login-select-card {
    padding: 40px 25px;
  }
  .main-title {
    font-size: 24px;
  }
  .login-card-item {
    padding: 25px 15px;
  }
}
@media (max-width: 480px) {
  .login-select-card {
    padding: 30px 20px;
  }
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  .logo-icon i {
    font-size: 28px;
  }
  .main-title {
    font-size: 20px;
  }
}
</style>