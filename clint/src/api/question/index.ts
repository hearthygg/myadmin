/**试题相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuestionForm,QuestionListQuery,QuestionTable } from './types';

/**录入试题 */
export function inputQuestionApi(data: QuestionForm) {
  return request({
    url: '/lmsWeb/examQuestion/addQuestion',
    method: 'post',
    data: data
  });
}
/**查询试题列表 */
export function getQuestionData(queryParams: QuestionListQuery) :AxiosPromise<{total: number, questionList: QuestionTable[]}> {
  return request({
    url: '/lmsWeb/examQuestion/pages',
    method: 'get',
    params: queryParams
  });
}
/**获取题目详细信息 */
export function getQuestionDetail(questionId: string) :AxiosPromise<{question: QuestionForm}> {
  return request({
    url: `/lmsWeb/examQuestion/getQuestionById/${questionId}`,
    method: 'get',
  });
}
/**编辑试题信息 */
export function updateQuestion(data: QuestionForm) {
  return request({
    url: `/lmsWeb/examQuestion/updateQuestion`,
    method: 'put',
    data,
  });
}
/**删除试题信息 */
export function deleteQuestions(ids: string) {
  return request({
    url: `/lmsWeb/examQuestion/deleteQuestionById/${ids}`,
    method: 'delete'
  });
}
