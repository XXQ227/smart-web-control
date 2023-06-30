import { request } from '@/utils/request';

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
    return request(`/apiBase/project/queryProjectInfo/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增项目 */
export async function addProjectAPI(body: APIManager.Project, options?: { [key: string]: any }) {
    return request(`/apiBase/project/addProject`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑项目 */
export async function editProjectAPI(body: APIManager.Project, options?: { [key: string]: any }) {
    return request(`/apiBase/project/editProject`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}


/** TODO: 删除项目 */
export async function deleteProjectAPI(body: APIManager.Project, options?: { [key: string]: any }) {
    return request(`/apiBase/project/deleteProject/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用禁用项目 */
export async function operateProjectAPI(body: APIManager.Project, options?: { [key: string]: any }) {
    return request(`/apiBase/project/OperateProject`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}