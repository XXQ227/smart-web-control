import { request } from '@/utils/request';

/** 获取权限数据 */
export async function queryAuthResourceTreeAPI(body: APIManager.SearchAuthResourceParams, options?: { [key: string]: any }) {
  return request(`/apiBase/authResource/queryAuthResourceTree/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** add authResource */
export async function addAuthResourceAPI(body: APIManager.AuthResource, options?: { [key: string]: any }) {
  return request(`/apiBase/authResource/addAuthResource`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** edit authResource */
export async function editAuthResourceAPI(body: APIManager.AuthResource, options?: { [key: string]: any }) {
  return request(`/apiBase/authResource/editAuthResource`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** delete authResource */
export async function deleteAuthResourceAPI(body: APIManager.AuthResource, options?: { [key: string]: any }) {
  return request(`/apiBase/authResource/deleteAuthResource/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** 获取部门数据 */
export async function queryRoleAPI(body: APIManager.SearchRoleParams, options?: { [key: string]: any }) {
  return request(`/apiBase/role/queryRole`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** add role */
export async function addRoleAPI(body: APIManager.Role, options?: { [key: string]: any }) {
  return request(`/apiBase/role/addRole`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
/** edit authResource */
export async function editRoleAPI(body: APIManager.Role, options?: { [key: string]: any }) {
  return request(`/apiBase/role/editRole`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** delete authResource */
export async function deleteRoleAPI(body: APIManager.Role, options?: { [key: string]: any }) {
  return request(`/apiBase/role/deleteRole/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}