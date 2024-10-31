import { SelectOption } from "../types/common";

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
