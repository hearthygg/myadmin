import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MenuQuery, Menu, Resource, MenuForm, ClintRoute } from './types';
/**
 * 获取路由列表
 */
export function listRoutes(): AxiosPromise<ClintRoute[]> {
  return request({
    url: '/auth/routes',
    method: 'get'
  });
}

/**
 * 获取菜单表格列表
 *
 * @param queryParams
 */
export function listMenus(queryParams: MenuQuery): AxiosPromise<{ menus: Menu[] }> {
  return request({
    url: '/lmsWeb/auth/menu/getAllMenus',
    method: 'get',
    params: queryParams
  });
}

/**
 * 获取菜单下拉树形列表
 */
export function listMenuOptions(): AxiosPromise<{ menuOption: OptionType[] }> {
  return request({
    url: '/lmsWeb/auth/menu/menuOptions',
    method: 'get'
  });
}

/**
 * 获取资源(菜单+权限)树形列表
 */
export function listResources(): AxiosPromise<{ resources: Resource[] }> {
  return request({
    url: '/lmsWeb/auth/menu/resources',
    method: 'get'
  });
}

/**
 * 获取菜单详情
 * @param menuId
 */
export function getMenuDetail(menuId: number | undefined): AxiosPromise<{ menu: MenuForm }> {
  return request({
    url: '/lmsWeb/auth/menu/getMenuById/' + menuId,
    method: 'get'
  });
}

/**
 * 添加菜单
 *
 * @param data
 */
export function addMenu(data: MenuForm) {
  return request({
    url: '/lmsWeb/auth/menu/saveMenu',
    method: 'post',
    data
  });
}

/**
 * 修改菜单
 *
 * @param id
 * @param data
 */
export function updateMenu(data: MenuForm) {
  return request({
    url: '/lmsWeb/auth/menu/updateMenu',
    method: 'put',
    data: data
  });
}

/**
 * 批量删除菜单
 *
 * @param ids 菜单ID，多个以英文逗号(,)分割
 */
export function deleteMenus(ids: string) {
  return request({
    url: `/lmsWeb/auth/menu/deleteMenuById/${ids}`,
    method: 'delete'
  });
}
