import { request } from '@/utils/request';


// TODO: 查询账期列表
export async function queryAccountPeriodAPI(body: APIManager.SearchAccountParams) {
  return request(`/apiBase/accountPeriod/queryAccountPeriod/`, {
    method: 'POST',
    body
  });
}

// TODO: 新增账期
export async function addAccountPeriodAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/addAccountPeriod/`, {
    method: 'POST',
    body
  });
}

// TODO: 查询账期详情
export async function queryAccountPeriodInfoAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodInfo/`, {
    method: 'POST',
    body
  });
}

// TODO: 编辑账期
export async function editAccountPeriodAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/editAccountPeriod/`, {
    method: 'POST',
    body
  });
}

// TODO: 开启账期
export async function openAccountPeriodAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/openAccountPeriod/`, {
    method: 'POST',
    body
  });
}

// TODO: 开始关账
export async function startCloseAccountPeriodAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/startCloseAccountPeriodAPI/`, {
    method: 'POST',
    body
  });
}

// TODO: 通用账期查询
export async function queryAccountPeriodCommonAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/queryAccountPeriodCommon/`, {
    method: 'POST',
    body
  });
}

// TODO: 查询当前开启账期
export async function queryStartAccountPeriodInfoAPI(body: { ID: number, UserID: number }) {
  return request(`/apiBase/accountPeriod/queryStartAccountPeriodInfo/`, {
    method: 'POST',
    body
  });
}

