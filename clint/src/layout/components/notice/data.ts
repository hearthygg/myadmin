import avatar from "@/assets/images/avatar.png";
export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  {
    key: "1",
    name: "通知",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "你有了 12 份试卷待批改",
        datetime: "一天前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title: "电路分析课程即将开课",
        datetime: "一天前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
        title: "电路分析课程实验报告已自动生成",
        datetime: "一天前",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "电路分析课程开设成功",
        datetime: "一天前",
        description: "",
        type: "1"
      },
    ]
  },
  {
    key: "2",
    name: "已读",
    list: [
      {
        avatar: avatar,
        title: "张明远 实验报告提交成功",
        description: "电路分析实验报告已提交",
        datetime: "一天前",
        type: "2"
      },
      {
        avatar: avatar,
        title: "董佳明 实验报告提交成功",
        description: "电路分析实验报告已提交",
        datetime: "一天前",
        type: "2"
      },
      {
        avatar: avatar,
        title: "胡安方 模电故障分析实验提交成功",
        description:
          "根据故障描述，根据实验数据，分析故障原因，并给提交解决方案电路。",
        datetime: "一天前",
        type: "2"
      }
    ]
  },
  {
    key: "3",
    name: "未读",
    list: [
      {
        avatar: "",
        title: "课程通知",
        description: "故障分析课程即将开始，请及时完成实验",
        datetime: "",
        extra: "未开始",
        status: "info",
        type: "3"
      },
      {
        avatar: "",
        title: "学生提问",
        description:
          "模电故障排查实验，电容测量有误，错误电路已发送到教师账号，请及时查看",
        datetime: "",
        extra: "学生提问",
        status: "danger",
        type: "3"
      },
      {
        avatar: "",
        title: "学生提问",
        description:
         "模电故障排查实验，电容测量有误，错误电路已发送到教师账号，请及时查看",
        datetime: "",
        extra: "已耗时 8 天",
        status: "warning",
        type: "3"
      },
      {
        avatar: "",
        title: "管理系统通知消息",
        description: "新版本管理系统持续更新中，实验数据兼容老版本管理系统，请放心使用",
        datetime: "",
        extra: "进行中",
        type: "3"
      }
    ]
  }
];
