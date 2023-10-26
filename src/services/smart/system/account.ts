import { request } from '@/utils/request';


// TODO: 查询账期列表
export async function queryAccountPeriodAPI(body: APISystem.SearchAccountParams) {
  return request(`/apiBase/accountPeriod/queryAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 查询账期详情
export async function queryAccountPeriodInfoAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodInfo`, {
     method: 'POST',
    body
  });
}

// TODO: 新增账期
export async function addAccountPeriodAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/addAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 编辑账期
export async function editAccountPeriodAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/editAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 开启账期
export async function openAccountPeriodAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/openAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 开始关账
export async function startCloseAccountPeriodAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/startCloseAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 结束关账
export async function endCloseAccountPeriodAPI(body: APISystem.AccountPeriod) {
  return request(`/apiBase/accountPeriod/endCloseAccountPeriod`, {
    method: 'POST',
    body
  });
}

// TODO: 通用账期查询
export async function queryAccountPeriodCommonAPI(body: any) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodCommon`, {
    method: 'POST',
    body
  });
}

// TODO: 查询当前开启账期
export async function queryStartAccountPeriodInfoAPI(body: any) {
  return request(`/apiBase/accountPeriod/queryStartAccountPeriodInfo`, {
    method: 'POST',
    body
  });
}

