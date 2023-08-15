import { request } from '@/utils/request';


// TODO: 查询账期列表
export async function queryAccountPeriodAPI(body: APIManager.SearchAccountParams, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/queryAccountPeriod`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

// TODO: 查询账期详情
export async function queryAccountPeriodInfoAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodInfo`, {
     method: 'POST',
    body,
    ...(options || {}),
  });
}

// TODO: 新增账期
export async function addAccountPeriodAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/addAccountPeriod`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 编辑账期
export async function editAccountPeriodAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/editAccountPeriod`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 开启账期
export async function openAccountPeriodAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/openAccountPeriod`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 开始关账
export async function startCloseAccountPeriodAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/startCloseAccountPeriod`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 结束关账
export async function endCloseAccountPeriodAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/endCloseAccountPeriod`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 通用账期查询
export async function queryAccountPeriodCommonAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodCommon`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

// TODO: 查询当前开启账期
export async function queryStartAccountPeriodInfoAPI(body: APIManager.AccountPeriod, options?: { [key: string]: any }) {
  return request(`/apiBase/accountPeriod/queryStartAccountPeriodInfo`, {
    method: 'POST',
    body,
      ...(options || {}),
  });
}

