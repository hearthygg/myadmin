import { QuestionForm } from '../question/types';

/**试卷发布状态枚举值 */
export enum PaPerPublish {
  /**未发布 */
  WFB = 1,
  /**已发布 */
  YFB = 2
}
/**成绩公布状态枚举值 */
export enum ScorePublish {
  /**未公布 */
  WGB = 1,
  /**已公布 */
  YGB = 2
}
/**答案公布状态枚举值 */
export enum AnswerPublish {
  /**未公布 */
  WGB = 1,
  /**已公布 */
  YGB = 2
}
/**生成试卷表单信息 */
export interface ExamPaperForm extends ExamPaperBaseInfo {
  /**
   * 组卷人的id
   */
  paperStaffId: number;
  /**
   * 试卷的具体要求 （每一类型的题目 占比多少）
   */
  paperStipulate: PaperStipulate[];
  /**关联实验相关信息 */
  questionPaperInfos?: ExamQuestionPaperForm[];
}
// 试卷详细信息
export interface ExamPaperDetail extends ExamPaperBaseInfo {
  /**命题人名称 */
  paperStaffName: string;
  /**试题列表 */
  questions: QuestionForm[];
}
// 试卷基本信息
export interface ExamPaperBaseInfo {
  /**
   * 试卷结束时间
   */
  paperEndTime: string;
  /**
   * 考试时间,默认为90分钟
   */
  paperExamTime: string;
  /**
   * 试卷的id
   */
  paperId: string;
  /**
   * 试卷开始时间
   */
  paperStartTime: string;
  /**
   * 试卷标题
   */
  paperTitle: string;
  /**
   * 题目的总数量
   */
  paperTotalCount: number;
  /**
   * 试卷的总分数
   */
  paperTotalScore: number;
  /**
   * 提醒学生考试结束的时间间隔
   */
  timeRemind: string;
}
/**
 * 试卷相关问题的具体信息
 *
 * ExamQuestionPaperForm
 */
export interface ExamQuestionPaperForm {
  /**
   * 实验的id
   */
  expId: number;
  /**
   * 问题的id
   */
  questionId: string;
  /**
   * 试卷的分数
   */
  questionScore: number;
}
/**
 * 生成试卷的具体规则类
 * PaperStipulate
 */
export interface PaperStipulate {
  /**
   * 对应的实验id
   */
  expId: number;
  /**
   * 课程的id
   */
  lessonId: number;
  /**
   * 问题的难易度
   */
  questionLevel: number;
  /**
   * 问题的数量
   */
  questionNumber: number;
  /**
   * 该类题目的分数
   * 可以为空，如果为空的话,取问题的分数
   */
  questionScore?: number;
  /**
   * 问题的类型
   */
  questionType: number;
}
export interface PaperListQuery extends PageQuery {
  /**
   * 试卷的结束时间
   */
  paperEndTime?: string;
  /**
   * 试卷信息
   */
  paperKeyWord?: string;
  /**
   * 试卷开始时间
   */
  paperStartTime?: string;
  /**
   * 试卷命题人的id信息
   */
  staffId?: string;
  /**试卷发布状态 */
  paperPublish?: number;
  /**分数公布状态 */
  scorePublish?: number;
  /**答案公布状态 */
  answerPublish?: number;
}
/**试卷列表基础数据 */
export interface PaperList {
  /**试卷结束时间 */
  paperEndTime: string;
  /**试卷考试时长 */
  paperExamTime: string;
  /**试卷id */
  paperId: string;
  /**命题人名称 */
  paperStaffName: string;
  /**试卷开始时间 */
  paperStartTime: string;
  /**试卷标题 */
  paperTitle: string;
  /**总题数 */
  paperTotalCount: number;
  /**总分数 */
  paperTotalScore: number;
  /**试卷发布状态 */
  paperPublish: number;
  /**分数公布状态 */
  scorePublish: number;
  /**答案公布状态 */
  answerPublish: number;
}

/**
 * ExamPaperUserForm
 */
export interface UserPaperRes {
  /**
   * 试卷的id
   */
  paperId: string;
  /**
   * 学生提交的问题记录
   */
  studentSubmitInfos?: UserPaperSubmit[];
}

/**
 * 用来记录学生试卷提交时，每一题的数据消息
 *
 * UserPaperSubmit
 */
export interface UserPaperSubmit {
  /**
   * 提交的问题的答案
   */
  answer?: string[];
  /**
   * 选择题的选项id列表
   */
  optionIds?: string[];
  /**
   * 问题的id
   */
  questionId: string;
  /**
   * 该试卷下的问题的分数
   */
  score: number;
}
/**考试结果列表条件查询条件 */
export interface PaperResListQuery extends PageQuery {
  /**
   * 试卷被是否审批
   * 0 :未审批
   * 1 :以审批
   */
  auditState?: number;
  /**
   * 班级的id
   */
  claId?: number;
  /**
   * 试卷的id
   */
  paperId: string;
  /**
   * 学生是否提交试卷
   * 1 :未提交
   * 2 :已提交
   */
  studentSubmitState?: number;
  /**
   * 学生姓名
   */
  userName?: string;
}
/**提交结果列表 */
export interface PaperResDetail {
  /**是否批改0：未批改 1：已批改 */
  auditState: number;
  /**班级名称 */
  claName: string;
  /**总分 */
  score: number;
  /**学生id */
  studentId: number;
  /**学生名称 */
  studentName: string;
  /**提交状态 1:未提交 2:已提交 */
  studentSubmitState: number;
}
/**提交结果详情 */
