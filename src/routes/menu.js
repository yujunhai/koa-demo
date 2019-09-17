const router = require('koa-joi-router');
const menu = router();
menu.prefix('/gg')
const routes = [
  {
    method: 'post',
    path: '/users',
    handler: async (ctx) => {}
  },
  {
    method: 'get',
    path: '/444',
    handler: async (ctx) => {
      ctx.body = 'hello 444menu!';
    }
  }
]
menu.route(routes);
module.exports = menu