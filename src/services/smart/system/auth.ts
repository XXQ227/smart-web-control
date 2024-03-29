import { request } from '@/utils/request';

/** 获取权限数据 */
export async function queryAuthResourceTreeAPI(body: APISystem.SearchAuthResourceParams) {
  return request(`/apiBase/authResource/queryAuthResourceTree/`, {
    method: 'POST',
    body
  });
}

/** add authResource */
export async function addAuthResourceAPI(body: APISystem.AuthResource) {
  return request(`/apiBase/authResource/addAuthResource`, {
    method: 'POST',
    body
  });
}

/** edit authResource */
export async function editAuthResourceAPI(body: APISystem.AuthResource) {
  return request(`/apiBase/authResource/editAuthResource`, {
    method: 'POST',
    body
  });
}

/** delete authResource */
export async function deleteAuthResourceAPI(body: APISystem.AuthResource) {
  return request(`/apiBase/authResource/deleteAuthResource/`, {
    method: 'POST',
    body
  });
}

/** 获取部门数据 */
export async function queryRoleAPI(body: APISystem.SearchRoleParams) {
  return request(`/apiBase/role/queryRole`, {
    method: 'POST',
    body
  });
}

/** add role */
export async function addRoleAPI(body: APISystem.Role) {
  return request(`/apiBase/role/addRole`, {
    method: 'POST',
    body
  });
}
/** 查询角色对应的权限详情 */
export async function queryRoleInfoAPI(body: APISystem.Role) {
  return request(`/apiBase/role/queryRoleInfo`, {
    method: 'POST',
    body
  });
}
/** edit authResource */
export async function editRoleAPI(body: APISystem.Role) {
  return request(`/apiBase/role/editRole`, {
    method: 'POST',
    body
  });
}

/** delete authResource */
export async function deleteRoleAPI(body: APISystem.Role) {
  return request(`/apiBase/role/deleteRole/`, {
    method: 'POST',
    body
  });
}

/** delete authResource */
export async function operateRoleAPI(body: APISystem.Role) {
  return request(`/apiBase/role/operateRole`, {
    method: 'POST',
    body
  });
}

/** 查询用户对应角色和角色列表
 POST /base/web/role/queryRoleByUser
 接口ID：122434839
 接口地址：https://app.apifox.com/link/project/2684231/apis/api-122434839 */
export async function queryRoleByUserAPI(body: APISystem.Role) {
  return request(`/apiBase/role/queryRoleByUser`, {
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