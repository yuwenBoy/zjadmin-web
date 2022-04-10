import { Notification } from 'element-ui'

const success = function(title = '设置成功',timeout = 2000){
    Notification.success({
        title: title,
        duration: timeout
      })
}

const error = function(title = '设置',timeout = 2000){
    Notification.error({
        title: title,
        duration: timeout
      })
}

export default{
    success,
    error
}