<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="overlay"></div>
      <div class="content">
        <div class="logo">
          <i class="el-icon-s-tools"></i>
        </div>
        <h1>欢迎来到</h1>
        <h2>JXXQZ 管理系统</h2>
        <p class="subtitle">专业的后台管理解决方案</p>
        <div class="features">
          <div class="feature-item">
            <i class="el-icon-s-grid"></i>
            <span>系统管理</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-s-custom"></i>
            <span>用户管理</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-s-data"></i>
            <span>数据分析</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-s-operation"></i>
            <span>权限控制</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="login-form-wrapper">
        <div class="form-header">
          <h3 class="title">管理员登录</h3>
          <p class="desc">登录您的管理账号</p>
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
          </div>
          <el-form-item style="width:100%;">
            <el-button :loading="loading" round type="primary" class="login-btn" @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { hashSync} from 'bcryptjs';
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
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
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
        // if (user.password !== this.cookiePass) {
        //   user.password =  hashSync(user.password,11);//encrypt(user.password)
        // }
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
            this.$store.dispatch('chat/initSocket');
          }).catch(error => {
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .left-panel {
    flex: 1;
    position: relative;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxwYXRoIGQ9Ik0gNTAgMCBMIDAgNTAgMCAwIFoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+') repeat;
    }

    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 0 40px;

      .logo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);

        i {
          font-size: 48px;
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
    width: 450px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);

    .login-form-wrapper {
      width: 100%;
      max-width: 380px;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

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
              border-color: #1e88e5;
              box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
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
        }

        .login-btn {
          width: 100%;
          height: 50px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e88e5 0%, #1976d2 100%);
          border: none;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(30, 136, 229, 0.3);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .login-container {
      flex-direction: column;
    }

    .left-panel {
      width: 100%;
      height: 40vh;
    }

    .right-panel {
      width: 100%;
      height: 60vh;
    }

    .right-panel .login-form-wrapper {
      padding: 30px;
    }
  }
</style>
