/**
 *  公共模块
 */

import { Controller, Get } from "routing-controllers";
import { selectOptions } from "@constants/selectOptions";
import { success } from "@utils/r";
@Controller("/common")
export class CommonController {
  /**
   * 获取下拉框数据
   */
  @Get("/selectOptions")
  async getCommonSelectOptions() {
    return success(selectOptions, "获取成功!");
  }
}
