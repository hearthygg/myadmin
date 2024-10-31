/**
 *  公共模块
 */

import { Controller, Get, Post, UploadedFile } from "routing-controllers";
import { selectOptions } from "@constants/selectOptions";
import { success } from "@utils/r";
import { fileUploadOptions } from "@utils/commonMethods";
@Controller("/common")
export class CommonController {
  /**
   * 获取下拉框数据
   */
  @Get("/selectOptions")
  async getCommonSelectOptions() {
    return success(selectOptions, "获取成功!");
  }

  /**
   * 文件上传
   */
  @Post("/uploadFile")
  async saveFile(
    @UploadedFile("file", { options: fileUploadOptions })
    file: Express.Multer.File
  ) {
    const fileUrl = "../uploads/" + file.filename;
    return success({ fileUrl }, "上传成功!");
  }
}
