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
export async function addBusinessUnitAPI(body: APIManager.BUInfo, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnit/addBusinessUnit`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 获取 业务单位属性 列表 */
export async function queryBusinessUnitPropertyAPI(body: APIManager.SearchBUPParams, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/queryBusinessUnitProperty`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增业务单位属性 */
export async function addBusinessUnitPropertyAPI(body: APIManager.BUP, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/addBusinessUnitProperty`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 获取 业务单位属性 详情 */
export async function queryBusinessUnitPropertyInfoAPI(body: APIManager.BUP, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/queryBusinessUnitPropertyInfo`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

