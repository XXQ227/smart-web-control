import { request } from '@/utils/request';

// TODO: 查询待开票费用
//   POST /accounting/web/invoice/QueryPendingInvoicingCharges
//   API ID:106401292
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-106401292
export async function queryPendingInvoicingChargesAPI(body: any) {
  return request(`/apiAccounting/invoice/queryPendingInvoicingCharges/`, {
    method: 'POST',
    body
  });
}


// TODO: 创建发票
//   POST /accounting/web/invoice/createInvoice
//   API ID:107139145
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-107139145
export async function createInvoiceAPI(body: any) {
  return request(`/apiAccounting/invoice/createInvoice/`, {
    method: 'POST',
    body
  });
}


// TODO: 查询发票详细信息
//   POST /accounting/web/invoice/queryInvoiceDetailById
//   API ID:108244197
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108244197
export async function queryInvoiceDetailByIdAPI(body: any) {
  return request(`/apiAccounting/invoice/queryInvoiceDetailById/`, {
    method: 'POST',
    body
  });
}

// TODO: 查询发票列表
//   POST /accounting/web/invoice/queryInvoices
//   API ID:108244197
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108244197
export async function queryInvoicesAPI(body: any) {
  return request(`/apiAccounting/invoice/queryInvoices/`, {
    method: 'POST',
    body
  });
}


// TODO: 作废发票
//   POST /accounting/web/invoice/cancelInvoice
//   API ID:108246032
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108246032
export async function cancelInvoiceAPI(body: any) {
  return request(`/apiAccounting/invoice/cancelInvoice/`, {
    method: 'POST',
    body
  });
}

// TODO: 修改发票
//   POST /accounting/web/invoice/editInvoice
//   API ID:108860414
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108860414
export async function editInvoiceAPI(body: any) {
  return request(`/apiAccounting/invoice/editInvoice/`, {
    method: 'POST',
    body
  });
}

