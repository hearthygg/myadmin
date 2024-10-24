/**条件查询在线课程列表参数 */
export interface OnlineCourseQuery extends PageQuery {
  /**
   * 课程标题
   */
  lessonName?: string;
  /**
   * 教师的id
   */
  teacherId?: number;
  /**
   * 学期的id
   */
  termId?: number;
  /**
   * 课程类型
   */
  lessonClassification?: number;
}

/**在线课程列表 */
export interface OnlineCourseList {
  /**课程id */
  courseId: number;
  /**课程封面 */
  lessonBackImage: string;
  /**课程名称 */
  lessonName: string;
  /**任课教师名称 */
  teacherName: string;
  /**所属学期结束时间 */
  termEndTime: number;
  /**所属学期名称 */
  termName: string;
  /**所属学期开始时间 */
  termStartTime: number;
}

/**在线实验列表 */
export interface OnlineExamList {
  /**开设实验id */
  courseExpId: number;
  /**实验id */
  expId: number;
  /**实验名称 */
  expName: string;
  /**实验排序 */
  num: number;
  /**实验时长 */
  timeLength: number;
  /**实验类型 */
  type: number;
  /**实验类型名称 */
  typeName: string;
  /**实验开始时间 */
  startTime: number;
  /**实验结束时间 */
  endTime: number;
  /**分组实验timeId */
  courseExpTimeId: number;
}

