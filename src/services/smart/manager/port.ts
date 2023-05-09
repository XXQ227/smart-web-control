// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取当前的用户 GET /api/currentUser */
export async function GetPortList(body: APIModel.SearchPortParams, options?: { [key: string]: any }) {
  return request(`/api/Port/GetPortList?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取当前的用户 GET /api/currentUser */
export async function GetPortByID(body: { ID: number }, options?: { [key: string]: any }) {
  return request(`/api/Port/GetPortByID?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

