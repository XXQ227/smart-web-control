// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';
import {stringify} from 'querystring'

/** 获取所有 branch 数据 */
export async function GetDepartmentList(body: APIManager.SearchDeptParams, options?: { [key: string]: any }) {
  return request(`/api/CT/GetCTPByStr?${stringify(body)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取部门数据 */
export async function SaveDepartment(body: APIManager.Department, options?: { [key: string]: any }) {
  return request(`/api/department/SaveDepartment`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}
