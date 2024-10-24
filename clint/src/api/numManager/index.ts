/* 课程相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import qs from 'qs';
import {PlayBackRecordQuery,PlayBackRecordTable,CourseDetail,CourseForm,MonitorTable} from './types'

/**
 * 分页查询实验回放记录
 */
export function getPlayBackRecordApi(queryParams: PlayBackRecordQuery) :AxiosPromise<{total: number, records: PlayBackRecordTable[]}> {
  return request({
    url: '/lmsWeb/device/deviceReplay/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取回放地址
 */
export function getPlayBackUrlApi(replayId: number, deviceType: string) :AxiosPromise<{baseUrl: string,fileUrl: string}> {
  return request({
    url: `/lmsWeb/device/deviceReplay/getReplayAddress/${replayId}/${deviceType}`,
    method: 'get',
  });
}
/**
 * 获取监控地址
 */
export function getMonitorUrlApi(hardWareNumber: string, deviceType: string) :AxiosPromise<{baseUrl: string,fileUrl: string}> {
  return request({
    url: `/lmsWeb/device/deviceMonitor/getMonitorAddress/${deviceType}/${hardWareNumber}`,
    method: 'get',
  });
}
/**
 * 查询监控数据
 */
export function getMonitorApi(deviceType: string) :AxiosPromise<MonitorTable[]> {
  return request({
    url: `/lmsWeb/device/deviceMonitor/getDeviceInfoByDeviceType/${deviceType}`,
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
