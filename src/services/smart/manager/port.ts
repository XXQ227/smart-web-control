// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取当前的用户 GET /api/currentUser */
export async function GetPortList(body: APIManager.SearchPortParams, options?: { [key: string]: any }) {
  return request(`/api/Port/GetPortList?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取当前的用户 GET /api/currentUser */
export async function GetPortByID(body: { ID: number }, options?: { [key: string]: any }) {
  return request(`/api/Port/GetPortByID?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取港口列表 */
export async function querySeaAPI(body: APIManager.SearchPortParams, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/querySea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 新增港口  */
export async function addSeaAPI(body: APIManager.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/addSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 编辑港口  */
export async function editSeaAPI(body: APIManager.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/editSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

/** 删除港口  */
export async function deleteSeaAPI(body: APIManager.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/deleteSea?${stringify(body)}`, {
        method: 'POST',
        ...(options || {}),
    });
}

/** 启用禁用港口  */
export async function operateSeaAPI(body: APIManager.Port, options?: { [key: string]: any }) {
    return request(`/apiBase/sea/operateSea`, {
        method: 'POST',
        body,
        ...(options || {}),
    });
}

