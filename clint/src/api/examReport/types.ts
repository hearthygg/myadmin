/**
 * 实验报告数据类型
 */
export interface ExamReport {
  /**题干 */
  stem: string;
  /**答题项 */
  answerOptions: AnswerOptions[];
}
/**学生提交答案的数据类型 */
export interface SubmitAnswer {
  /**题目序号 */
  questionIndex: number;
  /**答案集合 */
  answerGroups: string[];
}
/**教师批改评分细则 */
export interface CorrectionDetail {
  /**题目序号 */
  questionIndex: number;
  /**答案集合 */
  answerGroups: {
    tips: string;
    score: number | null;
  }[];
  /**点评 */
  remark: string;
}
/**实验报告答题项类型 */
export interface AnswerOptions {
  /**答题类型 */
  answerType: string;
  /**数据采集类型 */
  collectionType: string;
  /**数据类型 */
  dataType: string;
  /**正确答案 */
  trueResult: string;
  /**题目分数 */
  core: number;
  /**提交结果 */
  submitResult: string;
}

/**新增/更新实验报告表单 */
export interface ExamReportForm {
  /**
   * 是否自动开设
   */
  expAutoOpen?: number;
  /**
   * 实验项目的id
   */
  expId: number;
  /**
   * 实验名称
   */
  expName: string;
  /**
   * 实验顺序
   */
  expOrderNum: number;
  /**
   * 实验报告信息
   */
  expReportInfo?: string;
  /**
   * 实验的时长
   */
  expTimeLength?: number;
  /**
   * 关联的课程id
   */
  lessonId: number;
}

/**学生提交实验报告表单 */
export interface SubmitExamReportForm {
  /**报告id */
  reportId?: number;
  /**访问方式 */
  reportType: number;
  // 开设实验id
  courseExpId: number;
  // 提交内容
  content: string;
}
/**批改实验报告表单 */
export interface CorrectExamReportForm {
  /**报告id */
  reportId: number;
  /**实验报告评论 */
  comment: string;
  /**报告分数 */
  score: number;
  // 提交内容
  content: string;
}
/**实验报告查询条件 */
export interface ExamReportQueryParams extends PageQuery {
  /**
   * 批改状态
   */
  correctionStatus?: number;
  /**开课学期 */
  termId?: number;
  /**任课教师 */
  teacherId?: number;
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 开设课程的id
   */
  courseId: number;
  /**
   * 提交状态
   */
  submitStatus?: number;
  /**
   * 学生名称
   */
  username?: string;
}
/**实验报告提交记录表格信息 */
export interface ExamReportRecord {
  /**提交类型 */
  reportType: number;
  reportId: number;
  uid: string;
  userNickName: string;
  claName: string;
  uploadTime: string;
  score: string;
  teacherName: string;
  submitStatus: number;
  correctionStatus: number;
  correctedTime: string;
  /**实验名称 */
  lessonName: string;
  /**实验id */
  expId: number;
}

/**实验报告提交记录详细信息 */
export interface ExamReportRecordDetail {
  /**
   * 实验报告的评论
   */
  comment?: string;
  /**
   * 主要内容
   */
  content?: string;
  /**
   * 批改状态
   */
  correctionStatus?: number;
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 开设课程的id
   */
  courseId: number;
  /**
   * 开设实验的名称
   */
  expName?: string;
  /**
   * 附件的路径
   */
  path?: string;
  /**
   * 实验报告的id
   */
  reportId: number;
  /**
   * 报告的得分
   */
  score?: string;
  /**
   * 学生的id
   */
  studentId: number;
  /**
   * 学生的姓名
   */
  studentName?: string;
  /**
   * 学生的学号
   */
  studentUid?: string;
  /**
   * 提交状态
   */
  submitStatus?: number;
  /**
   * 教师的id
   */
  teacherId: number;
  /**
   * 教师的姓名
   */
  teacherName?: number;
}
