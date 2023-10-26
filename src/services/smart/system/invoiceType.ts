import { request } from '@/utils/request';

/** TODO: 获取 发票类型 列表 */
export async function queryInvoiceTypeAPI(body: APISystem.SearchInvoiceTypeParams, options?: { [key: string]: any }) {
    return request(`/apiBase/invoiceType/queryInvoiceType`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增发票类型 */
export async function addInvoiceTypeAPI(body: APISystem.InvoiceType, options?: { [key: string]: any }) {
    return request(`/apiBase/invoiceType/addInvoiceType`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑发票类型 */
export async function editInvoiceTypeAPI(body: APISystem.InvoiceType, options?: { [key: string]: any }) {
    return request(`/apiBase/invoiceType/editInvoiceType`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 删除发票类型 */
export async function deleteInvoiceTypeAPI(body: APISystem.InvoiceType, options?: { [key: string]: any }) {
    return request(`/apiBase/invoiceType/deleteInvoiceType`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用禁用发票类型 */
export async function operateInvoiceTypeAPI(body: APISystem.InvoiceType, options?: { [key: string]: any }) {
    return request(`/apiBase/invoiceType/operateInvoiceType`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}