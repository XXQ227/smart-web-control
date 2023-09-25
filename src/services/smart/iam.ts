// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

export async function iamUserLogInAPI(body: any) {
  return request(`/apiBase/IAMAuth/iamUserLogIn`, {
    method: 'POST',
    body
  });
}

// TODO: 退出登录
//   POST /auth/iam/logout
//   API ID:95955722
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-95955722
export async function logoutAPI(body: any) {
  return request(`/auth/iam/logout`, {
    method: 'POST',
    body
  });
}
