<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="摄像头名称" prop="cameraName">
              <el-input v-model="state.queryParams.cameraName" placeholder="摄像头名称" />
            </el-form-item>
            <el-form-item label="摄像头编号" prop="cameraDid">
              <el-input v-model="state.queryParams.cameraDid" placeholder="摄像头编号" />
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
            <div class="table-total">摄像头管理</div>
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
            :data="state.cameraList"
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
            <el-table-column label="监控设备编号" prop="cameraDid" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.cameraDid">{{ scope.row.cameraDid }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="摄像头名称" prop="cameraName" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.cameraName">{{ scope.row.cameraName }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="摄像头缩略图url" prop="cameraFrameUrl" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.cameraFrameUrl">{{ scope.row.cameraFrameUrl }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column label="摄像头地址" prop="cameraUrl" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.cameraUrl">{{ scope.row.cameraUrl }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" :align="'center'">
              <template #default="scope">
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
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="120px" label-position="left">
        <el-form-item label="摄像头名称" prop="cameraName">
          <el-input v-model="state.formData.cameraName" placeholder="摄像头名称" />
        </el-form-item>
        <el-form-item label="监控设备编号" prop="cameraDid">
          <el-input v-model="state.formData.cameraDid" placeholder="监控设备编号" />
        </el-form-item>
        <el-form-item label="摄像头url" prop="cameraUrl">
          <el-input v-model="state.formData.cameraUrl" placeholder="摄像头url" />
        </el-form-item>
        <el-form-item label="摄像头缩略图url" prop="cameraFrameUrl">
          <el-input v-model="state.formData.cameraFrameUrl" placeholder="摄像头缩略图url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
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

import { getCameraListApi, getCameraDetailApi, addCameraApi, UpdateCameraApi, deleteCamerasApi } from '@/api/camera';
import { CameraListQuery, CameraList } from '@/api/camera/types';
import { isValidUrl } from '@/utils/validate';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
const dataTableRef = ref(ElTable);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as CameraListQuery,
  // 表格数据
  cameraList: [] as CameraList[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as CameraList,
  // 增加/编辑表单校验规则
  rules: {
    cameraName: [{ required: true, message: '请输入摄像头的名称', trigger: 'blur' }],
    cameraDid: [{ required: true, message: '请输入监控设备编号', trigger: 'blur' }],
    cameraUrl: [{ required: true, validator: validateUrl, trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
});
// url地址校验
function validateUrl(rule: any, value: any, callback: any) {
  if (!isValidUrl(value)) {
    callback(new Error('请输入正确的url地址'));
  } else {
    callback();
  }
}
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getCameraListApi(state.queryParams).then(({ data }) => {
    state.cameraList = data.records;
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
function handleSelectionChange(selection: CameraList[]) {
  state.ids = selection.map((item: CameraList) => item.cameraUuid);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加摄像头',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: CameraList) {
  state.dialog = {
    title: '修改摄像头',
    visible: true
  };
  getCameraDetailApi(row.cameraUuid as string).then(({ data }) => {
    state.formData = data;
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.cameraUuid) {
        UpdateCameraApi(state.formData).then(() => {
          ElMessage.success('修改成功');
          closeDialog();
          handleQuery();
        });
      } else {
        addCameraApi(state.formData).then(() => {
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
  state.formData = {} as CameraList;
}
/**
 *  删除/批量删除
 */
function handleDelete(row: CameraList = {} as CameraList) {
  const ids = row.cameraUuid ? [row.cameraUuid] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteCamerasApi(ids).then(() => {
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
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
});
</script>
