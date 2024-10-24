/**登录请求体信息 */
export interface LoginBody {
  /**用户账户 */
  username: string;
  /**密码 */
  password: string;
}

export interface UserBaseInfo {
  /**用户id */
  userId: number;
  /**昵称 */
  nickname: string;
  /**角色 */
  roles: string[];
}

export interface ClintRoute {
  /**权限ID */
  permissionId: number;
  /**路径 */
  path: string;
  /**组件路径或名称 */
  component: string;
  /**父权限ID */
  parentPermissionId: number | null;
  /**重定向路径 */
  redirect?: string;
  /**路由元信息 */
  meta: {
    /**标题 */
    title: string;
    /**图标 */
    icon: string | null;
    /**是否隐藏 */
    hidden: boolean;
    /**是否缓存 */
    keepAlive: boolean;
  };
  children?: ClintRoute[];
}
