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
            <div class="table-total">用户管理</div>
            <div class="flex justify-between items-center">
              <!-- 引导页面 -->
              <!-- <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn> -->
              <el-button v-has-role="['admin']" class="importbtn" type="warning" @click="openBatchImport"><i class="iconfont icon-daoru"></i>批量导入</el-button>
              <el-button v-has-role="['admin']" class="addbtn" type="success" @click="handlerAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <Table
            currentPath="user"
            @tableBtnClick="tableBtnClick"
            ref="tableRef"
            v-bind="state.tableData"
            class="table-demo"
            @handlerEdit="handlerEdit"
            @delRow="onTableDelRow"
            @pageChange="onTablePageChange"
            @sortHeader="onSortHeader"
            @deleteAll="deleteAll"
          />
        </div>
      </el-col>
    </el-row>
    <OperateDialog width="800px" :dialog="state.tableData.dialogForm" ref="dialogRef" @refresh="dialogOperate" @searchCardRecord="searchCardRecord" />
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="900px">
      <el-form :model="dialog.searchForm" ref="dialogFormRef" label-width="90px">
        <el-row>
          <el-col :span="8" class="mb20">
            <el-form-item label="读卡器名称">
              <el-input v-model="dialog.searchForm.name" placeholder="读卡器名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间">
              <el-date-picker v-model="dialog.searchForm.startTime" type="date" value-format="x" placeholder="开始时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <el-date-picker v-model="dialog.searchForm.endTime" type="date" value-format="x" placeholder="结束时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="mb20 ml10">
            <el-button type="info" @click="resetQuery"><i class="iconfont icon-icon-refresh"></i>重置</el-button>
            <el-button type="primary" @click="queryDialogTable"><i class="iconfont icon-sousuo"></i>查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="dialog.tableData.data" height="480px" :border="true" :header-cell-style="{ background: '#F2F6FC' }" stripe v-loading="dialog.tableData.loading">
        <el-table-column type="index" :align="'center'" label="序号" width="60" />
        <el-table-column label="卡号" prop="cardId" />
        <el-table-column label="最后读卡器名称" prop="cardName" />
        <el-table-column label="最后读卡时间" prop="endTime" />
        <el-table-column label="操作" width="100" :align="'center'">
          <el-button text type="danger"><i class="iconfont icon-shanchu"></i>删除</el-button>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <pagination v-if="dialog.tableData.total > 0" :total="dialog.tableData.total" v-model:page="dialog.tableData.pageNum" v-model:limit="dialog.tableData.pageSize" @pagination="queryDialogTable" />
    </el-dialog>
    <BatchImport type="user" @queryTableData="getTableData" ref="importExcelRef" />
  </div>
</template>

<script setup lang="ts" name="makeTableDemo">
// api
import { listUserPages, addUser, getUserForm, updateUser, deleteUsers, resetUserPassword } from '@/api/user';
import { UserQuery, UserTable } from '@/api/user/types';
import { getAllDept } from '@/api/dept';
import { getAllClass } from '@/api/class';
import { getAllRole } from '@/api/role';
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useSelectEnum } from '@/store/selectEnum';
import BatchImport from '@/components/BatchImport/index.vue';
const selectEnum = useSelectEnum();
// 引入组件
const Table = defineAsyncComponent(() => import('@/components/Table/index.vue'));
const TableSearch = defineAsyncComponent(() => import('@/components/Table/search.vue'));
const OperateDialog = defineAsyncComponent(() => import('@/components/Table/dialog.vue'));
// 定义变量内容
const tableRef = ref<RefType>();
// 获取模态框对象
const dialogRef = ref();
const dialogFormRef = ref();
const importExcelRef = ref(BatchImport);
// 表格配置数据
const state = reactive<TableDemoState<UserQuery, UserTable>>({
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
      operateBtn: ['reset', 'edit', 'delete'], //展示操作栏有哪些按钮 edit: 编辑, delete: 删除, view: 预览, reset: 重置密码
      operateWidth: '210', //操作栏的宽度
      rowId: 'userId' //表格项id
    },

    /*---表格数据不同---*/
    // 表头内容（必传，注意格式）设置表格具体展示什么内容
    header: [
      { key: 'userName', colWidth: '', title: '用户账号', type: 'text', isCheck: true },
      { key: 'nickName', colWidth: '', title: '用户名称', type: 'text', isCheck: true },
      { key: 'cardID', colWidth: '', title: '校园卡号', type: 'text', isCheck: true },
      { key: 'uid', colWidth: '', title: '用户编号', type: 'text', isCheck: true },
      { key: 'deptName', colWidth: '', title: '所属部门', type: 'text', isCheck: true },
      { key: 'claName', colWidth: '', title: '所在班级', type: 'text', isCheck: true }
    ],
    // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式） 设置搜索框表单内容
    search: [
      { prop: 'nickName', label: '用户名称', placeholder: '用户名称', required: false, type: 'input' },
      { prop: 'userName', label: '用户账号', placeholder: '用户账号', required: false, type: 'input' },
      { prop: 'ugroup', label: '用户类别', placeholder: '用户类别', required: false, type: 'select', options: selectEnum.businessEnumTypes.userGroupOptions },
      { prop: 'deptId', label: '所属部门', placeholder: '所属部门', required: false, type: 'select', options: [] },
      { prop: 'claId', label: '所在班级', placeholder: '所在班级', required: false, type: 'select', options: [] }
    ],
    // 新增或者编辑弹框数据设置 有的选择器的数据要先从后台获取 设置模态框表单样式
    dialogForm: [
      { prop: 'avatar', label: '用户头像', placeholder: '用户头像', required: false, type: 'img' },
      { prop: 'roleIds', label: '用户角色', placeholder: '用户角色', required: true, type: 'selectAll', options: [] },
      { prop: 'nickName', label: '用户名称', placeholder: '用户名称', required: true, type: 'input' },
      { prop: 'userName', label: '用户账号', placeholder: '用户账号', required: true, type: 'input', state: 'add' },
      // { prop: 'newPassword', label: '用户密码', placeholder: '用户密码', required: true, type: 'password', state: 'add' },
      // { prop: 'confirmNewPassword', label: '确认密码', placeholder: '确认密码', required: true, type: 'password', state: 'add' },
      { prop: 'deptId', label: '所属部门', placeholder: '所属部门', required: true, type: 'select', options: [] },
      { prop: 'claId', label: '所在班级', placeholder: '所在班级', required: true, type: 'select', options: [] },
      { prop: 'uid', label: '用户编号', placeholder: '用户编号', required: true, type: 'input' },
      { prop: 'ugroup', label: '用户类别', placeholder: '用户类别', required: true, type: 'select', options: selectEnum.businessEnumTypes.userGroupOptions },
      { prop: 'sex', label: '用户性别', placeholder: '用户性别', required: false, type: 'select', options: selectEnum.businessEnumTypes.genderOptions },
      { prop: 'cardID', label: '校园卡号', placeholder: '校园卡号', required: false, type: 'input', options: [] },
      { prop: 'tel', label: '用户电话', placeholder: '用户电话', required: false, type: 'input' },
      { prop: 'birthday', label: '用户生日', placeholder: '用户生日', required: false, type: 'date' }
    ],
    /*---表格数据不同---*/

    // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
    param: {
      pageNum: 1,
      pageSize: 10
    }
  }
});
// 查询刷卡记录弹框相关数据
const dialog = reactive<any>({
  isShowDialog: false,
  title: '查询刷卡记录',
  currentCardId: '',
  searchForm: {
    name: '',
    startTime: '',
    endTime: ''
  },
  tableData: {
    data: [],
    loading: false,
    total: 0,
    pageNum: 1,
    pageSize: 10
  }
});
/*---增删改查调用的api不同 ---*/
// 初始化列表数据
const getTableData = () => {
  state.tableData.config.loading = true;
  state.tableData.data = [];
  listUserPages(state.tableData.param)
    .then(({ data }) => {
      state.tableData.data = data.userList as any;
      state.tableData.config.total = data.total;
      state.tableData.config.loading = false;
    })
    .catch(() => (state.tableData.config.loading = false));
};
// 初始化选择器数据
const getSelectOptionsData = () => {
  // 获取部门数据
  getAllDept().then(res => {
    state.tableData.dialogForm.map((i: TableSearchType) => {
      if (i.prop === 'deptId') i.options = res.data.deptOptions;
    });
    state.tableData.search.map((i: TableSearchType) => {
      if (i.prop === 'deptId') i.options = res.data.deptOptions;
    });
  });
  // 获取班级数据
  getAllClass().then(res => {
    state.tableData.dialogForm.map((i: TableSearchType) => {
      if (i.prop === 'claId') i.options = res.data.claOptions;
    });
    state.tableData.search.map((i: TableSearchType) => {
      if (i.prop === 'claId') i.options = res.data.claOptions;
    });
  });
  // 获取角色数据
  getAllRole().then(res => {
    state.tableData.dialogForm.map((i: TableSearchType) => {
      if (i.prop === 'roleIds') i.options = res.data.roleOptions;
    });
  });
};
// 模态框编辑还是新增操作 调用相应的api
const dialogOperate = (type: 'edit' | 'add', data: any) => {
  if (type === 'edit') {
    // 提交编辑操作
    updateUser(data).then(() => {
      ElMessage.success('编辑数据成功！');
      dialogRef.value.closeDialog();
      getTableData();
    });
  } else if (type === 'add') {
    // 提交新增
    addUser(data).then(() => {
      ElMessage.success('新增数据成功！');
      dialogRef.value.closeDialog();
      getTableData();
    });
  }
};
// 删除当前项回调
const onTableDelRow = (row: UserTable) => {
  deleteUsers([row[state.tableData.config.rowId]]).then(() => {
    ElMessage.success(`删除${row.nickName}成功！`);
    getTableData();
  });
};
// 批量删除旋转的表格数据
const deleteAll = (rows: Array<UserTable>) => {
  let ids: Array<string> = [];
  rows.map((i: UserTable) => ids.push(i[state.tableData.config.rowId]));
  // let idStr = ids.join(',');
  // console.log(ids);
  deleteUsers(ids).then(() => {
    ElMessage.success('批量删除数据成功');
    tableRef.value.clearSelection();
    getTableData();
  });
};
// 编辑点击时表单回调
const handlerEdit = (row: UserTable) => {
  getUserForm(row[state.tableData.config.rowId]).then(res => {
    dialogRef.value.openDialog('edit', res.data.user);
  });
};
// 外加功能
const tableBtnClick = (type: string, row: UserTable) => {
  if (type === 'view') {
    console.log('预览数据', row);
  } else if (type === 'reset') {
    resetUserPassword(row.userId).then(() => {
      ElMessage.success(`重置用户：${row.nickName}的密码成功！`);
    });
  }
};
// 打开刷卡记录弹框
const searchCardRecord = (data: string) => {
  if (data == '') return ElMessage.error('请输入校园卡号!');
  dialog.isShowDialog = true;
  dialog.cardID = data;
  queryDialogTable();
};
// 查询刷卡记录
const queryDialogTable = () => {
  // dialog.tableData.loading = true;
  dialog.tableData.data = [];
  // listUserPages(state.tableData.param).then(({ data }) => {
  //   dialog.tableData.data = data.userList as any;
  //   dialog.tableData.total = data.total;
  //   dialog.tableData.loading = false;
  // });
  for (let i = 0; i < 15; i++) {
    dialog.tableData.data.push({
      cardId: '#12456893',
      cardName: 'xxx',
      endTime: '2023-3-20'
    });
  }
  dialog.tableData.total = 15;
};
// 重置查询
const resetQuery = () => {
  dialogFormRef.value.resetFields();
  queryDialogTable();
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

const openBatchImport = () => {
  importExcelRef.value.openDialog();
};
// 页面加载时
onMounted(() => {
  // 初始化表格数据
  getTableData();
  // 初始化选择器数据
  getSelectOptionsData();
});
</script>
