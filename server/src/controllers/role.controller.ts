/**
 * 角色 controller
 */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Authorized,
  QueryParam,
} from "routing-controllers";
import { error } from "@utils/r";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import {
  addRoleDto,
  RolePagesQuery,
  updateRoleDto,
  updateRolePermissionsDto,
} from "../dto/auth.dto";
import { RoleService } from "@services/role.service";
@Controller("/auth")
export class AuthController {
  currentService;
  constructor() {
    this.currentService = new RoleService();
  }

  /**
   * 分页查询角色信息
   */
  @Authorized()
  @Get("/role/getRolePages")
  async getRolePages(
    @QueryParam("pageNum") pageNum: number = 1,
    @QueryParam("pageSize") pageSize: number = 10,
    @QueryParam("keywords") keywords?: string
  ) {
    const queryParams = {
      pageNum,
      pageSize,
      keywords,
    };
    const validateDto = plainToClass(RolePagesQuery, queryParams);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.getRolePages(queryParams);
    }
  }

  /**
   * 新增角色
   */
  @Authorized()
  @Post("/role/addRole")
  async addRole(@Body() body: addRoleDto) {
    const validateDto = plainToClass(addRoleDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.addRole(body);
    }
  }

  /**
   * 更新角色
   */
  @Authorized()
  @Put("/role/updateRole")
  async updateRole(@Body() body: updateRoleDto) {
    const validateDto = plainToClass(updateRoleDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.updateRole(body);
    }
  }

  /**
   * 获取角色拥有的权限
   */
  @Authorized()
  @Get("/role/getRolePermissions/:roleId")
  async getRolePermissions(@Param("roleId") roleId: number) {
    if (!roleId) return error("roleId不能为空");
    return this.currentService.getRolePermissions(roleId);
  }

  /**
   * 更新角色权限
   */
  @Authorized()
  @Put("/role/updateRolePermissions")
  async updateRolePermissions(@Body() body: updateRolePermissionsDto) {
    const validateDto = plainToClass(updateRolePermissionsDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.updateRolePermissions(body);
    }
  }

  /**
   * 获取角色选择器数据
   */
  @Authorized()
  @Get("/role/roleOptions")
  async getRoleOptions() {
    return await this.currentService.getRoleOptions();
  }
}
