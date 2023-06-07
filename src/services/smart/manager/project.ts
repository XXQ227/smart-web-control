import { request } from '@/utils/request';
import {stringify} from "querystring";

/** TODO: 获取 项目 列表 */
export async function queryProjectAPI(body: APIManager.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/project/queryProject`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}


/** TODO: 获取 项目 详情 */
export async function queryProjectInfoAPI(body: {id: string}, options?: { [key: string]: any }) {
    return request(`/apiBase/project/queryProjectInfo?${stringify(body)}`, {
        method: 'POST',
        ...(options || {}),
    });
}
