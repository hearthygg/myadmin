const TokenKey = 'njrzkj-admin-token';

// 将cookie存储token的方式改成使用localStorage
export function getToken() {
  return window.localStorage.getItem(TokenKey);
}

export function setToken(token: string) {
  window.localStorage.setItem(TokenKey, token);
  // 放置用户认证信息
  window.userAuthorization = token;
}

export function removeToken() {
  // 移除用户认证信息
  window.userAuthorization = '';
  window.localStorage.removeItem(TokenKey);
}
