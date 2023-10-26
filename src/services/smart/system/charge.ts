// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

//region TODO: 标准科目
/** 查询标准费目列表 */
export async function queryChargeStandardAPI(body: APISystem.SearchCGItemParams, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/queryChargeStandard/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 新增标准费目 */
export async function addChargeStandardAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/addChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 查询标准费目详情 */
export async function queryChargeStandardInfoAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/queryChargeStandardInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 编辑标准费目 */
export async function editChargeStandardAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/editChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 删除费目 */
export async function deleteChargeStandardAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/deleteChargeStandard/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 启用禁用标准费目 */
export async function operateChargeStandardAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeStandard/operateChargeStandard`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

/** 查询标准费目列表 */
export async function queryChargeItemAPI(body: APISystem.SearchCGItemParams, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/queryChargeItem/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 新增标准费目 */
export async function addChargeItemAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/addChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 查询标准费目详情 */
export async function queryChargeItemInfoAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/queryChargeItemInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 编辑标准费目 */
export async function editChargeItemAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/editChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 删除费目 */
export async function deleteChargeItemAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/deleteChargeItem/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 启用禁用标准费目 */
export async function operateChargeItemAPI(body: APISystem.CGItem, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeItem/operateChargeItem`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

