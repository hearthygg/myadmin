/**试题相关数据存储库 */
import { defineStore } from 'pinia';

export const useQuestionStore = defineStore('question', {
  state: () => {
    return {
      /**题目类型数据 */
      questionTypesOption: [
        { key: 1, value: '单选题' },
        { key: 7, value: '多选题' },
        { key: 2, value: '填空题' },
        { key: 3, value: '判断题' },
        { key: 4, value: '问答题' },
        { key: 5, value: '计算题' },
        { key: 6, value: '综合题' }
      ],
      /**题目难易程度等级 */
      hardStage: [
        { key: 1, value: '简单' },
        { key: 2, value: '基础' },
        { key: 3, value: '中等' },
        { key: 4, value: '困难' },
      ],
      /**试卷发布状态 */
      paPerPublishOptions: [
        { value: 1, label: '未发布' },
        { value: 2, label: '已发布' },
      ],
      /**成绩公布状态 */
      scorePublishOptions: [
        { value: 1, label: '未公布' },
        { value: 2, label: '已公布' },
      ],
      /**答案公布状态 */
      answerPublishOptions: [
        { value: 1, label: '未公布' },
        { value: 2, label: '已公布' },
      ],
    };
  },
});
