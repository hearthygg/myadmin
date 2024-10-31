/**
 * 用户 controller
 */

import { Authorized, Body, Controller, Get, HeaderParam, Param, Post, Put, QueryParam} from 'routing-controllers';
import { UserService } from '../services/user.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { addUserDto, updateUserDto, UserPagesQuery } from '../dto/auth.dto';
import { error } from '@utils/r';
@Controller('/auth')
export class UserController {
  currentService = new UserService();
  /**
   * 登录之后通过token获取用户的基本信息
   */
  @Authorized()
  @Get("/user/info")
  async getUserInfoBytoken(@HeaderParam("authorization") token: string) {
    return await this.currentService.getUserInfoBytoken(token);
  }

  /**
   * 登录之后获取用户拥有的路由表
   */
  @Authorized()
  @Get("/user/routes")
  async getRoutes(@HeaderParam("authorization") token: string) {
    return await this.currentService.getRoutes(token);
  }

  /**
   * 分页查询用户信息
   */
  @Authorized()
  @Get("/user/getUserPages")
  async getUserPages(
    @QueryParam("pageNum") pageNum: number = 1,
    @QueryParam("pageSize") pageSize: number = 10,
    @QueryParam("username") username?: string,
    @QueryParam("nickname") nickname?: string,
    @QueryParam("sex") sex?: number
  ) {
    const queryParams = {
      pageNum,
      pageSize,
      username,
      nickname,
      sex,
    };
    const validateDto = plainToClass(UserPagesQuery, queryParams);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.getUserPages(queryParams);
    }
  }

  /**
   * 新增用户
   */
  @Authorized()
  @Post("/user/addUser")
  async addUser(@Body() body: addUserDto) {
    const validateDto = plainToClass(addUserDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.addUser(body);
    }
  }

  /**
   * 获取用户的详细信息
   */
  @Authorized()
  @Get("/user/getUserDetail/:userId")
  async getUserDetail(@Param("userId") userId: number) {
    if (!userId) return error("userId不能为空");
    return this.currentService.getUserDetail(userId);
  }

  /**
   * 更新用户
   */
  @Authorized()
  @Put("/user/updateUser")
  async updateUser(@Body() body: updateUserDto) {
    const validateDto = plainToClass(updateUserDto, body);
    const errors = await validate(validateDto);
    if (errors.length > 0) {
      // 返回第一个报错提示信息
      return error(
        errors.map((e) => Object.values(e.constraints as any).join("，"))[0]
      );
    } else {
      return this.currentService.updateUser(body);
    }
  }

}
