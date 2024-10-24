/**
 * 实验回放记录查询参数
 */
export interface PlayBackRecordQuery extends PageQuery {
  /**
   * 设备的名称
   */
  deviceName?: string;
  /**
   * 设备的类型
   */
  deviceType?: number;
  /**
   * 用户的姓名
   */
  userName?: string;
}
/**
 * 实验回放记录表格数据
 */
export interface PlayBackRecordTable {
  /**实验名称 */
  expName?: string;
  /**
   * 使用的设备名
   */
  deviceName?: string;
  /**
   * 回放的id
   */
  deviceReplayId: number;
  /**
   * 当前回放记录的结束时间
   */
  endTime?: number;
  /**
   * 回放的实验路径
   */
  replayFilePath?: string;
  /**
   * 当前回放记录的开始时间
   */
  startTime?: number;
  /**
   * 使用的设备的用户id
   */
  userId?: number;
  /**
   * 使用的设备的用户名称
   */
  userName?: string;
  /**
   * 使用的设备的用户uid
   */
  userUid?: string;
  expInfoPath: string;
  deviceType: string;
}
/**
 * 实验监控表格数据
 */
export interface MonitorTable {
  /**
   * 设备id
   */
  deviceId?: number;
  /**
   * 设备名称
   */
  deviceName?: number;

  hardWareNum: string;

  deviceNum?: string;

  deviceType?: number;

  deviceState?: number;

  hardWareType?: string;

  userInfo?: string;
  userId: string;
  expInfoVos: any;
  /**设备在线状态 */
  onLineState: number;
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
