import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RoleQuery, RolePageResult, RoleForm, Role } from './types';

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function listRolePages(
  queryParams?: RoleQuery
): AxiosPromise<{total: number; list: Role[]}> {
  return request({
    url: '/auth/role/getRolePages',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取角色下拉数据
 *
 * @param queryParams
 */
export function listRoleOptions(
  queryParams?: RoleQuery
): AxiosPromise<OptionType[]> {
  return request({
    url: '/api/v1/roles/options',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取角色拥有的资源ID集合
 *
 * @param queryParams
 */
export function getRoleMenuIds(roleId: number): AxiosPromise<number[]> {
  return request({
    url: '/auth/role/getRolePermissions/' + roleId,
    method: 'get'
  });
}

/**
 * 修改角色资源权限
 *
 * @param queryParams
 */
export function updateRoleMenus(
  roleId: string,
  data: number[]
): AxiosPromise<any> {
  return request({
    url: '/auth/role/updateRolePermissions',
    method: 'put',
    data: {
      roleId: roleId,
      permIds: data
    }
  });
}

/**
 * 获取角色详情
 *
 * @param id
 */
export function getRoleDetail(id: number): AxiosPromise<{role: RoleForm}> {
  return request({
    url: '/lmsWeb/auth/role/getRoleById/' + id,
    method: 'get'
  });
}

/**
 * 添加角色
 *
 * @param data
 */
export function addRole(data: RoleForm) {
  return request({
    url: '/auth/role/addRole',
    method: 'post',
    data: data
  });
}

/**
 * 更新角色
 * @param data
 */
export function updateRole(data: RoleForm) {
  return request({
    url: '/auth/role/updateRole',
    method: 'put',
    data: data
  });
}

/**
 * 批量删除角色，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteRoles(ids: string) {
  return request({
    url: '/lmsWeb/auth/role/deleteRoleById/' + ids,
    method: 'delete'
  });
}

/* 获取到所有的角色信息 */
export function getAllRole(): AxiosPromise<SelectOptionType[]> {
  return request({
    url: '/auth/role/roleOptions',
    method: 'get',
  });
}
