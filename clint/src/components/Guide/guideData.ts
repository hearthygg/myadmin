// 将引导页的
import { Step } from 'intro.js';
// 使用方法用到时才会调用动态设置dom
export function getGuideData(type: string) {
  // 获取每个页面对应的引导信息
  if (type === "course") {
    // 课程信息
    return [
      {
        element: document.querySelector('.searchForm') as Element,
        title: '条件查询',
        intro: '这里可以设置查询表格数据的筛选条件',
        position: 'right'
      },
      {
        element: document.querySelector('.searchbtn') as Element,
        title: '搜索按钮',
        intro: '点击这里根据筛选条件查询表格数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.resetbtn') as Element,
        title: '重置按钮',
        intro: '点击这里可以重置筛选条件查询表格数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.importbtn') as Element,
        title: '批量导入',
        intro: '点击这里选择批量导入的文件来批量导入数据',
        position: 'left'
      },
      {
        element: document.querySelector('.helpbtn') as Element,
        title: '帮助按钮',
        intro: '点击这里可以提示当前页面是如何使用的',
        position: 'left'
      },
      {
        element: document.querySelector('.addbtn') as Element,
        title: '新增按钮',
        intro: '点击这里可以新增数据',
        position: 'left'
      },
      {
        element: document.querySelector('.tablearea') as Element,
        title: '表格区域',
        intro: '这里展示表格区域表格每一行操作区域可以可以编辑和删除当前行数据,省略号隐藏了实验开设(给某门课程增加实验)和导入学生功能',
        position: 'left'
      },
      {
        element: document.querySelector('.paginationarea') as Element,
        title: '分页区域',
        intro: '这里有展示表格总数据,可以设置每一页展示多少条,还可以指定跳转到某一页',
        position: 'top'
      },
      {
        element: document.querySelector('.deletebtn') as Element,
        title: '批量删除',
        intro: '勾选表格上的数据,点击这里可以批量删除数据',
        position: 'left'
      }
    ] as Step[];
  } else if (type === "exam") {
    // 实验项目
    return [
      {
        element: document.querySelector('.searchForm') as Element,
        title: '条件查询',
        intro: '这里可以设置查询表格数据的筛选条件',
        position: 'right'
      },
      {
        element: document.querySelector('.searchbtn') as Element,
        title: '搜索按钮',
        intro: '点击这里根据筛选条件查询表格数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.resetbtn') as Element,
        title: '重置按钮',
        intro: '点击这里可以重置筛选条件查询表格数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.columnsetbtn') as Element,
        title: '栏目设置',
        intro: '点击这里可以显示栏目设置相关信息',
        position: 'left'
      },
      {
        element: document.querySelector('.importbtn') as Element,
        title: '批量导入',
        intro: '点击这里选择批量导入的文件来批量导入数据',
        position: 'left'
      },
      {
        element: document.querySelector('.helpbtn') as Element,
        title: '帮助按钮',
        intro: '点击这里可以提示当前页面是如何使用的',
        position: 'left'
      },
      {
        element: document.querySelector('.addbtn') as Element,
        title: '新增按钮',
        intro: '点击这里可以新增数据',
        position: 'left'
      },
      {
        element: document.querySelector('.tablearea') as Element,
        title: '表格区域',
        intro: '这里展示表格区域表格每一行操作区域可以可以编辑和删除当前行数据',
        position: 'left'
      },
      {
        element: document.querySelector('.paginationarea') as Element,
        title: '分页区域',
        intro: '这里有展示表格总数据,可以设置每一页展示多少条,还可以指定跳转到某一页',
        position: 'top'
      },
      {
        element: document.querySelector('.deletebtn') as Element,
        title: '批量删除',
        intro: '勾选表格上的数据,点击这里可以批量删除数据',
        position: 'left'
      }
    ] as Step[];
  } else if (type === "inputStudent") {
    // 导入学生弹窗
    return [
      {
        element: document.querySelector('.searchForm-inputStudent') as Element,
        title: '条件查询',
        intro: '这里可以设置查询班级-学生树形数据的筛选条件',
        position: 'right'
      },
      {
        element: document.querySelector('.searchbtn-inputStudent') as Element,
        title: '搜索按钮',
        intro: '点击这里根据筛选条件查询班级-学生树形数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.resetbtn-inputStudent') as Element,
        title: '重置按钮',
        intro: '点击这里可以重置筛选条件查询班级-学生树形数据',
        position: 'bottom'
      },
      {
        element: document.querySelector('.treeArea-inputStudent') as Element,
        title: '班级-学生树形数据区域',
        intro: '这里显示的是班级-学生树形数据点击每个班级可以加载出当前班级学生可以点击多选框勾选班级或者学习',
        position: 'left'
      },
      {
        element: document.querySelector('.importbtn-inputStudent') as Element,
        title: '导入学生',
        intro: '点击这里将会导入树形列表勾选选中的学生数据，已经导入的学生会显示在右侧',
        position: 'left'
      },
      {
        element: document.querySelector('.fabu-inputStudent') as Element,
        title: '发布/撤回试卷',
        intro: '点击这里可以发布或者撤回试卷',
        position: 'left'
      },
      {
        element: document.querySelector('.tablearea-inputStudent') as Element,
        title: '表格区域',
        intro: '这里表格区域展示的是已经被导入的学生列表信息',
        position: 'left'
      },
      {
        element: document.querySelector('.deletebtn-inputStudent') as Element,
        title: '批量删除',
        intro: '勾选表格上的数据,点击这里可以批量删除数据',
        position: 'left'
      }
    ] as Step[];
  }
}
