/* 实验桌管理相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {LabDeskQuery,LabDeskTable,LabDeskDetail,LabDeskForm} from './types'

/**
 * 分页查询实验桌列表
 */
export function getLabDeskData(queryParams: LabDeskQuery) :AxiosPromise<{total: number, deskList: LabDeskTable[]}> {
  return request({
    url: '/lmsWeb/lab/desk/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取实验桌详细信息
 */
export function getLabDeskDetail(deskId: number) :AxiosPromise<{desk: LabDeskDetail}> {
  return request({
    url: `/lmsWeb/lab/desk/getDeskById/${deskId}`,
    method: 'get',
  });
}
/**
 * 添加实验桌信息
 */
export function addLabDesk(data: LabDeskForm) {
  return request({
    url: `/lmsWeb/lab/desk/saveDesk`,
    method: 'post',
    data,
  });
}
/**
 * 编辑实验桌信息
 */
export function updateLabDesk(data: LabDeskForm) {
  return request({
    url: `/lmsWeb/lab/desk/updateDesk`,
    method: 'put',
    data,
  });
}
/**
 * 删除实验桌信息
 */
export function deleteLabDesks(ids: number[]) {
  return request({
    url: `/lmsWeb/lab/desk/deleteDeskByIds`,
    method: 'delete',
    data: {ids}
  });
}
