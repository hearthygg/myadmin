<!-- 消息通知页面 -->
<script setup lang="ts">
import { ref ,computed} from 'vue';
import { noticesData } from './data';
import NoticeList from './noticeList.vue';
import { useUserStore } from '@/store/modules/user';
const noticesNum = ref(0);
const notices = ref(noticesData);
const activeKey = ref(noticesData[0].key);

const userStore = useUserStore();
// 定义父组件传过来的值
const props = defineProps({
  dataViewTheme: {
    type: Boolean,
    default: false
  },
});

notices.value.map(v => (noticesNum.value += v.list.length));
const broadcastMessage = computed(() => {
  return "新管理系统即将上线！本系统特色支持开课、选课，支持设备监控，支持在线实验及实验报告提交，教师阅卷自动批改等功能"
});

// 日期信息
const date: Date = new Date();

// eslint-disable-next-line vue/return-in-computed-property
const greetings = computed(() => {
  if (date.getHours() >= 6 && date.getHours() < 8) {
    return '晨起披衣出草堂，轩窗已自喜微凉🌅！';
  } else if (date.getHours() >= 8 && date.getHours() < 12) {
    return '上午好🌞！';
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return '下午好☕！';
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    return '晚上好🌃！';
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！';
  }
});
</script>

<template>
  <el-row class="noticeDetail home-card" :class="dataViewTheme?'blacktheme':''">
    <img class="bgImg" src="../../../assets/images/dash-right-top.png" alt="" srcset="">
    <el-col class="absolute notice-title"> 消息通知 </el-col>
    <div class="absolute welcomeText">{{ greetings }}</div>
    <el-descriptions title="" class="absolute useInfo">
        <el-descriptions-item label="用户名">{{ userStore.nickname }}</el-descriptions-item>
        <el-descriptions-item label="所属">{{ userStore.roles.includes('teacher')?'教师':'学生'  }}</el-descriptions-item>
    </el-descriptions>
    <el-divider class="notice-divider1"></el-divider>

    <el-row class="notice-roll">
      <el-col :span="1" class="mt-2 ml-4 mr-4"><el-tag type="danger">公告</el-tag></el-col>
      <el-col class="rounded-lg rollNotice" :span="13">
        <div class="marquee bg-[#e5e7eb] text-[#409eff] mt-1">
          <span class="m-2 text-base">{{ broadcastMessage }}</span>
        </div>
      </el-col>
    </el-row>

    <el-divider class="!mt-1 !mb-0 absolute notice-divider2"></el-divider>
    <el-tabs :stretch="true" v-model="activeKey" class="absolute dropdown-tabs">
      <template v-for="item in notices" :key="item.key">
        <el-tab-pane :label="`${item.name}(${item.list.length})`" :name="`${item.key}`">
          <el-scrollbar>
            <div class="noticeList-container">
              <NoticeList :list="item.list" />
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-row>
</template>

<style lang="scss" scoped>
// PX 转 rem
@function px2Rem($px) {
  $rem: 16px;
  @return calc($px / $rem) * 1rem;
}
.home-card{
  width: 100%;
  height: 100%;
  position: relative;
}
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 60px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  width: 94%;
  margin-top: px2Rem(140px);
  margin-left: 3%;
  .noticeList-container {
    padding: 15px 24px 0 24px;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px 0 36px;
  }
}

.marquee {
    overflow: hidden;
    white-space: nowrap;
}
.marquee span {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 20s linear infinite;
}
@keyframes marquee {
    0%   { transform: translateX(10); }
    100% { transform: translateX(-100%); }
}

.notice-title{
  margin-top: px2Rem(8px);
  margin-left: px2Rem(400px);
  font-size: px2Rem(18px);
  color: #fff;
}
.welcomeText{
  margin-top: px2Rem(0px);
  margin-left: px2Rem(20px);
  font-size: px2Rem(18px);
}
.useInfo{
  width: 80%;
  margin-top: px2Rem(54px);
  margin-left: px2Rem(20px);
  :deep(.el-descriptions__body){
    background-color: transparent!important;
  }
}
.notice-roll{
  position: absolute;
  margin-top: px2Rem(100px);
}
.notice-divider1{
  position: absolute;
  width: 96%;
  margin-top: px2Rem(90px);
  margin-left: px2Rem(10px);
}
.bgImg{
  width: 100%;
  height: 100%;
}
.blacktheme{
  :deep(.el-descriptions__body){
    background-color: transparent!important;
  }
  :deep(.useInfo){
    .el-descriptions__label{
      color: white;
    }
    .el-descriptions__content{
      color: white;
    }
  }

  :deep(.welcomeText){
    color:#fff;
  }

  :deep(.el-tabs__item){
    color: #fff;
  }
  :deep(.el-tabs__item.is-active, .el-tabs__item:hover){
    color: var(--el-color-primary);
  }
  :deep(.notice-title-content){
    color: #fff;
  }

  :deep(.notice-text-datetime){
    color: rgb(186, 186, 186);
  }

  :deep(.notice-text-description){
    color: rgb(218, 218, 218);
  }
}

.sidebarOpened{
  .rollNotice{
    width: px2Rem(980px) !important;
  }
}
</style>
