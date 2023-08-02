// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';

// TODO: 获取单票业务详情数据
export async function queryJobInfoAPI(body: APIModel.GetCJobByID) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/forwardJob/queryJobInfo/`, {
        method: 'POST',
        body
    });
}


// TODO: 获取单票业务详情数据
export async function querySeaExportInfoAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaExport/querySeaExportInfo/`, {
        method: 'POST',
        body,
    });
}

// TODO: 获取单票费用详情数据
export async function GetNJobCGSByIDAPI(body: APIModel.GetCJobByID) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiLocal/CargoJob/GetNJobCGSByID?${stringify(body)}`, {
        method: 'GET',
    });
}