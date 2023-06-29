import { request } from '@/utils/request';

/** 获取费用模板数据 */
export async function queryChargeTemplateAPI(body: APIManager.SearchCGTempParams) {
  return request(`/apiBase/chargeTemplate/queryChargeTemplate/`, {
    method: 'POST',
    body,
  });
}

/** 新增费目模板*/
export async function addChargeTemplateAPI(body: APIManager.CGTemp) {
  return request(`/apiBase/chargeTemplate/addChargeTemplate/`, {
    method: 'POST',
    body,
  });
}

/** 查询费目模板详细信息*/
export async function queryChargeTemplateInfoAPI(body: APIManager.CGTemp) {
  return request(`/apiBase/chargeTemplate/queryChargeTemplateInfo/`, {
    method: 'POST',
    body,
  });
}

/** 获取费用模板数据 */
export async function editChargeTemplateAPI(body: APIManager.CGTemp) {
  return request(`/apiBase/chargeTemplate/editChargeTemplate/`, {
    method: 'POST',
    body,
  });
}

/** 获取费用模板数据 */
export async function deleteChargeTemplateAPI(body: APIManager.CGTemp) {
  return request(`/apiBase/chargeTemplate/deleteChargeTemplate/`, {
    method: 'POST',
    body,
  });
}

/** 获取费用模板数据 */
export async function operateChargeTemplateAPI(body: APIManager.CGTemp) {
  return request(`/apiBase/chargeTemplate/operateChargeTemplate/`, {
    method: 'POST',
    body,
  });
}
