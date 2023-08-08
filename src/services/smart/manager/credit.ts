import { request } from '@/utils/request';

/** TODO: 获取 未做信控客户 列表 */
export async function queryUnCreditControlAPI(body: APIManager.SearchCreditParams, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/queryUnCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 获取 信控 列表 */
export async function queryCreditControlAPI(body: APIManager.SearchCreditParams, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/queryCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 获取 信控 详情 */
export async function queryCreditControlInfoAPI(body: APIManager.Credit, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/queryCreditControlInfo/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 新增信控 */
export async function addCreditControlAPI(body: APIManager.Credit, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/addCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 编辑信控 */
export async function editCreditControlAPI(body: APIManager.Credit, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/editCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 删除信控 */
export async function deleteCreditControlAPI(body: APIManager.Credit, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/deleteCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 启用禁用信控 */
export async function operateCreditControlAPI(body: APIManager.Credit, options?: { [key: string]: any }) {
  return request(`/apiBase/creditControl/operateCreditControl`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}