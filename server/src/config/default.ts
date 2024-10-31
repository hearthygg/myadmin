/* eslint-disable import/no-default-export */
const defaultEnvConfigs = {
  // 数据库配置
  db: {
    type: "mysql", // 类型
    host: "localhost", // 主机地址
    port: 3306, // 端口
    username: "root", // 账号
    password: "root", // 密码
    database: "zimuadmin", // 库名
  },
  // Redis 配置
  redis: {
    url: "redis://localhost:6379",
  },
  // 用户重置密码
  resetPassword: "password",
  // 默认密码后缀  默认密码：账号+后缀
  defaultPasswordSuffix: "@xyz",
  // 初始用户
  initUser: {
    username: "superAdmin",
    password: "superAdmin",
  },
  fileTypeArray: [
    "image/jpeg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/html",
    "text/css",
    "application/zip",
    "application/x-rar-compressed",
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
    "audio/aac",
  ],
  // 最大文件大小 5Mb
  maxFileSize: 5,
};

export default defaultEnvConfigs;
