<template>
  <div class="fullDialog">
    <el-dialog destroy-on-close :title="state.dialog.title" v-model="state.dialog.visible" :fullscreen="true">
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">所有学生列表</div>
          <el-card class="col-height" shadow="hover">
            <el-form class="searchForm-inputStudent" ref="queryFormRef" :model="state.queryParams" :inline="true">
              <el-form-item label="关键字">
                <el-input v-model="filterText" placeholder="关键字" />
              </el-form-item>
              <el-form-item label="学生名称/学号" prop="studentKeyWord">
                <el-input class="w-full" v-model="state.queryParams.studentKeyWord" placeholder="学生名称/学号" />
              </el-form-item>
              <el-form-item>
                <!-- 引导页面 -->
                <guide-btn class="helpbtn-inputStudent" :guideArr="state.guideArr"></guide-btn>
                <el-button class="searchbtn-inputStudent" type="primary" @click="getTreeData"><i class="iconfont icon-sousuo"></i></el-button>
                <el-button class="resetbtn-inputStudent" type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i></el-button>
              </el-form-item>
            </el-form>
            <el-scrollbar class="treeArea-inputStudent" height="calc(100vh - 240px)" v-loading="state.loading">
              <el-tree @check-change="treeCheckChange" :props="treeProps" :load="loadNode" :lazy="true" :filter-node-method="filterNode" ref="resourceRef" node-key="value" show-checkbox :data="state.treeList">
                <template #default="{ data }">
                  {{ data.label }}
                </template>
                <template #empty>
                  <el-empty description="暂无数据" />
                </template>
              </el-tree>
            </el-scrollbar>
          </el-card>
        </el-col>
        <el-col :span="8">
          <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">已导入学生列表</div>
          <el-table
            class="tablearea-inputStudent"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.studentList"
            height="calc(100vh - 188px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="学生学号" prop="userName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="学生名称" prop="nickName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属班级" prop="claName" show-overflow-tooltip :align="'center'" />
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
        </el-col>
      </el-row>
      <template #footer>
        <el-row :gutter="10">
          <el-col class="text-left" :span="16">
            <div class="paginationarea rounded-lg px-2 flex justify-between items-center">
              <el-button class="importbtn-inputStudent" type="primary" @click="submitInputStudent"> <i class="iconfont icon-daoru"></i>导入学生 </el-button>
              <el-button v-if="state.currentType === 'publishPaper'" class="fabu-inputStudent" type="primary" @click="publishPaper">
                <i class="iconfont icon-fabu2"></i>{{ state.publishState === PaPerPublish.WFB ? '发布试卷' : '撤回试卷' }}
              </el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="paginationarea rounded-lg px-2">
              <el-button class="deletebtn-inputStudent" type="danger" @click="deleteAlls"> <i class="iconfont icon-shanchu"></i>批量删除 </el-button>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, nextTick } from 'vue';
import { ElForm, ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { getStudentTree, getStudentList, inputStudent } from '@/api/courseSet';
import { getAllClass } from '@/api/class';
import { StudentTreeQuery, InputStudentInfo } from '@/api/courseSet/types';
import { changePaperPublishState } from '@/api/examPaper';
import { PaPerPublish } from '@/api/examPaper/types';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
// 条件查询表单对象
const queryFormRef = ref(ElForm);
const resourceRef = ref(ElTree);
// 树形数据
interface Tree {
  label?: string;
  value?: string;
  leaf?: boolean;
  [key: string]: any;
}
const filterText = ref('');
watch(filterText, val => {
  resourceRef.value!.filter(val);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
const treeProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'leaf'
};
const emit = defineEmits(['refresh']);
const state = reactive({
  // 表格刷新动画
  loading: false,
  // 查询条件
  queryParams: {} as StudentTreeQuery,
  // 树状图数据
  treeList: [] as OptionType[],
  // 学生数据
  studentList: [] as InputStudentInfo[],
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '导入学生',
    visible: false
  } as DialogType,
  // 保存父级数据id
  currentParentId: 0,
  // 区分当前组件状态
  currentType: '',
  // 树节点被选中的id
  treeCheckedIds: new Map(),
  // 试卷发布状态 1：未发布 2：已发布
  publishState: 1,
  // 引导页相关数据
  guideArr: [] as Step[]
});
// 初始化选择器数据
function initSelectOption() {
  // 获取班级数据
  getAllClass().then(({ data }) => {
    data.claOptions.map((v: any) => (v.children = []));
    state.treeList = data.claOptions as OptionType[];
    getInputStudent();
  });
}
/**学生名称/学号查询 */
function getTreeData() {
  state.queryParams.studentKeyWord ? (state.queryParams.claId = undefined) : (state.queryParams.claId = state.treeList[0].value);
  getStudentTree(state.queryParams).then(({ data }) => {
    const claIds = [...new Set(data.stduentTree.map(v => v.value))];
    treeNodeClick(claIds);
    // 进行排序
    // setTimeout(() => {
    //   state.treeList = sortAppointList(state.treeList,claIds)
    // },500)
    // setTimeout(() => {
    //   if(state.queryParams.studentKeyWord) filterText.value = state.queryParams.studentKeyWord;
    // },200)
  });
}

/**子节点展开 */
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  // 展开班级的时候懒加载学生数据
  if (node.level === 1) {
    state.queryParams.claId = node.data.value;
    state.queryParams.studentKeyWord = undefined;
    const treeData: Tree[] = [];
    getStudentTree(state.queryParams).then(({ data }) => {
      data.stduentTree.forEach(v => {
        v.children?.forEach(v2 => {
          treeData.push({ ...v2, leaf: true });
        });
      });
      resolve(treeData);
    });
  }
};

/**根节点点击获取子节点数据 */
function treeNodeClick(claIds: string[]) {
  claIds.forEach(v => {
    let tempIndex = state.treeList.findIndex(item => item.value == v);
    if (tempIndex !== -1 && state.treeList[tempIndex].children?.length < 1) {
      // 触发点击事件
      const clickElement = document.querySelector(`.el-tree>.el-tree-node[data-key="${v}"]`);
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      if (clickElement.getAttribute('aria-expanded') == 'false') {
        nextTick(() => {
          clickElement?.dispatchEvent(clickEvent);
        });
      }
    }
  });
}
// 获取已经导入的学生数据
function getInputStudent(isChecked = true) {
  getStudentList(state.currentParentId, state.currentType).then(({ data }) => {
    state.studentList = data.studentInfos;
    if (isChecked) {
      // 已导入的数据展开子节点 claId
      // 班级数据去重
      const claIds = [...new Set(state.studentList.map(v => v.claId))];
      treeNodeClick(claIds);
      // 勾选选中的数据
      setTimeout(() => {
        state.studentList.forEach(item => resourceRef.value.setChecked(item.userId, true));
      }, 200);
    }
  });
}
/**
 * 提交导入学生
 */
function submitInputStudent() {
  ElMessageBox.confirm('确认导入左侧勾选的学生吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const checkedIds: number[] = resourceRef.value.getCheckedKeys(true);
      // const checkedIds: number[] = [...state.treeCheckedIds.values()];
      inputStudent(state.currentParentId, checkedIds, state.currentType).then(() => {
        ElMessage.success('导入学生成功！');
        // 获取已导入学生数据
        getInputStudent(false);
      });
    })
    .catch(() => ElMessage.info('已取消'));
}
/**发布撤回试卷 */
function publishPaper() {
  let tipsInfo = '';
  if (state.publishState === PaPerPublish.WFB) {
    tipsInfo = '确定发布试卷吗？被导入的学生就可以答题以及提交试卷了';
  } else if (state.publishState === PaPerPublish.YFB) {
    tipsInfo = '确定撤回试卷吗？会影响学生做题以及相关功能';
  }
  ElMessageBox.confirm(tipsInfo, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      changePaperPublishState(state.currentParentId, state.publishState).then(() => {
        ElMessage.success('修改成功！');
        emit('refresh');
        state.dialog.visible = false;
      });
    })
    .catch(() => ElMessage.info('已取消'));
}
/**
 * 批量删除学生
 */
function deleteAlls() {
  ElMessageBox.confirm('确认删除右侧勾选的学生吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // ids取反操作
      let temArr: number[] = [];
      state.studentList.forEach(item => {
        if (!state.ids.includes(item.userId)) temArr.push(item.userId);
      });
      inputStudent(state.currentParentId, temArr, state.currentType).then(() => {
        ElMessage.success('批量删除学生成功！');
        // 取消勾选
        state.ids.forEach(item => resourceRef.value.setChecked(item, false));
        // 获取已导入学生数据
        getInputStudent(false);
      });
    })
    .catch(() => ElMessage.info('已取消'));
}
/**
 * 打开导入学生弹框
 */
function openDialog(id: number, type: string, publishState = 1) {
  if (type === 'publishPaper') {
    state.dialog.title = '发布试卷';
    state.publishState = publishState;
  }
  state.currentType = type;
  state.currentParentId = id;
  initSelectOption();
  // 重置树节点选中的id列表
  state.treeCheckedIds = new Map();
  state.dialog.visible = true;
  nextTick(() => {
    state.guideArr = getGuideData('inputStudent') as Step[];
  });
}
/**
 * 重置查询
 */
function resetQuery() {
  state.queryParams = {} as StudentTreeQuery;
  getTreeData();
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: InputStudentInfo[]) {
  state.ids = selection.map(item => item.userId);
}
/**树形数据复选框发生变化 */
function treeCheckChange(currentVal: TreeDataList, isCheck: boolean) {
  //共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
  if (!currentVal.children) {
    // 子节点复选框发生变化
    if (isCheck) {
      //选中 插入当前数据
      if (!state.treeCheckedIds.has(currentVal.value)) state.treeCheckedIds.set(currentVal.value, currentVal.value);
    } else {
      // 未选中 删除当前数据
      if (state.treeCheckedIds.has(currentVal.value)) {
        state.treeCheckedIds.delete(currentVal.value);
      }
    }
  } else {
    // 根节点发生变化
    treeNodeClick([currentVal.value]);
  }
}
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.col-height {
  height: calc(100vh - 188px);
}
</style>
