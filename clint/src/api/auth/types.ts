/**
 * 登录数据类型
 */
export interface LoginData {
  /**
   * 密码
   */
  password: string;
  /**
   * 用户名
   */
  username: string;
}

/**
 * Token响应类型
 */
export interface TokenResult {
  Authorization: string;
}

/**
 * 验证码类型
 */
export interface VerifyCode {
  verifyCodeImg: string;
  verifyCodeKey: string;
}
/**
 * 所有的枚举类型
 */
export interface SelectEnumType {
  /**
   * 菜单类型选择枚举值
   */
  MenuTypeOptions: SelectOptionType[];
  /**
   * 菜单是否显示枚举值
   */
  statusOptions: SelectOptionType[];
  /**
   * 实验开设枚举值
   */
  lessonAutoOpenOptions: SelectOptionType[];
  /**
   * 用户身份枚举值
   */
  userGroupOptions: SelectOptionType[];
  /**
   * 当前学期枚举值
   */
  currentTermOptions: SelectOptionType[];
  /**
   * 栏目类型枚举值
   */
  expInfoTypeColumnOptions: SelectOptionType[];
  /**
   * 实验访问方式枚举值
   */
  expInfoWayOptions: SelectOptionType[];
  /**
   * 性别选择
   */
  genderOptions: SelectOptionType[];
  /**
   * 实验箱连接方式
   */
  boxTypeOptions: SelectOptionType[];
  /**
   * 实验箱分配方式
   */
  selectDeviceOptions: SelectOptionType[];
  /**
   * 实验箱类型选择
   */
  DeviceBoxsOptions: SelectOptionType[];
  /**
   * 实验箱状态
   */
  DeviceBoxsStateOptions: SelectOptionType[];
  /**
   * 断电时是否关闭教师电源
   */
  labCloseTeacherPowerOptions: SelectOptionType[];
  /**
   * 实验桌的状态 1:实验桌正常 0:实验桌故障
   */
  deskStateOptions: SelectOptionType[];
  /**
   * 开设实验实验类型 1: 开放实验 2: 集体实验 3: 分组实验
   */
  courseExpTypeOptions: SelectOptionType[];
  /**
   * 开设实验是否绑定实验台 1: 使用实验台 2: 不使用实验台
   */
  courseExpWithDeskOptions: SelectOptionType[];
  /**硬件设备类型 */
  hardWareTypeOptions: SelectOptionType[];
  /**门禁设备类型 */
  DeviceDoorsOptions: SelectOptionType[];
  /**门禁设备状态 */
  DeviceDoorsStateOptions: SelectOptionType[];
  /**ic读卡器设备类型 */
  DeviceIcsOptions: SelectOptionType[];
  /**ic读卡器设备状态 */
  DeviceIcsStateOptions: SelectOptionType[];
  /**出入判决器设备类型 */
  DeviceIrsOptions: SelectOptionType[];
  /**出入判决器设备状态 */
  DeviceIrsStateOptions: SelectOptionType[];
  /**机位控制器设备类型 */
  DevicePowersOptions: SelectOptionType[];
  /**机位控制器设备状态 */
  DevicePowersStateOptions: SelectOptionType[];
  /**RFID读卡器设备类型 */
  DeviceRfidsOptions: SelectOptionType[];
  /**RFID读卡器设备状态 */
  DeviceRfidsStateOptions: SelectOptionType[];
}
/**实验相关枚举类型 */
export interface examEnumType {
  /**
   * 实验箱类型选择
   */
  DeviceBoxesOptions: SelectOptionType[];
  /**
   * 实验箱状态
   */
  DeviceBoxsStateOptions: SelectOptionType[];
  /**门禁设备类型 */
  DeviceDoorsOptions: SelectOptionType[];
  /**门禁设备状态 */
  DeviceDoorsStateOptions: SelectOptionType[];
  /**ic读卡器设备类型 */
  DeviceIcsOptions: SelectOptionType[];
  /**ic读卡器设备状态 */
  DeviceIcsStateOptions: SelectOptionType[];
  /**出入判决器设备类型 */
  DeviceIrsOptions: SelectOptionType[];
  /**出入判决器设备状态 */
  DeviceIrsStateOptions: SelectOptionType[];
  /**机位控制器设备类型 */
  DevicePowersOptions: SelectOptionType[];
  /**机位控制器设备状态 */
  DevicePowersStateOptions: SelectOptionType[];
  /**RFID读卡器设备类型 */
  DeviceRfidsOptions: SelectOptionType[];
  /**RFID读卡器设备状态 */
  DeviceRfidsStateOptions: SelectOptionType[];
}
/**业务相关枚举类型 */
export interface businessEnumType {
  /**
   * 菜单类型选择枚举值
   */
  MenuTypeOptions: SelectOptionType[];
  /**
   * 菜单是否显示枚举值
   */
  statusOptions: SelectOptionType[];
  /**
   * 实验开设枚举值
   */
  lessonAutoOpenOptions: SelectOptionType[];
  /**
   * 用户身份枚举值
   */
  userGroupOptions: SelectOptionType[];
  /**
   * 当前学期枚举值
   */
  currentTermOptions: SelectOptionType[];
  /**
   * 栏目类型枚举值
   */
  expInfoTypeColumnOptions: SelectOptionType[];
  /**
   * 实验访问方式枚举值
   */
  expInfoWayOptions: SelectOptionType[];
  /**
   * 性别选择
   */
  genderOptions: SelectOptionType[];
  /**
   * 实验箱连接方式
   */
  boxTypeOptions: SelectOptionType[];
  /**
   * 实验箱分配方式
   */
  selectDeviceOptions: SelectOptionType[];
  /**
   * 断电时是否关闭教师电源
   */
  labCloseTeacherPowerOptions: SelectOptionType[];
  /**
   * 实验桌的状态 1:实验桌正常 0:实验桌故障
   */
  deskStateOptions: SelectOptionType[];
  /**
   * 开设实验实验类型 1: 开放实验 2: 集体实验 3: 分组实验
   */
  courseExpTypeOptions: SelectOptionType[];
  /**
   * 开设实验是否绑定实验台 1: 使用实验台 2: 不使用实验台
   */
  courseExpWithDeskOptions: SelectOptionType[];
  /**硬件设备类型 */
  hardWareTypeOptions: SelectOptionType[];
  /**设在线状态 */
  onlineOption: SelectOptionType[];
  /**选择状态 */
  chooseOption: SelectOptionType[];
  menuTypeOptions: SelectOptionType[];
  yesOrNoOptions: SelectOptionType[];
  trueOrFalseOptions: SelectOptionType[];
  /**性别选择器数据 */
  sexOptions: SelectOptionType[];
}
// 批量导入报错信息
export interface ImportError {
  /**
   * 错误行数
   */
  rowNum: number;
  /**
   * 错误信息
   */
  message: string;
}
