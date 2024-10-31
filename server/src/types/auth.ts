/**登录请求体信息 */
export interface LoginBody {
  /**用户账户 */
  username: string;
  /**密码 */
  password: string;
}


// 个人路由表
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
  meta?: {
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

// 菜单表
export interface Menu {
  /**权限ID */
  permissionId?: number;
  /**权限名称 */
  permissionName: string;
  /**路径 */
  path: string;
  /**权限类型 */
  permissionType: number;
  /**图标 */
  icon: string | null;
  /**是否隐藏 */
  hidden: boolean;
  /**组件路径或名称 */
  component: string;
  /**父权限ID */
  parentPermissionId: number | null;
  sort: number;
  /**重定向路径 */
  redirect?: string;
  children?: Menu[];
}

