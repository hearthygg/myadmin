<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="设备类型" prop="hardWareType">
              <el-select filterable class="w-full" v-model="state.queryParams.hardWareType" placeholder="请选择设备类型">
                <el-option v-for="item in state.hardWareTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="state.queryParams.deviceName" placeholder="设备名称" />
            </el-form-item>
            <el-form-item label="设备的ip地址" prop="deviceIp">
              <el-input v-model="state.queryParams.deviceIp" placeholder="设备的ip地址" />
            </el-form-item>
            <el-form-item v-if="state.queryParams.hardWareType" label="子设备类型" prop="deviceType">
              <el-select filterable class="w-full" v-model="state.queryParams.deviceType" placeholder="请选择子设备类型">
                <el-option v-for="item in deviceType" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="state.queryParams.hardWareType" label="设备状态" prop="deviceState">
              <el-select filterable class="w-full" v-model="state.queryParams.deviceState" placeholder="请选择子设备状态">
                <el-option v-for="item in deviceState" :key="item.value" :value="item.value" :label="item.label"></el-option>
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
            <div class="table-total">设备列表</div>
            <div class="flex justify-between items-center">
              <el-button class="importbtn" type="warning" @click="openBatchImport"><i class="iconfont icon-daoru"></i>批量导入</el-button>
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.deviceList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="设备编号" prop="deviceNum" show-overflow-tooltip :align="'center'" />
            <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="硬件编号" prop="hardWareNum" show-overflow-tooltip :align="'center'" />
            <el-table-column label="设备类型" prop="hardWareType" show-overflow-tooltip :align="'center'" />
            <el-table-column label="子设备类型" prop="deviceType" show-overflow-tooltip :align="'center'" />
            <el-table-column label="设备状态" prop="deviceState" show-overflow-tooltip :align="'center'" />
            <el-table-column label="绑定摄像头" width="180" :align="'center'">
              <template #default="scope">
                <div @click="changeSetCamera(scope.row)">
                  <el-select
                    @change="bindCameraHandler(scope.row)"
                    clearable
                    v-if="state.setCamera.isSet && state.setCamera.deviceId === scope.row.deviceId"
                    filterable
                    class="w-full"
                    v-model="state.setCamera.cameraId"
                    placeholder="请选择需要绑定的摄像头"
                  >
                    <el-option v-for="item in state.cameraSelectList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                  <span v-else-if="scope.row.cameraId">{{ scope.row.cameraName }}</span>
                  <el-tag type="info" v-else>暂未绑定</el-tag>
                </div>
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
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="110px" label-position="left">
        <el-form-item label="硬件设备类型" prop="hardWareType">
          <el-select filterable class="w-full" v-model="state.formData.hardWareType" placeholder="请选择设备类型">
            <el-option v-for="item in state.hardWareTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="state.formData.deviceName" placeholder="设备名称" />
        </el-form-item>
        <el-form-item label="硬件编号" prop="hardWareNum">
          <el-input v-model="state.formData.hardWareNum" placeholder="硬件编号" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceNum">
          <el-input v-model="state.formData.deviceNum" placeholder="设备编号" />
        </el-form-item>
        <el-form-item label="设备ip地址" prop="deviceIp">
          <el-input v-model="state.formData.deviceIp" placeholder="设备的ip地址" />
        </el-form-item>
        <el-form-item label="设备端口号" prop="devicePort">
          <el-input v-model="state.formData.devicePort" placeholder="设备端口号" />
        </el-form-item>
        <el-form-item label="支持的实验" prop="fullFunction">
          <el-input v-model="state.formData.fullFunction" placeholder="支持的实验" />
        </el-form-item>
        <el-form-item v-if="state.formData.hardWareType" label="子设备类型" prop="deviceType">
          <el-select filterable class="w-full" v-model="state.formData.deviceType" placeholder="请选择子设备类型">
            <el-option v-for="item in deviceType1" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="state.formData.hardWareType" label="子设备状态" prop="deviceState">
          <el-select filterable class="w-full" v-model="state.formData.deviceState" placeholder="请选择子设备状态">
            <el-option v-for="item in deviceState1" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件后缀名" prop="fileSuffix">
          <el-input v-model="state.formData.fileSuffix" placeholder="文件后缀名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
    <BatchImport type="device" @queryTableData="handleQuery" ref="importExcelRef" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { DeviceDetail, DeviceList, DeviceListQuery } from '@/api/deviceManager/types';
import { UpdateDevice, addDevice, deleteDevices, getDeviceDetail, getDeviceList } from '@/api/deviceManager';
import { useSelectEnum } from '@/store/selectEnum';
import { isValidIPAddress } from '@/utils/validate';
import { bindCameraApi, liftCameraApi, getCameraSelectorApi } from '@/api/camera';
import BatchImport from '@/components/BatchImport/index.vue';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 选择器枚举类型
const selectEnum = useSelectEnum().examEnumTypes;
const importExcelRef = ref(BatchImport);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as DeviceListQuery,
  // 表格数据
  deviceList: [] as DeviceList[],
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
  formData: {} as DeviceDetail,
  // 增加/编辑表单校验规则
  rules: {
    hardWareType: [{ required: true, message: '请选择硬件设备类型', trigger: 'change' }],
    deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
    hardWareNum: [{ required: true, message: '请输入硬件编号', trigger: 'blur' }],
    deviceNum: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
    deviceIp: [{ required: true, validator: validateIp, trigger: 'blur' }],
    deviceType: [{ required: true, message: '请选择子设备类型', trigger: 'change' }],
    deviceState: [{ required: true, message: '请选择子设备状态', trigger: 'change' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 硬件设备选择类型
  hardWareTypeOptions: useSelectEnum().businessEnumTypes.hardWareTypeOptions,
  // 绑定摄像头识别
  setCamera: {
    deviceId: null as number | null,
    isSet: false,
    cameraId: null as number | null
  },
  // 摄像头设备选择器数据
  cameraSelectList: [] as SelectOptionType[]
});

// 设备ip地址校验
function validateIp(rule: any, value: any, callback: any) {
  if (!isValidIPAddress(value)) {
    callback(new Error('请输入正确的ip地址'));
  } else {
    callback();
  }
}
// 子设备类型选择器数据
const deviceType = computed(() => {
  return selectEnum[`Device${state.queryParams.hardWareType.charAt(0).toUpperCase() + state.queryParams.hardWareType.slice(1)}Options`];
});
// 子设备状态选择器数据
const deviceState = computed(() => {
  return selectEnum[`Device${state.queryParams.hardWareType.charAt(0).toUpperCase() + state.queryParams.hardWareType.slice(1)}StateOptions`];
});
// 子设备类型选择器数据
const deviceType1 = computed(() => {
  return selectEnum[`Device${state.formData.hardWareType.charAt(0).toUpperCase() + state.formData.hardWareType.slice(1)}Options`];
});
// 子设备状态选择器数据
const deviceState1 = computed(() => {
  return selectEnum[`Device${state.formData.hardWareType.charAt(0).toUpperCase() + state.formData.hardWareType.slice(1)}StateOptions`];
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getDeviceList(state.queryParams).then(({ data }) => {
    state.deviceList = data.deviceList;
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
  state.setCamera = {
    deviceId: null as number | null,
    isSet: false,
    cameraId: null as number | null
  };
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: DeviceList[]) {
  state.ids = selection.map((item: DeviceList) => item.deviceId as number);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加设备',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: DeviceList) {
  state.dialog = {
    title: '编辑设备',
    visible: true
  };
  /**获取设备详情 */
  getDeviceDetail(row.deviceId as number).then(({ data }) => {
    state.formData = data.device;
  });
}
function changeSetCamera(row: DeviceList) {
  state.setCamera = {
    deviceId: row.deviceId as number,
    isSet: true,
    cameraId: row.cameraId as number
  };
}
// 绑定摄像头
function bindCameraHandler(row: DeviceList) {
  if (state.setCamera.cameraId) {
    // 绑定摄像头
    bindCameraApi(state.setCamera.deviceId as number, state.setCamera.cameraId).then(() => {
      ElMessage.success('绑定摄像头成功！');
      handleQuery();
      state.setCamera = {
        deviceId: null as number | null,
        isSet: false,
        cameraId: null as number | null
      };
    });
  } else {
    // 解除绑定摄像头
    liftCameraApi(state.setCamera.deviceId as number, row.cameraId as number).then(() => {
      ElMessage.success('解除绑定摄像头成功！');
      handleQuery();
      state.setCamera = {
        deviceId: null as number | null,
        isSet: false,
        cameraId: null as number | null
      };
    });
  }
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      state.loading = true;
      if (state.formData.deviceId) {
        UpdateDevice(state.formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            handleQuery();
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });
      } else {
        addDevice(state.formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            handleQuery();
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
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
  state.formData = {} as DeviceDetail;
}

/**
 *  删除/批量删除
 */
function handleDelete(row: DeviceList = {} as DeviceList) {
  const ids = row.deviceId ? [row.deviceId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteDevices(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
const openBatchImport = () => {
  importExcelRef.value.openDialog();
};
onMounted(() => {
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
  // 获取摄像头选择器数据
  getCameraSelectorApi().then(({ data }) => {
    state.cameraSelectList = data;
  });
});
</script>
