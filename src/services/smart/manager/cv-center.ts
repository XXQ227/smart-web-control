// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取当前的用户 GET /api/currentUser */
export async function GetCTPByStr(body: APIManager.CVSearchParams, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr/`, {
    method: 'GET',
    body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function GetCTPByID(body: APIManager.CVSearchParams, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByID/`, {
    method: 'GET',
    body,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function UploadCTCenter(body: any, options?: { [key: string]: any }) {
  return request(`/api/CT/applyMerchantCenter/`, {
    method: 'GET',
    ...(options || {}),
  });
}

