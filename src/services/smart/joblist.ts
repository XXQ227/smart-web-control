import {request} from 'umi';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: API.GetCJobListInfo, options?: Record<string, any>) {
    return request<API.APIGetCJobListResult>(`/api/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // data: body,
        ...(options || {}),
    });
}

export async function GetNJobInfoByIDAPI(body: API.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request<API.GetCJobByIDResponse>(`/api/CargoJob/GetNJobInfoByID?${stringify(body)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // data: body,
        ...(options || {}),
    });
}