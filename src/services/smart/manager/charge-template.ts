import { request } from '@/utils/request';

/** 获取费用模板数据 */
export async function queryChargeTemplateAPI(body: APIManager.SearchCGTempParams, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/queryChargeTemplate/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 新增费目模板*/
export async function addChargeTemplateAPI(body: APIManager.CGTemp, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/addChargeTemplate/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 查询费目模板详细信息*/
export async function queryChargeTemplateInfoAPI(body: APIManager.CGTemp, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/queryChargeTemplateInfo/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 获取费用模板数据 */
export async function editChargeTemplateAPI(body: APIManager.CGTemp, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/editChargeTemplate/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 获取费用模板数据 */
export async function deleteChargeTemplateAPI(body: APIManager.CGTemp, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/deleteChargeTemplate/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 获取费用模板数据 */
export async function OperateChargeTemplateAPI(body: APIManager.CGTemp, options?: { [key: string]: any }) {
  return request(`/apiBase/chargeTemplate/operateChargeTemplate/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
