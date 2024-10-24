import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CameraList, CameraListQuery } from './types';

/**分页查询摄像头列表 */
export function getCameraListApi(queryParams: CameraListQuery): AxiosPromise<{ total: number; records: CameraList[] }> {
  return request({
    url: '/lmsWeb/device/cameraVideo/pages',
    method: 'get',
    params: queryParams
  });
}

/**获取摄像头详细信息 */
export function getCameraDetailApi(cameraId: string): AxiosPromise<CameraList> {
  return request({
    url: `/lmsWeb/device/cameraVideo/getCameraVideoFormById/${cameraId}`,
    method: 'get'
  });
}

/**添加摄像头 */
export function addCameraApi(data: CameraList) {
  return request({
    url: '/lmsWeb/device/cameraVideo/saveCameraVideo',
    method: 'post',
    data
  });
}

/**编辑摄像头 */
export function UpdateCameraApi(data: CameraList) {
  return request({
    url: '/lmsWeb/device/cameraVideo/updateCameraVideo',
    method: 'put',
    data
  });
}

/**根据设备的id列表删除摄像头 */
export function deleteCamerasApi(ids: number[]) {
  return request({
    url: `/lmsWeb/device/cameraVideo/deleteCameraVideoByIds`,
    method: 'delete',
    data: { ids }
  });
}
/**获取摄像头设备选择器数据 */
export function getCameraSelectorApi(): AxiosPromise<SelectOptionType[]> {
  return request({
    url: `/lmsWeb/device/cameraVideo/getCameraOptions`,
    method: 'get'
  });
}
/**设备绑定摄像头 */
export function bindCameraApi(deviceId: number,cameraId: number) {
  return request({
    url: `/lmsWeb/device/enetDevice/deviceBindCamera/${deviceId}/${cameraId}`,
    method: 'put',
  });
}
/**设备解除绑定摄像头 */
export function liftCameraApi(deviceId: number,cameraId: number) {
  return request({
    url: `/lmsWeb/device/enetDevice/deviceUnbindCamera/${deviceId}/${cameraId}`,
    method: 'put',
  });
}
