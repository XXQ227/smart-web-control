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
export async function addBusinessUnitAPI(body: APIManager.BU, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnit/addBusinessUnit`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 获取 业务单位属性 列表 */
export async function queryBusinessUnitPropertyAPI(body: APIManager.SearchBUParams, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/queryBusinessUnitProperty`, {
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

/** TODO: 新增业务单位属性 */
export async function addBusinessUnitPropertyAPI(body: APIManager.BUP, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/addBusinessUnitProperty`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑业务单位属性 */
export async function editBusinessUnitPropertyAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/editBusinessUnitProperty`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用或禁用业务单位属性 */
export async function operateBusinessUnitPropertyAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/operateBusinessUnitProperty`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增客户与付款方关联 */
export async function addPayCustomerAPI(body: APIManager.BUP, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/addPayCustomer`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 删除客户与付款方关联 */
export async function deletePayCustomerAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/deletePayCustomer`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 查询 业务单位属性信控信息 详情 */
export async function queryBusinessUnitPropertyCreditInfoAPI(body: any, options?: { [key: string]: any }) {
    return request(`/apiBase/businessUnitProperty/queryBusinessUnitPropertyCreditInfo`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}