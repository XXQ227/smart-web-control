// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取所有 branch 数据 */
export async function queryBranchAPI(body: APIManager.SearchBranchParams, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranch/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 获取 branch 详情 */
export async function queryBranchInfoAPI(body: {id: string}, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/queryBranchInfo/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Add Branch */
export async function addBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/addBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Edit Branch */
export async function editBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/editBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete Branch */
export async function deleteBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/deleteBranch/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Freezen Branch */
export async function operateBranchAPI(body: APIManager.Branch, options?: { [key: string]: any }) {
  return request(`/apiBase/branch/operateBranch`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

