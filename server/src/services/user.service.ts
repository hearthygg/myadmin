/**
 * 权限 service
 */
import { getDataSourceInstance } from "@tools/data-source";
import jwt from "jsonwebtoken";
import { In, Like, type Repository } from "typeorm";

import { User } from "@entities/user.entity";
import { Role } from "@entities/role.entity";

import { encryptPassword } from "@utils/pwd";
import { JWT_SECRET } from "@constants/secrets";
import type { ClintRoute } from "../types/auth";
import type { CommonResponse } from "../types/common";
import type { UserBaseInfo, UserListInfo } from "../types/user";
import { error, success } from "@utils/r";
import { getTreeData, uniqueArr } from "@utils/commonMethods";
import { MenuType } from "../types/usuallyEnum";
import {
  addUserDto,
  updateUserDto,
  UserPagesQuery,
} from "../dto/auth.dto";
import { get } from "@tools/env-config";
export class UserService {
  userRepository: Repository<User>;
  roleRepository: Repository<Role>;
  constructor() {
    this.userRepository = getDataSourceInstance().getRepository(User);
    this.roleRepository = getDataSourceInstance().getRepository(Role);
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
      const user = await this.userRepository
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
      const user = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.roles", "role")
        .leftJoinAndSelect("role.permissions", "permission")
        .where("user.userId = :userId", { userId })
        .distinct(true) // 添加去重操作
        .getOne();
      // 若不存在对应用户，不通过
      if (user) {
        let result = user.roles.flatMap((role) =>
          role.permissions.map((permission) => ({
            permissionId: permission.permissionId,
            path: permission.path,
            component: permission.component,
            parentPermissionId: permission.parentPermissionId,
            redirect: permission.redirect,
            permissionType: permission.permissionType,
            meta: {
              title: permission.permissionName,
              icon: permission.icon,
              hidden: permission.hidden,
              keepAlive: permission.keepAlive,
            },
          }))
        );
        // 只保留目录和菜单
        result = result.filter(
          (permission: any) =>
            permission.permissionType === MenuType.menu ||
            permission.permissionType === MenuType.contents
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


  /**
   * 分页查询用户数据
   */
  async getUserPages(
    data: UserPagesQuery
  ): Promise<CommonResponse<{ list: UserListInfo[]; total: number }>> {
    const skip = (data.pageNum - 1) * data.pageSize;
    const take = data.pageSize;
    const whereConditions = {} as any;
    // 过滤掉没有传递的查询条件
    // 账号查询
    if (data.username) {
      whereConditions.username = Like(`%${data.username}%`);
    }

    // 昵称查询
    if (data.nickname) {
      whereConditions.nickname = Like(`%${data.nickname}%`);
    }

    // 性别查询
    if (data.sex) {
      whereConditions.sex = data.sex;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      skip: skip,
      take: take,
      order: {
        createTime: "DESC", // 按照 创建时间 降序排序
      },
    });

    return success(
      {
        list: users.map((user) => ({
          userId: user.userId,
          nickname: user.nickname,
          username: user.username,
          email: user.email,
          sex: user.sex,
          avatar: user.avatar,
          telPhone: user.telPhone,
        })),
        total,
      },
      "获取成功!"
    );
  }

  /**
   * 新增用户数据
   */
  async addUser(data: addUserDto): Promise<CommonResponse<null>> {
    // 获取默认密码后缀
    const defaultPasswordSuffix = get("defaultPasswordSuffix") as string;
    const user = new User();
    user.username = data.username;
    user.nickname = data.nickname;
    if (data.avatar) user.avatar = data.avatar;
    if (data.sex) user.sex = data.sex;
    if (data.email) user.email = data.email;
    if (data.telPhone) user.telPhone = data.telPhone;

    // 分配角色
    if (data.roleRemarks && data.roleRemarks.length > 0) {
      const roles = await this.roleRepository.findBy({
        remark: In(data.roleRemarks),
      });

      if (roles.length !== data.roleRemarks.length) {
        return error("部分角色未找到!");
      }

      user.roles = roles;
    }

    try {
      // 默认密码：账号 + 后缀
      user.password = await encryptPassword(
        data.username + defaultPasswordSuffix
      );
      // 使用.save可以保存关联关系 但是createQueryBuilder不行
      await this.userRepository.save(user);
      return success(null, "添加成功！");
    } catch (err) {
      console.error(err);
      return error("添加失败！");
    }
  }

  /**
   * 获取用户详细信息
   */
  async getUserDetail(userId: number): Promise<CommonResponse<updateUserDto>> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .where("user.userId = :userId", { userId })
      .distinct(true) // 添加去重操作
      .getOne();
    if (user) {
      const result = {
        userId: user.userId,
        username: user.username,
        nickname: user.nickname,
        sex: user.sex,
        email: user.email,
        telPhone: user.telPhone,
        avatar: user.avatar,
        roleRemarks: user.roles.map((role) => role.remark),
      };
      return success(result, "获取成功!");
    } else {
      return error("获取失败！");
    }
  }

  /**
   * 更新用户数据
   */
  async updateUser(data: updateUserDto): Promise<CommonResponse<null>> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .where("user.userId = :userId", { userId: data.userId })
      .getOne();

    if(!user) return error("用户不存在！");
    if (data.nickname) user.nickname = data.nickname;
    if (data.avatar) user.avatar = data.avatar;
    if (data.sex) user.sex = data.sex;
    if (data.telPhone) user.telPhone = data.telPhone;

    // 分配角色
    if (data.roleRemarks && data.roleRemarks.length > 0) {
      const roles = await this.roleRepository.findBy({
        remark: In(data.roleRemarks),
      });

      if (roles.length !== data.roleRemarks.length) {
        return error("部分角色未找到!");
      }

      user.roles = roles;
    }
    try {
      // 使用.save可以保存关联关系 但是createQueryBuilder不行
      await this.userRepository.save(user);
      return success(null, "修改成功！");
    } catch (err) {
      console.error(err);
      return error("修改失败！");
    }
  }
}
