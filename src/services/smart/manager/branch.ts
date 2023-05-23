// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取所有 branch 数据 */
export async function GetBranchList(body: APIManager.SearchBranchParams, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取 branch 详情 */
export async function GetBranchInfo(body: { ID: number }, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

