// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取费用模板数据 */
export async function GetCGTempList(body: APIManager.SearchCGTempParams, options?: { [key: string]: any }) {
  return request(`/api/CGTemp/GetCGTempList?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/**
 * 获得明细
 * @param params
 * @param options
 */
export async function GetVOByID(params: APIManager.CGTempByIDParams, options?: { [key: string]: any }) {
  return request(`/api/CGTemp/GetVOByID?${stringify(params)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获得明细
 * @param params
 * @param options
 */
export async function DelTempByID(params: {ID: number}, options?: { [key: string]: any }) {
  return request(`/api/CGTemp/DelTempByID?${stringify(params)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 获得明细
 * @param params
 * @param options
 */
export async function SaveCGTemp(params: APIManager.SaveCGItem, options?: { [key: string]: any }) {
  return request(`/api/CGTemp/SaveCGTemp`, {
    method: 'POST',
    body: {
      ...params,
    },
    ...(options || {}),
  });
}

