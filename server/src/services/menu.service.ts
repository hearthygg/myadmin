/**
 * 权限 service
 */
import { getDataSourceInstance } from "@tools/data-source";
import { Like, type Repository } from "typeorm";

import { User } from "@entities/user.entity";
import { Permission } from "@entities/permission.entity";
import { Role } from "@entities/role.entity";

import type { Menu } from "../types/auth";
import type { CommonResponse, SelectOption } from "../types/common";
import { error, success } from "@utils/r";
import { changeThreeData, getTreeData } from "@utils/commonMethods";
export class MenuService {
  userRepository: Repository<User>;
  permRepository: Repository<Permission>;
  roleRepository: Repository<Role>;
  constructor() {
    this.userRepository = getDataSourceInstance().getRepository(User);
    this.permRepository = getDataSourceInstance().getRepository(Permission);
    this.roleRepository = getDataSourceInstance().getRepository(Role);
  }

  /**
   * 获取所有菜单
   */
  async getAllMenus(
    permissionName?: string,
    hidden?: boolean,
    permissionType?: number
  ): Promise<CommonResponse<Menu[]>> {
    const whereConditions = {} as any;
    // 过滤掉没有传递的查询条件
    if (permissionName) {
      whereConditions.permissionName = Like(`%${permissionName}%`);
    }
    if (hidden !== undefined) {
      whereConditions.hidden = hidden;
    }
    if (permissionType !== undefined) {
      whereConditions.permissionType = permissionType;
    }
    const permissions = await this.permRepository.find({
      where: whereConditions,
      order: {
        sort: "ASC", // 按照 sort 字段递增排序
      },
    });
    // 过滤筛选数据
    let result = permissions.map((permission) => ({
      permissionId: permission.permissionId,
      permissionName: permission.permissionName,
      permissionType: permission.permissionType,
      parentPermissionId: permission.parentPermissionId,
      path: permission.path,
      component: permission.component,
      redirect: permission.redirect,
      hidden: permission.hidden,
      icon: permission.icon,
      sort: permission.sort,
    }));
    // 构造树形数据
    const tree = getTreeData(result, "parentPermissionId", "permissionId");
    // changeThreeData(tree, "permissionId", "permissionName");
    return success(tree, "获取成功!");
  }

  /**
   * 获取菜单层级关系选择器数据
   */
  async getMenuOptions(): Promise<CommonResponse<SelectOption[]>> {
    const permissions = await this.permRepository.find({
      order: {
        sort: "ASC", // 按照 sort 字段递增排序
      },
    });
    const tree = getTreeData(permissions, "parentPermissionId", "permissionId");
    return success(
      changeThreeData(tree, "permissionId", "permissionName"),
      "获取成功!"
    );
  }

  /**
   * 新增菜单数据
   */
  async addMenu(data: Menu): Promise<CommonResponse<any>> {
    // 数据库默认值是null
    data.parentPermissionId = data.parentPermissionId || null;
    const result = await this.permRepository
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
   * 编辑菜单数据
   */
  async updateMenu(data: Menu): Promise<CommonResponse<any>> {
    // 数据库默认值是null
    data.parentPermissionId = data.parentPermissionId || null;

    const result = await this.permRepository
      .createQueryBuilder()
      .update()
      .set({
        permissionName: data.permissionName,
        permissionType: data.permissionType,
        parentPermissionId: data.parentPermissionId,
        path: data.path,
        component: data.component,
        redirect: data.redirect,
        hidden: data.hidden,
        icon: data.icon,
        sort: data.sort,
      })
      .where("permissionId = :permissionId", {
        permissionId: data.permissionId,
      })
      .execute();
    if (result) {
      return success(null, "修改成功！");
    } else {
      return error("修改失败！");
    }
  }
}
