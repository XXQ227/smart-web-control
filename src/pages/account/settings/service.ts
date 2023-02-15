import { request } from 'umi';
import type { CurrentUser, GeographicItemType } from './data';


export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  console.log('queryCurrent() 方法')
  return request('/api/accountSettingCurrentUser');
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  console.log('queryProvince() 方法')
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  console.log('queryCity() 方法')
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  console.log('query() 方法')
  return request('/api/users');
}
