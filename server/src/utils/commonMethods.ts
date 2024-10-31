import { get } from "@tools/env-config";
import { SelectOption } from "../types/common";
import multer from "multer";
import path from "path";

/**
 * 嵌套对象的数组去重
 * @param data
 * @param key 唯一标识
 * @returns
 */
export const uniqueArr = (data: any[], key: string) => {
  const uniqueKeys = new Set(data.map((item) => item[key]));
  const uniqueResult = data.filter((item) => uniqueKeys.delete(item[key]));
  return uniqueResult;
};

/**
 * 递归将扁平数据转换成树形数据
 */
export const getTreeData = (
  data: any,
  parentKey: string,
  uniqueKey: string
) => {
  // 创建一个映射，以唯一标识存储
  const treeMap = new Map<number, any>();
  data.forEach((item: any) => {
    treeMap.set(item[uniqueKey], item);
  });

  // 初始化根节点
  const rootPermissions: any[] = [];
  data.forEach((item: any) => {
    if (item[parentKey] === null) {
      rootPermissions.push(item);
    }
  });

  // 递归构建树
  const buildTree = (permissions: any[]): any[] => {
    return permissions.map((item) => {
      const children = Array.from(treeMap.values())
        .filter((child) => child[parentKey] === item[uniqueKey])
        .map((child) => buildTree([child])[0]);
      if (children.length > 0) {
        item.children = children;
      }
      return item;
    });
  };

  const tree = buildTree(rootPermissions);

  return tree;
};

/**
 * 将树形数据转换成 value lable的数据
 */
export const changeThreeData = (
  data: any,
  valueKey: string,
  labelKey: string
): SelectOption[] => {
  return data.map((item: any) => ({
    value: item[valueKey],
    label: item[labelKey],
    children:
      item.children && changeThreeData(item.children, valueKey, labelKey),
  }));
};

const maxFileSize = get("maxFileSize") as number;
const fileTypeArray = get("fileTypeArray") as string[];

/**
 * 限制文件的大小和类型
 */
export const checkFileSizeAndType = (file: Express.Multer.File) => {
  const fileSize = file.size / 1024 / 1024; // 转换为MB
  if (fileSize > maxFileSize) {
    return {
      success: false,
      message: `文件大小不能超过${maxFileSize}MB`,
    };
  }
  if (!fileTypeArray.includes(file.mimetype)) {
    return {
      success: false,
      message: `文件类型不正确，请上传${fileTypeArray.join(",")}类型`,
    };
  }
  return {
    success: true,
  };
};

/**
 * 单文件上传的配置项
 */
export const fileUploadOptions = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/uploads"));
    },
    //  3.2 存储名称
    filename: function (req, file, cb) {
      // 自定义图片名称
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  // 文件类型限制
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (!fileTypeArray.includes(file.mimetype)) {
      return cb(
        new Error("文件类型不正确，请上传" + fileTypeArray.join(",") + "类型")
      );
    }
    cb(null, true);
  },
  // 文件名长度和文件大小限制
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * maxFileSize,
  },
};
