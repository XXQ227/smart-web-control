// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取部门数据 */
export async function queryUserAPI(body: APISystem.SearchUserParams) {
  return request(`/apiBase/user/queryUser`, {
    method: 'POST',
    body,
  });
}

/** add user */
export async function addUserAPI(body: APISystem.User) {
  return request(`/apiBase/user/addUser`, {
    method: 'POST',
    body,
  });
}

/** edit user */
export async function editUserAPI(body: APISystem.User) {
  return request(`/apiBase/user/editUser`, {
    method: 'POST',
    body,
  });
}

/** delete user */
export async function deleteUserAPI(body: APISystem.User) {
  return request(`/apiBase/user/deleteUser/`, {
    method: 'POST',
    body,
  });
}

/** freezen user */
export async function operateUserAPI(body: APISystem.User) {
  return request(`/apiBase/user/operateUser`, {
    method: 'POST',
    body,
  });
}

/** Update user password */
export async function modifyPwdAPI(body: APISystem.User) {
  return request(`/apiBase/user/modifyPwd`, {
    method: 'POST',
    body,
  });
}


/** Update user password */
export async function queryUserCommonAPI(body: APISystem.User) {
  return request(`/apiBase/user/queryUserCommon`, {
    method: 'POST',
    body,
  });
}
