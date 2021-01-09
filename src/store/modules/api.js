// 统一请求路径前缀
let baseUrl = 'jxxqz'
const api = {
    state: {
        // 部署包上传
        deployUploadApi: baseUrl + '/api/deploy/upload',
        // SQL脚本上传
        databaseUploadApi: baseUrl + '/api/database/upload',
        // 实时控制台
        socketApi: baseUrl + '/websocket?token=kl',
        // 图片上传
        imagesUploadApi: baseUrl + '/api/pictures',
        // 上传头像
        uploadAvatarApi: baseUrl + '/api/user/uploadAvatar',
        // 上传文件到七牛云
        qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
        // Sql 监控
        sqlApi: baseUrl + '/druid/index.html',
        // swagger
        swaggerApi: baseUrl + '/swagger-ui.html',
        // 文件上传
        fileUploadApi: baseUrl + '/api/localStorage',
        // baseUrl，
        baseApi: baseUrl
    }
}

export default api