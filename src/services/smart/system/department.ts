// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取所有 branch 数据 */
export async function queryDepartmentAPI(body: {name: string}) {
  return request(`/apiBase/department/queryDepartment`, {
    method: 'POST',
    body,
  });
}


/** 获取所有 branch 数据 */
export async function queryDepartmentInfoAPI(body: APISystem.Department) {
  return request(`/apiBase/department/queryDepartmentInfo/`, {
    method: 'POST',
    body,
  });
}


/** add department */
export async function addDepartmentAPI(body: APISystem.Department) {
  return request(`/apiBase/department/addDepartment`, {
    method: 'POST',
    body,
  });
}

/** edit department */
export async function editDepartmentAPI(body: APISystem.Department) {
  return request(`/apiBase/department/editDepartment`, {
    method: 'POST',
    body,
  });
}

/** edit department */
export async function deleteDepartmentAPI(body: APISystem.Department) {
  return request(`/apiBase/department/deleteDepartment`, {
    method: 'POST',
    body,
  });
}

/** edit department */
export async function operateDepartmentAPI(body: APISystem.Department) {
  return request(`/apiBase/department/operateDepartment`, {
    method: 'POST',
    body,
  });
}
