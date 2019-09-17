const fs = require("fs");
const join = require('path').join;
const koa = require("koa");
const router = require("koa-joi-router");
const jwtKoa = require('koa-jwt');
const authen = require('./middle/authen')
const models = join(__dirname, 'models');

//  全局工具
global.ROOT = process.cwd();
global.tools = require(ROOT + '/src/common/tools.js');


// mongo
require('./database/redis');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

const { settingConfig } = require("./config");
const pub = router();
require('./database/mongodb');

pub.get("/", async ctx => {
  ctx.body = "hello joi!";
});

const app = new koa();

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

app.use(jwtKoa({ secret: settingConfig.secret.sign }).unless({ path: [/^\/account^\/login/, /^\/account^\/register/, '/', '/account/register', '/account/login'] }));
app.use(authen())

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
  console.log('Server is running at ' + settingConfig.server.host + ':' + settingConfig.server.port);
}

try {
  initServer()
} catch (err) {
  if (err.stack) {
    console.log(err.stack);
  } else {
    console.log(err.toString());
  }
  process.exit(-1);
}
