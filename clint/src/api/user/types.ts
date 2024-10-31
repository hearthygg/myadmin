/**
 * 登录用户信息
 */
export interface UserInfo {
  userId: number; //用户id
  nickname: string; //昵称
  avatar: string; //头像
  ugroup: number; //用户类型
  roles: string[]; //角色
  roleNames: string[]; //角色名称集合
  perms: string[]; //权限
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  username?: string;
  nickname?: string;
  sex?: number;
}

/**
 * 用户分页列表项声明
 */
export interface UserType {
  id: string;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptName: string;
  roleNames: string;
  createTime: string;
}

/**
 * 用户分页项类型声明
 */
export type UserPageResult = PageResult<UserType[]>;

export interface UserTable {
  /**用户id */
  userId: number;
  /**昵称 */
  nickname: string;
  /**用户账号 */
  username: string;
  /**邮箱 */
  email: string;
  /**性别 */
  sex: string;
  /**头像 */
  avatar: string;
  /**电话 */
  telPhone: string;
}
/**
 * 用户表单类型声明
 */
export interface UserForm {
  /**用户id */
  userId?: number;
  /**昵称 */
  nickname: string;
  /**用户账号 */
  username: string;
  /**邮箱 */
  email?: string;
  /**性别 */
  sex?: string;
  /**头像 */
  avatar?: string;
  /**电话 */
  telPhone?: string;
  /**用户角色 */
  roleRemarks?: number[];
}

/* 新增/编辑用户表单信息 */
export interface UpdateUser extends UserForm {
  confirmNewPassword: string;
}

/**
 * 用户导入表单类型声明
 */
export interface UserImportData {
  deptId: number;
  roleIds: number[];
}

/* 用户修改密码数据类型 */
export interface UserPwd {
  userId: number;
  pwd: string;
  newPassword: string;
  confirmNewPassword: string;
}
