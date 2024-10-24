/* 学期相关api数据类型 */

/* 查询学期数据类型 */
export interface TermQuery extends PageQuery {
  termName?: string; //学期名称
  currentTerm?: string; //当前学期 1:当前学期 0: 非当前学期
  startTime?: number; //开始时间 时间戳
  endTime?: number; //结束时间 时间戳
}
/* 查询学期获取表格数据 */
export interface TermTable {
  total: number,
  termList: BaseTerm,
}

/* 学期含有的基本数据 */
export interface BaseTerm {
  termId: number;//学期id
  currentTerm: string; //当前学期 1:当前学期 0: 非当前学期
  startTime: number; //开始时间 时间戳
  endTime: number; //结束时间 时间戳
  termName: string;//学期名称
}

/* 学期表单数据类型 */
export interface TermForm {
  termId?: number;//学期id
  currentTerm: string; //当前学期 1:当前学期 0: 非当前学期
  startTime: number; //开始时间 时间戳
  endTime: number; //结束时间 时间戳
  termName: string;//学期名称
}
