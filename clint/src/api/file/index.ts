import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FileInfo } from './types';

/**
 * 上传文件
 *  临时文件上传
 * @param file
 */
export function uploadFileApi(file: File): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/common/uploadFile',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 以表单格式上传文件
 */
export function uploadFileByFormApi(file: any): AxiosPromise<{
  fileUrl: string;
}> {
  return request({
    url: '/lmsWeb/file/exp/uploadFile',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 上传文件
 * 主要用于试题文件上传
 * @param file
 */
export function uploadQuestionFileApi(file: File): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/lmsWeb/examQuestion/questionUploadFile',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 上传文件
 * 主要用于实验相关文件上传
 * @param file
 */
export function uploadExpFileApi(file: File,expId: number,columnId = 20): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: `/lmsWeb/common/uploadExpReportFile/${expId}/${columnId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 上传文件
 * 主要用于实验报告相关文件
 * @param file
 */
export function uploadExpReportFileApi(file: File,courseExpId: string): AxiosPromise<{
  fileUrl: string;
}> {
  return request({
    url: `/lmsWeb/common/uploadCourseExpReportFile/${courseExpId}`,
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 上传文件
 * 实验设置：导入文件上传
 * @param file
 */
export function uploadExpInfoImportFile(file: File,expId: number,columnId: number): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('importFile', file);
  return request({
    url: `/lmsWeb/course/expInfo/uploadExpInfoImportFile`,
    method: 'post',
    data: formData,
    params: {
      expId,
      columnId
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 上传文件
 * 实验设置：实验前需下载的文件上传
 * @param file
 */
export function uploadExpInfoDownloadFile(file: File,expId: number,columnId: number): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('downloadFile', file);
  return request({
    url: `/lmsWeb/course/expInfo/uploadExpInfoDownloadFile`,
    method: 'post',
    data: formData,
    params: {
      expId,
      columnId
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 公告文件上传
 * @param file
 */
export function uploadNoticeFileApi(file: File): AxiosPromise<{
  fileUrl: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/lmsWeb/display/notice/uploadNoticeFile',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
  return request({
    url: '/api/v1/files',
    method: 'delete',
    params: { filePath: filePath }
  });
}
