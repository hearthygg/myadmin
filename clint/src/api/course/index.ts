/* 课程相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import qs from 'qs';
import {CourseQuery,CourseTable,CourseDetail,CourseForm, MergeCourseData} from './types'

/**
 * 分页查询课程表格信息
 */
export function getCourseData(queryParams: CourseQuery) :AxiosPromise<{total: number, lessonList: CourseTable[]}> {
  return request({
    url: '/lmsWeb/course/lesson/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取课程详细信息
 */
export function getCourseDetail(lessonId: number) :AxiosPromise<{lesson: CourseDetail}> {
  return request({
    url: `/lmsWeb/course/lesson/getLessonById/${lessonId}`,
    method: 'get',
  });
}
/**
 * 获取课程选择器数据
 */
export function getCourseSelect() :AxiosPromise<{lessonOptions: SelectOptionType[]}> {
  return request({
    url: `/lmsWeb/course/lesson/lessonOptions`,
    method: 'get',
  });
}
/**
 * 添加课程信息
 */
export function addCourse(data: CourseForm) {
  let formData
  if(data.lessonBackImage != '') {
    formData = new FormData();
    formData.append("file", data.lessonBackImage);
  }
  return request({
    url: `/lmsWeb/course/lesson/saveLesson`,
    method: 'post',
    params: data,
    data: formData ? formData : '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    paramsSerializer: {
      serialize: function(params) {
        delete params.lessonBackImage
        return  qs.stringify(params,{arrayFormat: 'indices'})
      }
    }
  });
}
/**
 * 编辑课程信息
 */
export function updateCourse(data: CourseForm) {
  let formData
  if(data.lessonBackImage != '') {
    formData = new FormData();
    formData.append("file", data.lessonBackImage);
  }
  return request({
    url: `/lmsWeb/course/lesson/updateLesson`,
    method: 'put',
    params: data,
    data: formData ? formData : '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    paramsSerializer: {
      serialize: function(params) {
        delete params.lessonBackImage
        return  qs.stringify(params,{arrayFormat: 'indices'})
      }
    }
  });
}
/**
 * 删除课程信息
 */
export function deleteCourses(ids: number[]) {
  return request({
    url: `/lmsWeb/course/lesson/deleteLessonByIds`,
    method: 'delete',
    data: { ids }
  });
}
/**获取到所有的课程和实验信息(封装为联级选择器格式) */
export function getLessonAndExpOptions() :AxiosPromise<{lessonAndExpOptions: TreeDataList[]}> {
  return request({
    url: `/lmsWeb/course/lesson/lessonAndExpOptions`,
    method: 'get',
  });
}
/**
 * 获取课程分类选择器数据
 */
export function getLessonClassificationOption() :AxiosPromise<SelectOptionType[]> {
  return request({
    url: `/lmsWeb/course/lesson/getLessonClassificationOption`,
    method: 'get',
  });
}
/**
 * 根据学期id获取到该学期下开课的下拉列表
 */
export function getCourseOptionsByTermIdApi(termId: number) :AxiosPromise<SelectOptionType[]> {
  return request({
    url: `/lmsWeb/subject/course/getCourseOptionsByTermId/${termId}`,
    method: 'get',
  });
}
/**
 * 根据开设课程id获取到开设实验的选项列表
 */
export function getCourseExpOptionsByCourseIdApi(courseId: number) :AxiosPromise<SelectOptionType[]> {
  return request({
    url: `/lmsWeb/subject/courseExp/getCourseExpOptionsByCourseId/${courseId}`,
    method: 'get',
  });
}
/**
 * 合并课程
 */
export function mergeCourseApi(data: MergeCourseData) {
  return request({
    url: `/lmsWeb/course/lesson/mergeLesson`,
    method: 'post',
    data
  });
}
