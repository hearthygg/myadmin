/**
 * 实验开设查询参数
 */
export interface ExamSetQuery extends PageQuery {
  /**
   * 开设课程id
   */
  courseId: number;
}
/**
 * 实验开设表格数据
 */
export interface ExamSetTable {
  /**
   * 实验开设id
   */
  courseExpId: number;
  /**
   * 开课部门
   */
  deptName: string;
  /**
   * 实验项目
   */
  expName: string;
  /**
   * 实验室
   */
  labName: string;
  /**
   * 课程
   */
  lessonName: string;
  /**
   * 实验负责教师
   */
  teacherName: string;
  /**
   * 开课学期
   */
  termName: string;
  /**
   * 实验类型名称
   */
  courseExpTypeName: string;
  /**
   * 实验类型
   */
  courseExpType: number;
}
/**
 * 实验开设详细信息
 */
export interface ExamSetDetail {
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 排序
   */
  num: number;
  /**
   * 实验的时长
   */
  timeLength: number;
  /**
   * 实验类型 1: 开放实验 2: 集体实验 3: 分组实验
   */
  courseExpType: number;
  /**
   * 是否绑定实验台
   */
  withDesk: number;
  /**
   * 实验桌人数
   */
  deskPerUser: number;
  /**
   * 实验开始时间
   */
  startTime: number;
  /**
   * 实验的结束时间
   */
  endTime: number;
  /**
   * 所属部门id
   */
  courseId: number;
  /**
   * 对应的实验id
   */
  expId: number;
  /**
   * 实验室的id
   */
  labId: number;
  /**
   * 对应的教师id
   */
  teacherId: number;
}
/**
 * 实验开设管理：新增/编辑课程表单信息
 */
export interface ExamSetForm {
  termId?: number;
  deptId?: number;
  lessonId?: number;
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 排序
   */
  num: number;
  /**
   * 实验的时长
   */
  timeLength: number;
  /**
   * 实验类型 1: 开放实验 2: 集体实验 3: 分组实验
   */
  courseExpType: number;
  /**
   * 是否绑定实验台 1: 使用实验台 2: 不使用实验台
   */
  withDesk: number;
  /**
   * 实验桌人数
   */
  deskPerUser: number;
  /**
   * 实验开始时间
   */
  startTime: number;
  /**
   * 实验的结束时间
   */
  endTime: number;
  /**
   * 开课id
   */
  courseId: number;
  /**
   * 对应的实验id
   */
  expId: number;
  /**
   * 实验室的id
   */
  labId: number;
  /**
   * 对应的教师id
   */
  teacherId: number;
}
/**
 * 实验时间安排查询参数
 */
export interface CourseExpTimeQuery extends PageQuery {
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 结束时间
   */
  endTime?: number;
  /**
   * 开始时间
   */
  startTime?: number;
  /**教师id */
  teacherId: number;
}
/**
 * 实验时间安排列表数据
 */
export interface CourseExpTimeList {
  /**
   * 实验时间id
   */
  courseExpTimeUuid?: number;
  /**
   * 当前的人数
   */
  currentHumanNumber?: number;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 该时间段内的最大人数
   */
  maxHumanNumber?: number;
  /**
   * 开始时间
   */
  startTime?: string;
}
/**
 * 实验时间安排表单数据
 */
export interface CourseExpTimeForm {
  /**
   * 开设实验id
   */
  courseExpId: number;
  /**
   * 开课时间信息的id
   */
  courseExpTimeId?: number;
  /**
   * 结束时间
   */
  endTime: number;
  /**
   * 最大人数
   */
  maxHumanNumber: number;
  /**
   * 开始时间
   */
  startTime: number;
  /**
   * 老师id
   */
  teacherId: number;
}
/**
 * 实验时间安排表单数据
 */
export interface CourseExpStudentList {
  /**
   * 用户头像
   */
  avatar?: string;
  /**
   * 用户的校园卡号
   */
  cardID?: string;
  /**
   * 用户的班级id
   */
  claId?: number;
  /**
   * 用户的班级名称
   */
  claName?: string;
  /**
   * 用户的部门名称
   */
  deptName?: string;
  /**
   * 用户的昵称
   */
  nickName?: string;
  sex?: number;
  /**
   * 在分组实验下，选择的实验时间id
   */
  timeId?: number;
  /**
   * 用户的类别
   */
  ugroup?: number;
  /**
   * 用户的编号
   */
  uid?: string;
  /**
   * 用户的id
   */
  userId?: number;
  /**
   * 用户的账号
   */
  userName?: string;
  isChecked?: boolean;
}
/**
 * 查询学生条件
 */
export interface CourseExpStudentQuery {
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 实验时间id
   */
  timeId: number;
  teacherId: number;
  /**
   * 用户的昵称
   */
  userNickName?: string;
  /**
   * *
   * 用户的学号
   */
  userUid?: string;
}
