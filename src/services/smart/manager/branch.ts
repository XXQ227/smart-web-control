import { request } from '@/utils/request';

/** TODO: 获取 公司 列表 */
export async function queryBranchAPI(body: APIManager.SearchBranchParams, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 获取 公司 详情 */
export async function queryBranchInfoAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranchInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 新增公司 */
export async function addBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/addBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 编辑公司 */
export async function editBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/editBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 删除公司 */
export async function deleteBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/deleteBranch/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 启用禁用公司 */
export async function operateBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/operateBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 查询公司原币到账单币汇率 */
export async function queryCurrentExRateByTwoCurrencyAsyncAPI(body: any, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryCurrentExRateByTwoCurrencyAsync`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

