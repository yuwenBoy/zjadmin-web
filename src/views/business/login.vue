<template>
<div class="login-container">
        <div class="left-panel">
            <!-- 背景图 -->
            <h1>你好
                <br />欢迎来到JXXQZ 商家端</h1>
        </div>
        <div class="right-panel">
             <div class="login-header">
                <span>没有账号，</span> <a href="javascript:void(0)" class="register" @click="goShop">去开店</a>
             </div>
             <el-form ref="loginForm" size="medium" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
                <h3 class="title">JXXQZ 商家端登录</h3>
                <el-form-item prop="username">
                    <el-input ref="username" size="medium" v-model="loginForm.username" type="text" autocomplete="off" placeholder="请输入您的账号">
                        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input ref="password"  size="medium" v-model="loginForm.password" type="password" auto-complete="off" show-password placeholder="请输入您的密码" @keyup.enter.native="handleLogin">
                        <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">记住我</el-checkbox>
                <el-form-item style="width:100%;">
                <el-button :loading="loading" round type="primary"  @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                </el-form-item>
            </el-form>
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
  
  <style rel="stylesheet/scss" lang="scss">
  .login-container {
            display: flex;
            height: 100vh;
        }
        .left-panel {
            width: 30%;
            background-size: cover;
            background-position: center;
            h1{
                margin-top: 200px;
                color: #333333;
                text-align: left;
                font-weight: 400;
                padding-left: 50px;
                line-height: 50px;
            }
        }
        .right-panel {
            width: 70%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f9f9f9;
            .login-header{
                width: 100%;
                height: 50px;
                line-height: 50px;
                text-align: right;
                padding: 0 50px;
                .register{
                    color: #007BFF;
                }
                .register:hover{
                    color: #0056b3;
                }
            }
        }
        .login-form {
            padding-top: 80px;
            background: transparent;
            width: 300px;
        }
        .login-form h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        .login-form input {
            width: 100%;
        }
        .login-form button {
            width: 100%;
            padding: 10px;
            border: none;
            background-color: #007BFF;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
        }
        .login-form button:hover {
            background-color: #0056b3;
        }
  </style>
  