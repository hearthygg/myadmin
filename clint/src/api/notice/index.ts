import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NoticeList, NoticeListQuery,NoticeInfo } from './types';

/**分页查询公告列表 */
export function getNoticeListApi(queryParams: NoticeListQuery): AxiosPromise<{ total: number; records: NoticeList[] }> {
  return request({
    url: '/lmsWeb/display/notice/pages',
    method: 'get',
    params: queryParams
  });
}

/**获取公告详细信息 */
export function getNoticeDetailApi(noticeId: number): AxiosPromise<NoticeInfo> {
  return request({
    url: `/lmsWeb/display/notice/getNoticeById/${noticeId}`,
    method: 'get'
  });
}

/**添加公告 */
export function addNoticeApi(data: NoticeInfo) {
  return request({
    url: '/lmsWeb/display/notice/saveNotice',
    method: 'post',
    data
  });
}

/**编辑公告 */
export function UpdateNoticeApi(data: NoticeInfo) {
  return request({
    url: '/lmsWeb/display/notice/updateNotice',
    method: 'put',
    data
  });
}

/**根据设备的id列表删除公告 */
export function deleteNoticesApi(ids: number[]) {
  return request({
    url: `/lmsWeb/display/notice/deleteNoticeByIds`,
    method: 'delete',
    data: { ids }
  });
}
