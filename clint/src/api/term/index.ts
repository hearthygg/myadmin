/* 学期相关API */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TermQuery,TermForm,TermTable } from './types';

/* 条件查询分页信息 */
export function listTermData(queryParams: TermQuery) :AxiosPromise<TermTable> {
  return request({
    url: '/lmsWeb/auth/term/pages',
    method: 'get',
    params: queryParams
  });
}

/* 添加新学期 */
export function addTerm(data: TermForm) {
  return request({
    url: '/lmsWeb/auth/term/saveTerm',
    method: 'post',
    data: data
  });
}

/* 根据id获取学期详细信息 */
export function getTermById(termId:number) {
  return request({
    url: `/lmsWeb/auth/term/getTermById/${termId}`,
    method: 'get',
  });
}

/* 编辑学期 */
export function updateTerm(data: TermForm) {
  return request({
    url: '/lmsWeb/auth/term/updateTerm',
    method: 'put',
    data: data
  });
}

/* 删除学期 批量删除id使用,分割 */
export function deleteTerm(ids: string[]) {
  return request({
    url: `/lmsWeb/auth/term/deleteTermByIds`,
    method: 'delete',
    data: { ids }
  });
}

/* 获取所有的学期信息 选择器选择 */
export function getAllTerm(): AxiosPromise<{ termOption: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/auth/term/termOptions',
    method: 'get',
  });
}
