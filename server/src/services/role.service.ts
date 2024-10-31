/**
 * 权限 service
 */
import { getDataSourceInstance } from "@tools/data-source";
import { type Repository } from "typeorm";

import { User } from "@entities/user.entity";
import { Permission } from "@entities/permission.entity";
import { Role } from "@entities/role.entity";

import type { CommonResponse, SelectOption } from "../types/common";
import { error, success } from "@utils/r";
import {
  addRoleDto,
  RolePagesQuery,
  updateRoleDto,
  updateRolePermissionsDto,
} from "../dto/auth.dto";
export class RoleService {
  userRepository: Repository<User>;
  permRepository: Repository<Permission>;
  roleRepository: Repository<Role>;
  constructor() {
    this.userRepository = getDataSourceInstance().getRepository(User);
    this.permRepository = getDataSourceInstance().getRepository(Permission);
    this.roleRepository = getDataSourceInstance().getRepository(Role);
  }


  /**
   * 分页查询角色数据
   */
  async getRolePages(data: RolePagesQuery): Promise<CommonResponse<any>> {
    const skip = (data.pageNum - 1) * data.pageSize;
    const take = data.pageSize;
    const queryBuilder = this.roleRepository.createQueryBuilder("role");

    if (data.keywords) {
      queryBuilder.orWhere("role.roleName LIKE :keyword", {
        keyword: `%${data.keywords}%`,
      });
      queryBuilder.orWhere("role.remark LIKE :keyword", {
        keyword: `%${data.keywords}%`,
      });
    }

    const [roles, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy("role.createTime", "DESC") //按照创建时间降序排序
      .getManyAndCount();
    return success(
      {
        list: roles,
        total,
      },
      "获取成功!"
    );
  }

  /**
   * 新增角色数据
   */
  async addRole(data: addRoleDto): Promise<CommonResponse<any>> {
    const result = await this.roleRepository
      .createQueryBuilder()
      .insert()
      .values(data)
      .execute();
    if (result) {
      return success(null, "添加成功！");
    } else {
      return error("添加失败！");
    }
  }

  /**
   * 编辑角色数据
   */
  async updateRole(data: updateRoleDto): Promise<CommonResponse<any>> {
    const result = await this.roleRepository
      .createQueryBuilder()
      .update()
      .set({
        roleName: data.roleName,
        remark: data.remark,
        description: data.description,
      })
      .where("roleId = :roleId", {
        roleId: data.roleId,
      })
      .execute();
    if (result) {
      return success(null, "修改成功！");
    } else {
      return error("修改失败！");
    }
  }

  /**
   * 获取角色权限数据
   */
  async getRolePermissions(roleId: number): Promise<CommonResponse<any>> {
    const role = await this.roleRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("role.roleId = :roleId", { roleId })
      .distinct(true) // 添加去重操作
      .getOne();
    if (role) {
      return success(
        role.permissions.map((permission) => permission.permissionId),
        "获取成功!"
      );
    } else {
      return error("获取失败！");
    }
  }

  /**
   * 修改角色权限
   */
  async updateRolePermissions(
    data: updateRolePermissionsDto
  ): Promise<CommonResponse<any>> {
    try {
      const { roleId, permIds } = data;
      const role = await this.roleRepository
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.permissions", "permission")
        .where("role.roleId = :roleId", { roleId })
        .distinct(true) // 添加去重操作
        .getOne();

      if (!role) {
        return error("角色不存在！");
      }

      // 如果 permIds 是空数组，表示移除所有权限
      if (permIds.length === 0) {
        role.permissions = [];
      } else {
        // 查询新的权限列表
        const permissions = await this.permRepository
          .createQueryBuilder("permission")
          .where("permission.permissionId IN (:...permIds)", { permIds })
          .getMany();
        // 更新角色的权限
        role.permissions = permissions;
      }
      // 保存角色
      await this.roleRepository.save(role);
      return success(null, "获取成功!");
    } catch (err) {
      console.error(err);
      return error("获取失败！");
    }
  }

  /**
   * 获取角色选择器数据
   */
  async getRoleOptions(): Promise<CommonResponse<SelectOption[]>> {
    const roles = await this.roleRepository.find();
    return success(
      roles.map((role) => ({
        value: role.remark,
        label: role.roleName,
      })),
      "获取成功!"
    );
  }

}
