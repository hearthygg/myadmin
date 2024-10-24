<template>
  <div class="sys-container">
    <el-row class="w-full">
      <el-col :span="4">
        <div class="search-container">
          <TableSearch :search="state.tableData.search" @search="onSearch" />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">部门管理</div>
            <div class="flex justify-between items-center">
              <!-- 引导页面 -->
              <!-- <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn> -->
              <el-button class="addbtn" type="success" @click="handlerAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <Table ref="tableRef" v-bind="state.tableData" class="table-demo" @handlerEdit="handlerEdit" @delRow="onTableDelRow" @pageChange="onTablePageChange" @sortHeader="onSortHeader" @deleteAll="deleteAll" />
        </div>
      </el-col>
    </el-row>
    <OperateDialog width="769px" :dialog="state.tableData.dialogForm" ref="dialogRef" @refresh="dialogOperate" />
  </div>
</template>

<script setup lang="ts" name="makeTableDemo">
// api
import { listDepartments, addDept, getDeptById, updateDept, deleteDept } from '@/api/dept';
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// 引入组件
const Table = defineAsyncComponent(() => import('@/components/Table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('@/components/Table/search.vue'));
const OperateDialog = defineAsyncComponent(() => import('@/components/Table/dialog.vue'));
// 定义变量内容
const tableRef = ref<RefType>();
// 获取模态框对象
const dialogRef = ref();
// 表格配置数据
const state = reactive<any>({
  tableData: {
    // 列表数据（必传）
    data: [],
    // 配置项（必传）表格样式配置
    config: {
      total: 0, // 列表总数
      loading: true, // loading 加载
      isBorder: true, // 是否显示表格边框
      isSerialNo: true, // 是否显示表格序号
      isSelection: true, // 是否显示表格多选
      isOperate: true, // 是否显示表格操作栏
      operateBtn: ['edit', 'delete'], //展示操作栏有哪些按钮 edit: 编辑, delete: 删除, view: 预览, reset: 重置密码
      operateWidth: '180', //操作栏的宽度
      rowId: 'deptId' //表格项id
    },

    /*---表格数据不同---*/
    // 表头内容（必传，注意格式）设置表格具体展示什么内容
    header: [
      { key: 'deptName', colWidth: '', title: '部门名称', type: 'text', isCheck: true },
      { key: 'deptCode', colWidth: '', title: '部门标识', type: 'text', isCheck: true },
      { key: 'deptTel', colWidth: '', title: '部门电话', type: 'text', isCheck: true }
    ],
    // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式） 设置搜索框表单内容
    search: [
      { label: '部门名称', prop: 'deptName', placeholder: '部门名称', required: false, type: 'input' },
      { label: '部门电话', prop: 'deptTel', placeholder: '部门电话', required: false, type: 'input' },
      { label: '部门标识', prop: 'deptCode', placeholder: '部门标识', required: false, type: 'input' }
    ],
    // 新增或者编辑弹框数据设置 有的选择器的数据要先从后台获取 设置模态框表单样式
    dialogForm: [
      { label: '部门名称', prop: 'deptName', placeholder: '部门名称', required: true, type: 'input' },
      { label: '部门电话', prop: 'deptTel', placeholder: '部门电话', required: false, type: 'input' },
      { label: '部门标识', prop: 'deptCode', placeholder: '部门标识', required: true, type: 'input' }
    ],
    /*---表格数据不同---*/

    // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
    param: {
      pageNum: 1,
      pageSize: 10
    }
  }
});

/*---增删改查调用的api不同 ---*/
// 初始化列表数据
const getTableData = () => {
  state.tableData.config.loading = true;
  state.tableData.data = [];
  listDepartments(state.tableData.param)
    .then(({ data }) => {
      state.tableData.data = data.deptList;
      state.tableData.config.total = data.total;
      state.tableData.config.loading = false;
    })
    .catch(() => (state.tableData.config.loading = false));
};
// 模态框编辑还是新增操作 调用相应的api
const dialogOperate = (type: 'edit' | 'add', data: any) => {
  if (type === 'edit') {
    // 提交编辑操作
    updateDept(data).then(() => {
      ElMessage.success('编辑数据成功！');
      dialogRef.value.closeDialog();
      getTableData();
    });
  } else if (type === 'add') {
    // 提交新增
    addDept(data).then(() => {
      ElMessage.success('新增数据成功！');
      dialogRef.value.closeDialog();
      getTableData();
    });
  }
};
// 删除当前项回调
const onTableDelRow = (row: EmptyObjectType) => {
  deleteDept([row[state.tableData.config.rowId]]).then(() => {
    ElMessage.success(`删除${row.deptName}成功！`);
    getTableData();
  });
};
// 批量删除旋转的表格数据
const deleteAll = (rows: EmptyObjectType) => {
  let ids: Array<string> = [];
  rows.map((i: any) => ids.push(i[state.tableData.config.rowId]));
  // let idStr = ids.join(',');
  deleteDept(ids).then(() => {
    ElMessage.success('批量删除数据成功');
    getTableData();
  });
};
// 编辑点击时表单回调
const handlerEdit = (row: any) => {
  getDeptById(row[state.tableData.config.rowId]).then(res => {
    dialogRef.value.openDialog('edit', res.data.dept);
  });
};
/*---unique End---*/

// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
  state.tableData.param = Object.assign({}, state.tableData.param, { ...data });
  tableRef.value.pageReset();
};
// 新增点击时表单回调
const handlerAdd = () => {
  dialogRef.value.openDialog('add');
};
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
  state.tableData.param.pageNum = page.pageNum;
  state.tableData.param.pageSize = page.pageSize;
  getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
  state.tableData.header = data;
};
// 页面加载时
onMounted(() => {
  // 初始化表格数据
  getTableData();
});
</script>
