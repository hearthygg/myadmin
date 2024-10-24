/**
 * 实验桌列表查询参数
 */
export interface LabDeskQuery extends PageQuery {
  /**
   * 实验桌名称
   */
  deskName?: string;
  /**
   * 实验桌的ip地址
   */
  deskIp?: number;
  /**
   * 所属实验室的id
   */
  labId?: number;
}
/**
 * 实验桌表格数据
 */
export interface LabDeskTable {
  /**
   * 实验桌id
   */
  deskId: number;
  /**
   * 实验桌名称
   */
  deskName: string;
  /**
   * 所属实验室
   */
  labName: string;
  /**
   * 实验桌ip地址
   */
  deskIp: string;
  /**
   * 实验桌端口号
   */
  deskPort: string;
  /**
   * 实验桌的状态 1:实验桌正常 0:实验桌故障
   */
  deskState: number;
}
/**
 * 实验桌详细信息
 */
export interface LabDeskDetail {
  /**
   * 实验桌id
   */
  deskId: number;
  /**
   * 实验桌名称
   */
  deskName: string;
  /**
   * 实验桌的ip地址
   */
  deskIp: string;
  /**
   * 实验桌端口号
   */
  deskPort: string;
  /**
   * 所属实验室的id
   */
  labId: number;
  /**
   * 实验桌的状态 1:实验桌正常 0:实验桌故障
   */
  deskState: number;
}
/**
 * 新增/编辑实验桌表单信息
 */
export interface LabDeskForm {
  /**
   * 实验桌id
   */
  deskId?: number;
  /**
   * 实验桌名称
   */
  deskName: string;
  /**
   * 实验桌的ip地址
   */
  deskIp: string;
  /**
   * 实验桌端口号
   */
  deskPort: string;
  /**
   * 所属实验室的id
   */
  labId: number;
  /**
   * 实验桌的状态 1:实验桌正常 0:实验桌故障
   */
  deskState: number;
}
