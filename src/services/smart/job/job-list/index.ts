// import {request} from 'umi';
import {request} from '@/utils/request';
import {stringify} from 'querystring';


export async function GetCJobByKeyAPI(body: APIModel.GetCJobListInfo, options?: Record<string, any>) {
    return request(`/api/CargoJob/GetCJobByKey?${stringify(body)}`, {
        method: 'GET',
        ...(options || {}),
    });
}
