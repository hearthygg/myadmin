/* 开课管理相关接口 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {CourseQuery,CourseTable,CourseDetail,CourseForm, StudentTreeQuery,InputStudentInfo, CourseSelectQuery, CourseSelectList} from './types'

/**
 * 分页查询开课管理表格信息
 */
export function getCourseData(queryParams: CourseQuery) :AxiosPromise<{total: number, courseVoPage: CourseTable[]}> {
  return request({
    url: '/lmsWeb/subject/course/pages',
    method: 'get',
    params: queryParams
  });
}
/**
 * 获取课程详细信息
 */
export function getCourseDetail(courseId: number) :AxiosPromise<{course: CourseDetail}> {
  return request({
    url: `/lmsWeb/subject/course/getCourseById/${courseId}`,
    method: 'get',
  });
}
/**
 * 添加开课信息
 */
export function addCourse(data: CourseForm) {
  return request({
    url: `/lmsWeb/subject/course/saveCourse`,
    method: 'post',
    data,
  });
}
/**
 * 编辑开课信息
 */
export function updateCourse(data: CourseForm) {
  return request({
    url: `/lmsWeb/subject/course/updateCourse`,
    method: 'put',
    data,
  });
}
/**
 * 删除课程信息
 */
export function deleteCourses(ids: string) {
  return request({
    url: `/lmsWeb/subject/course/deleteCourseByIds`,
    method: 'delete',
    data: {
      ids,
    }
  });
}
/**
 * 删除开设课程信息
 */
export function deleteCourseSets(ids: number[]) {
  return request({
    url: `/lmsWeb/subject/course/deleteCourseByIds`,
    method: 'delete',
    data: {
      ids,
    }
  });
}
/**
 * 获取学生树状数据
 */
export function getStudentTree(queryParams: StudentTreeQuery) :AxiosPromise<{stduentTree: OptionType[]}> {
  return request({
    url: `/lmsWeb/subject/course/getStudentTree`,
    method: 'get',
    params: queryParams,
  });
}
/**
 * 根据开课id/实验id/试卷id 获取已被选中的学生列表
 */
export function getStudentList(Id: number,type: string) :AxiosPromise<{studentInfos: InputStudentInfo[]}> {
  if(type === "courseSet") {
    // 课程导入学生
    return request({
      url: `/lmsWeb/subject/course/getSelectedIdsByCourseId/${Id}`,
      method: 'get',
    });
  } else if(type === "examSet") {
    // 实验导入学生
    return request({
      url: `/lmsWeb/subject/courseExp/getSelectedIdsByCourseExpId/${Id}`,
      method: 'get',
    });
  } else if(type === "publishPaper") {
    // 发布试卷导入学生
    return request({
      url: `/lmsWeb/examPaper/getSelectedStudentByPaperId/${Id}`,
      method: 'get',
    });
  }
}
/**
 * 开设课程/实验开设/发布试卷 导入学生
 */
export function inputStudent(Id: number,data: number[],type: string) {
  if(type === "courseSet") {
    // 课程导入学生
    return request({
      url: `/lmsWeb/subject/course/importStudentByCourseId/${Id}`,
      method: 'post',
      data,
    });
  } else if(type === "examSet") {
    // 实验导入学生
    return request({
      url: `/lmsWeb/subject/courseExp/importStudentByCourseExpId/${Id}`,
      method: 'post',
      data,
    });
  } else if(type === "publishPaper") {
    // 发布试卷导入学生
    return request({
      url: `/lmsWeb/examPaper/importStudent/${Id}`,
      method: 'post',
      data,
    });
  }
}

/**
 * 分页查询实验选课
 */
export function getCourseSelectListApi(queryParams: CourseSelectQuery) :AxiosPromise<{total: number, records: CourseSelectList[]}> {
  return request({
    url: '/lmsWeb/subject/courseExp/getStudentCourseExpsPage',
    method: 'get',
    params: queryParams
  });
}
/**
 * 学生预约实验选课
 */
export function setCourseSelect(courseExpId: number,courseExpStudentId:number,courseExpTimeId:number) {
  return request({
    url: `/lmsWeb/subject/courseExpTime/studentChooseCourseExp/${courseExpId}/${courseExpStudentId}/${courseExpTimeId}`,
    method: 'put',
  });
}
/**
 * 学生取消预约实验选课
 */
export function resetCourseSelect(courseExpId: number,courseExpStudentId:number,courseExpTimeId:number) {
  return request({
    url: `/lmsWeb/subject/courseExpTime/studentUnChooseCourseExp/${courseExpId}/${courseExpStudentId}/${courseExpTimeId}`,
    method: 'put',
  });
}
