import { getRequest, postRequest } from '@/utils/axios'

export function add(params) {
  return postRequest('/api/advertisement/add', params)
}

export function edit(params) {
  return postRequest('/api/advertisement/edit', params)
}

export function del(params) {
  return postRequest('/api/advertisement/delete', params)
}

export default { add, edit, del }
