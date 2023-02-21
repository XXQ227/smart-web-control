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
    return request<API.APIGetCJobListResult>(`/api/CargoJob/GetNJobInfoByID?${stringify(body)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // data: body,
        ...(options || {}),
    });
}