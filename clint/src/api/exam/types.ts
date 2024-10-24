import { ExamSetDetail } from '../examSet/types';

/**
 * 实验查询参数
 */
export interface ExamQuery extends PageQuery {
  /**
   * 实验名称
   */
  expName?: string;
  /**
   * 关联的课程id
   */
  lessonId?: number;
  /**
   * 是否自动开设 1 :开课后手动开设 0 :开课后自动开设
   */
  expAutoOpen?: number;
}
/**
 * 实验表格数据
 */
export interface ExamTable {
  /**
   * 实验id
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
   * 实验时长(分)
   */
  expTimeLength: number;
  /**
   * 关联课程id
   */
  lessonId: number;
  /**
   * 关联课程名称
   */
  lessonName: string;
  /**
   * 是否自动开设 1 :开课后手动开设 0 :开课后自动开设
   */
  expAutoOpen?: number;
}
/**
 * 实验详细信息
 */
export interface ExamDetail {
  /**
   * 实验id
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
   * 实验时长(分)
   */
  expTimeLength: number;
  /**
   * 关联课程id
   */
  lessonId: number;
  /**
   * 是否自动开设 1 :开课后手动开设 0 :开课后自动开设
   */
  expAutoOpen?: number;
  lessonName?: string;
}
/**
 * 新增/编辑实验表单信息
 */
export interface ExamForm {
  /**
   * 实验id
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
   * 实验时长(分)
   */
  expTimeLength: number;
  /**
   * 关联课程id
   */
  lessonId: number;
  /**
   * 是否自动开设 1 :开课后手动开设 0 :开课后自动开设
   */
  expAutoOpen?: number;
}
/**
 * 实验栏目列表信息
 */
export interface ExamColumnTable {
  /**
   * 栏目id
   */
  expInfoColumnId: number;
  /**
   * 栏目名称
   */
  expInfoColumnName: string;
  /**
   * 栏目类型 1：预习课件 2：复习课件 3：实验课件
   */
  expInfoColumnType: number;
  expInfoId: number;
}
/**
 * 实验栏目具体信息
 */
export interface ExamColumnDetail {
  /**
   * 栏目id
   */
  expInfoColumnId: number;
  /**
   * 栏目名称
   */
  expInfoColumnName: string;
  /**
   * 栏目类型 1：预习课件 2：复习课件 3：实验课件
   */
  expInfoColumnType: number;
  /**
   * 栏目顺序
   */
  expInfoColumnOrderNum: number;
}
/**
 * 实验栏目表单信息
 */
export interface ExamColumnForm {
  /**
   * 栏目id
   */
  expInfoColumnId?: number;
  /**
   * 栏目名称
   */
  expInfoColumnName: string;
  /**
   * 栏目类型 1：预习课件 2：复习课件 3：实验课件
   */
  expInfoColumnType: number;
  /**
   * 栏目顺序
   */
  expInfoColumnOrderNum: number;
}
/**
 * 实验详细设置表单信息
 */
export interface ExamDetailForm {
  /**
   * 实验课件的id
   */
  expInfoId?: number;
  /**
   * 自定义内容
   */
  expInfoContent: string;
  /**栏目名称 */
  expInfoColumnName: string;
  /**
   * 关联的实验id
   */
  expId: number;
  /**
   * 关联的栏目id
   */
  columnId: number;
  /**
   * 实验路径
   */
  expInfoPath: string;
  /**
   * 访问方式 1 :自定义内容 2 :引用界面 3 :跳转界面(不含课件) 4 :PDF预览 5 :跳转界面(含课件)
   */
  expInfoWay: number;
  /**
   * 实验箱连接方式 1 :不使用远程实验箱 2 :使用socket连接实验箱 3 :使用html5连接实验箱
   */
  expInfoBoxType: number;
  /**
   * 实验前下载文件的路径
   */
  expInfoFilePath: string;
  /**
   * 	实验箱类型
   */
  expInfoKeyFlag: string;
  /**
   * 实验箱分配方式 0 :自动分配实验设备 1 :自选实验设备
   */
  expInfoSelectDevice: number;
  /**
   * 引用标志
   */
  expInfoFlag: string;
  /**
   * 	支持的实验
   */
  expInfoFunction: string;
}

// 栏目+侧边栏图标数据
export interface SiderExamColumn extends ExamDetailForm {
  icon: string;
  iconSize: string;
}
export interface ExamBaseInfo {
  expInfo: ExamTable;
  courseExpInfo: ExamSetDetail;
  columnList: ExamColumnTable[];
  ExpInfoList: ExamDetailForm[];
}
