import { postRequest } from '@/utils/axios'

export function add(params) {
  return postRequest('/api/news/add', params)
}

export function edit(params) {
  return postRequest('/api/news/edit', params)
}

export function del(params) {
  return postRequest('/api/news/delete', params)
}

export function submitApply(params) {
  return postRequest('/api/news/submitApply', params)
}

export default { add, edit, del }
