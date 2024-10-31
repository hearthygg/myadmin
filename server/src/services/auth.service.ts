/**
 * 权限 service
 */
import { getDataSourceInstance } from "@tools/data-source";
import jwt from "jsonwebtoken";
import { type Repository } from "typeorm";

import { User } from "@entities/user.entity";
import { Permission } from "@entities/permission.entity";
import { Role } from "@entities/role.entity";

import { comparePassword } from "@utils/pwd";
import { JWT_SECRET } from "@constants/secrets";
import type { LoginBody } from "../types/auth";
import { error, success } from "@utils/r";
export class AuthService {
  userRepository: Repository<User>;
  permRepository: Repository<Permission>;
  roleRepository: Repository<Role>;
  constructor() {
    this.userRepository = getDataSourceInstance().getRepository(User);
    this.permRepository = getDataSourceInstance().getRepository(Permission);
    this.roleRepository = getDataSourceInstance().getRepository(Role);
  }
  /**
   * 登录
   */
  async login(loginDaat: LoginBody) {
    const { username, password } = loginDaat;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    // 校验用户是否存在
    if (!user) {
      return error("用户不存在!");
    }
    // 验证用户名和密码是否正确
    const isSamePwd = await comparePassword(password, user.password);
    if (isSamePwd) {
      // 返回token信息
      // 生成 jwt 存储用户ID和用户账号信息在token中
      const token = jwt.sign(
        { username: user.username, userId: user.userId },
        JWT_SECRET,
        // 12小时过期
        {
          expiresIn: 60 * 60 * 12,
        }
      );
      return success({ Authorization: token }, "登录成功!");
    } else {
      return error("密码错误!");
    }
  }

}
