import "reflect-metadata"; // 引入 reflect-metadata
import "module-alias/register";
import path from "node:path";
import express from "express";
import { useExpressServer } from "routing-controllers";
import { json, urlencoded } from "body-parser";
import multer from "multer";
import { initDataSource } from "@tools/data-source";
import { authChecker } from "@utils/auth-checker";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
async function init() {
  // 先等待数据库连接上
  await initDataSource();
  const app = express();
  // body-parser body解析相关中间件
  // 解析json格式数据 注意中间件的顺序
  app.use(json());
  // 解析 urlencoded body
  // 会在 request 对象上挂载 body 属性，包含解析后的数据。
  // 这个新的 body 对象包含 key-value 键值对，若设置 extended 为 true，则键值可以是任意数据类型，否则只能是字符串或数组。
  app.use(urlencoded({ extended: true }));
  // 添加 multer 中间件
  app.use(upload.array('files'));
  useExpressServer(app, {
    routePrefix: "/api", // 接口统一前缀
    controllers: [path.join(__dirname, "./controllers/*.controller.ts")],
    middlewares: [path.join(__dirname, "./middlewares/*.global.ts")],
    interceptors: [path.join(__dirname, "./interceptors/*.global.ts")],
    authorizationChecker: authChecker,
    defaultErrorHandler: false, // 有自己的错误处理程序再禁用默认错误处理
  });
  // 添加Swagger
  // const options = {
  //   swaggerDefinition: {
  //     info: {
  //       title: "示例API",
  //       version: "1.0.0",
  //       description: "这是一个示例API文档",
  //     },
  //   },
  //   apis: [path.join(__dirname, "./controllers/*.controller.ts")], // 指向你的控制器文件
  // };

  // const specs = swaggerJsdoc(options);

  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.listen(9527, () => {
    // console.log(`  App is running at http://localhost:9527\n`);
    console.log(`  App is running at http://10.10.10.124:9527\n`);
  });
}
// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });
init();
