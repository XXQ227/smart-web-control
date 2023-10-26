// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';


//region TODO: 水港
/** 获取港口列表 */
export async function querySeaAPI(body: APISystem.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/querySea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 新增港口  */
export async function addSeaAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/addSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 编辑港口  */
export async function editSeaAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/editSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 删除港口  */
export async function deleteSeaAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/deleteSea/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 启用禁用港口  */
export async function operateSeaAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/operateSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

//region TODO: 空港
/** 获取港口列表 */
export async function queryAirAPI(body: APISystem.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/air/queryAir`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 新增港口  */
export async function addAirAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/air/addAir`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 编辑港口  */
export async function editAirAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/air/editAir`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 删除港口  */
export async function deleteAirAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/air/deleteAir/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 启用禁用港口  */
export async function operateAirAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/air/operateAir`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

//region TODO: 陆运
/** 获取港口列表 */
export async function queryLandAPI(body: APISystem.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/land/queryLand`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 新增港口  */
export async function addLandAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/land/addLand`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 编辑港口  */
export async function editLandAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/land/editLand`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 删除港口  */
export async function deleteLandAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/land/deleteLand/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 启用禁用港口  */
export async function operateLandAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/land/operateLand`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

//region TODO: 贸易站点
/** 获取港口列表 */
export async function queryTradePlaceAPI(body: APISystem.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/trade/queryTradePlace`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 新增港口  */
export async function addTradePlaceAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/trade/addTradePlace`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 编辑港口  */
export async function editTradePlaceAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/trade/editTradePlace`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 删除港口  */
export async function deleteTradePlaceAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/trade/deleteTradePlace/`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 启用禁用港口  */
export async function operateTradePlaceAPI(body: APISystem.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/trade/operateTradePlace`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}
//endregion

