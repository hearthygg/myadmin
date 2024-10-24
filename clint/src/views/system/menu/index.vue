<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" :model="queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="queryParams.keywords" placeholder="菜单名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否显示" prop="visible">
              <el-select class="w-full" v-model="queryParams.visible" filterable>
                <el-option v-for="item in selectEnum.businessEnumTypes.statusOptions" :key="item.value" :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type">
              <el-select class="w-full" v-model="queryParams.type" filterable>
                <el-option v-for="item in selectEnum.businessEnumTypes.MenuTypeOptions" :key="item.value"
                  :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col><el-button type="primary" @click="handleQuery"><i
                    class="iconfont icon-sousuo"></i>搜索</el-button></el-col>
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col><el-button type="info" @click="resetQuery"><i
                    class="iconfont icon-zhongzhi"></i>重置</el-button></el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">菜单管理</div>
            <div class="flex justify-between items-center">
              <!-- <el-button type="primary"><i class="iconfont icon-icon_help"></i>帮助</el-button> -->
              <el-button type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table v-loading="loading" :data="menuList" highlight-current-row
          :header-cell-style="{ background: '#EBF5FF',color: '#606266' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @row-click="handleRowClick"
            row-key="menuId" :border="true" :stripe="true" height="calc(100vh - 160px)">
            <el-table-column label="菜单名称" align="center" show-overflow-tooltip>
              <template #default="scope">
                <svg-icon :icon-class="
                  scope.row.type === 4 ? 'button' : scope.row.icon
                " />
                {{ scope.row.menuName }}
              </template>
            </el-table-column>
            <el-table-column label="路径" align="center" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.path }}
              </template>
            </el-table-column>
            <el-table-column label="菜单类型" align="center" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.type === 1" type="warning">目录</el-tag>
                <el-tag v-if="scope.row.type === 2" type="success">菜单</el-tag>
                <el-tag v-if="scope.row.type === 3" type="info">外链</el-tag>
                <el-tag v-if="scope.row.type === 4" type="danger">按钮</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="权限标识" align="center" prop="perm" show-overflow-tooltip /> -->

            <el-table-column label="状态" align="center" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.visible === 0" type="success">显示</el-tag>
                <el-tag v-else type="info">隐藏</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="排序" align="center" width="60" prop="orderNum" />

            <el-table-column label="操作" align="center" width="220">
              <template #default="scope">
                <el-button type="success" link @click.stop="handleAdd(scope.row)"
                  v-if="scope.row.type == 1 || scope.row.type == 2">
                  <i class="iconfont icon-xinzeng"></i>新增
                </el-button>

                <el-button type="primary" link @click.stop="handleUpdate(scope.row)">
                  <i class="iconfont icon-bianji"></i>编辑
                </el-button>
                <el-button type="danger" link @click.stop="handleDelete(scope.row)">
                  <i class="iconfont icon-shanchu"></i>删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
          <!-- <div class="mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <el-pagination v-model:current-page="state.queryParams.pageNum" v-model:page-size="state.queryParams.pageSize"
              :pager-count="5" :page-sizes="[10, 20, 30]" :total="state.total"
              layout="total, sizes, prev, pager, next, jumper" background @size-change="handleQuery"
              @current-change="handleQuery">
            </el-pagination>
            <el-button type="danger" :disabled="state.ids.length === 0" @click="handleDelete()">
              <i class="iconfont icon-shanchu"></i>批量删除
            </el-button>
          </div> -->
        </div>
      </el-col>
    </el-row>
    <!-- dialog -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" @close="cancel" width="750px">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select v-model="formData.parentId" placeholder="选择上级菜单" :data="menuOptions" filterable check-strictly
            :render-after-expand="false" />
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleMenuTypeChange">
            <el-radio v-for="item in selectEnum.businessEnumTypes.MenuTypeOptions" :key="item.value" :label="item.value">{{
              item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.type == 3" label="外链地址" prop="path">
          <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item label="路由路径" prop="path" v-if="formData.type === 1 || formData.type == 2">
          <el-input v-if="formData.type === 1" v-model="formData.path" placeholder="/system  (目录以/开头)" />
          <el-input v-else v-model="formData.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item v-if="formData.type == 2" label="页面路径" prop="component">
          <el-input v-model="formData.component" placeholder="system/user/index" style="width: 95%">
            <template v-if="formData.parentId != 0" #prepend>src/views/</template>
            <template v-if="formData.parentId != 0" #append>.vue</template>
          </el-input>
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item v-if="formData.type == 4" label="权限标识" prop="perm">
          <el-input v-model="formData.perm" placeholder="sys:user:add" />
        </el-form-item>

        <el-form-item label="图标" prop="icon" v-if="formData.type !== 4">
          <el-popover ref="popoverRef" placement="bottom-start" :width="570" trigger="click">
            <template #reference>
              <el-input v-model="formData.icon" placeholder="点击选择图标" readonly @click="iconSelectVisible = true">
                <template #prefix>
                  <svg-icon :icon-class="formData.icon" />
                </template>
              </el-input>
            </template>
            <icon-select @selected="selected" />
          </el-popover>
        </el-form-item>

        <el-form-item label="跳转路由" v-if="formData.type == 1">
          <el-input v-model="formData.redirectUrl" placeholder="跳转路由" />
        </el-form-item>

        <el-form-item label="状态" v-if="formData.type !== 4">
          <el-radio-group v-model="formData.visible">
            <el-radio v-for="item in selectEnum.businessEnumTypes.statusOptions" :key="item.value" :label="item.value">{{
              item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="formData.orderNum" style="width: 100px" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="cancel"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs, nextTick } from 'vue';

import { ElForm, ElMessage, ElMessageBox, ElPopover } from 'element-plus';

import { MenuQuery, MenuForm, Menu } from '@/api/menu/types';
// API 依赖
import {
  listMenus,
  getMenuDetail,
  listMenuOptions,
  addMenu,
  deleteMenus,
  updateMenu
} from '@/api/menu';

import SvgIcon from '@/components/SvgIcon/index.vue';
import IconSelect from '@/components/IconSelect/index.vue';
import { useSelectEnum } from '@/store/selectEnum'
const emit = defineEmits(['menuClick']);
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const popoverRef = ref(ElPopover);
const selectEnum = useSelectEnum()
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  queryParams: {} as MenuQuery,
  // 表格数据
  menuList: [] as Menu[],
  dialog: { visible: false } as DialogType,
  formData: {
    parentId: 0,
    menuName: '',
    visible: 0,
    orderNum: 1,
    component: undefined,
    type: 2,
  } as MenuForm,
  rules: {
    parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    component: [
      { required: true, message: '请输入组件完整路径', trigger: 'blur' }
    ]
  },
  // 选择菜单级别的下拉菜单树
  menuOptions: [] as OptionType[],
  // 当前点击的表格行数据
  currentRow: undefined,
  // Icon选择器显示状态
  iconSelectVisible: false,
  cacheData: {
    menuType: 1,
    menuPath: ''
  }
});

const {
  loading,
  queryParams,
  menuList,
  dialog,
  formData,
  rules,
  menuOptions,
  iconSelectVisible,
  cacheData
} = toRefs(state);

/**
 * 查询
 */
function handleQuery() {
  // 重置父组件
  emit('menuClick', null);
  state.loading = true;
  listMenus(state.queryParams).then(({ data }) => {
    state.menuList = data.menus;
    state.loading = false;
  });
}

/**
 * 加载菜单下拉树
 */
async function loadMenuData() {
  const menuOptions: any[] = [];
  await listMenuOptions().then(({ data }) => {
    const menuOption = { value: 0, label: '顶级菜单', children: data.menuOption };
    menuOptions.push(menuOption);
    state.menuOptions = menuOptions;
  });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

function handleRowClick(row: any) {
  state.currentRow = JSON.parse(JSON.stringify(row));
  emit('menuClick', row);
}

/**
 * 新增菜单打开
 */
async function handleAdd(row: any) {
  formData.value.menuId = undefined;
  nextTick(() => {
    dataFormRef.value.resetFields()
  })
  await loadMenuData();
  dialog.value = {
    title: '添加菜单',
    visible: true
  };

  if (row.menuId) {
    // 行点击新增

    formData.value.parentId = row.menuId;
  } else {
    // 工具栏新增

    if (state.currentRow) {
      // 选择行
      formData.value.parentId = (state.currentRow as any).menuId;
    } else {
      // 未选择行
      formData.value.parentId = 0;
    }
  }
}

/**
 * 编辑菜单
 */
async function handleUpdate(row: MenuForm) {
  await loadMenuData();
  state.dialog = {
    title: '编辑菜单',
    visible: true
  };
  const menuId = row.menuId;
  getMenuDetail(menuId).then(({ data }) => {
    state.formData = data.menu;
    cacheData.value.menuType = data.menu.type;
    cacheData.value.menuPath = data.menu.path;
  });
}

/**
 * 菜单类型 change
 */
function handleMenuTypeChange(menuType: any) {
  if (menuType !== cacheData.value.menuType) {
    formData.value.path = '';
  } else {
    formData.value.path = cacheData.value.menuPath;
  }
}

/**
 * 菜单提交
 */
function submitForm() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      if (state.formData.menuId) {
        updateMenu(state.formData).then(() => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addMenu(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 删除菜单
 *
 * @param row
 */
function handleDelete(row: any) {
  const ids = [row.menuId || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteMenus(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 取消关闭弹窗
 */
function cancel() {
  dataFormRef.value.resetFields();
  state.dialog.visible = false;
}

/**
 * 选择图标后事件
 */
function selected(name: string) {
  state.formData.icon = name;
  state.iconSelectVisible = false;
}

onMounted(() => {
  handleQuery();
});
</script>
