import { request } from '@/utils/request';

/** TODO: 删除银行 */
export async function deleteBankAPI(body: any, options?: { [key: string]: any }) {
    return request(`/apiBase/bankAccount/deleteBank`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

export async function queryDictDetailCommonAPI(body: any) {
    return request(`/apiBase/dict/queryDictDetailCommon`, {
        method: 'POST',
        body
    });
}