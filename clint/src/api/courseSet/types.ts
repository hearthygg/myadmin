/**
 * 开课管理课程查询参数
 */
export interface CourseQuery extends PageQuery {
  /**
   * 开课的部门id
   */
  deptId?: number;
  /**
   * 开课的课程id
   */
  lessonId?: number;
  /**
   * 开课的任课教师的id
   */
  teacherId?: number;
  /**
   * 当前开课的学期id
   */
  termId?: number;
  /**
   * 开课号
   */
  courseOpenCode?: string;
}
/**
 * 查询学生树状数据查询参数
 */
export interface StudentTreeQuery extends PageQuery {
  /**
   * 部门id
   */
  deptId?: number;
  /**
   * 开课的课程id
   */
  claId?: number;
  /**
   * 学生的姓名/学号
   */
  studentKeyWord?: string;
}
/**
 * 导入学生模块学生基本信息
 */
export interface InputStudentInfo {
  /**
   * 学生id
   */
  userId: number;
  /**
   * 学生名称
   */
  nickName: string;
  /**
   * 部门名称
   */
  deptName: string;
  /**
   * 班级名称
   */
  claName: string;
  /**
   * 账号/学号
   */
  userName: string;
  /**
   * 班级id
   */
  claId: string;
}
/**
 * 开课管理课程表格数据
 */
export interface CourseTable {
  /**
   * 开课id
   */
  courseId: number;
  /**
   * 课程id
   */
  lessonId: number;
  /**
   * 课程名称
   */
  lessonName: string;
  /**
   * 任课教师
   */
  teacherName: string;
  /**
   * 部门id
   */
  deptId: number;
  /**
   * 开课部门
   */
  deptName: string;
  /**
   * 学期id
   */
  termId: number;
  /**
   * 开课学期
   */
  termName: string;
  /**
   * 开课号
   */
  courseOpenCode: string;
  /**
   * 备注
   */
  markContent: string;
  /**教师id */
  teacherId: number;
}
/**
 * 开课管理课程详细信息
 */
export interface CourseDetail {
  /**
   * 开课id
   */
  courseId: number;
  /**
   * 开课编号
   */
  courseOpenCode: string;
  /**
   * 课程id
   */
  lessonId: number;
  /**
   * 所属部门id
   */
  deptId: number;
  /**
   * 任课教师id
   */
  teacherId: number;
  /**
   * 开课学期id
   */
  termId: number;
  /**
   * 实验时长 单位(min)
   */
  timeLength: number;
  /**
   * 备注信息
   */
  markContent: string;
  /**
   * 关联的实验室id
   */
  labId: number;
}
/**
 * 开课管理：新增/编辑课程表单信息
 */
export interface CourseForm {
  /**
   * 开课id
   */
  courseId?: number;
  /**
   * 开课编号
   */
  courseOpenCode: string;
  /**
   * 课程id
   */
  lessonId: number;
  /**
   * 所属部门id
   */
  deptId: number;
  /**
   * 任课教师id
   */
  teacherId: number;
  /**
   * 开课学期id
   */
  termId: number;
  /**
   * 实验时长 单位(min)
   */
  timeLength: number;
  /**
   * 备注信息
   */
  markContent: string;
  /**
   * 关联的实验室id
   */
  labId: number;
}
/**
 * 选课查询参数
 */
export interface CourseSelectQuery extends PageQuery {
  /**
   * 开设课程的id
   */
  courseId?: number;
  /**
   * 课程的id
   */
  lessonId?: number;
  /**
   * 状态
   * 0 :CHOOSED
   * 1 :UNCHOOSED
   */
  status?: number;
  /**
   * 教师的id
   */
  teacherId?: number;
  /**
   * 学期的id
   */
  termId?: number;
  /**
   * 当前用户的id
   */
  userId?: number;
}
/**
 * 实验选课表格数据
 */
export interface CourseSelectList {
  /**
   * 开设实验的id
   */
  courseExpId?: number;
  /**
   * 绑定的学生的id
   */
  courseExpStudentId?: number;
  /**
   * 选课类型
   */
  courseExpType?: number;
  /**
   * 选课类型名称
   */
  courseExpTypeName?: string;
  /**
   * 部门的id
   */
  deptId?: number;
  /**
   * 开课部门
   */
  deptName?: string;
  /**
   * 实验的id
   */
  expId?: number;
  /**
   * 实验项目
   */
  expName?: string;
  /**
   * 实验室的id
   */
  labId?: number;
  /**
   * 实验室名称
   */
  labName?: string;
  /**
   * 课程的id
   */
  lessonId?: number;
  /**
   * 课程名称
   */
  lessonName?: string;
  /**
   * 开课教师id
   */
  teacherId?: number;
  /**
   * 实验负责教师
   */
  teacherName?: string;
  /**
   * 学期id
   */
  termId?: number;
  /**
   * 学期名称
   */
  termName?: string;
  /**绑定选课id */
  courseExpTimeId?: number;
}
