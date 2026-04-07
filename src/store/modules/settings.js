import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

// 从本地存储中读取设置，如果没有则使用默认值
const getLocalSetting = (key, defaultValue) => {
  const value = localStorage.getItem(`JXXQZ_SETTING_${key}`);
  return value !== null ? JSON.parse(value) : defaultValue;
};

const state = {
    theme: getLocalSetting('theme', variables.theme),
    showSettings: getLocalSetting('showSettings', false),
    tagsView: getLocalSetting('tagsView', tagsView),
    fixedHeader: getLocalSetting('fixedHeader', fixedHeader),
    sidebarLogo: getLocalSetting('sidebarLogo', sidebarLogo),
    uniqueOpened: getLocalSetting('uniqueOpened', uniqueOpened),
    showFooter: getLocalSetting('showFooter', showFooter),
    footerTxt: getLocalSetting('footerTxt', footerTxt),
    caseNumber: getLocalSetting('caseNumber', caseNumber)
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
            // 将设置保存到本地存储
            localStorage.setItem(`JXXQZ_SETTING_${key}`, JSON.stringify(value));
        }
    }
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}