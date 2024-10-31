/**用户实体类型 */
export interface User {
  /**用户id */
  userId: number;
  /**用户账户 */
  username: string;
  /**密码 */
  password: string;
  /**邮箱 */
  email: string;
  /**昵称 */
  nickname?: string;
  /**创建时间 */
  createTime: Date;
  /**更新时间 */
  updateTime: Date;
}

// 统一返回值的类型
export interface CommonResponse<T> {
  code: string
  message: string
  data?: T
}

// 树形选择器数据
export interface SelectOption {
  value: string | number;
  label: string;
  children?: SelectOption[];
}
