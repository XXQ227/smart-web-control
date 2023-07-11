// @ts-ignore
import {stringify} from "querystring";
import {request} from '@/utils/request'

export async function loginSmart(body: API.LoginParams, options?: { [key: string]: any }) {
  return request(`/apiLocal/User/Login?${stringify(body)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // data: body,
    ...(options || {}),
  });
}
export async function loginIAM(body: API.LoginParams, options?: { [key: string]: any }) {
  return request(`/apiIAM/User/Login?${stringify(body)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // data: body,
    ...(options || {}),
  });
}

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFakeCaptchaParams,
  options?: { [key: string]: any },
) {
  return request('/api/login/captcha', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
