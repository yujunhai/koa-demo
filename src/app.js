const fs = require("fs");
const join = require("path").join;
const koa = require("koa");
const router = require("koa-joi-router");
const jwtKoa = require("koa-jwt");
const koaStatic = require("koa-static");
const koaBody = require("koa-body");
const authen = require("./middle/authen");
const loggerPlugin = require("./middle/logger");
const models = join(__dirname, "models");
const { loggerConfig } = require("./config");
var koaBunyanLogger = require('koa-bunyan-logger');
var bunyan = koaBunyanLogger.bunyan;
var cors = require('koa2-cors');

//  全局工具
global.ROOT = process.cwd();
global.tools = require(ROOT + "/src/common/tools.js");

// mongo
require("./database/redis");
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

const { settingConfig } = require("./config");
const pub = router();
require("./database/mongodb");

pub.get("/", async ctx => {
  ctx.body = "hello joi!";
});

const app = new koa();

app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(koaStatic(__dirname + "/public/files"));


app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  })
);

// logger
var appLogger = bunyan.createLogger(loggerConfig)
app.use(koaBunyanLogger(appLogger));
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());

// 注意这里的中间件需要放在koa-body 后面，不然拿不到参数
app.use(loggerPlugin())

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = "Protected resource, use Authorization header to get access\n";
    } else {
      throw err;
    }
  });
});

app.use(
  jwtKoa({ secret: settingConfig.secret.sign }).unless({
    path: [
      /^\/account^\/login/,
      /^\/account^\/register/,
      "/",
      "/account/register",
      "/account/login"
    ]
  })
);
app.use(authen());

app.use(pub.middleware());


function initServer() {
  const rootRoutePath = `${__dirname}/routes/`;
  let files = fs.readdirSync(rootRoutePath);
  files.length &&
    files.map(file => {
      const fileName = rootRoutePath + file;
      const stat = fs.statSync(fileName);
      if (!stat.isFile()) {
        console.log("Path is not file", fileName);
        return;
      }
      const routeObj = require(fileName);
      app.use(routeObj.middleware());
    });
  app.listen(settingConfig.server.port, settingConfig.server.host);
  console.log(
    "Server is running at " +
      settingConfig.server.host +
      ":" +
      settingConfig.server.port
  );
}

try {
  initServer();
} catch (err) {
  if (err.stack) {
    console.log(err.stack);
  } else {
    console.log(err.toString());
  }
  process.exit(-1);
}
