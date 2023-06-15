// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';

// TODO: 获取单票业务详情数据
export async function GetNJobInfoByIDAPI(body: APIModel.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiLocal/CargoJob/GetNJobInfoByID?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

// TODO: 获取单票费用详情数据
export async function GetNJobCGSByIDAPI(body: APIModel.GetCJobByID, options?: Record<string, any>) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiLocal/CargoJob/GetNJobCGSByID?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}