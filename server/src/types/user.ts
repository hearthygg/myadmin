// 用户列表信息
export interface UserListInfo {
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

// 用户个人基本信息
export interface UserBaseInfo {
  /**用户id */
  userId: number;
  /**昵称 */
  nickname: string;
  /**角色 */
  roles: string[];
}
