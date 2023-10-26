import { request } from '@/utils/request';

/** TODO: 获取 公司 列表 */
export async function queryBranchAPI(body: APISystem.SearchBranchParams, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 获取 公司 详情 */
export async function queryBranchInfoAPI(body: APISystem.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranchInfo`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 新增公司 */
export async function addBranchAPI(body: APISystem.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/addBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 编辑公司 */
export async function editBranchAPI(body: APISystem.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/editBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 删除公司 */
export async function deleteBranchAPI(body: APISystem.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/deleteBranch/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** TODO: 启用禁用公司 */
export async function operateBranchAPI(body: APISystem.Branch, options?: { [key: string]: any }) {
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

