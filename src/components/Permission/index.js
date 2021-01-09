import permission from './permission'
const install = function(Vue) {
    Vue.directive('authority', permission)
}
if (window.Vue) {
    window['authority'] = permission
    Vue.use(install)
}

permission.install = install

export default permission