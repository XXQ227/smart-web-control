// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: API.GetCJobListInfo, options?: Record<string, any>) {
    return request(`/api/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

// TODO: 获取单票业务详情数据
export async function GetNJobInfoByIDAPI(body: API.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/api/CargoJob/GetNJobInfoByID?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

// TODO: 获取单票业务详情数据
export async function GetNJobCGSByIDAPI(body: API.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/api/CargoJob/GetNJobCGSByID?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}