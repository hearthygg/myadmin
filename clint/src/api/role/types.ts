/**
 * 角色查询参数类型
 */
export interface RoleQuery extends PageQuery {
  keywords?: string;
}

/**
 * 角色分页列表项
 */
export interface Role {
  // id: string;
  // name: string;
  // code: string;
  // sort: number;
  // status: number;
  // deleted: number;
  // menuIds?: any;
  // permissionIds?: any;
  roleId: number;
  roleName: string;
  roleCode: string;
}

/**
 * 角色分页项类型
 */
export type RolePageResult = PageResult<Role[]>;

/**
 * 角色表单
 */
export interface RoleForm {
  // id?: number;
  // name: string;
  // code: string;
  // sort: number;
  // status: number;
  // /**
  //  * 数据权限
  //  */
  // dataScope: number;
  roleId?: number;
  roleCode: string;
  roleName: string;
}