<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="overlay"></div>
      <div class="content">
        <div class="logo">
          <i class="el-icon-shop"></i>
        </div>
        <h1>欢迎来到</h1>
        <h2>JXXQZ 商家端</h2>
        <p class="subtitle">开启您的电商之旅</p>
        <div class="features">
          <div class="feature-item">
            <i class="el-icon-s-shop"></i>
            <span>轻松管理店铺</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-s-order"></i>
            <span>实时订单处理</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-s-data"></i>
            <span>数据分析洞察</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="login-header">
        <span>还没有账号？</span>
        <a href="javascript:void(0)" class="register" @click="goShop">
          立即开店
          <i class="el-icon-right"></i>
        </a>
      </div>
      <div class="login-form-wrapper">
        <div class="form-header">
          <h3 class="title">商家登录</h3>
          <p class="desc">登录您的商家账号</p>
        </div>
        <el-form ref="loginForm" size="medium" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
          <el-form-item prop="username">
            <el-input ref="username" size="medium" v-model="loginForm.username" type="text" autocomplete="off" placeholder="请输入您的账号" prefix-icon="el-icon-user">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input ref="password" size="medium" v-model="loginForm.password" type="password" auto-complete="off" show-password placeholder="请输入您的密码" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin">
            </el-input>
          </el-form-item>
          <div class="form-options">
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            <a href="javascript:void(0)" class="forgot-password">忘记密码？</a>
          </div>
          <el-form-item style="width:100%;">
            <el-button :loading="loading" round type="primary" class="login-btn" @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-footer">
          <p>其他登录方式</p>
          <div class="social-login">
            <a href="javascript:void(0)" class="social-item">
              <i class="el-icon-mobile-phone"></i>
            </a>
            <a href="javascript:void(0)" class="social-item">
              <i class="el-icon-message"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import msg  from '@/utils/alert'
  import { getCodeData } from '@/api/base'
  import Config from '@/settings'
  import Cookies from 'js-cookie'
  export default {
    name: 'Login',
    data() {
      return {
        codeUrl: '',
        captchaId: '',
        cookiePass: '',
        loginForm: {
          username: 'admin', // admin
          password: 'jxxqz123', // 123456
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
          code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        },
        loading: false,
        redirect: undefined,
        request: false
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // 获取验证码
      // this.getCode()
      // 获取用户名密码等Cookie
      this.getCookie()
      // token 过期提示
      this.point()
    },
    methods: {
      async getCode() {
        this.request = false
        const res = await getCodeData();
        this.codeUrl =res;
        this.request = true
      },
      getCookie() {
        const username = Cookies.get('username')
        let password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        // 保存cookie里面的加密后的密码
        this.cookiePass = password === undefined ? '' : password
        password = password === undefined ? this.loginForm.password : password
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password,
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
          code: ''
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            rememberMe: this.loginForm.rememberMe,
            code: this.loginForm.code,
            uuid: this.loginForm.uuid
          }
          if (valid) {
            this.loading = true
            if (user.rememberMe) {
              Cookies.set('username', user.username, { expires: Config.passCookieExpires })
              Cookies.set('password', user.password, { expires: Config.passCookieExpires })
              Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store.dispatch('Login', user).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            }).catch(error => {
              console.log(error);
              msg.alert('账号密码错误，请重新登录','error');
              this.loading = false
              // this.getCode()
            })
          } else {
            return false
          }
        })
      },
      point() {
        const point = Cookies.get('point') !== undefined
        if (point) {
          this.$notify({
            title: '提示',
            message: '当前登录状态已过期，请重新登录！',
            type: 'warning',
            duration: 5000
          })
          Cookies.remove('point')
        }
      },
      // 去开店
      goShop() {
        // 解析当前路由对象，获取完整的 href
        const href = this.$router.resolve({ path: '/merchantApplication' }).href;
        // 使用 _blank 打开新标签页
        window.open(href, '_blank');
    }
    }
  }
  </script>
  
  <style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.left-panel {
  width: 45%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/><circle cx="80" cy="80" r="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/></svg>');
    background-size: 200px;
    opacity: 0.3;
  }
  
  .content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
    padding: 40px;
    
    .logo {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px;
      backdrop-filter: blur(10px);
      
      i {
        font-size: 40px;
        color: white;
      }
    }
    
    h1 {
      font-size: 32px;
      font-weight: 300;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    
    h2 {
      font-size: 42px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .subtitle {
      font-size: 18px;
      opacity: 0.8;
      margin-bottom: 50px;
    }
    
    .features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .feature-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        padding: 15px 25px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }
        
        i {
          font-size: 24px;
        }
        
        span {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}

.right-panel {
  width: 55%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  
  .login-header {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 50px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    span {
      color: #666;
      font-size: 14px;
    }
    
    .register {
      color: #667eea;
      font-weight: 500;
      margin-left: 5px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      
      &:hover {
        color: #764ba2;
        
        i {
          transform: translateX(3px);
        }
      }
      
      i {
        transition: transform 0.3s ease;
      }
    }
  }
  
  .login-form-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    
    .form-header {
      text-align: center;
      margin-bottom: 40px;
      
      .title {
        font-size: 32px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
      }
      
      .desc {
        font-size: 16px;
        color: #999;
      }
    }
    
    .login-form {
      width: 100%;
      max-width: 400px;
      
      .el-form-item {
        margin-bottom: 25px;
      }
      
      .el-input {
        ::v-deep .el-input__inner {
          height: 50px;
          border-radius: 10px;
          border: 2px solid #e8e8e8;
          padding-left: 45px;
          font-size: 15px;
          transition: all 0.3s ease;
          
          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }
        
        ::v-deep .el-input__prefix {
          left: 15px;
          font-size: 18px;
          color: #999;
        }
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        
        .el-checkbox {
          ::v-deep .el-checkbox__label {
            color: #666;
            font-size: 14px;
          }
        }
        
        .forgot-password {
          color: #667eea;
          font-size: 14px;
          transition: color 0.3s ease;
          
          &:hover {
            color: #764ba2;
          }
        }
      }
      
      .login-btn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        font-weight: 500;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
    
    .login-footer {
      margin-top: 40px;
      text-align: center;
      
      p {
        color: #999;
        font-size: 14px;
        margin-bottom: 20px;
      }
      
      .social-login {
        display: flex;
        justify-content: center;
        gap: 20px;
        
        .social-item {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          border: 2px solid #e8e8e8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          
          i {
            font-size: 20px;
            color: #666;
          }
          
          &:hover {
            border-color: #667eea;
            background: #667eea;
            
            i {
              color: white;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    min-height: 300px;
    
    .content {
      .features {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        
        .feature-item {
          flex: 0 0 auto;
          min-width: 200px;
        }
      }
    }
  }
  
  .right-panel {
    width: 100%;
    
    .login-form-wrapper {
      padding: 20px;
    }
  }
}
</style>
  