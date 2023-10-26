import { request } from '@/utils/request';

//region TODO: 航次
/** TODO: 查询 航次 列表 */
export async function queryVoyageAPI(body: APISystem.SearchShippingParams, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/queryVoyage`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 获取 航次 详情 */
export async function queryVoyageInfoAPI(body: {id: string}, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/queryVoyageInfo/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 增加航次 */
export async function addVoyageAPI(body: APISystem.Voyage, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/addVoyage`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑航次 */
export async function editVoyageAPI(body: APISystem.Voyage, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/editVoyage`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 删除航次 */
export async function deleteVoyageAPI(body: APISystem.Voyage, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/deleteVoyage/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用禁用航次 */
export async function operateVoyageAPI(body: APISystem.Voyage, options?: { [key: string]: any }) {
    return request(`/apiBase/voyage/operateVoyage`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

//region TODO: 船舶
/** TODO: 查询 船舶 列表 */
export async function queryVesselAPI(body: APISystem.SearchShippingParams, options?: { [key: string]: any }) {
    return request(`/apiBase/vessel/queryVessel`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增船舶 */
export async function addVesselAPI(body: APISystem.Vessel, options?: { [key: string]: any }) {
    return request(`/apiBase/vessel/addVessel`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑船舶 */
export async function editVesselAPI(body: APISystem.Vessel, options?: { [key: string]: any }) {
    return request(`/apiBase/vessel/editVessel`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 删除船舶 */
export async function deleteVesselAPI(body: APISystem.Vessel, options?: { [key: string]: any }) {
    return request(`/apiBase/vessel/deleteVessel/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用禁用船舶 */
export async function operateVesselAPI(body: APISystem.Vessel, options?: { [key: string]: any }) {
    return request(`/apiBase/vessel/operateVessel`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

//region TODO: 航线
/** TODO: 查询 航线 列表 */
export async function queryLineAPI(body: APISystem.SearchShippingParams, options?: { [key: string]: any }) {
    return request(`/apiBase/line/queryLine`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 新增航线 */
export async function addLineAPI(body: APISystem.Line, options?: { [key: string]: any }) {
    return request(`/apiBase/line/addLine`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 编辑航线 */
export async function editLineAPI(body: APISystem.Line, options?: { [key: string]: any }) {
    return request(`/apiBase/line/editLine`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 删除航线 */
export async function deleteLineAPI(body: APISystem.Line, options?: { [key: string]: any }) {
    return request(`/apiBase/line/deleteLine/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** TODO: 启用禁用航线 */
export async function operateLineAPI(body: APISystem.Line, options?: { [key: string]: any }) {
    return request(`/apiBase/line/operateLine`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion