/**条件查询摄像头分页信息 */
export interface CameraListQuery extends PageQuery {
  /**
   * 摄像头的名称
   */
  cameraName?: string;
  /**
   * 摄像头的编号
   */
  cameraDid?: string;
}

/**摄像头列表信息 */
export interface CameraList {
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
