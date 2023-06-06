// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

//region TODO: 标准科目
/** 查询标准费目列表 */
export async function queryChargeStandardAPI(body: APIManager.SearchCGItemParams, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/queryChargeStandard/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 新增标准费目 */
export async function addChargeStandardAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/addChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 查询标准费目详情 */
export async function queryChargeStandardInfoAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/queryChargeStandardInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 编辑标准费目 */
export async function editChargeStandardAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/editChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 删除费目 */
export async function deleteChargeStandardAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/deleteChargeStandard?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 启用禁用标准费目 */
export async function OperateChargeStandardAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/OperateChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

/** 查询标准费目列表 */
export async function queryChargeItemAPI(body: APIManager.SearchCGItemParams, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/queryChargeItem/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 新增标准费目 */
export async function addChargeItemAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/addChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 查询标准费目详情 */
export async function queryChargeItemInfoAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/queryChargeItemInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 编辑标准费目 */
export async function editChargeItemAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/editChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 删除费目 */
export async function deleteChargeItemAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/deleteChargeItem?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 启用禁用标准费目 */
export async function OperateChargeItemAPI(body: APIManager.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/OperateChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

