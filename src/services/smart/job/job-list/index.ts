// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: APIModel.SearchJobParams, options?: Record<string, any>) {
    return request(`/apiLocal/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function queryJobListAPI(body: APIModel.SearchJobParams) {
    return request(`/apiEngine/forwardJob/queryJobList/`, {
        method: 'POST',
        body
    });
}

export async function queryJobInfoAPI(body: {id: string }) {
    return request(`/apiEngine/forwardJob/queryJobInfo/`, {
        method: 'POST',
        body
    });
}
