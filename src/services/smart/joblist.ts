// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: API.GetCJobListInfo, options?: Record<string, any>) {
    return request(`/api/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function GetNJobInfoByIDAPI(body: API.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/api/CargoJob/GetNJobInfoByID?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}