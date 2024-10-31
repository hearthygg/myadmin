import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  Validate,
} from "class-validator";
import { IsNumberArrayConstraint, IsStringArrayConstraint, PageQuery } from "./common.dto";

// 自定义校验规则
// export function IsCustomValid(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isCustomValid',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           // 自定义校验逻辑
//           const regex = /^[a-zA-Z0-9_-]+$/;
//           return regex.test(value);
//         },
//         defaultMessage(args: ValidationArguments) {
//           return `${args.property} 必须是字母、数字、下划线或破折号的组合`;
//         },
//       },
//     });
//   };
// }

/**新增菜单校验规则 */
export class addMenuDto {
  @IsNotEmpty({ message: "permissionName 不能为空" })
  @IsString()
  permissionName!: string;

  @IsNotEmpty({ message: "permissionType 不能为空" })
  @IsNumber()
  permissionType!: number;

  @IsNotEmpty({ message: "path 不能为空" })
  @IsString()
  // 正则校验规则
  // @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'path 必须是字母、数字、下划线或破折号的组合' })
  path!: string;

  @IsOptional()
  @IsInt({ message: "parentPermissionId 必须是整数" })
  @Transform(({ value }) => (value === 0 ? 0 : value), { toClassOnly: true })
  parentPermissionId!: number | 0 | null;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsString()
  redirect?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @IsOptional()
  @IsNumber()
  sort?: number;
}

/**编辑菜单校验规则 */
export class updateMenuDto extends addMenuDto {
  @IsNotEmpty({ message: "permissionId 不能为空" })
  @IsNumber()
  permissionId!: number;
}

/**分页查询菜单校验规则 */
export class RolePagesQuery extends PageQuery {
  @IsOptional()
  @IsString()
  keywords?: string;
}

// 新增角色校验规则
export class addRoleDto {
  @IsNotEmpty({ message: "角色名称不能为空！" })
  @IsString()
  roleName!: string;

  @IsNotEmpty({ message: "角色标识不能为空！" })
  @IsString()
  remark!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// 编辑角色校验规则
export class updateRoleDto extends addRoleDto {
  @IsNotEmpty({ message: "角色id不能为空" })
  @IsNumber()
  roleId!: number;
}

// 修改角色权限校验规则
export class updateRolePermissionsDto {
  @IsNotEmpty({ message: "角色id不能为空" })
  @IsNumber()
  roleId!: number;

  @IsNotEmpty({ message: "权限ID数组不能为空" })
  @IsArray({ message: "权限ID必须是一个数组" })
  @Validate(IsNumberArrayConstraint, {
    message: "权限ID数组中的每个元素都必须是数字",
  })
  permIds!: number[];
}

/**分页查询用户校验规则 */
export class UserPagesQuery extends PageQuery {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsNumber()
  sex?: number;
}

// 新增用户权限校验规则
export class addUserDto {
  @IsNotEmpty({ message: "用户账号不能为空！" })
  @IsString()
  username!: string;

  @IsNotEmpty({ message: "用户名不能为空！" })
  @IsString()
  nickname!: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNotEmpty({ message: "邮箱不能为空！" })
  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  telPhone?: string;

  @IsOptional()
  @IsNumber()
  sex?: number;

  @IsOptional()
  @IsArray({ message: "角色标识必须是一个数组" })
  @Validate(IsStringArrayConstraint, {
    message: "角色标识中的每个元素都必须是数字",
  })
  roleRemarks?: string[];
}

// 新增用户权限校验规则
export class updateUserDto extends addUserDto {
  @IsNotEmpty({ message: "用户id不能为空！" })
  @IsNumber()
  userId!: number;
}
