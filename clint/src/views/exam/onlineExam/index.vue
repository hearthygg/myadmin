<template>
  <div class="list-adapt-container layout-pd">
    <!-- 课程分类选择 -->
    <!-- <el-card v-if="state.isShowCourseType" class="container-card">
      <template #header>
        <div class="header-search">
          <span class="header-title">课程类型选择</span>
        </div>
      </template>
      <div class="examRoomBox p-4">
        <el-row :gutter="15">
          <el-col v-for="(item, index) in state.lessonClassificationOption" :key="item.value" :span="8" class="mb-4 examRoom">
            <el-card class="my-card">
              <template #header>
                <div class="flex justify-between">
                  <span>{{ item.label }}</span>
                  <el-button type="primary" @click="courseSelectHandler(item.value as number)">进入实验室</el-button>
                </div>
              </template>
              <div class="examRoomContent">
                <img :src="state.courseTypeBgList[index]" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card> -->
    <!-- 展示课程列表数据 -->
    <el-card class="container-card">
      <template #header>
        <div class="header-search">
          <div>
            <!-- <el-button type="primary" @click="state.isShowCourseType = true">返回</el-button> -->
            <span class="header-title ml-2">课程列表</span>
          </div>
          <div class="header-item flex justify-between items-center">
            <el-select clearable filterable @change="handleQuery" class="mr-4" v-model="state.queryParams.lessonClassification" placeholder="请选择实验室类型">
              <el-option v-for="item in state.lessonClassificationOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input @change="handleQuery" v-model="state.queryParams.lessonName" placeholder="请输入课程标题">
              <!-- <template #append>
                <el-button @click="handleQuery"><i class="iconfont icon-sousuo"></i></el-button>
              </template> -->
            </el-input>
          </div>
        </div>
      </template>
      <div class="flex-warp pd15" v-if="state.onlineCourseList.length > 0">
        <div class="course-list">
          <!-- 课程列表 -->
          <div @click="showExamList(v)" class="course-list-item" v-for="(v, index) in state.onlineCourseList" :key="v.courseId">
            <div class="course-item-img">
              <div class="img-title">
                <span>{{ v.lessonName }}</span>
              </div>
              <img :src="getBgImg(index)" />
            </div>
            <div class="course-list-title">{{ v.lessonName }}</div>
            <div class="text-right mr-2">
              <el-tag type="warning">{{ v.termName }}</el-tag>
            </div>
            <div class="course-list-num">任课教师：{{ v.teacherName }}</div>
            <div class="text-right mr-2">
              <el-tag :type="isEffectiveTime(v.termStartTime, v.termEndTime) ? '' : 'info'">
                {{ isEffectiveTime(v.termStartTime, v.termEndTime) ? '进行中' : '已结束' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <el-empty class="mx-auto" v-else description="暂无数据"></el-empty>
      <div class="paginationarea bg-[#F9F9F9] rounded-lg p-3.5 flex justify-between items-center">
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
      </div>
    </el-card>
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="60%">
      <div class="course-desc mb-4" style="height: 60px">
        <div class="float-left">
          <span>当前课程是：</span>
          <el-tag type="success">{{ state.dialog.title }}</el-tag>
        </div>
        <div class="float-right">
          <el-input style="display: inline" v-model="searchKeyword" placeholder="可以输入实验名称进行搜索"> </el-input>
          <!-- <span class="search-hidden"><i class="iconfont icon-sousuo"></i></span> -->
          <span class="ml-4">实验总数：</span>
          <el-tag type="warning">{{ state.onlineExamList.length }}</el-tag>
        </div>
      </div>
      <el-scrollbar max-height="565px">
        <el-row :gutter="15" class="w-full">
          <template v-if="filteredOnlineExamList.length > 0">
            <el-col class="mb-4" v-for="(item, index) in filteredOnlineExamList" :key="item.courseExpId">
              <el-card class="item-card">
                <template #header>
                  <div class="flex justify-between">
                    <span>{{ item.expName }}</span>
                    <el-tag type="success">{{ index + 1 }}</el-tag>
                  </div>
                </template>
                <el-descriptions :column="2" :border="true">
                  <el-descriptions-item>
                    <template #label>
                      <span>开始时间</span>
                    </template>
                    <span v-if="item.startTime">{{ formartCurrentTime(item.startTime) }}</span>
                    <el-tag v-else type="info">暂无数据</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <span>结束时间</span>
                    </template>
                    <span v-if="item.endTime">{{ formartCurrentTime(item.endTime) }}</span>
                    <el-tag v-else type="info">暂无数据</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <span>实验类型</span>
                    </template>
                    <el-tag type="warning">{{ getSelectLabelByValue(state.expTypeList, item.type) }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <span>实验时长</span>
                    </template>
                    <span>{{ item.timeLength }}分钟</span>
                  </el-descriptions-item>
                </el-descriptions>
                <div class="text-right mt-2 mr-2">
                  <el-button type="success" @click="loopDocument(item)"><i class="iconfont icon-shiyani"></i>实验文档</el-button>
                  <el-button type="primary" @click="toDetail(item)"><i class="iconfont icon-fabu1"></i>进入实验</el-button>
                  <el-button type="warning" @click="openExamReportDialog(item)"><i class="iconfont icon-shujuyulan"></i>查看报告</el-button>
                </div>
              </el-card>
            </el-col>
          </template>
          <el-empty class="mx-auto" v-else description="暂无数据"></el-empty>
        </el-row>
      </el-scrollbar>
    </el-dialog>
    <div class="fullDialog" id="dialog-nopadding">
      <el-dialog :title="state.viewDocumentDialog.title" v-model="state.viewDocumentDialog.visible" :fullscreen="true">
        <ViewPdf :height="'calc(100vh - 116px)'" :pdf-url="state.documentPath"></ViewPdf>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.viewDocumentDialog.visible = false"><i class="iconfont icon-quxiao"></i>关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="pagesListAdapt">
import ViewPdf from '@/components/ViewPdf/iframePdf.vue';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router';
import { OnlineCourseList, OnlineCourseQuery, OnlineExamList } from '@/api/onlineExam/types';
import { getExpDocument, getOnlineCourseList, getOnlineExpList } from '@/api/onlineExam';
import { isEffectiveTime, formatDate } from '@/utils/formatTime';
import { getSelectLabelByValue } from '@/utils/commonMethods';
import { getAllSelectEnmuTypes } from '@/api/auth';
import { getLessonClassificationOption } from '@/api/course';
import { ExpColumnEnum } from '@/utils/staticData';
// 定义变量内容
const router = useRouter();
const state = reactive({
  dialog: {
    title: '',
    visible: false
  },
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as OnlineCourseQuery,
  // 表格数据
  onlineCourseList: [] as OnlineCourseList[],
  // 实验列表数据
  onlineExamList: [] as OnlineExamList[],
  // 总数
  total: 0,
  // 课程列表背景图片
  courseBgList: [
    new URL(`@/assets/images/blueBg.png`, import.meta.url).href,
    new URL(`@/assets/images/cyanBg.png`, import.meta.url).href,
    new URL(`@/assets/images/greenBg.png`, import.meta.url).href,
    new URL(`@/assets/images/orangeBg.png`, import.meta.url).href,
    new URL(`@/assets/images/redBg.png`, import.meta.url).href
  ],
  // 课程类型背景图片
  courseTypeBgList: [
    new URL(`@/assets/images/course1.png`, import.meta.url).href,
    new URL(`@/assets/images/course2.png`, import.meta.url).href,
    new URL(`@/assets/images/course3.png`, import.meta.url).href,
    new URL(`@/assets/images/course4.png`, import.meta.url).href,
    new URL(`@/assets/images/course5.png`, import.meta.url).href,
    new URL(`@/assets/images/course6.png`, import.meta.url).href,
    new URL(`@/assets/images/course6.png`, import.meta.url).href
  ],
  // 实验类型键值对数据
  expTypeList: [] as SelectOptionType[],
  // 实验文档路径
  documentPath: '',
  viewDocumentDialog: {
    title: '',
    visible: false
  },
  currentCourseId: -1,
  // 是否展示课程分类
  isShowCourseType: true,
  // 课程分类选择器数据
  lessonClassificationOption: [] as SelectOptionType[]
});
// 用户输入的关键词
const searchKeyword = ref('');
// 过滤后的数据
const filteredOnlineExamList = computed(() => {
  return state.onlineExamList.filter(exam => exam.expName.toLowerCase().includes(searchKeyword.value.toLowerCase()));
});

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getOnlineCourseList(state.queryParams).then(({ data }) => {
    state.onlineCourseList = data.experimentList;
    state.total = data.total;
    state.loading = false;
  });
}

// 格式化时间戳
const formartCurrentTime = (date: number, type = 'YYYY-mm-dd HH:MM:SS') => {
  return formatDate(new Date(date), type);
};
// 获取背景图片
function getBgImg(index: number) {
  return state.courseBgList[index % 5];
}

// 获取实验列表
function showExamList(course: OnlineCourseList) {
  state.currentCourseId = course.courseId;
  state.dialog.title = course.lessonName;
  state.dialog.visible = true;
  getOnlineExpList(course.courseId).then(({ data }) => {
    state.onlineExamList = data.experimentInfos;
  });
}

// 查看实验文档
async function loopDocument(onlineExam: OnlineExamList, expInfoTypeId = ExpColumnEnum.document) {
  // 获取到了文档地址才会打开弹窗
  let res = await getExpDocument(expInfoTypeId, onlineExam.expId);
  state.documentPath = res.data.path;
  state.viewDocumentDialog.title = `预览 ${onlineExam.expName} 实验文档`;
  state.viewDocumentDialog.visible = true;
}
// 打开实验报告弹窗
function openExamReportDialog(row: OnlineExamList) {
  // 统一跳转到实验报告管理界面
  router.push({
    path: '/education/examReport'
  });
}
// 进入实验
function toDetail(onlineExam: OnlineExamList) {
  let queryParams;
  if (onlineExam.type === 3) {
    // 分组实验新增timeId参数
    queryParams = {
      courseExpId: onlineExam.courseExpId,
      expId: onlineExam.expId,
      courseExpTimeId: onlineExam.courseExpTimeId
    };
  } else {
    queryParams = {
      courseExpId: onlineExam.courseExpId,
      expId: onlineExam.expId
    };
  }
  router.push({
    path: '/examDetail',
    query: queryParams
  });
}
// 实验类型选择
const courseSelectHandler = (courseType: number) => {
  state.isShowCourseType = false;
  state.queryParams.lessonClassification = courseType;
  handleQuery();
};
// 保存状态
const saveState = () => {
  // 保存状态的时候加入当前时间
  localStorage.setItem(
    'onlineExamState',
    JSON.stringify({
      time: new Date().getTime(),
      state
    })
  );
};

// 恢复状态
const restoreState = () => {
  const savedState = localStorage.getItem('onlineExamState');
  if (savedState) {
    // 记得让数据恢复响应性
    let lastData = JSON.parse(savedState);
    // 设置缓存数据的有效期是10分钟
    if (lastData.time && Math.abs(new Date().getTime() - lastData.time) / (1000 * 60) < 10) {
      let res = lastData.state;
      state.currentCourseId = res.currentCourseId;
      state.dialog = res.dialog;
      state.viewDocumentDialog = res.viewDocumentDialog;
      state.isShowCourseType = res.isShowCourseType;
      state.queryParams = res.queryParams;
      state.onlineExamList = res.onlineExamList;
    } else {
      // 清除过期数据
      localStorage.removeItem('onlineExamState');
    }
  }
};
onMounted(() => {
  // 恢复状态
  restoreState();
  handleQuery();
  // 获取实验类型键值对
  getAllSelectEnmuTypes().then(({ data }) => {
    state.expTypeList = data.courseExpTypeOptions;
  });
  // 获取课程类型选择器数据
  getLessonClassificationOption().then(({ data }) => {
    state.lessonClassificationOption = data;
  });
  // console.log('onlineExam挂载');
});
// 组件卸载时保存状态
onUnmounted(() => {
  // saveState(); // 保存状态
  // console.log('onlineExam卸载');
});

// 在路由离开前保存状态
onBeforeRouteLeave((to, from, next) => {
  saveState(); // 保存状态
  // console.log('onlineExam离开');
  next();
});

// 在路由更新(即 路由携带的参数发生变化但是path不变)前恢复状态
onBeforeRouteUpdate((to, from, next) => {
  // restoreState(); // 恢复状态
  // console.log('onlineExam更新');
  next();
});
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';

.header-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
  }
  :deep(.el-input) {
    width: 470px;
  }
}
.header-item {
  width: 500px;
}

.course-list {
  .course-list-item {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px 0 rgba(95, 101, 105, 0.1);
    }
    cursor: pointer;
    position: relative;
    width: 302px;
    height: 302px;
    float: left;
    margin: 0 20px 20px 0;
    box-shadow: 0 4px 8px 0 rgba(95, 101, 105, 0.05);
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.2s;
    border: 1px solid var(--el-card-border-color);
    .course-item-img {
      height: 169px;
      margin-bottom: 8px;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      position: relative;
      .img-title {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 28px;
        color: #fff;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .course-list-title {
      color: #545c63;
      line-height: 20px;
      font-size: 16px;
      height: 30px;
      // margin-bottom: 8px;
      padding: 0 8px;
    }
    .course-list-num {
      font-size: 14px;
      color: #9199a1;
      line-height: 18px;
      padding: 0 8px;
      margin-bottom: 8px;
    }
  }
}
.flex-warp {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: calc(100vh - 225px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scrollBar;
  margin: 0 -5px;
  padding: 15px;
}
.mx-auto {
  height: calc(100vh - 225px);
}

.examRoomBox {
  height: calc(100vh - 185px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scrollBar;
  .examRoom {
    border-radius: 5px;
    .examRoomContent {
      height: 288px;
      img {
        width: 100%;
        height: 100%;
      }
      // border: 1px solid var(--el-card-border-color);
    }
  }
}
</style>
<style lang="scss">
.container-card {
  border-radius: 10px;
  height: calc(100vh - 105px);
  border: 1px solid #f9f9f9;

  .el-card__header {
    background-color: #f9f9f9;
    font-size: 18px;
    font-weight: bold;
    color: #909399;
    padding: 15px 20px;
  }
  .el-card__body {
    // background: #EFF6FF;
    padding: 0;
  }
}
.item-card {
  border-radius: 10px;
  height: 178px !important;
  .el-card__header {
    background-color: #eff6ff;
    font-size: 16px;
    font-weight: bold;
    color: #6b7280;
    padding: 10px 15px;
  }
  .el-card__body {
    // padding: 10px 15px;
    padding: 0;
  }
  .el-descriptions__label {
    width: 80px;
  }
}
.search-hidden {
  font-size: 16px;
  // position: absolute;
  // right: 0;
  // top: 0;
  width: 46px;
  height: 46px;
  background: linear-gradient(315deg, #6772ff 0, #00f9e5 100%);
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  &:hover {
    width: 200px;
    transition: all 0.5s;
    border-radius: 23px;
    text-align: left;
    text-indent: 1em;
  }
}
</style>
