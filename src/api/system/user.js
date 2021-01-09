import { postRequest } from '@/utils/axios'

export function add(params) {
    return postRequest("/api/user/add", params)
}

export function edit(params) {
    return postRequest("/api/user/edit", params)
}

export function del(params) {
    return postRequest("/api/user/delete", params)
}

export function setRoles(params) {
    return postRequest("/api/user/setRoles", params)
}

export default { add, edit, del }