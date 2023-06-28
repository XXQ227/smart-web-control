import { request } from '@/utils/request';
import {stringify} from 'qs'

/** 获取部门数据 */
export async function queryEDIAPI(body: APIManager.SearchEDIParams) {
  return request(`/apiBase/edi/queryEDI`, {
    method: 'POST',
    body,
  });
}

/** add edi */
export async function addEDIAPI(body: APIManager.EDI) {
  return request(`/apiBase/edi/addEDI`, {
    method: 'POST',
    body,
  });
}

/** add edi */
export async function queryEDIInfoAPI(body: APIManager.EDI) {
  return request(`/apiBase/edi/queryEDIInfo/`, {
    method: 'POST',
    body,
  });
}

/** edit edi */
export async function editEDIAPI(body: APIManager.EDI) {
  return request(`/apiBase/edi/editEDI`, {
    method: 'POST',
    body,
  });
}

/** delete edi */
export async function deleteEDIAPI(body: APIManager.EDI) {
  return request(`/apiBase/edi/deleteEDI/`, {
    method: 'POST',
    body,
  });
}

/** freezen edi */
export async function operateEDIAPI(body: APIManager.EDI) {
  return request(`/apiBase/edi/operateEDI`, {
    method: 'POST',
    body,
  });
}
