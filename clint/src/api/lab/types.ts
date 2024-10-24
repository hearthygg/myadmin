/**
 * 实验室列表查询参数
 */
export interface LabQuery extends PageQuery {
  /**
   * 实验室名称
   */
  labName?: string;
  /**
   * 所属部门id
   */
  deptId?: number;
}
/**
 * 实验室表格数据
 */
export interface LabTable {
  /**
   * 实验室的id
   */
  labId: number;
  /**
   * 实验室名称
   */
  labName: string;
  /**
   * 所属部门名称
   */
  deptName: string;
  /**
   * 实验室地址
   */
  labAddress: string;
  /**
   * 实验室电话
   */
  labTel: string;
  /**
   * 电源关闭时间
   */
  powerOffTime: string;
}
/**
 * 实验室详细信息
 */
export interface LabDetail {
 /**
   * 实验室的id
   */
 labId: number;
 /**
  * 实验室名称
  */
 labName: string;
 /**
  * 所属部门id
  */
 deptId: number;
 /**
  * 实验室地址
  */
 labAddress: string;
 /**
  * 实验室电话
  */
 labTel: string;
 /**
  * 断电时是否关闭教师电源 1: 是  0：否
  */
 closeTeacher: number;
 /**
  * 电源关闭时间
  */
 powerOffTime: Date;
}
/**
 * 新增/编辑实验室表单信息
 */
export interface LabForm {
 /**
   * 实验室的id
   */
 labId?: number;
 /**
  * 实验室名称
  */
 labName: string;
 /**
  * 所属部门id
  */
 deptId: number;
 /**
  * 实验室地址
  */
 labAddress: string;
 /**
  * 实验室电话
  */
 labTel: string;
 /**
  * 断电时是否关闭教师电源 1: 是  0：否
  */
 closeTeacher: number;
 /**
  * 电源关闭时间
  */
 powerOffTime: Date;
}
