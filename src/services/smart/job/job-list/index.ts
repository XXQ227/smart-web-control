// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: APIModel.GetCJobListInfo, options?: Record<string, any>) {
    return request(`/apiLocal/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function queryJobListAPI(body: APIModel.GetCJobListInfo) {
    return request(`/apiEngine/forwardJob/queryJobList/`, {
        method: 'POST',
        body
    });
}
