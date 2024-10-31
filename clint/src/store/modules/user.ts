import { defineStore } from 'pinia';

import { getToken, setToken, removeToken } from '@/utils/auth';
import { loginApi, logoutApi } from '@/api/auth';
import { getUserInfo } from '@/api/user';
import { resetRouter } from '@/router';
import { store } from '@/store';
import { LoginData } from '@/api/auth/types';
import { ref } from 'vue';
import { UserInfo } from '@/api/user/types';

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string>(getToken() || '');
  const nickname = ref<string>('');
  const avatar = ref<string>('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  const ugroup = ref<number>(); //用户类型
  const userId = ref<number>(); //用户ID
  const roleNames = ref<Array<string>>([]); //用户角色名称集合
  // actions

  // 登录
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then(response => {
          const { Authorization } = response.data;
          token.value = Authorization;
          setToken(Authorization);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({ data }) => {
          const res = data;
          if (!res) {
            return reject('Verification failed, please Login again.');
          }
          if (!res.roles || res.roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!');
          }
          nickname.value = res.nickname;
          avatar.value = res.avatar;
          roles.value = res.roles;
          perms.value = res.perms;
          ugroup.value = res.ugroup;
          userId.value = res.userId;
          roleNames.value = res.roleNames;
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      // logoutApi()
      //   .then(() => {
      //     resetRouter();
      //     resetToken();
      //     resolve();
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      resetRouter();
      resetToken();
      resolve();
    });
  }

  // 重置
  function resetToken() {
    removeToken();
    token.value = '';
    nickname.value = '';
    avatar.value = '';
    roles.value = [];
    perms.value = [];
  }
  return {
    token,
    nickname,
    avatar,
    roles,
    perms,
    ugroup,
    userId,
    roleNames,
    login,
    getInfo,
    logout,
    resetToken
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
