import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, TokenResult, VerifyCode,SelectEnumType, examEnumType, businessEnumType, ImportError } from './types';
/**
 * 登录接口
 * @param data {LoginForm}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

// 润众模拟登陆数据
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function loginApiRZ(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: '/lmsWeb/user_login',
    method: 'post',
    // params: data
    params: {
      "struts.token.name": "token",
      "token": "55LN5ZW6V1KQXDVRR3P3CX0KKR7PQ8AZ",
      "url": "",
      "um.userName": "webdev",
      "um.pwd": "webdev12345",
    }
  });
}

/**
 * 注销
 */
export function logoutApi() {
  return request({
    url: '/lmsWeb/auth/logout',
    method: 'delete'
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<VerifyCode> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get'
  });
}
/**
 * 获取所有选择器的枚举数据
 */
export function getAllSelectEnmuTypes(): AxiosPromise<SelectEnumType> {
  return request({
    url: `/lmsWeb/common/getCommonOptions`,
    method: 'get'
  });
}
/**
 * 获取实验枚举数据
 */
export function getExamEnmuTypes(): AxiosPromise<examEnumType> {
  return request({
    url: `/lmsWeb/common/getExperimentsOptions`,
    method: 'get'
  });
}
/**
 * 获取业务枚举数据
 */
export function getBussinerEnmuTypes(): AxiosPromise<businessEnumType> {
  return request({
    url: `/lmsWeb/common/getCommonOptions`,
    method: 'get'
  });
}
/**
 * 返回导入excel模板的地址
 */
export function getExcelTemplateApi(): AxiosPromise<string> {
  return request({
    url: `/lmsWeb/common/getDownloadImportExcelFile`,
    method: 'get'
  });
}

/**
 * 批量导入
 * @param file
 */
export function batchImportApi(file: File,type = 'user'): AxiosPromise<{ errorRows: ImportError[]}> {
  const formData = new FormData();
  formData.append('file', file);
  let url = ''
  if(type === 'user'){
    url = '/lmsWeb/auth/user/importUserByExcel'
  }else if(type === 'course'){
    url = '/lmsWeb/subject/course/importCourseByExcel'
  } else if(type === 'device'){
    url = '/lmsWeb/device/enetDevice/importDeviceByExcel'
  }
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
