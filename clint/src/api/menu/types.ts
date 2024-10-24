/**
 * 菜单查询参数类型声明
 */
export interface MenuQuery {
  keywords?: string;
  visible?: number;
  type?: number;
}

/**
 * 菜单分页列表项声明
 */

export interface Menu {
  id?: number;
  parentId: number;
  type?: string | 'CATEGORY' | 'MENU' | 'EXTLINK';
  createTime: string;
  updateTime: string;
  name: string;
  icon: string;
  component: string;
  sort: number;
  visible: number;
  children: Menu[];
}
/**前端路由表 */
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
/**
 * 菜单表单类型声明
 */
export interface MenuForm {
  /**
   * 菜单ID
   */
  menuId?: number;
  /**
   * 父菜单ID
   */
  parentId: number;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 菜单是否可见(1:否;0:是;)
   */
  visible: number;
  icon?: string;
  /**
   * 排序
   */
  orderNum: number;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 路由路径
   */
  path: string;
  /**
   * 跳转路由路径
   */
  redirectUrl?: string;

  /**
   * 菜单类型 (1:目录；2:菜单；3:外链；4:按钮)
   */
  type: number;

  /**
   * 权限标识
   */
  perm?: string;
}

/**
 * 资源(菜单+权限)类型
 */
export interface Resource {
  /**
   * 菜单值
   */
  value: string;
  /**
   * 菜单文本
   */
  label: string;
  /**
   * 子菜单
   */
  children: Resource[];
}

/**
 * 权限类型
 */
export interface Permission {
  /**
   * 权限值
   */
  value: string;
  /**
   * 权限文本
   */
  label: string;
}
