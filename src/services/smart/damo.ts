// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取当前的用户 GET /api/currentUser */
export async function GetCTPByStr(body: any, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

