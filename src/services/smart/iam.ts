// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

export async function iamAccessedAppsAPI(body: any) {
  return request(`/apiIAM/iam-external/accessed-apps/`, {
    method: 'POST',
    body
  });
}
export async function mdmAppsAPI(body: any) {
  return request(`/apiIAM/iam-external/mdm-apps/`, {
    method: 'POST',
    body
  });
}
export async function getManagerUserByAppIdAPI(body: any) {
  return request(`/apiIAM/iam-external/getManagerUserByAppId/${body}`, {
    method: 'GET',
  });
}
/** 获取当前的用户 GET /api/currentUser */
export async function getAdminUserListBySystemCodeListAPI(body: any) {
  return request(`/apiIAM/iam-external/application/getAdminUserListBySystemCodeList`, {
    method: 'POST',
    body
  });
}
