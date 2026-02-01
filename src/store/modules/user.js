import { login, getUserInfo, logout } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/storage'
import router from '@/router/routers'
const user = {
    state: {
        token: getToken(),
        user: {},
        roles: [],
        // 第一次加载菜单时用到
        loadMenus: false
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_LOAD_MENUS: (state, loadMenus) => {
            state.loadMenus = loadMenus
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const rememberMe = userInfo.rememberMe;
            return new Promise((resolve, reject) => {
                login(userInfo).then(async res => {
                       let data = res.result;
                       let userType = data.user.userType;
                         if(window.electronAPI){
                            // ✅ 保存 Token 到主进程
                            window.electronAPI.setToken(data.accessToken)
                            const config = await window.electronAPI.getAppConfig()
                            console.log('✅ [Login.vue] 重新获取配置确认:', config.token ? 'Token 存在' : 'Token 仍为空')
                         }
                        setToken(data.accessToken,data.refreshToken)
                        if(userType==2){
                            router.push('/BDashboard');
                        }else{
                             router.push('/');
                        }
                        commit('SET_TOKEN',data.accessToken)
                        setUserInfo(data, commit)
                        // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                        commit('SET_LOAD_MENUS', true);
                        commit('settings/CHANGE_SETTING', { key: 'tagsView', value: userType==1?true:false });
                        resolve();
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    setUserInfo(res.result, commit)
                    resolve(res.result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    logOut(commit)
                    resolve()
                }).catch(error => {
                    logOut(commit)
                    reject(error)
                })
            })
        },

        updateLoadMenus({ commit }) {
            return new Promise((resolve, reject) => {
                commit('SET_LOAD_MENUS', false)
            })
        }
    }
}

export const logOut = async (commit) => {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    if (window.electronAPI) {
        const result = await window.electronAPI.removeToken()
        console.log('✅ [Logout.vue] 主进程 Token 已清除:', result)
    }
    removeToken()
}

export const setUserInfo = (res, commit) => {
    // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
    if (res.roles.length === 0) {
        commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
    } else {
        commit('SET_ROLES', res.roles)
    }
    commit('SET_USER', res.user)
}

export default user