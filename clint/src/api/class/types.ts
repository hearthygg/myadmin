/**
 * 班级查询参数
 */
export interface ClassQuery extends PageQuery {
  claName?: string; //班级名称
  major?: string; //所修专业/职能
  claShortName?: string; //班级简称
  deptId?: number; //部门id
  termId?: number; //学期id
}

/* 查询班级获取表格数据 */
export interface ClassTable {
  total: number,
  claList: QueryClass,
}


/**
 * 班级基本数据类型
 */
 export interface BaseClass {
  claId: number; //班级id
  major: string; //所修专业/职能
  claName: string; //班级名称
  claShortName: string; //班级简称
}

/**
 * 查询返回班级数据类型
 */
export interface QueryClass extends BaseClass {
  deptName: string; //部门名称
  termName: string; //学期名称
}

/**
 * 班级详细信息
 */
 export interface DetailClass extends BaseClass {
  deptId: number; //部门id
  termId: number; //学期id
}

/**
 * 班级表单类型
 */
export interface ClassForm {
  claId?: number; //班级ID
  claName: string; //班级名称
  major: string; //所修专业/职能
  claShortName: string; //班级简称
  deptId: number; //部门id
  termId: number; //学期id
}
