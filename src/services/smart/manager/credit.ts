import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取所有 Credit Control 数据 */
export async function queryCreditControlAPI(body: APIManager.SearchCreditParams) {
  return request(`/apiBase/creditControl/queryCreditControl/`, {
    method: 'POST',
    body,
  });
}

/** 获取 Credit Control 详情 */
export async function addCreditControlAPI(body: APIManager.Credit) {
  return request(`/apiBase/creditControl/addCreditControl/`, {
    method: 'POST',
    body,
  });
}

/** 查询 Credit Control */
export async function queryCreditControlInfoAPI(body: APIManager.Credit) {
  return request(`/apiBase/creditControl/queryCreditControlInfo/`, {
    method: 'POST',
    body,
  });
}

/** edit Credit Control */
export async function editCreditControlAPI(body: APIManager.Credit) {
  return request(`/apiBase/creditControl/editCreditControl/`, {
    method: 'POST',
    body
  });
}

/** delete Credit Control */
export async function deleteCreditControlAPI(body: APIManager.Credit) {
  return request(`/apiBase/creditControl/deleteCreditControl?${stringify(body)}`, {
    method: 'POST',
  });
}


/** Freezen Credit Control */
export async function operateCreditControlAPI(body: APIManager.Credit) {
  return request(`/apiBase/creditControl/operateCreditControl`, {
    method: 'POST',
    body,
  });
}

