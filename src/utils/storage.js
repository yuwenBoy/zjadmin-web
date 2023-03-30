import jwtDecode from "jwt-decode"
import AppStorageKey from '@/settings'
/**
 * 存储 token 顺带存储 refreshToken
 * token 过期后，会自动根据 refreshToken 刷新 token
 * 如果 refreshToken 过期则必须重新登录
 * @param token
 * @param refreshToken
 */
export function setToken (token, refreshToken) {
    sessionStorage.setItem(AppStorageKey.TOKEN, token)
    setRefreshToken(refreshToken)
    // 解析过期时间，设置过期
    const rtExp = (jwtDecode(refreshToken)).exp * 1000
    setRTExp(rtExp)
  }
  
  export function getToken () {
    console.log(AppStorageKey)
    return sessionStorage.getItem(AppStorageKey.TOKEN)
  }
  
  export function setRefreshToken (refreshToken) {
    sessionStorage.setItem(AppStorageKey.REFRESH_TOKEN, refreshToken)
  }
  
  export function getRefreshToken () {
    return sessionStorage.getItem(AppStorageKey.REFRESH_TOKEN)
  }
  
  export function setRTExp (exp) {
    sessionStorage.setItem(AppStorageKey.REFRESH_TOKEN_EXP, `${exp}`)
  }
  export function getRTExp () {
    const rtExpStr = sessionStorage.getItem(AppStorageKey.REFRESH_TOKEN_EXP)
    return rtExpStr ? Number(rtExpStr) : 0
  }

  export function removeToken() {
    return sessionStorage.removeItem(AppStorageKey.TOKEN);
  }
  
  export function clearAll () {
    sessionStorage.clear()
  }