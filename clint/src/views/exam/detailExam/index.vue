<!-- 具体的在线实验界面 -->
<template>
  <div class="flex h-full examParent">
    <!-- 自由弹窗 -->
    <FreeDialog v-for="item in state.expInfoList" :key="item.columnId" :dialogTitle="item.expInfoColumnName" :width="1300" :height="700" :x="70" :y="50" :dialogId="item.columnId">
      <!-- 实验报告 -->
      <div v-if="item.expInfoWay == 5">
        <editor height="100%" v-model="state.commonReportData.question" :exp-id="state.currentExpId" file-type="exp" />
        <div class="pt-2 pr-2 text-right">
          <el-button @click="submitExamReporte" type="primary"><i class="iconfont icon-queding" />提交报告</el-button>
        </div>
      </div>
      <!-- pdf预览 -->
      <view-pdf height="100%" v-else-if="item.expInfoWay == 4" :currentDocumentTitle="state.currentExpInfo.expName" :pdf-url="item.expInfoPath"></view-pdf>
      <!-- 引用界面 -->
      <iframe v-else-if="item.expInfoWay == 2" :src="item.expInfoPath" class="siderBar-container"></iframe>
      <!-- 自定义内容 -->
      <div v-else-if="item.expInfoWay == 1" v-html="item.expInfoContent" class="siderBar-container"></div>
      <!-- 自动化实验报告 -->
      <div class="p-4 siderBar-container" v-else-if="item.expInfoWay == 6 && state.examReportData.length > 0">
        <examReportDetail @submitExamReporte="submitExamReporte" :exam-report-data="state.examReportData" current-state="edit"></examReportDetail>
      </div>
    </FreeDialog>
    <div class="leftBar">
      <!-- 操作按钮区域 -->
      <el-tooltip v-for="(item, index) in leftBarData" :key="index" :content="item.longText" placement="right" effect="dark">
        <div v-if="controlShowCamera(item.type)" class="leftBarItem" :style="`margin-top: ${index === 0 ? '0' : '10'}px;`" @click="leftBarClick(item.type)">
          <svg class="myIcon" aria-hidden="true" :style="`font-size: ${item.iconSize};`">
            <use :xlink:href="item.icon"></use>
          </svg>
          <span class="text-gray-600">{{ item.text }}</span>
        </div>
      </el-tooltip>
      <div class="bottomLine"></div>
      <!-- 实验资料区域 -->
      <!-- 底部窗口弹窗控制 -->
      <FreeBottomBar v-if="state.expInfoList.length > 0" :listData="state.expInfoList" />
    </div>
    <div class="exam-container">
      <!-- 倒计时 -->
      <div v-draggable v-if="state.device.deviceId !== '' && state.isShowTime" class="text-2xl text-red-500 showTimer">{{ formatSeconds(state.remainTime) }}</div>
      <!-- 具体实验界面 -->
      <div class="exam-main">
        <div v-if="state.device.deviceId === ''" class="mb-2 course-desc" style="width: 100%; border-radius: 0; background-color: #545c64">
          <span class="pl-6 text-xl">当前课程：<i class="iconfont icon-shiyani"></i> {{ state.currentExpInfo.lessonName }}</span>
          <span class="flex items-center pr-6 text-xl"
            >当前实验：<el-tag type="success">{{ state.currentExpInfo.expName }}</el-tag></span
          >
        </div>
        <!-- 1.先勾选设备 -->
        <div v-if="state.device.deviceId === ''" class="flex select-device">
          <div class="device-left">
            <div class="my-2 titleStyle rounded-lg p-3.5 text-xl text-gray-700">请选择设备</div>
            <el-table height="calc(100vh - 125px)" class="tablearea" ref="dataTableRef" :data="state.tableData" :header-cell-style="{ background: '#EBF5FF', color: '#606266' }" :stripe="true" :border="true" highlight-current-row>
              <el-table-column type="index" label="序号" width="55" :align="'center'" />
              <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip :align="'center'" />
              <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip :align="'center'" />
              <el-table-column label="连接状态" prop="deviceLinkState" show-overflow-tooltip :align="'center'" />
              <el-table-column label="锁定状态" prop="deviceLockState" show-overflow-tooltip :align="'center'" />
              <el-table-column label="使用人" show-overflow-tooltip :align="'center'">
                <template #default="scope">
                  <el-tag type="info" v-if="scope.row.userInfo == null">暂未使用</el-tag>
                  <span v-else>{{ scope.row.userInfo }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="设备在线状态"
                prop="onLineState"
                :filters="[
                  { text: '在线', value: 1 },
                  { text: '不在线', value: 2 }
                ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
                :align="'center'"
              >
                <template #default="scope">
                  <el-tag type="success" v-if="scope.row.onLineState === 1">在线</el-tag>
                  <el-tag type="info" v-else>不在线</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="isStudent() ? 180 : 250" :align="'center'">
                <template #default="scope">
                  <el-button type="primary" link @click="handleSelect(scope.row)"> <i class="iconfont icon-queding"></i>进入实验 </el-button>
                  <el-button v-if="!isStudent()" @click="handleLeaveDevice(scope.row)" type="danger" link> <i class="iconfont icon-quxiao"></i>踢人 </el-button>
                  <el-button v-if="!isStudent()" type="warning" link> <i class="iconfont icon-icon-refresh"></i>加载 </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty description="暂无数据" />
              </template>
            </el-table>
          </div>
        </div>
        <!-- 2.具体实验界面 -->
        <iframe id="myIframe" v-if="state.device.deviceId !== ''" class="examDetail" :src="state.examUrl"></iframe>
      </div>
      <!-- 底部实验回放 -->
      <!-- <expReplay></expReplay> -->
      <div v-draggable class="camera-box" v-show="state.isShowCamera">
        <div class="camera-header">
          摄像头数据展示
          <div @click="state.isShowCamera = false" class="cursor-pointer modalClosebtn">×</div>
        </div>
        <iframe id="camerIframe" :src="state.cameraData.cameraUrl" class="camera-container"></iframe>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ViewPdf from '@/components/ViewPdf/iframePdf.vue';
import examReportDetail from '@/components/ExamReport/examReportDetail.vue';
import FreeDialog from '@/components/FreeDialog/index.vue';
import FreeBottomBar from '@/components/FreeDialog/FreeBottomBar.vue';
import { useFullscreen } from '@vueuse/core';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { formatSeconds } from '@/utils/formatTime';
import { isStudent } from '@/utils/commonMethods';
import { getCourseExpBaseInfoByIds } from '@/api/exam';
import { ExamBaseInfo, ExamColumnTable, ExamDetail, ExamDetailForm, SiderExamColumn } from '@/api/exam/types';
import { defaultSidebarData, ExpColumnEnum } from '@/utils/staticData';
import { bindExamDevice, getOnlineDeviceList, withoutDevice, getCameraApi, bindRandomExamDeviceApi } from '@/api/deviceManager';
import { DeviceList, CameraData } from '@/api/deviceManager/types';
import { ExamReport, SubmitAnswer } from '@/api/examReport/types';
import { submitExamReportApi, getStudentAnswerApi, updateReportApi } from '@/api/examReport';
import { sidebarData } from '@/utils/staticData';
import eventBus from '@/utils/eventBus';
import Editor from '@/components/WangEditor/index.vue';
const userStore = useUserStore();
const { toggle } = useFullscreen();
const route = useRoute();
const router = useRouter();
const menuRef = ref();
const state = reactive({
  sideBarIsShow: false,
  navBarIsShow: true,
  // 当前视图 pdf exam
  currentView: 0,
  // 当前设备信息
  device: {
    deviceId: '',
    deviceName: ''
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  // 表格数据
  tableData: [] as DeviceList[],
  // 总数
  total: 0,
  examUrl: 'http://10.10.10.245:8001/md/#/ex01',
  menuList: [] as ExamColumnTable[],
  // 实验栏目详情列表数据
  expInfoList: [] as SiderExamColumn[],
  // 倒计时计时器
  timer: null as any,
  // 倒计时秒数
  remainTime: 45 * 60,
  // 当前实验id
  currentExpId: 0,
  // 当前开设实验id
  currentCourseExpId: 0,
  // 当前实验详细信息
  currentExpInfo: {} as ExamDetail,
  // 侧边栏栏目信息
  columnItemInfo: {} as ExamDetailForm,
  // 在线实验信息
  onlineExpInfo: {} as ExamDetailForm,
  // 自动化实验报告信息
  examReportData: [] as ExamReport[],
  // 普通实验报告
  commonReportData: {
    // 题目
    question: '',
    // 答案和评分标准
    answer: ''
  },
  // 实验报告id
  reportId: -1,
  // 是否显示倒计时
  isShowTime: true,
  // 是否显示菜单
  isShowMenu: false,
  // 实验时长
  expTimeLength: 0,
  // 摄像头数据
  cameraData: {} as CameraData,
  isShowCamera: false,
  cameraId: -1,
});
// 侧边栏数据显示
const leftBarData = ref([
  { iconSize: '40px', type: 'return', icon: '#icon-icon-svg-04', text: '返回', longText: '返回实验列表' },
  // { iconSize: '40px', type: 'menu', icon: '#icon-gengduo', text: '菜单', longText: '菜单显示/隐藏' },
  { iconSize: '40px', type: 'time', icon: '#icon-naozhong', text: '倒计时', longText: '倒计时显示/隐藏' },
  { iconSize: '32px', type: 'screenFull', icon: '#icon-24full_screen_01', text: '全屏', longText: '全屏/取消全屏' },
  { iconSize: '32px', type: 'camera', icon: '#icon-shexiangtou', text: '摄像头', longText: '显示摄像头数据' }
]);
// 侧边栏控制方法
const leftBarClick = (type: string) => {
  switch (type) {
    case 'return':
      router.push('/exam/onlineExam');
      break;
    case 'menu':
      state.isShowMenu = !state.isShowMenu;
      menuRef.value.toggleDrawer();
      break;
    case 'time':
      state.isShowTime = !state.isShowTime;
      break;
    case 'screenFull':
      toggle();
      break;
    case 'camera':
      handleCamera();
      break;
  }
};

/**
 * 获取实验报告数据
 */
function reportDataHandler(expInfo: ExamDetailForm) {
  if (expInfo.expInfoWay === 6) {
    // 获取自动化实验报告的内容
    state.examReportData = JSON.parse(expInfo.expInfoContent);
    setTimeout(() => {
      eventBus.emit('changeCorrectStatus', false);
    });
    // 判断学生是否已经提交了实验报告
    getStudentAnswerApi(state.currentCourseExpId, userStore.userId as number, expInfo.expInfoWay).then(({ data }) => {
      if (data) {
        state.reportId = data.reportId;
        // 获取学生提交的答案结果
        let tempRes = [] as SubmitAnswer[];
        tempRes = JSON.parse(data.content);
        tempRes.map((v1, i1) => {
          v1.answerGroups.map((v2, i2) => {
            state.examReportData[i1].answerOptions[i2].submitResult = v2;
          });
        });
      } else {
        state.reportId = -1;
      }
    });
  } else if (expInfo.expInfoWay === 5) {
    // 获取普通实验报告数据
    getStudentAnswerApi(state.currentCourseExpId, userStore.userId as number, expInfo.expInfoWay).then(({ data }) => {
      try {
        let reportRes;
        if (data) {
          state.reportId = data.reportId;
          reportRes = JSON.parse(data.content);
        } else {
          state.reportId = -1;
          reportRes = JSON.parse(expInfo.expInfoContent);
        }
        if (typeof reportRes === 'object' && reportRes !== null) {
          if (!(Object.keys(reportRes).length === 0 && reportRes.constructor === Object)) {
            state.commonReportData = reportRes;
          }
        } else {
          // console.log('不是对象');
        }
        // console.log('reportRes:', reportRes);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    });
  }
}
/**
 * 查询
 */
function handleQuery() {
  getOnlineDeviceList(state.onlineExpInfo.expInfoKeyFlag).then(({ data }) => {
    state.tableData = data.devices;
    state.total = state.tableData.length;
  });
}
/**设备在线与不在线筛选 */
const filterTag = (value: number, row: DeviceList) => {
  return row.onLineState === value;
};
/**选择设备 */
function handleSelect(row: DeviceList) {
  const apiParams = {
    deviceKey: state.onlineExpInfo.expInfoKeyFlag,
    hardWareNum: row.hardWareNum,
    defaultDownloadFilePath: state.onlineExpInfo.expInfoFilePath,
    expId: state.onlineExpInfo.expId,
    courseExpId: state.currentCourseExpId,
    courseExpTimeOut: state.expTimeLength
  };
  bindExamDevice(apiParams).then(({data}) => {
    state.device.deviceId = row.deviceId as unknown as string;
    state.device.deviceName = row.deviceName;
    // 当前实验全屏
    // toggle();
    timeReduce();
    console.log('绑定设备返回数据：', data);
    // 记录当前摄像头id
    if(data.cameraId) {
      state.cameraId = data.cameraId;
    }
  });
}
/**踢人下线 */
function handleLeaveDevice(row: DeviceList) {
  if (row.userAccount) {
    withoutDevice(state.onlineExpInfo.expInfoKeyFlag, row.hardWareNum, row.userAccount).then(res => {
      ElMessage.success('踢人下线成功！');
      handleQuery();
    });
  } else {
    ElMessage.error('当前设备暂未被使用！');
  }
}
// 实现倒计时效果
function timeReduce() {
  state.timer = setInterval(function () {
    // 10分钟进行倒计时提醒
    if (10 * 60 == state.remainTime) {
      ElMessage.warning(`距离实验结束还有10分钟！`);
    }
    // 时间结束自动提交结果
    if (state.remainTime == 0) {
      clearInterval(state.timer);
    } else {
      // 倒计时
      --state.remainTime;
    }
  }, 1000);
}

// 提交实验报告
const submitExamReporte = (params: ExamReport[]) => {
  const reportType = params ? 6 : 5;
  let submitContent = '';
  if (reportType === 6) {
    let tempRes = [] as SubmitAnswer[];
    params.forEach((item, index) => {
      tempRes.push({
        answerGroups: item.answerOptions.map(item => item.submitResult),
        questionIndex: index
      });
    });
    // 自动化实验报告
    submitContent = JSON.stringify(tempRes);
  } else if (reportType === 5) {
    // 普通实验报告
    submitContent = JSON.stringify(state.commonReportData);
  }
  // 区分新增还是编辑实验报告
  if (state.reportId === -1) {
    // 新增
    submitExamReportApi({
      reportType: reportType,
      courseExpId: state.currentCourseExpId,
      content: submitContent
    }).then(() => {
      ElMessage.success('提交实验报告成功！');
    });
  } else {
    // 编辑
    updateReportApi({
      reportId: state.reportId,
      reportType: reportType,
      courseExpId: state.currentCourseExpId,
      content: submitContent
    }).then(() => {
      ElMessage.success('编辑实验报告成功！');
    });
  }
};

// 设置子页面参数
const setChildParams = () => {
  // window挂载信息便于子集调用
  window.userAuthorization = userStore.token;
  window.token = userStore.userId + '';
  window.infouuid = route.query.courseExpId + '';

  // 交流中心相关挂载信息
  window.courseexpid = route.query.courseExpId + '';
  window.user_uuid = userStore.userId + '';
  window.user_name = userStore.nickname + '';
  window.user_group = userStore.ugroup + '';

  // 二次开发相挂载信息
  window.port = window.location.port;
  window.host = window.location.host;
  window.sessionid = userStore.token;
};

// 展现摄像头数据
const handleCamera = () => {
  try {
    if (state.device.deviceId && state.device.deviceId !== '123') {
      state.isShowCamera = !state.isShowCamera;
      if (state.isShowCamera) {
        getCameraApi(state.device.deviceId).then(({ data }) => {
          nextTick(() => {
            var iframe = document.getElementById('camerIframe') as any;
            // 重载 iframe 内容窗口的当前页面
            iframe.contentDocument.location.reload();
            state.cameraData = data;
          });
        });
      }
    } else {
      ElMessage.warning('暂未绑定设备无法获取摄像头数据！');
    }
  } catch (error) {
    state.isShowCamera = false;
    ElMessage.error('当前实验暂不支持摄像头功能！');
  }
};
// 控制摄像头按钮的显示
function controlShowCamera(type: string) {
  if(type === 'camera') {
    return state.device.deviceId && state.device.deviceId !== '123' && state.cameraId !== -1;
  } else {
    return true;
  }
}
// 实验栏目数据处理
const handleColumnData = (data: ExamBaseInfo) => {
  state.expInfoList = [] as SiderExamColumn[];
  data.ExpInfoList.map(item => {
    if (item.columnId === ExpColumnEnum.onlineExam) {
      // 获取在线实验数据
      state.onlineExpInfo = item;
      if (state.onlineExpInfo.expInfoKeyFlag === 'not_use_box') {
        // 不需要使用设备 仿真实验
        if (state.onlineExpInfo.expInfoPath) {
          state.examUrl = state.onlineExpInfo.expInfoPath;
          state.device.deviceId = '123';
          state.device.deviceName = '仿真实验不使用实验设备';
          // 当前实验全屏
          // toggle();
          timeReduce();
        }
      } else if (state.onlineExpInfo.expInfoSelectDevice === 0) {
        // 自动分配实验设备
        bindRandomExamDeviceApi({
          expId: state.onlineExpInfo.expId,
          courseExpId: state.currentCourseExpId,
          courseExpTimeOut: state.expTimeLength
        }).then(() => {
          state.device.deviceId = '134';
          state.device.deviceName = '动态分配实验设备';
        })
      } else {
        // 自选实验设备获取设备列表
        state.examUrl = state.onlineExpInfo.expInfoPath;
        handleQuery();
      }
    } else {
      // 侧边栏数据处理
      let sideItem = sidebarData.find(v => v.expInfoColumnId === item.columnId);
      if (!sideItem) sideItem = defaultSidebarData;
      state.expInfoList.push({
        ...item,
        icon: sideItem.icon,
        iconSize: sideItem.iconSize
      });
    }
    // 实验报告数据处理
    if (item.expInfoWay === 6 || item.expInfoWay === 5) {
      reportDataHandler(item);
    }
  });
};
onMounted(() => {
  // 获取路由参数
  state.currentCourseExpId = parseInt(route.query.courseExpId as string);
  state.currentExpId = parseInt(route.query.expId as string);
  getCourseExpBaseInfoByIds(state.currentCourseExpId, state.currentExpId,parseInt(route.query.courseExpTimeId as string)).then(({ data }) => {
    handleColumnData(data);
    state.currentExpInfo = data.expInfo;
    // 倒计时数据处理
    if (state.currentExpInfo.expTimeLength) {
      state.expTimeLength = data.courseExpInfo.timeLength;
      state.remainTime = data.courseExpInfo.timeLength * 60;
    }
  });
  // 设置window全局参数
  setChildParams();
});
onUnmounted(() => {
  clearInterval(state.timer);
});
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.returnBtn {
  position: fixed;
  top: 5px;
  z-index: 99999;
  right: 5px;
  cursor: pointer;
}
.camera-box {
  position: fixed;
  width: 500px;
  height: 400px;
  top: 200px;
  right: 200px;
  z-index: 2024;
  .camera-header {
    border-radius: 10px 10px 0 0;
    letter-spacing: 5px;
    height: 50px;
    width: 100%;
    text-align: center;
    line-height: 50px;
    background: #6b7280;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    position: relative;
    .modalClosebtn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #fff;
      padding-left: 4px;
      line-height: 27px;
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      &:hover {
        border: 2px solid #60a5fa;
        color: #60a5fa;
      }
    }
  }
  .camera-container {
    width: 100%;
    height: 350px;
    border-radius: 0 0 10px 10px;
    background-color: #fff;
  }
}
.el-dropdown {
  font-size: 18px;
}
.siderBar-container {
  // padding: 10px;
  width: 100%;
  // height: calc(100vh - 50px);
  height: 100%;
  overflow-y: auto;
  @include scrollBar;
}
.commonReport {
  height: 49px;
  text-align: right;
}
.bottomLine {
  width: 40px;
  margin: 20px auto;
  border: 1px solid #d2d2d2;
}
.select-device {
  width: 75%;
  margin: 0 auto;
  .device-left {
    // width: calc(100% - 300px);
    width: 100%;
  }
  .device-right {
    width: 300px;
    background-color: #fafcfe;
    border-radius: 10px;
    margin: 5px;
    box-shadow: 0 0 1px 1px #ebf5ff;
    .company-desc {
      text-indent: 1em;
      padding: 5px;
      color: #636e7b;
      font-size: 15px;
    }
  }
}
.menu-group {
  .menu-group-item {
    font-size: 16px;
    width: 120px;
    height: 35px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      border-radius: 5px;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: skew(20deg);
      background-color: var(--background-color);
      border: 1px solid #e5e7eb;
      box-shadow: 0 0 1px 1px #d9ecff;
    }
  }
}

.titleStyle {
  background: #61a0e8;
  color: white;
}

.active {
  color: #fff;
}
.active::before {
  --background-color: #409eff;
}
.showTimer {
  position: fixed;
  height: 32px;
  width: 50px;
  bottom: 85px;
  z-index: 800;
  left: 6px;
  cursor: pointer;
}
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
  background: #545c64;
  color: white;
}
.examDetail {
  border-radius: 5px;
  width: 100%;
  height: 100vh;
}
.tip-position {
  margin: 0 auto;
  width: 800px;
  height: 800px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .tip-res {
    position: absolute;
    top: 225px;
    left: 325px;
  }
}

.show {
  top: 0;
}
.exam-container {
  width: calc(100vw - 60px);
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #f5f7fa;
  .open-btn {
    position: absolute;
    z-index: 999;
    top: 70px;
    right: 20px;
    width: 100px;
    height: 35px;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px #d1d5db;
    overflow: hidden;
    color: #fff;
    cursor: pointer;
    background-color: #93c5fd;
    font-size: 18px;
    text-align: center;
    // transition: all 0.5s;
    &:hover {
      background-color: #60a5fa;
      box-shadow: 0 0 1px 1px #93c5fd;
    }
  }
}
.leftBar {
  background-color: #f7f7f7;
  width: 60px;
  height: 100%;
  border-left: 1px solid var(--el-border-color-light, #ebeef5);
  .myIcon {
    font-size: 40px;
  }
  .leftBarItem {
    width: 59px;
    height: 59px;
    margin: 10px auto;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #edf2fa;
      border: 1px solid #93c5fd;
    }
  }
}
.examParent {
  background-color: #f7f7f7;
  overflow: hidden;
}
</style>
<style lang="scss">
.exam-main {
  .el-descriptions__label {
    width: 80px;
  }
}
</style>
