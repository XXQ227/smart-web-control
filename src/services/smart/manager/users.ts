// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取部门数据 */
export async function queryUserAPI(body: APIManager.SearchUserParams, options?: { [key: string]: any }) {
  return request(`/apiBase/user/queryUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** add user */
export async function addUserAPI(body: APIManager.User, options?: { [key: string]: any }) {
  return request(`/apiBase/user/addUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** edit user */
export async function editUserAPI(body: APIManager.User, options?: { [key: string]: any }) {
  return request(`/apiBase/user/editUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** delete user */
export async function deleteUserAPI(body: APIManager.User, options?: { [key: string]: any }) {
  return request(`/apiBase/user/deleteUser/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** freezen user */
export async function operateUserAPI(body: APIManager.User, options?: { [key: string]: any }) {
  return request(`/apiBase/user/operateUser`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Update user password */
export async function modifyPwdAPI(body: APIManager.User, options?: { [key: string]: any }) {
  return request(`/apiBase/user/modifyPwd`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
