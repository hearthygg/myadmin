import { ExamDetail } from '@/api/exam/types';
import { ExamQuestionPaperForm } from '../examPaper/types';
// 枚举的作用：通过枚举来替代无意义的订单状态数字，提高程序可读性
/** 问题选项状枚举值 */
export enum Question {
  /** 单选题 */
  DanX = 1,
  /** 多选题 */
  DuoX = 7,
  /** 填空题 */
  TK = 2,
  /** 判断题 */
  PD = 3,
  /** 简答题 */
  JD = 4,
  /** 计算题 */
  JS = 5,
  /** 综合题 */
  ZH = 6
}
/** 选择题选项枚举值 */
export enum SelectQuestionEnum {
  A = 1,
  B = 2,
  C = 3,
  D = 4,
  E = 5,
  F = 6,
  G = 7
}
/** 试题等级枚举值 */
export enum QuestionLevelEnum {
  /**简单 */
  JD = 1,
  /**基础 */
  JC = 2,
  /**中等 */
  ZD = 3,
  /**困难 */
  KN = 4
}
export interface LessonChild {
  /**章节id */
  chapterId: string;
  /**课程id */
  lessonId: string;
}
export interface SelectOption {
  /**选项id */
  optionId?: string;
  /**对应的选项内容 */
  optionText: string;
  /**是否是正确的答案 1:正确 2:错误 */
  optionCorrect: number;
}

/**问题表单信息 */
export interface QuestionForm {
  /**问题id */
  questionId?: string;
  /**正确答案 */
  answer: string[];
  /**题目的解析 */
  questionAnalysis: string;
  /**题干 */
  question: string;
  /**问题的难易度 3个等级，基本(1)、较难(2)、创见发挥(3) */
  questionLevel: number;
  /**问题类型：1：单选 ,多选 2 ：填空题 3:判断题 4:问答题 5:计算题 6:综合题 */
  questionType: number;
  /**分数 */
  score: number;
  /**选择题选项信息 */
  questionOptions: SelectOption[];
  /**关联的实验id*/
  expIds: number[];
  /**关联实验详细信息 */
  expForms?: ExamDetail[];
  lessonInfo?: ExamQuestionPaperForm;
}
/**试题列表查询参数 */
export interface QuestionListQuery extends PageQuery {
  /**题干信息 */
  questionKeyWord: string;
  /**问题的等级 */
  questionLevel: number;
  /**问题的类型 */
  questionType: number;
  /**实验的id信息 */
  expId: number;
}
/**试题列表表格数据 */
export interface QuestionTable {
  /**题目id */
  questionId: string;
  /**问题的等级 */
  questionLevel: number;
  /**问题的类型 */
  questionType: number;
  /**题干信息 */
  question: string;
  /**题目分数 */
  score: number;
}
