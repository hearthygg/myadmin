/* 实验开设相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {ExamSetQuery,ExamSetTable,ExamSetDetail,ExamSetForm, CourseExpTimeQuery, CourseExpTimeList, CourseExpTimeForm, CourseExpStudentList, CourseExpStudentQuery} from './types'

/**
 * 分页查询实验开设表格信息
 */
export function getExamSetData(queryParams: ExamSetQuery) :AxiosPromise<{total: number, courseExpVoPage: ExamSetTable[]}> {
  return request({
    url: '/lmsWeb/subject/courseExp/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取实验开设详细信息
 */
export function getExamSetDetail(courseExpId: number) :AxiosPromise<{courseExpForm: ExamSetDetail}> {
  return request({
    url: `/lmsWeb/subject/courseExp/getCourseExpById/${courseExpId}`,
    method: 'get',
  });
}
/**
 * 添加开课信息
 */
export function addExamSet(data: ExamSetForm) {
  return request({
    url: `/lmsWeb/subject/courseExp/saveCourseExp`,
    method: 'post',
    data,
  });
}
/**
 * 编辑开课信息
 */
export function updateExamSet(data: ExamSetForm) {
  return request({
    url: `/lmsWeb/subject/courseExp/updateCourseExp`,
    method: 'put',
    data,
  });
}
/**
 * 根据id删除实验开设信息
 */
export function deleteExamSets(ids: number[]) {
  return request({
    url: `/lmsWeb/subject/course/deleteCourseExpByIds`,
    method: 'delete',
    data: {
      ids,
    }
  });
}

/**
 * 根据查询条件获取到分组下的时间的具体分页信息
 */
export function getCourseExpTimePagesApi(queryParams: CourseExpTimeQuery) :AxiosPromise<{total: number, records: CourseExpTimeList[]}> {
  return request({
    url: '/lmsWeb/subject/courseExpTime/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 添加开课信息
 */
export function addCourseExpTimeApi(data: CourseExpTimeForm) {
  return request({
    url: `/lmsWeb/subject/courseExpTime/saveCourseExpTime`,
    method: 'post',
    data,
  });
}
/**
 * 编辑开课信息
 */
export function updateCourseExpTimeApi(data: CourseExpTimeForm) {
  return request({
    url: `/lmsWeb/subject/courseExpTime/updateCourseExpTime`,
    method: 'put',
    data,
  });
}

/**
 * 获取实验开设详细信息
 */
export function getourseExpTimeDetailApi(courseExpTimeId: number) :AxiosPromise<CourseExpTimeForm> {
  return request({
    url: `/lmsWeb/subject/courseExpTime/getCourseExpTimeById/${courseExpTimeId}`,
    method: 'get',
  });
}

/**
 * 获取时间分配学生列表信息
 */
export function getStudentListApi(data: CourseExpStudentQuery) :AxiosPromise<CourseExpStudentList[]> {
  return request({
    url: `/lmsWeb/subject/courseExpTime/getCourseExpStudents`,
    method: 'post',
    data,
  });
}

/**
 * 教师添加学生
 */
export function addStudentApi(data: any) {
  return request({
    url: `/lmsWeb/subject/courseExpTime/teacherSelectStudentToJoinCourseExp`,
    method: 'post',
    data,
  });
}
