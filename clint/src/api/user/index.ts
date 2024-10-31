import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserForm, UserInfo, UserPwd, UserQuery,UserTable,UpdateUser } from './types';
import qs from "qs"
import { ImportError } from '../auth/types';
/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: '/auth/user/info',
    method: 'get'
  });
}

/**
 * 获取用户分页列表
 *
 * @param queryParams
 */
export function getUserPagesApi(
  queryParams: UserQuery
): AxiosPromise<{total: number, list: UserTable[]}> {
  return request({
    url: '/auth/user/getUserPages',
    method: 'get',
    params: queryParams
  });
}

/**
 * 根据id获取用户详情
 *
 * @param userId
 */
export function getUserForm(userId: number): AxiosPromise<UserForm> {
  return request({
    url: `/auth/user/getUserDetail/${userId}`,
    method: 'get'
  });
}

/**
 * 添加用户
 *
 * @param data
 */
export function addUser(data: UserForm) {
  return request({
    url: '/auth/user/addUser',
    method: 'post',
    data,
  });
}

/**
 * 修改用户基本信息
 *
 * @param data
 */
export function updateUser(data: UserForm) {
  return request({
    url: '/auth/user/updateUser',
    method: 'put',
    data,
  });
}

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateUserStatus(id: number, status: number) {
  return request({
    url: '/api/v1/users/' + id + '/status',
    method: 'patch',
    params: { status: status }
  });
}

/**
 * 修改用户密码
 *
 * @param id
 * @param password
 */
export function updateUserPassword(data:UserPwd) {
  return request({
    url: `/lmsWeb/auth/user/updatePassword`,
    method: 'patch',
    data
  });
}
/* 重置用户密码 */
export function resetUserPassword(userId: number) {
  return request({
    url: `/lmsWeb/auth/user/resetPassword/${userId}`,
    method: 'patch',
  });
}

/**
 * 删除用户
 *
 */
export function deleteUsers(ids: string[]) {
  return request({
    url: `/lmsWeb/auth/user/deleteUserByIds`,
    method: 'delete',
    data: {ids}
  });
}

/**
 * 下载用户导入模板
 *
 * @returns
 */
export function downloadTemplate() {
  return request({
    url: '/api/v1/users/template',
    method: 'get',
    responseType: 'arraybuffer'
  });
}

/**
 * 导出用户
 *
 * @param queryParams
 * @returns
 */
export function exportUser(queryParams: UserQuery) {
  return request({
    url: '/api/v1/users/_export',
    method: 'get',
    params: queryParams,
    responseType: 'arraybuffer'
  });
}

/**
 * 批量导入用户
 *
 * @param file
 */
export function importUsersApi(file: File): AxiosPromise<{ errorRows: ImportError[]}> {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/lmsWeb/auth/user/importUserByExcel',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/* 用户表单相关选择器数据 */
export function getUserOptions(): AxiosPromise<{ sexOptions: SelectOptionType[],uproupOptions: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/auth/user/userOptions',
    method: 'get',
  });
}

/* 获取所有的任课教师 */
export function getAllTeacher(): AxiosPromise<{ teacherOptions: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/auth/user/teacherOptions',
    method: 'get',
  });
}
