import { request } from '@/utils/request';

/** 获取部门数据 */
export async function queryEDIAPI(body: APISystem.SearchEDIParams) {
  return request(`/apiBase/edi/queryEDI`, {
    method: 'POST',
    body,
  });
}

/** add edi */
export async function addEDIAPI(body: APISystem.EDI) {
  return request(`/apiBase/edi/addEDI`, {
    method: 'POST',
    body,
  });
}

/** add edi */
export async function queryEDIInfoAPI(body: APISystem.EDI) {
  return request(`/apiBase/edi/queryEDIInfo/`, {
    method: 'POST',
    body,
  });
}

/** edit edi */
export async function editEDIAPI(body: APISystem.EDI) {
  return request(`/apiBase/edi/editEDI`, {
    method: 'POST',
    body,
  });
}

/** delete edi */
export async function deleteEDIAPI(body: APISystem.EDI) {
  return request(`/apiBase/edi/deleteEDI/`, {
    method: 'POST',
    body,
  });
}

/** freezen edi */
export async function operateEDIAPI(body: APISystem.EDI) {
  return request(`/apiBase/edi/operateEDI`, {
    method: 'POST',
    body,
  });
}
