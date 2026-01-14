import request from '@/utils/request'

/**
 * 查询积分列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.memberId] - 会员ID（可选）
 * @returns {Promise<{total: number, list: Array}>} 积分列表数据
 */
export function fetchList(params) {
  return request({
    url:'/admin/integration/list',
    method:'get',
    params
  })
}

/**
 * 增加积分
 * @param {Object} data - 积分数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.sourceType - 来源类型
 * @returns {Promise<Object>} 操作结果
 */
export function addIntegration(data) {
  return request({
    url:'/admin/integration/add',
    method:'post',
    data
  })
}

/**
 * 减少积分
 * @param {Object} data - 积分数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.sourceType - 来源类型
 * @returns {Promise<Object>} 操作结果
 */
export function reduceIntegration(data) {
  return request({
    url:'/admin/integration/reduce',
    method:'post',
    data
  })
}

/**
 * 赠送积分
 * @param {Object} data - 积分数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.sourceType - 来源类型
 * @returns {Promise<Object>} 操作结果
 */
export function giftIntegration(data) {
  return request({
    url:'/admin/integration/gift',
    method:'post',
    data
  })
}

/**
 * 查询冻结详情
 * @param {string} memberId - 会员ID
 * @returns {Promise<Array>} 冻结详情列表
 */
export function fetchFreezeList(memberId) {
  return request({
    url:`/admin/integration/freeze/${memberId}`,
    method:'get'
  })
}

/**
 * 查询积分历史
 * @param {string} memberId - 会员ID
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<{total: number, list: Array}>} 积分历史数据
 */
export function fetchHistory(memberId, params) {
  return request({
    url:`/admin/integration/history/${memberId}`,
    method:'get',
    params
  })
}

/**
 * 冻结积分
 * @param {Object} data - 冻结数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.note - 备注
 * @returns {Promise<Object>} 操作结果
 */
export function freezeIntegration(data) {
  return request({
    url:'/admin/integration/freeze',
    method:'post',
    data
  })
}

/**
 * 解冻扣减积分
 * @param {Object} data - 扣减数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.note - 备注
 * @returns {Promise<Object>} 操作结果
 */
export function deductIntegration(data) {
  return request({
    url:'/admin/integration/deduct',
    method:'post',
    data
  })
}

/**
 * 释放积分
 * @param {Object} data - 释放数据
 * @param {string} data.memberId - 会员ID
 * @param {number} data.integration - 积分数量
 * @param {string} data.note - 备注
 * @returns {Promise<Object>} 操作结果
 */
export function releaseIntegration(data) {
  return request({
    url:'/admin/integration/release',
    method:'post',
    data
  })
}
