<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="菜单名称" prop="permissionName">
              <el-input v-model="state.queryParams.permissionName" placeholder="菜单名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否显示" prop="hidden">
              <el-select class="w-full" v-model="state.queryParams.hidden" filterable>
                <el-option :value="true" label="隐藏"></el-option>
                <el-option :value="false" label="显示"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单类型" prop="permissionType">
              <el-select class="w-full" v-model="state.queryParams.permissionType" filterable>
                <el-option v-for="item in selectEnum.businessEnumTypes.menuTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col
                ><el-button type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button></el-col
              >
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col
                ><el-button type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button></el-col
              >
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
          <el-table
            v-loading="state.loading"
            :data="state.menuList"
            highlight-current-row
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @row-click="handleRowClick"
            row-key="permissionId"
            :border="true"
            :stripe="true"
            height="calc(100vh - 160px)"
          >
            <el-table-column label="菜单名称" show-overflow-tooltip>
              <template #default="scope">
                <svg-icon :icon-class="scope.row.permissionType === 4 ? 'button' : scope.row.icon" />
                {{ scope.row.permissionName }}
              </template>
            </el-table-column>
            <el-table-column label="路径" :align="'center'" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.path }}
              </template>
            </el-table-column>
            <el-table-column label="菜单类型" :align="'center'" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.permissionType === 1" type="warning">目录</el-tag>
                <el-tag v-if="scope.row.permissionType === 2" type="success">菜单</el-tag>
                <el-tag v-if="scope.row.permissionType === 3" type="info">外链</el-tag>
                <el-tag v-if="scope.row.permissionType === 4" type="danger">按钮</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="权限标识" :align="'center'" prop="perm" show-overflow-tooltip /> -->

            <el-table-column label="状态" :align="'center'" width="120">
              <template #default="scope">
                <el-tag v-if="scope.row.hidden === false" type="success">显示</el-tag>
                <el-tag v-else type="info">隐藏</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="排序" :align="'center'" width="60" prop="sort" />

            <el-table-column label="操作" :align="'center'" width="220">
              <template #default="scope">
                <el-button type="success" link @click.stop="handleAdd(scope.row)" v-if="scope.row.permissionType == 1 || scope.row.permissionType == 2"> <i class="iconfont icon-xinzeng"></i>新增 </el-button>

                <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
                <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button>
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
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="cancel" width="750px">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
        <el-form-item label="父级菜单" prop="parentPermissionId">
          <el-tree-select v-model="state.formData.parentPermissionId" placeholder="选择上级菜单" :data="state.menuOptions" filterable check-strictly :render-after-expand="false" />
        </el-form-item>

        <el-form-item label="菜单名称" prop="permissionName">
          <el-input v-model="state.formData.permissionName" placeholder="请输入菜单名称" />
        </el-form-item>

        <el-form-item label="菜单类型" prop="permissionType">
          <el-radio-group v-model="state.formData.permissionType" @change="handleMenuTypeChange">
            <el-radio v-for="item in selectEnum.businessEnumTypes.menuTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="state.formData.permissionType == 3" label="外链地址" prop="path">
          <el-input v-model="state.formData.path" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item label="路由路径" prop="path" v-if="state.formData.permissionType === 1 || state.formData.permissionType == 2">
          <el-input v-if="state.formData.permissionType === 1" v-model="state.formData.path" placeholder="/system  (目录以/开头)" />
          <el-input v-else v-model="state.formData.path" placeholder="user" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item v-if="state.formData.permissionType == 2" label="页面路径" prop="component">
          <el-input v-model="state.formData.component" placeholder="system/user/index" style="width: 95%">
            <template v-if="state.formData.parentPermissionId != 0" #prepend>src/views/</template>
            <template v-if="state.formData.parentPermissionId != 0" #append>.vue</template>
          </el-input>
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item v-if="state.formData.permissionType == 4" label="权限标识" prop="perm">
          <el-input v-model="state.formData.perm" placeholder="sys:user:add" />
        </el-form-item>

        <el-form-item label="图标" prop="icon" v-if="state.formData.permissionType !== 4">
          <el-popover ref="popoverRef" placement="bottom-start" :width="570" trigger="click">
            <template #reference>
              <el-input v-model="state.formData.icon" placeholder="点击选择图标" readonly @click="state.iconSelectVisible = true">
                <template #prefix>
                  <svg-icon :icon-class="state.formData.icon" />
                </template>
              </el-input>
            </template>
            <icon-select @selected="selected" />
          </el-popover>
        </el-form-item>

        <el-form-item label="跳转路由" v-if="state.formData.permissionType == 1">
          <el-input v-model="state.formData.redirect" placeholder="跳转路由" />
        </el-form-item>

        <el-form-item label="状态" v-if="state.formData.permissionType !== 4">
          <el-radio-group v-model="state.formData.hidden">
            <el-radio :label="false">显示</el-radio>
            <el-radio :label="true">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="state.formData.sort" style="width: 100px" controls-position="right" :min="0" />
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
import { listMenus, getMenuDetail, listMenuOptions, addMenu, deleteMenus, updateMenu } from '@/api/menu';

import SvgIcon from '@/components/SvgIcon/index.vue';
import IconSelect from '@/components/IconSelect/index.vue';
import { useSelectEnum } from '@/store/selectEnum';

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const popoverRef = ref(ElPopover);
const selectEnum = useSelectEnum();
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
    parentPermissionId: 0,
    permissionName: '',
    hidden: 0,
    sort: 1,
    component: undefined,
    permissionType: 2
  } as MenuForm,
  rules: {
    parentPermissionId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
    permissionName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    permissionType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件完整路径', trigger: 'blur' }]
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

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  listMenus(state.queryParams).then(({ data }) => {
    state.menuList = data;
    state.loading = false;
  });
}

/**
 * 加载菜单下拉树
 */
async function loadMenuData() {
  const menuOptions: any[] = [];
  await listMenuOptions().then(({ data }) => {
    const menuOption = { value: 0, label: '顶级菜单', children: data };
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
}

/**
 * 新增菜单打开
 */
async function handleAdd(row: any) {
  state.dialog = {
    title: '添加菜单',
    visible: true
  };
  state.formData.permissionId = undefined;
  await loadMenuData();
  if (row.permissionId) {
    // 行点击新增
    state.formData.parentPermissionId = row.permissionId;
  } else {
    // 工具栏新增
    if (state.currentRow) {
      // 选择行
      state.formData.parentPermissionId = (state.currentRow as any).permissionId;
    } else {
      // 未选择行
      state.formData.parentPermissionId = 0;
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
  // const menuId = row.permissionId;
  // getMenuDetail(menuId).then(({ data }) => {
  //   state.formData = data.menu;
  //   state.cacheData.menuType = data.menu.type;
  //   state.cacheData.menuPath = data.menu.path;
  // });
  state.formData = Object.assign({}, row);
  state.cacheData.menuType = row.permissionType;
  state.cacheData.menuPath = row.path;
  state.formData.parentPermissionId = state.formData.parentPermissionId || 0;
  if (state.formData.children) delete state.formData.children;
}

/**
 * 菜单类型 change
 */
function handleMenuTypeChange(menuType: any) {
  if (menuType !== state.cacheData.menuType) {
    state.formData.path = '';
  } else {
    state.formData.path = state.cacheData.menuPath;
  }
}

/**
 * 菜单提交
 */
function submitForm() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      if (state.formData.permissionId) {
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
  // const ids = [row.menuId || state.ids].join(',');
  // ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // })
  //   .then(() => {
  //     deleteMenus(ids).then(() => {
  //       ElMessage.success('删除成功');
  //       handleQuery();
  //     });
  //   })
  //   .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 取消关闭弹窗
 */
function cancel() {
  dataFormRef.value.resetFields();
  state.dialog.visible = false;
  // 重置表单数据
  state.formData = {
    parentPermissionId: 0,
    permissionName: '',
    hidden: 0,
    sort: 1,
    component: undefined,
    permissionType: 2
  } as MenuForm;
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
