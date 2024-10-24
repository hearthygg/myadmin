<!-- 交流中心 -->
<template>
  <el-row class="chat">
    <!-- 聊天列表 -->
    <el-col class="chat-list" :xs="8" :sm="7" :md="6" :lg="5" :xl="4">
      <div class="chat-search flex justify-between items-center p-2">
        <i class="iconfont icon-sousuo mr-2"></i><el-input placeholder="搜索" v-model="state.searchChatVal"
          clearable></el-input>
      </div>
      <div class="list-item p-3 flex">
        <div class="list-avatar w-[45px] h-[45px] rounded-xl flex justify-center items-center bg-[#8291A9]">
          <i class="iconfont icon-jiqiren text-white text-2xl font-bold"></i>
        </div>
        <div class="list-title">
          <div><span class="text-xl text-[#242A38] ml-5">测试群组聊天</span></div>
          <div>
            <span
              class="one-text-overflow text-lg text-[#8291A9] ml-5">测试一条聊天记录</span>
          </div>
        </div>
      </div>
    </el-col>
    <!-- 聊天窗口 -->
    <el-col class="chat-window" :xs="16" :sm="17" :md="18" :lg="19" :xl="20">
      <div class="window-title ml-5 w-full flex items-center">
        <div class="w-[45px] h-[45px] rounded-xl flex justify-center items-center bg-[#8291A9]">
          <i class="iconfont icon-jiqiren text-white text-2xl font-bold"></i>
        </div>
        <span class="text-xl text-[#242A38] ml-5">测试群组聊天</span>
      </div>
      <div class="window-chat w-full">
        <el-scrollbar ref="scrollbarRef">
          <div ref="innerRef">
            <div v-for="item, index in state.chatList" :key="item.message.time">
              <div v-if="isShowTime(item, index)" class="text-lg text-center text-[#8291A9] m-1">
                <i class="iconfont icon-shijian"></i>
                {{ formartCurrentTime(item.message.time) }}
              </div>
              <div v-if="item.type === 'AUTH_RESPONSE' || item.type === 'CHAT_SEND_RESPONSE'"
                class="chat-record w-full p-5 flex">
                <div class="w-[45px] min-w-[45px] h-[45px] rounded-xl flex justify-center items-center bg-[#09B66D]">
                  <i class="iconfont icon-jiqiren text-white text-2xl font-bold"></i>
                </div>
                <div class="ml-5 chat-width bg-[#0081FF] rounded-xl p-3 flex flex-wrap">
                  <span class="text-lg text-white">{{ item.message.message }}</span>
                </div>
              </div>
              <div v-else-if="item.message.fromUser !== state.currentUser" class="chat-record w-full p-5 flex">
                <div class="w-[45px] min-w-[45px] h-[45px] rounded-xl flex justify-center items-center bg-[#8291A9]">
                  <span class="text-white text-2xl font-bold">{{ showFirstName(item.message.fromUser) }}</span>
                </div>
                <div class="ml-5 chat-width bg-[#0081FF] rounded-xl p-3">
                  <span class="text-lg text-white" v-html="item.message.content"></span>
                </div>
              </div>
              <div v-else class="personal-chat w-full p-5 flex flex-row-reverse">
                <div class="w-[45px] min-w-[45px] h-[45px] rounded-xl flex justify-center items-center bg-[#FDBF5E]">
                  <span class="text-white text-2xl font-bold">{{ showFirstName(item.message.fromUser) }}</span>
                </div>
                <div class="mr-5 chat-width bg-[#EDF4FB] rounded-xl p-3 flex flex-wrap">
                  <span class="text-lg text-[#242A38]" v-html="item.message.content"></span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="chat-input w-full h-[160px] bg-[#EDF4FB]">
        <editor ref="currentEdit" v-model="state.inputChatVal" @keyup.ctrl.enter="handleSendMsg" />
        <div class="chat-send">
          <el-tooltip content="Ctrl+Enter发送" placement="top">
            <el-button @click="handleSendMsg" type="primary"><i class="iconfont icon-dianji"></i>发送</el-button>
          </el-tooltip>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, nextTick } from "vue";
import { ElScrollbar, ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user';
import { formatDate } from '@/utils/formatTime'
import Editor from '@/components/WangEditor/chatEditer.vue';
// 当前用户消息
const userStore = useUserStore();
// 滚动条内容dom对象
const innerRef = ref<HTMLDivElement>()
// el-scrollbar对象
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
// 输入窗口富文本对象
const currentEdit = ref()
const state = reactive({
  // 查询聊天列表
  searchChatVal: '',
  // 发送聊天消息
  inputChatVal: '',
  // 聊天消息队列
  chatList: [] as ChatListItem[],
  // websocket连接
  ws: '' as unknown as WebSocket,
  // 当前用户
  currentUser: '',
})
// 在色盘中随机取一种颜色
function getRandomColor() {
  let colorIndex: string[] = ["#FDBF5E", "#8291A9", "#FF3D57", "#09B66D", "#FF8A48"]
  let currentIndex = Math.floor(Math.random() * 5)
  // return `bg-[${colorIndex[currentIndex]}]`
  return colorIndex[currentIndex]
}
// 发送聊天消息
function handleSendMsg() {
  // websocket连接成功
  if (state.ws.readyState === 1) {
    let sendObj = JSON.stringify({
      type: "CHAT_SEND_TO_ALL_REQUEST",
      message: {
        content: state.inputChatVal,
        fromUser: state.chatList[0].message.currentUser
      }
    })
    const encoder = new TextEncoder()
    state.ws.send(encoder.encode(sendObj).buffer);
    state.ws
    // 聊天发送之后清空当前的聊天消息
    state.inputChatVal = ""
    currentEdit.value.clearEditContent()
  } else {
    ElMessage.error('您还未连接群聊！');
  }
}
// 连接聊天室
function openWebSocket() {
  //判断当前浏览器是否支持WebSocket
  if ('WebSocket' in window) {
    let wsUrl = `${document.location.host}/lmsWeb/chat`
    // 根据协议不同动态判断是 ws还是wss
    if('https:' == document.location.protocol) {
      wsUrl = 'wss://' + wsUrl
    } else {
      wsUrl = 'ws://' + wsUrl
    }
    console.log(wsUrl);
    state.ws = new WebSocket(wsUrl);
  } else {
    ElMessage.error('当前浏览器不支持websocket');
  }

  //连接发生错误的回调方法
  state.ws.onerror = function () {
    ElMessage.error('WebSocket连接发生错误');
  };

  //连接成功建立的回调方法
  state.ws.onopen = function () {
    ElMessage.success(`欢迎${userStore.nickname}进入群聊`);
    let userInfo = JSON.stringify({
      type: 'AUTH_REQUEST',
      message: {
        accessToken: userStore.token,
      }
    })
    const encoder = new TextEncoder()
    state.ws.send(encoder.encode(userInfo).buffer);
  };

  //接收到消息的回调方法
  state.ws.onmessage = function (event) {
    // 将blob格式文件转换成json对象
    let res
    let reader = new FileReader(); // 创建读取文件对象
    reader.readAsText(event.data, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8
    reader.addEventListener("loadend", async function () { //
      res = JSON.parse(reader.result as string); // 返回的数据
      res.message = JSON.parse(res.message)
      if (res.type === 'CHAT_SEND_RESPONSE') return
      state.chatList.push(res)
      // 保存当前用户
      state.currentUser = state.chatList[0].message.currentUser
      // 设置滚动条滚到最底部
      nextTick(() => {
        scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
      })
    });
  };

  //连接关闭的回调方法
  state.ws.onclose = function () {
    ElMessage.success(`再见${userStore.nickname}！`);
  };

  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function () {
    closeWebSocket();
  };
}
//关闭WebSocket连接
function closeWebSocket() {
  state.ws.close();
}
// 格式化时间戳
const formartCurrentTime = (date: number, type = "YYYY-mm-dd HH:MM:SS") => {
  return formatDate(new Date(date), type)
}
// 控制一定聊天记录之间显示时间
function isShowTime(data: ChatListItem, index: number) {
  if (index == 0) {
    return true
  } else if (data.message.time - state.chatList[index - 1].message.time >= 1000 * 60 * 2) {
    // 两条聊天记录之间相差了2分钟显示一次发送时间
    return true
  } else {
    return false
  }
}
// 截取首字母
function showFirstName(name: string) {
  return name.split("_")[1].slice(0, 1)
}
onMounted(() => {
  openWebSocket()
  // 设置滚动条在最底部
  scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
})
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.chat {
  width: 100%;
  height: calc(100vh - 84px);

  .chat-list {
    height: 100%;
    background-color: #EDF4FB;
    border-right: 1px solid #DBE7EE;

    .chat-search {
      height: 55px;
      border-bottom: 1px solid #DBE7EE;
    }

    .list-avatar {
      width: 45px;
      height: 45px;
    }

    .list-title {
      width: calc(100% - 45px)
    }
  }

  .one-text-overflow {
    @include text-ellipsis(1);
  }

  .list-item {
    width: 100%;
    height: 80px;
    background-color: #EDF4FB;
    border-bottom: 1px solid #DBE7EE;
    cursor: pointer;

    &:hover {
      background-color: #fff;
    }
  }

  .active {
    background-color: #fff;
  }

  .chat-window {
    height: 100%;

    .window-title {
      border-bottom: 1px solid #DBE7EE;
      height: 55px;

      .chat-width {
        width: 500px
      }
    }

    .window-chat {
      height: calc(100vh - 300px);
      overflow-y: auto;
      transition: all 0.5s;
    }

    .chat-input {
      position: relative;

      .chat-send {
        position: absolute;
        z-index: 1200;
        bottom: 10px;
        right: 10px;
      }
    }
  }
}
</style>
