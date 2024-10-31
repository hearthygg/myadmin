/**
 * 权限 controller
 */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Authorized,
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

  // ---------- 1. 权限认证相关 ----------

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

}
