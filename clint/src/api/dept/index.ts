import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeptForm, DeptQuery, Dept } from './types';

/**
 * 部门表格数据
 *
 * @param queryParams
 */
export function listDepartments(queryParams?: DeptQuery): AxiosPromise<{total: number, deptList: Dept[]}> {
  return request({
    url: '/lmsWeb/auth/dept/pages',
    method: 'get',
    params: queryParams
  });
}

/**
 * 部门下拉列表
 */
export function listDeptOptions(): AxiosPromise<OptionType[]> {
  return request({
    url: '/api/v1/dept/options',
    method: 'get'
  });
}

/**
 * 获取部门详情
 *
 * @param id
 */
export function getDeptForm(id: number): AxiosPromise<DeptForm> {
  return request({
    url: '/api/v1/dept/' + id + '/form',
    method: 'get'
  });
}

/**
 * 新增部门
 *
 * @param data
 */
export function addDept(data: Dept) {
  return request({
    url: '/lmsWeb/auth/dept/saveDept',
    method: 'post',
    data: data
  });
}
/* 根据id获取部门详细信息 */
export function getDeptById(deptId:number):AxiosPromise<{ dept: Dept}> {
  return request({
    url: `/lmsWeb/auth/dept/getDeptById/${deptId}`,
    method: 'get',
  });
}

/**
 *  修改部门
 *
 * @param data
 */
export function updateDept(data: Dept) {
  return request({
    url: '/lmsWeb/auth/dept/updateDept',
    method: 'put',
    data: data
  });
}

/**
 * 删除部门
 *
 * @param ids
 */
export function deleteDept(ids: string[]) {
  return request({
    url: '/lmsWeb/auth/dept/deleteDeptByIds',
    method: 'delete',
    data: {ids}
  });
}

/* 获取所有的部门信息 选择器选择 */
export function getAllDept(): AxiosPromise<{ deptOptions: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/auth/dept/deptOptions',
    method: 'get',
  });
}
