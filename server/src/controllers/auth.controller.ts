/**
 * 权限 controller
 */

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  HeaderParam,
  Req,
  Res,
  Authorized,
  QueryParam,
} from "routing-controllers";
import { AuthService } from "@services/auth.service";
import type { LoginBody } from "../types/auth";
import { error, success } from "@utils/r";

@Controller("/auth")
export class AuthController {
  currentService;
  constructor() {
    this.currentService = new AuthService();
  }
  /**
   * 登录
   */
  @Post("/login")
  async login(@Body() body: LoginBody) {
    // 确保body至少包含username和password字段
    if (!body.username || !body.password) {
      return error("用户名和密码不能为空！");
    }
    return await this.currentService.login(body);
  }

  /**
   * 注册
   */
  @Post("/register")
  async register(@Body() body: any) {}

  /**
   * 获取邮箱验证码
   */
  @Authorized()
  @Get("/emailCode/:email")
  async emailCode(@Param("email") email: string) {
    console.log("Email:", email);
    return success(null, email);
  }

  /**
   * 登录之后通过token获取用户的基本信息
   */
  @Authorized()
  @Get("/info")
  async getUserInfoBytoken(@HeaderParam("authorization") token: string) {
    return await this.currentService.getUserInfoBytoken(token);
  }

  /**
   * 登录之后获取用户拥有的路由表
   */
  @Authorized()
  @Get("/routes")
  async getRoutes(@HeaderParam("authorization") token: string) {
    return await this.currentService.getRoutes(token);
  }

  /**
   * 获取所有的菜单
   */
  @Authorized()
  @Get("/menu/getAllMenus")
  async getAllMenus(
    @QueryParam("keywords") keywords: string,
    @QueryParam("visible") visible: number,
    @QueryParam("type") type: number,
    @QueryParam("order") order: "asc" | "desc" = "asc"
  ) {}

  /**-
   * 上传图片
   */
  @Post("/uploadImage")
  async uploadImage(@Req() req: any, @Res() res: any) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "没有上传文件" });
    }

    const files = req.files as Express.Multer.File[];
    console.log("Uploaded Files:", files);

    // 进一步处理文件...
    return res.status(200).json({ message: "文件上传成功", files });
  }
}
