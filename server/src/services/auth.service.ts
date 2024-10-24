/**
 * 权限 service
 */
import { getDataSourceInstance } from "@tools/data-source";
import jwt from "jsonwebtoken";
import { User } from "@entities/user.entity";
import type { Repository } from "typeorm";
import { comparePassword } from "@utils/pwd";
import { JWT_SECRET } from "@constants/secrets";
import type { ClintRoute, LoginBody, UserBaseInfo } from "../types/auth";
import type { CommonResponse } from "../types/common";
import { error, success } from "@utils/r";
import { getTreeData, uniqueArr } from "@utils/commonMethods";
import { MenuType } from "../types/usuallyEnum";
export class AuthService {
  repository: Repository<User>;
  constructor() {
    this.repository = getDataSourceInstance().getRepository(User);
  }
  /**
   * 登录
   */
  async login(loginDaat: LoginBody) {
    const { username, password } = loginDaat;
    const user = await this.repository.findOne({
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
  /**
   * 通过token获取用户基本信息
   */
  async getUserInfoBytoken(
    token: string
  ): Promise<CommonResponse<UserBaseInfo>> {
    // jwt 验证 token 是否有效
    const payload = jwt.verify(token, JWT_SECRET);
    // 验证用户名是否有效
    const username = (payload as jwt.JwtPayload).username;
    if (username) {
      // 联表查询用户拥有的角色
      const user = await this.repository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "role")
        .where("user.username = :username", { username })
        .getOne();
      // 若不存在对应用户，不通过
      if (user) {
        const result = {
          userId: user.userId,
          nickname: user.nickname,
          roles: user.roles.map((item) => item.remark),
        } as UserBaseInfo;
        return success(result, "获取个人基本信息成功!");
      } else {
        return error("没有权限请尝试重新登录!", "401");
      }
    } else {
      return error("没有权限请尝试重新登录!", "401");
    }
  }
  /**
   * 查询路由表
   */
  async getRoutes(token: string): Promise<CommonResponse<ClintRoute[]>> {
    // jwt 验证 token 是否有效
    const payload = jwt.verify(token, JWT_SECRET);
    // 验证用户名是否有效
    const userId = (payload as jwt.JwtPayload).userId;
    if (userId) {
      // 联表查询用户拥有的权限
      const user = await this.repository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "role")
        .leftJoinAndSelect("role.permissions", "permission")
        .where("user.userId = :userId", { userId })
        .getOne();
      // 若不存在对应用户，不通过
      if (user) {
        const result = user.roles.flatMap((role) =>
          role.permissions.map((permission) => {
            let item = {
              permissionId: permission.permissionId,
              path: permission.path,
              component: permission.component,
              parentPermissionId: permission.parentPermissionId,
              redirect: permission.redirect,
              meta: {
                title: permission.permissionName,
                icon: permission.icon,
                hidden: permission.hidden,
                keepAlive: permission.keepAlive,
              },
            };
            return item;
            // if(!item.redirect) delete item.redirect;
            // if(permission.permissionType === MenuType.menu || permission.permissionType === MenuType.contents) {
            //   return item;
            // }
          })
        );
        // 进行去重处理
        const uniqueResult = uniqueArr(result, "permissionId");

        // 获取树形数据
        const tree = getTreeData(
          uniqueResult,
          "parentPermissionId",
          "permissionId"
        );
        return success(tree, "获取路由表成功!");
      } else {
        return error("没有权限请尝试重新登录!", "401");
      }
    } else {
      return error("没有权限请尝试重新登录!", "401");
    }
  }
}
