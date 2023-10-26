// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
//region 字典类型表
/** 获取所有 Dictionary 数据 */
export async function queryDictAPI(body: APISystem.SearchDictParams, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Add Dict  */
export async function addDictAPI(body: APISystem.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/addDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Get Dict Information  */
export async function queryDictInfoAPI(body: APISystem.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDictInfo/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Edit Dict */
export async function editDictAPI(body: APISystem.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/editDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete Dict */
export async function deleteDictAPI(body: APISystem.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/deleteDict/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Enable/Disable Dict */
export async function operateDictAPI(body: APISystem.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/operateDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

//region 字典详情表
/** 获取所有 Dictionary 数据 */
export async function queryDictDetailAPI(body: APISystem.SearchDictDetailParams, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Add DictDetail  */
export async function addDictDetailAPI(body: APISystem.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/addDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Edit DictDetail */
export async function editDictDetailAPI(body: APISystem.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/editDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete DictDetail */
export async function deleteDictDetailAPI(body: APISystem.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/deleteDictDetail/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Enable/Disable DictDetail */
export async function operateDictDetailAPI(body: APISystem.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/operateDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

