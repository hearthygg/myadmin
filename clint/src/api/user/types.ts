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
  ugroup?: number; //用户类型
  userName?: string; //用户账户
  nickName?: string; //用户名称
  deptId?: number; //所属部门id
  claId?: number; //所在班级id
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
  userId: number;
  userName: string;
  nickName: string;
  cardID: string;
  uid: string;
  deptName: string;
  claName: string;
}
/**
 * 用户表单类型声明
 */
export interface UserForm {
  userId: number | undefined; //用户id
  nickName: string; //用户名
  uid: string;
  userName: string; //账号
  cardID: string; //校园卡号
  deptId: number; //部门id
  claId: number; //班级id
  ugroup: number; //用户类型
  tel: string; //电话
  roleIds: number[]; //角色集合
  pwd: string; //密码
  birthday: number;
  sex: number;
  avatar: string;
}

/* 新增/编辑用户表单信息 */
export interface UpdateUser extends UserForm {
  avatar: any; //头像
  sex: number; //性别
  birthday: number; //生日
  newPassword: string;
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
