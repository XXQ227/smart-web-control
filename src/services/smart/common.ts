// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取字典通用接口 */
export async function queryDictCommonAPI(body: {dictCodes: string}) {
  return request(`/apiBase/dict/queryDictCommon`, {
    method: 'POST',
    body
  });
}

/** 获取字典详情通用接口 */
export async function queryDictDetailCommonAPI(body: any) {
  return request(`/apiBase/dict/queryDictDetailCommon`, {
    method: 'POST',
    body
  });
}

