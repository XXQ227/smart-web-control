// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'qs'
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

