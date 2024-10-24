import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CameraData, DeviceDetail, DeviceInfo, DeviceList, DeviceListQuery } from './types';

/**条件查询获取实验列表 */
export function getDeviceList(queryParams: DeviceListQuery): AxiosPromise<{ total: number; deviceList: DeviceList[] }> {
  return request({
    url: '/lmsWeb/device/enetDevice/pages',
    method: 'get',
    params: queryParams
  });
}

/**获取设备详细信息 */
export function getDeviceDetail(deviceId: number): AxiosPromise<{ device: DeviceDetail }> {
  return request({
    url: `/lmsWeb/device/enetDevice/getDeviceById/${deviceId}`,
    method: 'get'
  });
}

/**添加设备 */
export function addDevice(data: DeviceDetail) {
  return request({
    url: '/lmsWeb/device/enetDevice/saveDevice',
    method: 'post',
    data
  });
}

/**编辑设备 */
export function UpdateDevice(data: DeviceDetail) {
  return request({
    url: '/lmsWeb/device/enetDevice/updateDevice',
    method: 'put',
    data
  });
}

/**根据设备的id列表删除设备 */
export function deleteDevices(ids: number[]) {
  return request({
    url: `/lmsWeb/device/enetDevice/deleteDeviceByIds`,
    method: 'delete',
    data: { ids }
  });
}

/**根据开设实验的设备类型来获取在线设备列表 */
export function getOnlineDeviceList(keyFlag: string): AxiosPromise<{ devices: DeviceList[] }> {
  return request({
    url: `/lmsWeb/experiment/getExperimentDevicesByDeviceType/${keyFlag}`,
    method: 'get'
  });
}

/**用户进入实验绑定设备，失败的情况不让用户进入实验 */
export function bindExamDevice(data: DeviceInfo) {
  return request({
    url: `/lmsWeb/experiment/userBindDevice`,
    method: 'post',
    data,
  });
}

/**踢人下线（抢占设备） */
export function withoutDevice(deviceKey: string, hardWareNum: string, userId: string) {
  return request({
    url: `/lmsWeb/experiment/userOffLineDevice/${deviceKey}/${hardWareNum}/${userId}`,
    method: 'get'
  });
}
/**根据设备id获取到摄像头设备信息 */
export function getCameraApi(deviceId: string): AxiosPromise<CameraData> {
  return request({
    url: `/lmsWeb/device/cameraVideo/getCameraVideoInfoByDeviceId/${deviceId}`,
    method: 'get'
  });
}

/**用户绑定随机设备(自动分配) */
export function bindRandomExamDeviceApi(data: DeviceInfo) {
  return request({
    url: `/lmsWeb/experiment/userBindRandomDevice`,
    method: 'post',
    data,
  });
}
