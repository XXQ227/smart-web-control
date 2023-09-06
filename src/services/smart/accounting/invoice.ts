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

