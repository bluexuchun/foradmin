import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  if (localStorage.getItem('userInfo_admin')) {
    return { ...JSON.parse(localStorage.getItem('userInfo_admin')) };
  } else {
    location.href = '/user/login';
  }
}
