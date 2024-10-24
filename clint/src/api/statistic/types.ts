/**
 * Request，[Map]
 *
 * BaseResponse«List«Option»»
 */
 export interface Request {
  /**
   * 代码
   */
  code?: number | null;
  /**
   * 返回的数据，没有固定格式，为一个泛型
   */
  data?: any;
  /**
   * 返回的信息
   */
  message?: null | string;
  /**
   * 是否成功
   */
  success?: boolean | null;
  [property: string]: any;
}

/**
* java.lang.Object
*
* Object
*/
export interface Object {
  /**
   * 子级 标签
   *
   * 对应二级菜单，或者树状结构
   */
  children?: Option[] | null;
  /**
   * 选项的标签
   *
   * 对应前端需要展示的值
   */
  label?: null | string;
  /**
   * 选项的值
   *
   * 一般对应实体类的id
   */
  value?: { [key: string]: any };
  [property: string]: any;
}

export interface BaseInfoStatisticsVo {
  /**
     * 设备的总数
     */
   deviceCount?: number;
   /**
    * 试卷的总数
    */
   examPaperCount?: number;
   /**
    * 实验的总数
    */
   expCount?: number;
   /**
    * 课程的总数
    */
   lessonCount?: number;
   /**
    * 在线设备的总数
    */
   onLineDeviceCount?: number;
   /**
    * 在线实验人数
    */
   onlineExperimentsUserCount?: number;
   /**
    * 问题的总数
    */
   questionCount?: number;
   /**
    * 用户的总数
    */
   userCount?: number;
    /**
     * 课程完成率 假数据  随机生成 80~95 之间的数据
     */
    courseCompletedRate?: number;
    /**
     * 设备使用率   最近7天的设备利用率  返回值百分比
     */
    equipmentUtilizationRate?: number;
}

/**
* 下拉选项对象
*
* 将对象封装为前端 连级选择器 和二级菜单 的读取格式
*
* Option
*/
export interface Option {
  /**
   * 子级 标签
   *
   * 对应二级菜单，或者树状结构
   */
  children?: Option[] | null;
  /**
   * 选项的标签
   *
   * 对应前端需要展示的值
   */
  label?: null | string;
  /**
   * 选项的值
   *
   * 一般对应实体类的id
   */
  value?: { [key: string]: any };
  [property: string]: any;
}


/**
 * 开课统计图标的vo类
 *
 * CourseInfoStatisticsVo
 */
 export interface CourseInfoStatisticsVo {
  /**
   * 开课的总平均分
   */
  courseAverage?: number | null;
  /**
   * 每一个开课下的实验数量
   */
  courseExpNum?: number | null;
  /**
   * 开课的主键
   */
  courseId?: number | null;
  /**
   * 当前开课的任课教师
   */
  courseTeacher?: null | string;
  /**
   * 当前开课的总人数
   */
  courseTotal?: number | null;
  /**
   * 提交的实验报告数量
   */
  expReportNum?: number | null;
  /**
   * 课程名称
   */
  lessonName?: null | string;
}


// 定义设备类型
export interface DeviceInfo {
  /**
   * 设备主键
   */
  deviceId: number  | null;
  /**
   * 设备名称
   */
  deviceName: string;
  /**
   * 设备型号
   */
  hardWareNum: string;
  /**
   * 设备编号
   */
  deviceNum: string;
  /**
   * 设备类型
   */
  deviceType: string;
   /**
   * 设备状态
   */
  deviceState: string;
   /**
   * 设备端口
   */
  deviceIp: string;
   /**
   * 设备硬件类型
   * 实验箱 摄像头 门禁
   */
  hardWareType: string;
}
