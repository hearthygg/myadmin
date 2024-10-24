import { Question, QuestionForm } from '@/api/question/types';
import { useQuestionStore } from '@/store/modules/question';
import { useUserStoreHook } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';

/**选择器数据映射 */
export function getSelectOptionVal(key: number, type: string) {
  const questionStore = useQuestionStore();
  if (type === 'questionLevel') {
    return questionStore.hardStage.find(v => v.key === key)?.value;
  } else if (type === 'questionType') {
    return questionStore.questionTypesOption.find(v => v.key === key)?.value;
  }
}
/**客观题题数据特殊处理 */
export function selectQuestionOperate(data: QuestionForm) {
  if (data.questionType === Question.DanX || data.questionType === Question.DuoX) {
    data.answer = [];
    data.questionOptions.forEach((v, index) => {
      if (v.optionCorrect == 1) {
        data.answer.push(String.fromCharCode(65 + index));
      }
    });
  }
  // else if(data.questionType === Question.PD) {
  //   data.answer = [];
  //   data.questionOptions.forEach((v, index) => {
  //     if (v.optionCorrect == 1) {
  //       data.answer[0].push(index == 0 ? "1" : "2");
  //     }
  //   });
  // }
  return data;
}

/**判断当前用户是否是学生 */
export function isStudent() {
  const userStore = useUserStoreHook();
  return userStore.ugroup === 1 && userStore.roles.includes('student');
}

/**
 * 切换布局
 */
export function changeLayout(layout: string) {
  const settingsStore = useSettingsStore();
  settingsStore.changeSetting({ key: 'layout', value: layout });
  window.document.body.setAttribute('layout', settingsStore.layout);
}

/**键值对数据映射 */
export function getSelectLabelByValue(selectList: SelectOptionType[], value: number) {
  return selectList.find(v => v.value === value)?.label;
}

/**表格操作按钮区域对应关系 */
export const tableBtnData = [
  { text: '编辑', icon: '', tag: 'update' },
  { text: '删除', icon: '', tag: 'delete' },
  { text: '预览', icon: '', tag: 'view' }
];

/**解析URL参数 */
export function getParameterByName(name: string, url: string) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**导入实验数据 */
async function processTasks(func1: any, func2: any, params1: any, params2: any, params3: any): Promise<any> {
  const result1 = await func1(params1);
  const data = result1.data;

  await func2({ ...params2, expId: data });
  const result3 = await func2({ ...params3, expId: data });
  console.log(params1.expName, '完成录入');
  return result3;
}
/**
 * 批量导入实验数据
 * func1 addExam
 * func2 addCurrentExamCol
 */
export async function inputLessonInfoList(func1: any, func2: any, params1: any, params2: any, params3: any) {
  for (let i = 0; i < testExamData.length; i++) {
    await processTasks(
      func1,
      func2,
      {
        ...params1,
        expName: testExamData[i].expName,
        expOrderNum: i + 1
      },
      {
        ...params2,
        expInfoPath: testExamData[i].examPath
      },
      {
        ...params3,
        expInfoPath: testExamData[i].documentPath
      }
    );
  }
}
// md: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' 传感器: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf'
// 软件无线电: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf'
const testExamData = [
  // 模电
  // { expName: '比例求和运算电路实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '积分与微分电路实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '电压比较器实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '有源滤波器实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '波形发生电路实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '集成电路RC正弦波振荡器实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // { expName: '波形变换电路实验', examPath: '../md_gfkd/#/?id=1', documentPath: 'lmsFile/doc/984_12/国防科大混合模电实验指导书_rwqc3e.pdf' },
  // 传感器
  // { expName: '基于线上的光敏/气敏传感器开发与显示实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的DS18B20开发与显示实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的AD芯片MS1100采集与显示实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的AD芯片ADS7888采集与显示实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的DA芯片DAC5311输出与控制实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上比较器的频率计设计开发与显示实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的扫频电路搭建与自搭电路频响测试实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // { expName: '基于线上的PT100传感器调理电路实验', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },

  { expName: '电子技术（模拟）', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  { expName: '电子技术（数字）', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  { expName: '阻抗匹配', examPath: '../md_gfkd/#/?id=2', documentPath: 'lmsFile/doc/987_12/国科混合-单片机传感器实验课件_aq16r2.pdf' },
  // 软件无线电
  // { expName: 'PN序列发生器', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: '组合逻辑电路与时序逻辑电路设计', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'FIR数字滤波器', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: '半带滤波器', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'CIC滤波器 (抽取与插值)', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: '基带成形与匹配', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'ASK调制解调', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'FSK调制解调', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'PSK调制解调', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
  // { expName: 'DQPSK调制解调', examPath: '../md_gfkd/#/?id=3', documentPath: 'lmsFile/doc/988_12/软件无线电教材_2vkgvm.pdf' },
];

