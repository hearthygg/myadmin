import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
/**新增菜单校验规则 */
export class PageQuery {
  @IsInt({ message: "pageNum 必须是整数" })
  @Min(1, { message: "pageNum 必须大于等于 1" })
  pageNum!: number;

  @IsInt({ message: "pageSize 必须是整数" })
  @Min(1, { message: "pageSize 必须大于等于 1" })
  @Max(100, { message: "pageSize 最大值为 100" })
  @IsNumber()
  pageSize!: number;
}

// 自定义验证器，确保数组中的每个元素都是数字
@ValidatorConstraint({ name: "isNumberArray", async: false })
export class IsNumberArrayConstraint implements ValidatorConstraintInterface {
  validate(permIds: any, args: ValidationArguments) {
    if (!Array.isArray(permIds)) {
      return false;
    }
    return permIds.every((item) => typeof item === "number");
  }

  defaultMessage(args: ValidationArguments) {
    return "permIds 数组中的每个元素都必须是数字";
  }
}
// 自定义验证器，确保数组中的每个元素都是字符串
@ValidatorConstraint({ name: "isStringArray", async: false })
export class IsStringArrayConstraint implements ValidatorConstraintInterface {
  validate(permIds: any, args: ValidationArguments) {
    if (!Array.isArray(permIds)) {
      return false;
    }
    return permIds.every((item) => typeof item === "string");
  }

  defaultMessage(args: ValidationArguments) {
    return "permIds 数组中的每个元素都必须是数字";
  }
}
