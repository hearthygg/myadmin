/**实验报告相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CorrectExamReportForm, ExamReportForm, ExamReportQueryParams, ExamReportRecord, ExamReportRecordDetail, SubmitExamReportForm } from './types';

/**根据实验id 新增/更新实验报告 */
export function updateExamReportApi(data: ExamReportForm) {
  return request({
    url: '/lmsWeb/course/exp/UpdateExpExpReportInfoByExpId',
    method: 'put',
    data: data
  });
}

/**根据实验id获取实验报告*/
export function getExamReportApi(expId: number): AxiosPromise<string> {
  return request({
    url: `/lmsWeb/course/exp/getExpReportInfoByExpId/${expId}`,
    method: 'get'
  });
}

/**学生提交实验报告 */
export function submitExamReportApi(data: SubmitExamReportForm) {
  return request({
    url: '/lmsWeb/subject/report/saveReport',
    method: 'post',
    data: data
  });
}
/**学生更新实验报告 */
export function updateReportApi(data: SubmitExamReportForm) {
  return request({
    url: '/lmsWeb/subject/report/updateReport',
    method: 'post',
    data: data
  });
}
/**教师批改实验报告 */
export function correctionReportApi(data: CorrectExamReportForm) {
  return request({
    url: '/lmsWeb/subject/report/teacherCorrectReport',
    method: 'patch',
    data: data
  });
}
/**获取批改结果 */
export function getCorrectionResultApi(reportId: number): AxiosPromise<{teacherContent: string}> {
  return request({
    url: `/lmsWeb/subject/report/getReportCorrectResult/${reportId}`,
    method: 'get'
  });
}
/**分页查询提交实验报告记录 */
export function getReportApi(queryParams: ExamReportQueryParams): AxiosPromise<{ total: number; records: ExamReportRecord[] }> {
  return request({
    // url: '/lmsWeb/subject/report/getWrittenReportPages',
    url: '/lmsWeb/subject/report/getStudentReportPages',
    method: 'get',
    params: queryParams
  });
}

/**查询实验报告详情 */
export function getReportDetailApi(reportId: number): AxiosPromise<ExamReportRecordDetail> {
  return request({
    url: `/lmsWeb/subject/report/getReportById/${reportId}`,
    method: 'get'
  });
}

/**查询学生提交答案 */
export function getStudentAnswerApi(courseExpId: number, studentId: number, reportType: number): AxiosPromise<{ content: string , reportId: number }> {
  return request({
    url: `/lmsWeb/subject/report/getReportContentByIds/${courseExpId}/${studentId}/${reportType}`,
    method: 'get'
  });
}

/**查询实验报告基本信息 */
export function getReportBaseInfoApi(courseExpId: number, studentId: number): AxiosPromise<ExamReportRecord> {
  return request({
    url: `/lmsWeb/subject/report/getReportBaseInfoByIds/${courseExpId}/${studentId}`,
    method: 'get'
  });
}

