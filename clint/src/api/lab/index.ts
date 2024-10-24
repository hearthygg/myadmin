/* 实验室管理相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {LabQuery,LabTable,LabDetail,LabForm} from './types'

/**
 * 分页查询实验室列表
 */
export function getLabData(queryParams: LabQuery) :AxiosPromise<{total: number, labList: LabTable[]}> {
  return request({
    url: '/lmsWeb/lab/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取实验室详细信息
 */
export function getLabDetail(labId: number) :AxiosPromise<{lab: LabDetail}> {
  return request({
    url: `/lmsWeb/lab/getLabById/${labId}`,
    method: 'get',
  });
}
/**
 * 添加实验室信息
 */
export function addLab(data: LabForm) {
  return request({
    url: `/lmsWeb/lab/saveLab`,
    method: 'post',
    data,
  });
}
/**
 * 编辑实验室信息
 */
export function updateLab(data: LabForm) {
  return request({
    url: `/lmsWeb/lab/updateLab`,
    method: 'put',
    data,
  });
}
/**
 * 删除实验室信息
 */
export function deleteLabs(ids: number[]) {
  return request({
    url: `/lmsWeb/lab/deleteLabByIds`,
    method: 'delete',
    data: {ids}
  });
}
/* 获取所有的实验室信息 选择器选择 */
export function getAllLab(): AxiosPromise<{ LabOptions: SelectOptionType[]}> {
  return request({
    url: '/lmsWeb/lab/getLabOptions',
    method: 'get',
  });
}
