/**试卷相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {ExamPaperForm,PaperListQuery, PaperList, ExamPaperDetail,PaPerPublish, UserPaperRes, PaperResListQuery, PaperResDetail} from './types';
import { QuestionForm} from '../question/types';

/**生成试卷需要的问题列表 */
export function addExamPaperApi(data: ExamPaperForm):AxiosPromise<{questions: QuestionForm[]}> {
  return request({
    url: '/lmsWeb/examPaper/compositePaperQuestion',
    method: 'post',
    data: data
  });
}
/**二次确认进行组合试卷 */
export function confirmAddPaperApi(data: ExamPaperForm) {
  return request({
    url: '/lmsWeb/examPaper/savePaperInfo',
    method: 'post',
    data: data
  });
}
/**条件查询试卷列表 */
export function getPaperListApi(queryParams: PaperListQuery) :AxiosPromise<{total: number, questionList: PaperList[]}> {
  return request({
    url: '/lmsWeb/examPaper/pages',
    method: 'get',
    params: queryParams
  });
}
/**获取试卷详细信息 */
export function getPaperDetailApi(paperId: string) :AxiosPromise<{paper: ExamPaperDetail}> {
  return request({
    url: `/lmsWeb/examPaper/getPaperInfoById/${paperId}`,
    method: 'get',
  });
}
/**发布/撤回试卷 */
export function changePaperPublishState(paperId: string,publishState: number) {
  if(publishState === PaPerPublish.WFB) {
    // 发布试卷
    return request({
      url: `/lmsWeb/examPaper/publishPaper/${paperId}`,
      method: 'patch',
    });
  } else if(publishState === PaPerPublish.YFB) {
    // 撤回试卷
    return request({
      url: `/lmsWeb/examPaper/unPublishedPaper/${paperId}`,
      method: 'patch',
    });
  }
}
/**条件查询用户的试卷列表 */
export function getUserPaperListApi(queryParams: PaperListQuery) :AxiosPromise<{total: number, papers: PaperList[]}> {
  return request({
    url: '/lmsWeb/examPaper/getPaperPageByStudentInfo',
    method: 'post',
    params: queryParams
  });
}
/**提交学生考试结果 */
export function submitPaperResApi(data: UserPaperRes) {
  return request({
    url: '/lmsWeb/examPaper/submitPaper',
    method: 'post',
    data,
  });
}

/**查询某张试卷下学生的提交结果列表 */
export function getPaperResListApi(queryParams: PaperResListQuery) :AxiosPromise<{total: number, studentInfos: PaperResDetail[]}> {
  return request({
    url: '/lmsWeb/examPaper/getStudentPagesByPaperId',
    method: 'get',
    params: queryParams
  });
}

/**根据学生提交的结果查询详情 */
export function getPaperResDetailApi(paperId: string) :AxiosPromise<{paper: ExamPaperDetail}> {
  return request({
    url: `/lmsWeb/examPaper/getPaperInfoById/${paperId}`,
    method: 'get',
  });
}
