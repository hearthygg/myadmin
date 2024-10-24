/* 班级管理相关api */

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ClassForm, ClassQuery,DetailClass,ClassTable } from './types';

/* 条件查询分页信息 */
export function listClassData(queryParams: ClassQuery) :AxiosPromise<ClassTable> {
  return request({
    url: '/lmsWeb/auth/cla/pages',
    method: 'get',
    params: queryParams
  });
}

/* 添加新班级 */
export function addClass(data: ClassForm) {
  return request({
    url: '/lmsWeb/auth/cla/saveCla',
    method: 'post',
    data: data
  });
}

/* 根据id获取班级详细信息 */
export function getClassById(claId:number) :AxiosPromise<{cla: DetailClass}>{
  return request({
    url: `/lmsWeb/auth/cla/getClaById/${claId}`,
    method: 'get',
  });
}

/* 编辑班级 */
export function updateClass(data: ClassForm) {
  return request({
    url: '/lmsWeb/auth/cla/updateCla',
    method: 'put',
    data: data
  });
}

/* 删除班级 批量删除id使用,分割 */
export function deleteClass(ids: string[]) {
  return request({
    url: `/lmsWeb/auth/cla/deleteClaByIds`,
    method: 'delete',
    data: {ids}
  });
}

/* 获取所有的班级 */
export function getAllClass(): AxiosPromise<{ claOptions: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/auth/cla/claOptions',
    method: 'get',
  });
}

/**获取部门班级树形选择器数据 */
export function getClassTreeData(): AxiosPromise<{ deptAndClaOptions: TreeDataList[]}> {
  return request({
    url: '/lmsWeb/subject/course/deptAndClaOptions',
    method: 'get',
  });
}
