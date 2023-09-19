import { request } from '@/utils/request';

// TODO: 查询待审核单票列表
//   POST /accounting/web/audit/queryAuditJob
//   API ID:109008485
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-109008485
export async function queryAuditJobAPI(body: any) {
  return request(`/accounting/audit/queryAuditJob`, {
    method: 'POST',
    body
  });
}


// TODO: 审核单票
//   POST /accounting/web/audit/auditJob
//   API ID:110745257
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-110745257
export async function auditJobAPI(body: any) {
  return request(`/accounting/audit/auditJob`, {
    method: 'POST',
    body
  });
}

