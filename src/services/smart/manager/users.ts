// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取部门数据 */
export async function queryUser(body: APIManager.SearchUserParams, options?: { [key: string]: any }) {
  return request(`/api/manage/web/user/queryUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
