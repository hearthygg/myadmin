/**条件查询设备分页信息 */
export interface DeviceListQuery extends PageQuery {
  /**
   * 设备的ip地址
   */
  deviceIp?: string;
  /**
   * 设备名称
   */
  deviceName?: string;
  /**
   * 设备状态
   */
  deviceState?: string;
  /**
   * 硬件设备下子设备的类型
   */
  deviceType?: string;
  /**
   * 硬件设备类型
   */
  hardWareType: string;
}

/**设备列表信息 */
export interface DeviceList {
  /**
   * 设备id
   */
  deviceId?: number;
  /**
   * 设备名称
   */
  deviceName: string;
  /**摄像头id */
  cameraId?: number;
  /**摄像头名称 */
  cameraName?: string;
  /**
   * 设备编号
   */
  deviceNum: string;
  /**
   * 设备状态
   */
  deviceState: number;
  /**
   * 设备类型
   */
  deviceType: string;
  /**
   * 硬件编号
   */
  hardWareNum: string;
  /**
   * 硬件设备类型
   */
  hardWareType: string;
  /**
   * 设备在线状态
   */
  onLineState: number;
  /**被使用人id */
  userId?: string;
  /**使用人账号 */
  userAccount?: string;
}

/**设备详细信息 */
export interface DeviceDetail {
  /**
   * 设备的id
   */
  deviceId?: number;
  /**
   * 设备的ip
   */
  deviceIp: string;
  /**
   * 设备的名称
   */
  deviceName: string;
  /**
   * 设备的编号
   */
  deviceNum: string;
  /**
   * 设备的端口号
   */
  devicePort: number;
  /**
   * 设备的状态
   */
  deviceState: string;
  /**
   * 设备的类型
   */
  deviceType: string;
  /**
   * 支持的实验
   */
  fullFunction: string;
  /**
   * 硬件编号
   */
  hardWareNum: string;
  /**
   * 硬件设备编号
   */
  hardWareType: string;
  /**文件后缀名 */
  fileSuffix: string;
}
/**
 * 摄像头数据
 */
export interface CameraData {
  /**
   * 监控设备编号
   */
  cameraDid?: string;
  /**
   * 摄像头的缩略图url
   */
  cameraFrameUrl?: string;
  /**
   * 摄像头的名称
   */
  cameraName?: string;
  /**
   * 摄像头的url
   */
  cameraUrl?: string;
  /**
   * 摄像头的uuid
   */
  cameraUuid?: string;
}
export interface DeviceInfo {
  /**
   * 设备value
   */
  deviceKey?: string;
  /**
   * 设备硬件编号
   */
  hardWareNum?: string;
  /**
   * 预设的下载路径
   */
  defaultDownloadFilePath?: string;
  /**
   * 需要绑定的实验id
   */
  expId: number;
  /**
   * 开设实验的id
   */
  courseExpId: number;
  /**
   * 当前实验的过期时间
   */
  courseExpTimeOut: number;
}
