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

const _cors=(ctx,next)=>{
  //指定服务器端允许进行跨域资源访问的来源域。可以用通配符*表示允许任何域的JavaScript访问资源，但是在响应一个携带身份信息(Credential)的HTTP请求时，必需指定具体的域，不能用通配符
  ctx.set("Access-Control-Allow-Origin", "*");

  //指定服务器允许进行跨域资源访问的请求方法列表，一般用在响应预检请求上
  ctx.set("Access-Control-Allow-Methods", "OPTIONS,POST,GET,HEAD,DELETE,PUT");
  
  //必需。指定服务器允许进行跨域资源访问的请求头列表，一般用在响应预检请求上
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  
  //告诉客户端返回数据的MIME的类型，这只是一个标识信息,并不是真正的数据文件的一部分
  ctx.set("Content-Type", "application/json;charset=utf-8");
  
  //可选，单位为秒，指定浏览器在本次预检请求的有效期内，无需再发送预检请求进行协商，直接用本次协商结果即可。当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  ctx.set("Access-Control-Max-Age", 300);

  //可选。它的值是一个布尔值，表示是否允许客户端跨域请求时携带身份信息(Cookie或者HTTP认证信息)。默认情况下，Cookie不包括在CORS请求之中。当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";如果没有设置这个值，浏览器会忽略此次响应。
  ctx.set("Access-Control-Allow-Credentials", true);

  //可选。跨域请求时，客户端xhr对象的getResponseHeader()方法只能拿到6个基本字段，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。要获取其他字段时，使用Access-Control-Expose-Headers，xhr.getResponseHeader('myData')可以返回我们所需的值
  ctx.set("Access-Control-Expose-Headers", "myData");

  next()
}

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

app.use(koaStatic(__dirname + "/public/files"));



app.use(_cors)
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
