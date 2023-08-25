import { request } from '@/utils/request';

/** 获取权限数据 */
export async function queryAuthResourceTreeAPI(body: APIManager.SearchAuthResourceParams) {
  return request(`/apiBase/authResource/queryAuthResourceTree/`, {
    method: 'POST',
    body
  });
}

/** add authResource */
export async function addAuthResourceAPI(body: APIManager.AuthResource) {
  return request(`/apiBase/authResource/addAuthResource`, {
    method: 'POST',
    body
  });
}

/** edit authResource */
export async function editAuthResourceAPI(body: APIManager.AuthResource) {
  return request(`/apiBase/authResource/editAuthResource`, {
    method: 'POST',
    body
  });
}

/** delete authResource */
export async function deleteAuthResourceAPI(body: APIManager.AuthResource) {
  return request(`/apiBase/authResource/deleteAuthResource/`, {
    method: 'POST',
    body
  });
}

/** 获取部门数据 */
export async function queryRoleAPI(body: APIManager.SearchRoleParams) {
  return request(`/apiBase/role/queryRole`, {
    method: 'POST',
    body
  });
}

/** add role */
export async function addRoleAPI(body: APIManager.Role) {
  return request(`/apiBase/role/addRole`, {
    method: 'POST',
    body
  });
}
/** edit authResource */
export async function editRoleAPI(body: APIManager.Role) {
  return request(`/apiBase/role/editRole`, {
    method: 'POST',
    body
  });
}

/** delete authResource */
export async function deleteRoleAPI(body: APIManager.Role) {
  return request(`/apiBase/role/deleteRole/`, {
    method: 'POST',
    body
  });
}

/** 切换公司组织 */
export async function iamUserOrganizationConvertAPI(body: any) {
  return request(`/apiAuth/iamUserOrganizationConvert/`, {
    method: 'POST',
    body,
  });
}