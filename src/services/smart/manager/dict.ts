// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'qs'
//region 字典类型表
/** 获取所有 Dictionary 数据 */
export async function queryDictAPI(body: APIManager.SearchDictParams, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Add Dict  */
export async function addDictAPI(body: APIManager.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/addDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Get Dict Information  */
export async function queryDictInfoAPI(body: APIManager.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDictInfo?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** Edit Dict */
export async function editDictAPI(body: APIManager.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/editDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete Dict */
export async function deleteDictAPI(body: APIManager.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/deleteDict?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** Enable/Disable Dict */
export async function operateDictAPI(body: APIManager.Dict, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/operateDict`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

//region 字典详情表
/** 获取所有 Dictionary 数据 */
export async function queryDictDetailAPI(body: APIManager.SearchDictDetailParams, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/queryDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Add DictDetail  */
export async function addDictDetailAPI(body: APIManager.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/addDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Edit DictDetail */
export async function editDictDetailAPI(body: APIManager.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/editDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete DictDetail */
export async function deleteDictDetailAPI(body: APIManager.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/deleteDictDetail?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** Enable/Disable DictDetail */
export async function operateDictDetailAPI(body: APIManager.DictDetail, options?: { [key: string]: any }) {
  return request(`/apiBase/dict/operateDictDetail`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
//endregion

