/**
 * 权限 controller
 */
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Authorized,
  QueryParam,
} from "routing-controllers";
import type { Menu } from "../types/auth";
import { error } from "@utils/r";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  addMenuDto,
  updateMenuDto,
} from "../dto/auth.dto";
import { MenuService } from "@services/menu.service";
@Controller("/auth")
export class AuthController {
  currentService;
  constructor() {
    this.currentService = new MenuService();
  }

  /**
   * 获取所有的菜单
   */
  @Authorized()
  @Get("/menu/getAllMenus")
  async getAllMenus(
    @QueryParam("permissionName") permissionName?: string,
    @QueryParam("hidden") hidden?: boolean,
    @QueryParam("permissionType") permissionType?: number
  ) {
    return await this.currentService.getAllMenus(
      permissionName,
      hidden,
      permissionType
    );
  }

  /**
   * 获取菜单层级关系选择器数据
   */
  @Authorized()
  @Get("/menu/menuOptions")
  async getMenuOptions() {
    return await this.currentService.getMenuOptions();
  }

  /**
   * 新增菜单
   */
  @Authorized()
  @Post("/menu/addMenu")
  async addMenu(@Body() body: Menu) {
    const validateDto = plainToClass(addMenuDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.addMenu(body);
    }
  }

  /**
   * 修改菜单
   */
  @Authorized()
  @Put("/menu/updateMenu")
  async updateMenu(@Body() body: Menu) {
    const validateDto = plainToClass(updateMenuDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.updateMenu(body);
    }
  }

}
