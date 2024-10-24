/* 实验相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import qs from 'qs';
import { ExamQuery, ExamTable, ExamDetail, ExamForm, ExamColumnTable, ExamColumnDetail, ExamColumnForm, ExamDetailForm, ExamBaseInfo } from './types';

/**
 * 分页查询实验表格信息
 */
export function getExamData(queryParams: ExamQuery): AxiosPromise<{ total: number; expList: ExamTable[] }> {
  return request({
    url: '/lmsWeb/course/exp/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取实验详细信息
 */
export function getExamDetail(expId: number): AxiosPromise<{ exp: ExamDetail }> {
  return request({
    url: `/lmsWeb/course/exp/getExpById/${expId}`,
    method: 'get'
  });
}
/**
 * 根据课程的id获取到所有的实验列表
 */
export function getExamSelect(lessonId: number): AxiosPromise<{ expOptions: SelectOptionType[] }> {
  return request({
    url: `/lmsWeb/course/exp/getExpsByLessonId/${lessonId}`,
    method: 'get'
  });
}
/**
 * 添加实验信息
 */
export function addExam(data: ExamForm) {
  return request({
    url: `/lmsWeb/course/exp/saveExp`,
    method: 'post',
    data
  });
}
/**
 * 编辑实验信息
 */
export function updateExam(data: ExamForm) {
  return request({
    url: `/lmsWeb/course/exp/updateExp`,
    method: 'put',
    data
  });
}
/**
 * 根据实验id删除实验
 */
export function deleteExams(ids: number[]) {
  return request({
    url: `/lmsWeb/course/exp/deleteExpByIds`,
    method: 'delete',
    data: { ids }
  });
}
/**
 * 获取所有的栏目信息
 */
export function getAllExamColumn(): AxiosPromise<{ expInfoTypeList: ExamColumnTable[] }> {
  return request({
    url: `/lmsWeb/course/expInfoType/getAllExpInfoType`,
    method: 'get'
  });
}
/**
 * 获取实验栏目的具体信息
 */
export function getExamColumnDetail(infoTypeId: number): AxiosPromise<{ expInfoType: ExamColumnDetail }> {
  return request({
    url: `/lmsWeb/course/expInfoType/getExpInoTypeById/${infoTypeId}`,
    method: 'get'
  });
}
/**
 * 增加实验栏目信息
 */
export function addExamColumn(data: ExamColumnForm) {
  return request({
    url: `/lmsWeb/course/expInfoType/saveExpInfoType`,
    method: 'post',
    data
  });
}
/**
 * 更新实验栏目信息
 */
export function updateExamColumn(data: ExamColumnForm) {
  return request({
    url: `/lmsWeb/course/expInfoType/updateExpInfoType`,
    method: 'put',
    data
  });
}
/**
 * 删除实验栏目信息
 */
export function deleteExamColumns(ids: number[]) {
  return request({
    url: `/lmsWeb/course/expInfoType/deleteExpInfoTypeByIds`,
    method: 'delete',
    data: { ids }
  });
}
/**
 * 根据实验项目的id获取到其拥有的栏目列表
 */
export function getColumnByExamId(expId: number): AxiosPromise<{ columnList: ExamColumnTable[] }> {
  return request({
    url: `/lmsWeb/course/expInfoType/getColumnsByExpId/${expId}`,
    // url: `/lmsWeb/course/expInfoType/getColumnsByCourseExpId/${expId}`,
    method: 'get'
  });
}
/**
 * 根据开设实验的id获取到其拥有的栏目列表
 */
export function getColumnByCourseExpId(expId: number): AxiosPromise<{ columnList: ExamColumnTable[] }> {
  return request({
    url: `/lmsWeb/course/expInfoType/getColumnsByCourseExpId/${expId}`,
    method: 'get'
  });
}
/**
 * 获取当前实验栏目的具体信息
 */
export function getCurrentExamDetail(expId: number, columnId: number): AxiosPromise<{ expInfo: ExamDetailForm }> {
  return request({
    url: `/lmsWeb/course/expInfo/getExpInfoByExpId/${expId}/${columnId}`,
    method: 'get'
  });
}
/**
 * 保存实验课件
 */
export function addCurrentExamCol(data: ExamDetailForm) {
  return request({
    url: '/lmsWeb/course/expInfo/saveExpInfo',
    method: 'post',
    data: data
  });
}
/**
 * 更新实验课件
 */
export function updateCurrentExamCol(data: ExamDetailForm) {
  return request({
    url: '/lmsWeb/course/expInfo/updateExpInfo',
    method: 'put',
    data
  });
}

/**
 * 删除实验设置中已有的栏目
 */
export function deleteOnlineExamCol(ids: string) {
  return request({
    url: `/lmsWeb/course/expInfo/deleteExpInfoByIds`,
    method: 'delete',
    data: {
      ids: [ids]
    }
  });
}

/**根据实验的id和开设实验id和时间id获取到实验的基础信息 */
export function getCourseExpBaseInfoByIds(courseExpId: number, expId: number, timeId?: number): AxiosPromise<ExamBaseInfo> {
  return request({
    url: `/lmsWeb/subject/courseExp/getCourseExpBaseInfo`,
    method: 'post',
    data: {
      courseExpId,
      expId,
      timeId
    }
  });
}
