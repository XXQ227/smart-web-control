// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取当前的用户 GET /api/currentUser */
export async function GetAPList(body: APIManager.SearchAccountParams, options?: { [key: string]: any }) {
  return request(`/api/AccountPeriod/GetAPList?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取当前的用户 GET /api/currentUser */
export async function GetDetailByID(body: { ID: number, UserID: number }, options?: { [key: string]: any }) {
  return request(`/api/AccountPeriod/GetDetailByID?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

