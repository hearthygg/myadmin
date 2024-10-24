import { DirectiveBinding, h, render, nextTick,} from 'vue';
import ReportItem from '@/components/ExamReport/ReportItem.vue';
export const renderHtml = {
  async mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 渲染富文本元素并且替换掉特殊标记
    const replacedContent = binding.value.data.stem.replace(/<strong>\s*___\((\d+)\)___\s*<\/strong>/g, '<report-item></report-item>');
    el.innerHTML = replacedContent;
    // 等待Vue完成DOM更新后再查询
    await nextTick();

    const myComponents = Array.from(el.querySelectorAll('report-item'));
    myComponents.forEach((element, index) => {
      // 使用h()函数创建组件实例
      const vnode = h(ReportItem, {
        // props: {
        //   parentIndex: binding.value.index,
        //   childIndex: index,
        //   showData: binding.value.data.answerOptions[index]
        // }
        parentIndex: binding.value.index,
        childIndex: index,
        showData: binding.value.data.answerOptions[index],
        currentState: binding.value.currentState,
      });

      // 手动挂载到DOM
      render(vnode, element);
    });
  }
};
