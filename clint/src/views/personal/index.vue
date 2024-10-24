<template>
  <div class="personal">
    <div class="personal-header">
      <div class="personal-userinfo">
        <div class="user-pic">
          <div class="user-pic-bg">
            <!-- <img class="img" :src="defaultAvatar" /> -->
            <img class="img" :src="userStore.avatar" />
          </div>
        </div>
        <div class="user-info-right">
          <h3 class="user-name">
            <span>{{ userStore.nickname }}</span>
          </h3>
          <div class="user-role">
            <span>角色：</span>
            <el-tag :class="{ 'ml-2': index !== 0 }" v-for="(item, index) in userStore.roleNames" :key="index">{{ item }}</el-tag>
          </div>
        </div>
        <!-- <div class="study-info">
          <div class="follows">
            <div class="set-btn"><i class="iconfont icon-shezhi"></i>个人设置</div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="personal-content mt-4">
      <div class="slider">
        <ul @click="handleMenuChange">
          <li v-for="item in sliderData" :key="item.id">
            <span :data-item-id="item.id" class="slider-item" :class="{ 'slider-active': item.id === currentView }">
              <i class="iconfont" :class="item.icon" :style="item.id === currentView ? 'color: #fff;' : ''"></i>
              {{ item.title }}
              <b class="icon-drop_right"></b>
            </span>
          </li>
        </ul>
      </div>
      <div class="u-container">
        <PersonalForm ref="personalFormRef" v-if="currentView === 'info'" />
        <ExamList v-if="currentView === 'exam'" />
        <Curriculum v-if="currentView === 'course'" />
        <PaperList v-if="currentView === 'paper'" />
        <PaperScore v-if="currentView === 'score'" />
        <MessageList v-if="currentView === 'notice'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="personal">
import { onMounted, ref, nextTick } from 'vue';
import { useUserStore } from '@/store/modules/user';
import defaultAvatar from '@/assets/images/defaultAvatar.png';
import PersonalForm from './components/personalForm.vue';
import ExamList from './components/examList.vue';
import PaperList from './components/paperList.vue';
import PaperScore from './components/paperScore.vue';
import MessageList from './components/messageList.vue'
import Curriculum from './components/curriculum.vue'
const personalFormRef = ref();
// 当前活跃视图
const currentView = ref('info');
const sliderData = [
  { title: '个人信息', icon: 'icon-denglu-yonghuming', id: 'info' },
  { title: '我的实验', icon: 'icon-shiyani', id: 'exam' },
  { title: '我的课表', icon: 'icon-kebiao', id: 'course' },
  { title: '我的试卷', icon: 'icon-mianshishijuan', id: 'paper' },
  { title: '我的报告', icon: 'icon-baogao', id: 'record' },
  { title: '我的成绩', icon: 'icon-chengji', id: 'score' },
  { title: '消息通知', icon: 'icon-gonggao', id: 'notice' }
];
// 获取pinia用户信息
const userStore = useUserStore();

// 菜单发生变化
function handleMenuChange(event: any) {
  // 事件委托
  const target = event.target;
  // 子元素被点击
  if (target.classList.contains('slider-item')) {
    // 读取自定义属性是以 data- 开头的 target.dataset.xxx就可以获取自定义属性
    currentView.value = target.dataset.itemId;
    switch (currentView.value) {
      case 'info':
        nextTick(() => {
          personalFormRef.value.getUserBaseInfo();
        });
        break;
      case 'exam':
        break;
      default:
        break;
    }
  }
}
onMounted(() => {
  personalFormRef.value.getUserBaseInfo();
});
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';

.personal {
  .personal-header {
    background: url('@/assets/images/personal-bg.png') no-repeat center top #000;
    background-size: cover;
    height: 148px;
    .personal-userinfo {
      position: relative;
      width: 1152px;
      margin: 0 auto;
      .user-pic {
        float: left;
        width: 148px;
        height: 148px;
        .user-pic-bg {
          border: 4px solid #fff;
          box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
          width: 140px;
          height: 140px;
          position: relative;
          border-radius: 50%;
          background: #fff;
          top: 24px;
          .img {
            text-align: center;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .user-info-right {
        float: right;
        width: 980px;
        .user-name {
          font-weight: 600;
          text-align: left;
          font-size: 24px;
          color: #fff;
          line-height: 28px;
          margin-top: 48px;
        }
        .user-role {
          font-size: 16px;
          color: #fff;
          line-height: 20px;
          text-align: left;
          margin-top: 6px;
        }
      }
      .study-info {
        position: absolute;
        top: 48px;
        right: 10px;
        min-width: 200px;
        text-align: right;
        .follows {
          margin-right: 24px;
          line-height: 48px;
          vertical-align: middle;
          height: 48px;
          float: left;
          .set-btn {
            padding: 8px 16px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 18px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 20px;
            &:hover {
              border: 1px solid #fff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .personal-content {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    .slider {
      position: absolute;
      left: 24px;
      top: 0px;
      width: 172px;
      ul li:first-child {
        margin-top: 40px;
      }
      ul li {
        height: 48px;
        width: 160px;
        margin: 0 auto 8px;
      }
      .slider-item {
        position: relative;
        display: block;
        height: 48px;
        font-size: 16px;
        line-height: 48px;
        text-align: center;
        color: #787d82;
        padding-left: 54px;
        text-align: left;
        cursor: pointer;
        i {
          position: absolute;
          left: 20px;
          top: 0;
          font-size: 20px;
          color: #93999f;
          line-height: 48px;
        }
        .icon-drop_right {
          visibility: hidden;
          &::before {
            content: '\e90b';
          }
        }
      }
      .slider-active {
        color: #fff;
        // background: rgba(240, 20, 20, 0.8);
        background: #409EFF;
        border-radius: 8px 0 0 8px;
        &::after {
          display: block;
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-top: 24px solid #fff;
          border-bottom: 24px solid #fff;
          border-left: 15px solid transparent;
        }
      }
    }
    .u-container {
      margin-left: 240px;
      min-height: 589px;
      // border: 1px solid #ccc;
      padding: 15px;
    }
  }
}
</style>
