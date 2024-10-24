import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OnlineCourseList, OnlineCourseQuery, OnlineExamList } from './types';

/**获取在线实验课程列表 */
export function getOnlineCourseList(queryParams: OnlineCourseQuery) :AxiosPromise<{total: number, experimentList: OnlineCourseList[]}> {
  return request({
    url: '/lmsWeb/experiment/getExperimentCoursePages',
    method: 'get',
    params: queryParams
  });
}

/**获取在线课程下的实验列表 */
export function getOnlineExpList(courseId: number) :AxiosPromise<{experimentInfos: OnlineExamList[]}> {
  return request({
    url: `/lmsWeb/experiment/getExperimentInfoByCourseId/${courseId}`,
    method: 'get',
  });
}

/**根据栏目id和实验id获取相应的实验文档 */
export function getExpDocument(expInfoTypeId:number, expId:number):AxiosPromise<{path: string}> {
  return request({
    url: `/lmsWeb/experiment/getExperimentalDocumentPath/${expInfoTypeId}/${expId}`,
    method: 'get',
  });
}


