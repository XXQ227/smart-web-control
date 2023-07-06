import { request } from '@/utils/request';

export async function readMockBPMNFile() {
  return request('/api/bpmn/test', { method: 'GET' });
}
