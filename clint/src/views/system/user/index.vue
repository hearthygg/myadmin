<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="用户账号" prop="username">
              <el-input v-model="state.queryParams.username" placeholder="用户账号" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="state.queryParams.nickname" placeholder="用户昵称" />
            </el-form-item>
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="state.queryParams.sex" placeholder="请选择" clearable>
                <el-option v-for="item in selectEnum.businessEnumTypes.sexOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col
                ><el-button class="searchbtn" type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button></el-col
              >
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col
                ><el-button class="resetbtn" type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button></el-col
              >
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">用户管理</div>
            <div class="flex justify-between items-center">
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.userList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
            row-key="lessonId"
          >
            <!-- reserve-selection分页刷新数据之后是否保留勾选数据 -->
            <el-table-column type="selection" width="55" :align="'center'" :reserve-selection="true" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="用户账号" prop="username" show-overflow-tooltip :align="'center'" />
            <el-table-column label="用户昵称" prop="nickname" show-overflow-tooltip :align="'center'" />
            <el-table-column label="用户性别" prop="sex" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag v-if="scope.row.sex === selectEnum.businessEnumTypes.sexOptions[0].value" type="warning">{{ getSelectLabelByValue(selectEnum.businessEnumTypes.sexOptions, scope.row.sex) }}</el-tag>
                <el-tag v-else-if="scope.row.sex === selectEnum.businessEnumTypes.sexOptions[1].value" type="success">{{ getSelectLabelByValue(selectEnum.businessEnumTypes.sexOptions, scope.row.sex) }}</el-tag>
                <el-tag v-if="scope.row.sex === selectEnum.businessEnumTypes.sexOptions[2].value" type="info">{{ getSelectLabelByValue(selectEnum.businessEnumTypes.sexOptions, scope.row.sex) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="用户邮箱" prop="email" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.email">{{ scope.row.email }}</span>
                <el-tag type="info" v-else>暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" prop="telPhone" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.telPhone">{{ scope.row.telPhone }}</span>
                <el-tag type="info" v-else>暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="handlePreview(scope.row)"> <i class="iconfont icon-shujuyulan"></i>预览 </el-button>
                <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
                <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
          <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <el-pagination
              v-model:current-page="state.queryParams.pageNum"
              v-model:page-size="state.queryParams.pageSize"
              :pager-count="5"
              :page-sizes="[10, 20, 30]"
              :total="state.total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleQuery"
              @current-change="handleQuery"
            >
            </el-pagination>
            <el-button class="deletebtn" type="danger" :disabled="state.ids.length === 0" @click="handleDelete()"> <i class="iconfont icon-shanchu"></i>批量删除 </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- dialog -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="1000px" destroy-on-close @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="95px" label-position="left">
        <el-row :gutter="15">
          <el-col class="mb-6" :span="12">
            <el-form-item label="用户头像：" prop="avatar">
              <single-upload v-model="state.formData.avatar"></single-upload>
            </el-form-item>
          </el-col>
          <el-col class="mb-6" :span="12">
            <el-form-item label="用户角色：" prop="roleRemarks">
              <el-checkbox-group v-model="state.formData.roleRemarks" placeholder="请选择角色">
                <el-checkbox v-for="item in state.roleOptions" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称：" prop="nickname">
              <el-input v-model="state.formData.nickname" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col class="mb-6" :span="12">
            <el-form-item label="用户账号：" prop="username">
              <el-input :disabled="state.formData.userId" v-model="state.formData.username" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱：" prop="email">
              <el-input :disabled="state.formData.userId" v-model="state.formData.email" placeholder="请输入用户邮箱" />
            </el-form-item>
          </el-col>
          <el-col class="mb-6" :span="12">
            <el-form-item label="电话号码：" prop="telPhone">
              <el-input v-model="state.formData.telPhone" placeholder="请输入电话号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别：" prop="sex">
              <el-select v-model="state.formData.sex" placeholder="请选择性别" clearable>
                <el-option v-for="item in selectEnum.businessEnumTypes.sexOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog :title="state.viewDialog.title" v-model="state.viewDialog.visible" destroy-on-close width="1200px">
      <div class="mb-2 w-full text-center text-2xl font-bold text-gray-600">{{ state.formData.noticeTitle }}</div>
      <div class="mb-2 w-full text-lg font-bold flex justify-between items-center">
        <span><i class="iconfont icon-denglu-yonghuming text-blue-500"></i> 发布人：测试教师1</span>
        <span><i class="iconfont icon-shijian text-blue-500"></i> 发布时间：2024-10-10 10:46:54</span>
      </div>
      <div class="mb-2 text-lg text-gray-600" v-html="state.formData.noticeContent"></div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.viewDialog.visible = false"><i class="iconfont icon-quxiao"></i>关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import Editor from '@/components/WangEditor/index.vue';
import { getNoticeListApi, getNoticeDetailApi, addNoticeApi, UpdateNoticeApi, deleteNoticesApi } from '@/api/notice';
import { NoticeListQuery, NoticeList, NoticeInfo } from '@/api/notice/types';
import { addUser, getUserForm, getUserPagesApi, updateUser } from '@/api/user';
import { UserForm, UserQuery, UserTable } from '@/api/user/types';
import { useSelectEnum } from '@/store/selectEnum';
import { getSelectLabelByValue } from '@/utils/commonMethods';
import SingleUpload from '@/components/Upload/SingleUpload.vue';
import { getAllRole } from '@/api/role';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
const dataTableRef = ref(ElTable);
const selectEnum = useSelectEnum();
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as UserQuery,
  // 表格数据
  userList: [] as UserTable[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  viewDialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as UserForm,
  // 增加/编辑表单校验规则
  rules: {
    username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 角色选择器数据
  roleOptions: [] as SelectOptionType[]
});

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getUserPagesApi(state.queryParams).then(({ data }) => {
    state.userList = data.list;
    state.total = data.total;
    state.loading = false;
  });
}
/**
 * 重置查询
 */
function resetQuery() {
  // 恢复查询表单默认值
  queryFormRef.value.resetFields();
  handleQuery();
  clearSelection();
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: UserTable[]) {
  state.ids = selection.map((item: UserTable) => item.userId) as number[];
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加用户',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: UserTable) {
  state.dialog = {
    title: '修改用户',
    visible: true
  };
  getUserForm(row.userId as number).then(({ data }) => {
    state.formData = data;
  });
}
/**预览点击 */
function handlePreview(row: UserTable) {
  state.viewDialog = {
    title: '预览用户',
    visible: true
  };
  getNoticeDetailApi(row.noticeId as number).then(({ data }) => {
    state.formData = data;
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.userId) {
        updateUser(state.formData).then(() => {
          ElMessage.success('修改成功');
          closeDialog();
          handleQuery();
        });
      } else {
        addUser(state.formData).then(() => {
          ElMessage.success('新增成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}
/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as UserForm;
}
/**
 *  删除/批量删除
 */
function handleDelete(row: UserTable = {} as UserTable) {
  const ids = row.noticeId ? [row.noticeId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteNoticesApi(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
        clearSelection();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
// 清除表格勾选数据
const clearSelection = () => {
  state.ids = [];
  dataTableRef.value.clearSelection();
};

onMounted(() => {
  getAllRole().then(({data}) => {
    state.roleOptions = data;
  })
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
});
</script>
