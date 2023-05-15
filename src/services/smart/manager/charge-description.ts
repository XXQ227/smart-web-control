// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取所有的费目 */
export async function GetCGItem(body: APIManager.SearchCGItemParams, options?: { [key: string]: any }) {
  return request(`/api/CGItem/GetCGItem?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 创建和保存费目
 * @param params
 */
export async function CreateCargoCGItem(params: APIManager.CGItem) {
  return request(`/api/CGItem/CreateCargoCGItem/`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除费目
 * @param params
 */
export async function DeleteCGItem(params: APIManager.DeleteFreezenCGItem) {
  return request(`/api/CGItem/Delete?${stringify(params)}`, {
    method: 'POST',
  });
}

/**
 * 冻结、解冻费目
 * @param params
 */
export async function FreezenCGItem(params: APIManager.DeleteFreezenCGItem) {
  return request(`/api/CGItem/FreezenCGItem?${stringify(params)}`, {
    method: 'POST',
  });
}

