const router = require("koa-joi-router");
const CommonHandler = require("../handlers/common");
const Joi = router.Joi;
const common = router();
common.prefix("/common");
const routes = [
  // 上传单个文件
  {
    method: "post",
    path: "/uploadFile",
    handler: CommonHandler.uplodFile
  },
  // 上传多个文件
  {
    method: "post",
    path: "/uploadFiles",
    handler: CommonHandler.uplodFiles
  }
];
common.route(routes);
module.exports = common;
