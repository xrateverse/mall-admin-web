import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/admin/caseCategory/list',
    method: 'get',
    params: params
  })
}

export function createCaseCategory(data) {
  return request({
    url: '/admin/caseCategory/create',
    method: 'post',
    data: data
  })
}

export function updateCaseCategory(id, data) {
  return request({
    url: '/admin/caseCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function getCaseCategory(id) {
  return request({
    url: '/admin/caseCategory/' + id,
    method: 'get'
  })
}

export function deleteCaseCategory(id) {
  return request({
    url: '/admin/caseCategory/delete/' + id,
    method: 'post'
  })
}

export function deleteBatch(data) {
  return request({
    url: '/admin/caseCategory/delete/batch',
    method: 'post',
    params: data
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/admin/caseCategory/update/showStatus',
    method: 'post',
    params: data
  })
}

export function fetchAllList() {
  return request({
    url: '/admin/caseCategory/listAll',
    method: 'get'
  })
}