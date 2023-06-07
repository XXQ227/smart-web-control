// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取港口列表 */
export async function queryProjectAPI(body: APIManager.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/project/queryProject`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
