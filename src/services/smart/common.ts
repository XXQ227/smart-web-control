// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取字典通用接口 */
export async function queryDictCommonAPI(body: {dictCodes: any}) {
  return request(`/apiBase/dict/queryDictCommon`, {
    method: 'POST',
    body
  });
}

/** 获取字典详情通用接口 */
export async function queryDictDetailCommonAPI(body: any) {
  return request(`/apiBase/dict/queryDictDetailCommon`, {
    method: 'POST',
    body
  });
}

/** 获取字典详情通用接口 */
export async function queryInvoiceTypeCommonAPI(body: any) {
  return request(`/apiBase/invoiceType/queryInvoiceTypeCommon`, {
    method: 'POST',
    body
  });
}

/** 查询公司币种通用列表 */
export async function queryBranchCurrencyCommonAPI(body: any) {
  return request(`/apiBase/branch/queryBranchCurrencyCommon`, {
    method: 'POST',
    body
  });
}

/** 查询公司币种通用列表 */
export async function queryDepartmentCommonAPI(body: any) {
  return request(`/apiBase/department/queryDepartmentCommon`, {
    method: 'POST',
    body
  });
}

