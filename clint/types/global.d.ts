// 申明外部 npm 插件模块
declare module 'qrcodejs2-fixes';
declare module 'js-table2excel';
declare module 'sortablejs';
declare interface PageQuery {
  pageNum: number;
  pageSize: number;
}

declare interface PageResult<T> {
  roleList: T;
  total: number;
}

declare type DialogType = {
  title?: string;
  visible: boolean;
};

declare type OptionType = {
  value: string;
  label: string;
  checked?: boolean;
  children?: OptionType[];
};
// 声明路由当前项类型
declare type RouteItem<T = any> = {
  path: string;
  name?: string | symbol | undefined | null;
  redirect?: string;
  k?: T;
  meta?: {
    title?: string;
    isLink?: string;
    isHide?: boolean;
    isKeepAlive?: boolean;
    isAffix?: boolean;
    isIframe?: boolean;
    roles?: string[];
    icon?: string;
    isDynamic?: boolean;
    isDynamicPath?: string;
    isIframeOpen?: string;
    loading?: boolean;
  };
  children: T[];
  query?: { [key: string]: T };
  params?: { [key: string]: T };
  contextMenuClickId?: string | number;
  commonUrl?: string;
  isFnClick?: boolean;
  url?: string;
  transUrl?: string;
  title?: string;
  id?: string | number;
};
declare interface Window {
  nextLoading: boolean;
  /**用户认证信息便于子页面获取 */
  userAuthorization: string;
  token: string;
  infouuid: string;
  courseexpid: string;
  user_uuid: string;
  user_name: string;
  user_group: string;
  port: string;
  host: string;
  sessionid: string;
}
// 声明 ref
declare type RefType<T = any> = T | null;
// 申明 数组
declare type EmptyArrayType<T = any> = T[];

// 申明 对象
declare type EmptyObjectType<T = any> = {
  [key: string]: T;
};
// 申明 select option
declare type SelectOptionType = {
children: never[];
[x: string]: never[];
  value: string | number;
  label: string | number;
};
// table 数据格式公共类型
declare interface TableType<T = any> {
  total: number;
  loading: boolean;
  param: {
    pageNum: number;
    pageSize: number;
    [key: string]: T;
  };
}
declare module 'pdfjs-dist/build/pdf.worker.entry';
/**课程和实验信息树形数据 */
declare interface TreeDataList extends SelectOptionType {
  children?: SelectOptionType[]
}
/* 定义返回值的类型 */
// declare interface ResponseType<T = any> {
//   [key: string]: T;
// }


