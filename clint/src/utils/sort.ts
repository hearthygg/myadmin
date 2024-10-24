/**排序方法 */

import { QuestionForm } from '@/api/question/types';

// 试题列表按照特定顺序进行排序 按照[1, 7, 2, 3, 4, 5, 6]的顺序排序
export function sortQuestionList(data: QuestionForm[]) {
  if (data.length === 0) return data;
  const customSort = (a: any, b: any) => {
    const order = [1, 7, 2, 3, 4, 5, 6];
    const indexA = order.indexOf(a.questionType);
    const indexB = order.indexOf(b.questionType);
    return indexA - indexB;
  };
  return data.sort(customSort);
}
/**指定的数据排列在前面 */
export function sortAppointList(data: OptionType[], reference: string[]) {
  if (data.length === 0) return data;
  const customSort = (a: OptionType, b: OptionType) => {
    const indexA = reference.includes(a.value) ? 1 : 2;
    const indexB = reference.includes(b.value) ? 1 : 2;
    return indexA - indexB;
  };
  // 返回一个新数组
  return [...data].sort(customSort);
}
// 让数据按照指定的顺序进行排列
export function sortBySelfOrder(data: any[], order: number[] | string[], key: string) {
  if (data.length === 0) return data;
  const customSort = (a: any, b: any) => {
    const indexA = order.indexOf(a[key]);
    const indexB = order.indexOf(b[key]);
    return indexA - indexB;
  };
  return data.sort(customSort);
}
