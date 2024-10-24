/**
 * 课程查询参数
 */
export interface CourseQuery extends PageQuery {
  /**
   * 课程名称
   */
  lessonName?: string;
  /**
   * 课程编号
   */
  lessonNumber?: string;
  /**
   * 课程学分
   */
  lessonCredit?: string;
  /**
   * 课程学时
   */
  lessonPeriod?: string;
  /**
   * 课程标志
   */
  lessonFlag?: string;
  /**
   * 课程类型
   */
  lessonClassification?: string;
}
/**
 * 课程表格数据
 */
export interface CourseTable {
  /**
   * 课程id
   */
  lessonId: number;
  /**
   * 课程名称
   */
  lessonName: string;
  /**
   * 课程编号
   */
  lessonNumber: string;
  /**
   * 课程学分
   */
  lessonCredit: string;
  /**
   * 课程学时
   */
  lessonPeriod: string;
  /**
   * 课程标志
   */
  lessonFlag: string;
  /**
   * 课程的背景图片
   */
  lessonBackImage: string;
  /**课程类型 */
  lessonClassification: string;
}
/**
 * 课程详细信息
 */
export interface CourseDetail {
  /**
   * 课程id
   */
  lessonId: number;
  /**
   * 课程名称
   */
  lessonName: string;
  /**
   * 课程编号
   */
  lessonNumber: string;
  /**
   * 课程学分
   */
  lessonCredit: string;
  /**
   * 课程学时
   */
  lessonPeriod: string;
  /**
   * 课程标志
   */
  lessonFlag: string;
  /**
   * 课程的背景图片
   */
  lessonBackImage: string;
}
/**
 * 新增/编辑课程表单信息
 */
export interface CourseForm {
  /**
   * 课程id
   */
  lessonId?: number;
  /**
   * 课程名称
   */
  lessonName: string;
  /**
   * 课程编号
   */
  lessonNumber: string;
  /**
   * 课程学分
   */
  lessonCredit: string;
  /**
   * 课程学时
   */
  lessonPeriod: string;
  /**
   * 课程标志
   */
  lessonFlag: string;
  /**
   * 课程的背景图片
   */
  lessonBackImage: string;
  /**
   * 课程类型
   */
  lessonClassification?: string;
}
export interface MergeCourseData {
  /**
   * 合并后的新课程名称
   */
  newLessonName: string;
  /**
   * 合并后的新课程编号
   */
  newLessonNum: string;
  /**
   * 合并的课程id集合
   */
  selectedLessonIds?: {
    ids: number[]
  };
  /**
   * 课程类型
   */
  lessonClassification?: number;
}
