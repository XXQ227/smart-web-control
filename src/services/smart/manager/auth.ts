import { request } from '@/utils/request';
import {stringify} from 'qs'

/** 获取部门数据 */
export async function queryAuthResourceTreeAPI(body: APIManager.SearchAuthResourceParams, options?: { [key: string]: any }) {
  return request(`/apiBase/authResource/queryAuthResourceTree`, {
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
  return request(`/apiBase/authResource/deleteAuthResource?${stringify(body)}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** freezen authResource */
export async function addRoleAPI(body: APIManager.AuthResource, options?: { [key: string]: any }) {
  return request(`/apiBase/role/addRole`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}