// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取所有 Dictionary 数据 */
export async function GetDictionaryList(body: APIManager.SearchDictionaryParams, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取 Dictionary 详情 */
export async function GetDictionaryInfo(body: { ID: number }, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取 Dictionary 详情 */
export async function addDictionaryAPI(body: APIManager.Dictionary, options?: { [key: string]: any }) {
  return request(`/apiBase/Dictionary/addDictionary`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

