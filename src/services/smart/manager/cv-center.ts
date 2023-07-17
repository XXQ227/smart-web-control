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





/** TODO: 新增业务单位 */
export async function addBusinessUnitAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnit/addBusinessUnit`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增业务单位 */
export async function queryBusinessUnitPropertyCreditInfoAPI(body: any, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/queryBusinessUnitPropertyCreditInfo`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}