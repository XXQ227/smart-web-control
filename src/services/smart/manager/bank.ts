// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** Add Bank */
export async function addBankAPI(body: APIManager.Bank, options?: { [key: string]: any }) {
  return request(`/apiBase/bankaccount/addBank`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Edit Bank */
export async function editBankAPI(body: APIManager.Bank, options?: { [key: string]: any }) {
  return request(`/apiBase/bankaccount/editBank`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Delete Bank */
export async function deleteBankAPI(body: APIManager.Bank, options?: { [key: string]: any }) {
  return request(`/apiBase/bankaccount/deleteBank/`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

/** Freezen Bank */
export async function operateBankAPI(body: APIManager.Bank, options?: { [key: string]: any }) {
  return request(`/apiBase/bankaccount/operateBank`, {
    method: 'POST',
    body,
    ...(options || {}),
  });
}

