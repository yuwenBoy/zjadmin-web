'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
function resolve(dir) {
  return path.join(__dirname, dir)
}

console.log(`项目当前环境:${process.env.NODE_ENV}`)
const system_name = defaultSettings.title
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  devServer: {
    host: '127.0.0.1',
    port: 3500,
    open: false,
    proxy: {
      [`/${process.env.VUE_APP_BASEURL}`]: {
        target: process.env.VUE_APP_URL, // 请求本地 需要jxxqz后端项目
        ws: true
      }
    },
    hot: false,
    inline: false // ← 禁用 inline 模式
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: system_name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      preload: path.join(__dirname, 'preload.js'),
      mainProcessFile: 'main.js',
      // 额外复制 preload 文件
      // builderOptions: {
      //   extraResources: [
      //     {
      //       from: 'preload.js',
      //       to: 'preload.js'
      //     }
      //   ]
      // }
    }
  },
  chainWebpack(config) {
    // config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // config.entry('main').add('babel-polyfill')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      // 生产环境移除所有 HMR 相关代码
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('hmr')
    }
  },
  transpileDependencies: []
}
