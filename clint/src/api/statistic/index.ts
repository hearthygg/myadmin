// 获取统计信息（首页）
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { Request , BaseInfoStatisticsVo, CourseInfoStatisticsVo,DeviceInfo } from './types';



/**
 * 获取课程的统计信息
 */
 export function getLessonStatistics() :AxiosPromise<BaseInfoStatisticsVo[]> {
  return request({
    url: `/lmsWeb/statistic/lessonStatistics`,
    method: 'get',
  });
}

/**
 * 获取开设课信息的统计信息
 */
 export function getCourseStatistics() :AxiosPromise<CourseInfoStatisticsVo[]> {
  return request({
    url: `/lmsWeb/statistic/courseStatistics`,
    method: 'get',
  });
}

/**
 * 获取dssh页面的统计信息
 */
 export function getBasicInfoStatistics() :AxiosPromise<BaseInfoStatisticsVo> {
  return request({
    url: `/lmsWeb/statistic/basicInfoStatistics`,
    method: 'get',
  });
}

/**
 * 获取设备的统计信息
 */
 export function getDeviceStatisticss() :AxiosPromise<any> {
  return request({
    url: `/lmsWeb/statistic/deviceStatistics`,
    method: 'get',
  });
}
