// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

export async function iamUserLogInAPI(body: any) {
  return request(`/apiBase/IAMAuth/iamUserLogIn`, {
    method: 'POST',
    body
  });
}
