import { request } from '@/utils/request';

// TODO: 查询待核销发票列表
//   POST /accounting/web/writeOff/queryUnWriteOffInvoice
//   API ID:108911367
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108911367
export async function queryUnWriteOffInvoiceAPI(body: any) {
  return request(`/apiAccounting/writeOff/queryUnWriteOffInvoice/`, {
    method: 'POST',
    body
  });
}

// TODO: 查询核销记录列表
//   POST /accounting/web/writeOff/queryWriteOff
//   API ID:108910659
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108910659
export async function queryWriteOffAPI(body: any) {
  return request(`/apiAccounting/writeOff/queryWriteOff/`, {
    method: 'POST',
    body
  });
}

// TODO: 查询核销记录详情
//   POST /accounting/web/writeOff/queryWriteOffInfo
//   API ID:108910965
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108910965
export async function queryWriteOffInfoAPI(body: any) {
  return request(`/apiAccounting/writeOff/queryWriteOffInfo/`, {
    method: 'POST',
    body
  });
}


// TODO: 删除核销记录
//   POST /accounting/web/writeOff/deleteWriteOff
//   API ID:108911128
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108911128
export async function deleteWriteOffAPI(body: any) {
  return request(`/apiAccounting/writeOff/deleteWriteOff/`, {
    method: 'POST',
    body
  });
}



// TODO: 发票核销
//   POST /accounting/web/writeOff/invoiceWriteOff
//   API ID:111583235
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-111583235
export async function invoiceWriteOffAPI(body: any) {
  return request(`/apiAccounting/writeOff/invoiceWriteOff/`, {
    method: 'POST',
    body
  });
}
