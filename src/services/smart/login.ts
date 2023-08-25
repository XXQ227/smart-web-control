// @ts-ignore
import {stringify} from "querystring";
import {request} from '@/utils/request'

export async function loginSmart(body: API.LoginParams) {
  return request(`/apiLocal/User/Login?${stringify(body)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // data: body,
  });
}
export async function loginIAM(body: API.LoginParams) {
  return request(`/apiIAM/User/Login?${stringify(body)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // data: body,
  });
}


/** 登录接口 POST /api/login/outLogin */
export async function iamUserLogInAPI(body: any) {
  return request('/apiBase/IAMAuth/iamUserLogIn/', {
    method: 'POST',
    body,
  });
}
