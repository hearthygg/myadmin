/**
 * 部门查询参数
 */
export interface DeptQuery extends PageQuery {
  deptCode?: string;
  deptName?: string;
  deptTel?: string;
}

/**
 * 部门类型
 */
export interface Dept {
  deptId?: number;
  deptCode: string;
  deptName: string;
  deptTel: string;
}

/**
 * 部门表单类型
 */
export interface DeptForm {
  id?: string;
  parentId: string;
  name: string;
  sort: number;
  status: number;
}
