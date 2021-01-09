import { getNoAuthRequest, postNoAuthRequest, getRequest } from '@/utils/axios'
class Users{
    list(params){
      return getNoAuthRequest("/common/captcha/code", params)
    }yo
}
export default{
  users:new Users()
}
