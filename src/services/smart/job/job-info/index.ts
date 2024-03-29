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

// TODO: 新增单票
export async function addJobAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/forwardJob/addJob`, {
        method: 'POST',
        body
    });
}

// TODO: 编辑单票
export async function editJobAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/forwardJob/editJob`, {
        method: 'POST',
        body
    });
}

// TODO: 查询海运出口服务信息
export async function querySeaExportInfoAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaExport/querySeaExportInfo/`, {
        method: 'POST',
        body,
    });
}

// TODO: 新增海运出口服务信息
export async function addSeaExportAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaExport/addSeaExport/`, {
        method: 'POST',
        body,
    });
}

// TODO: 编辑海运出口服务信息
export async function editSeaExportAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaExport/editSeaExport/`, {
        method: 'POST',
        body,
    });
}

// TODO: 删除收发通信息
export async function deleteBillOfLoadingAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaExport/deleteBillOfLoading`, {
        method: 'POST',
        body,
    });
}

// TODO: 查询海运进口服务信息
export async function querySeaImportInfoAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaImport/querySeaImportInfo/`, {
        method: 'POST',
        body,
    });
}

// TODO: 新增海运进口服务信息
export async function addSeaImportAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaImport/addSeaImport/`, {
        method: 'POST',
        body,
    });
}

// TODO: 编辑海运进口服务信息
export async function editSeaImportAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/seaImport/editSeaImport/`, {
        method: 'POST',
        body,
    });
}

// TODO: 查询本地交付服务信息
export async function queryLocalDeliveryInfoAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/localDelivery/queryLocalDeliveryInfo/`, {
        method: 'POST',
        body,
    });
}

// TODO: 新增本地交付服务信息
export async function addLocalDeliveryAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/localDelivery/addLocalDelivery/`, {
        method: 'POST',
        body,
    });
}

// TODO: 编辑本地交付服务信息
export async function editLocalDeliveryAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/localDelivery/editLocalDelivery/`, {
        method: 'POST',
        body,
    });
}

// TODO: 删除本地交付服务信息
export async function deleteLocalDeliveryAPI(body: {id: string}) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiEngine/localDelivery/deleteLocalDelivery`, {
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

// TODO: 获取单票费用详情数据
export async function queryChargesByJobIdAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiAccounting/charge/queryChargesByJobId/`, {
        method: 'POST',
        body,
    });
}

// TODO: 获取单票费用详情数据
export async function saveChargesAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiAccounting/charge/saveCharges/`, {
        method: 'POST',
        body,
    });
}

// TODO: 获取单票费用详情数据
export async function deleteChargesAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiAccounting/charge/deleteCharges/`, {
        method: 'POST',
        body,
    });
}

// TODO: 费用提交主管/财务
//   POST /accounting/web/charge/submitCharges
//   API ID:108222318
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108222318
export async function submitChargesAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiAccounting/charge/submitCharges/`, {
        method: 'POST',
        body,
    });
}

// TODO: 费用驳回
//   POST /accounting/web/charge/RejectCharges
//   API ID:108223599
//   API URL:https://app.apifox.com/link/project/2684231/apis/api-108223599
export async function rejectChargesAPI(body: any) {
    // TODO: <API.GetCJobByIDResponse> 为接口返回的数据结构
    return request(`/apiAccounting/charge/rejectCharges/`, {
        method: 'POST',
        body,
    });
}