// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取部门数据 */
export async function queryUser(body: APIManager.SearchUserParams, options?: { [key: string]: any }) {
  return request(`/apiBase/user/queryUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
