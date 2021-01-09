'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 3500,
        open:true,
        proxy: {
            '/jxxqz': {
                target: 'http://127.0.0.1:9000', // 请求本地 需要jxxqz后端项目
                ws: true
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: '123',
        resolve: {
            alias: {
                '@': resolve('src'),
                '@crud': resolve('src/components/Crud')
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
       // config.entry('main').add('babel-polyfill')
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end()
        config.module.rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options=>{
          options.compilerOptions.preserveWhitespace=true
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
    },
    transpileDependencies: []
}
