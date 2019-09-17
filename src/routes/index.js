const router = require('koa-joi-router');
const AccountHandler  = require('../handlers/account');
const Joi = router.Joi;
const account = router();
account.prefix('/account')
const routes = [
  // {
  //   method: 'post',
  //   path: '/register',
  //   validate: {
  //     body: {
  //       name: Joi.string().max(100),
  //       email: Joi.string().lowercase().email(),
  //       password: Joi.string().max(100),
  //       _csrf: Joi.string().token()
  //     },
  //     type: 'form',
  //     output: {
  //       200: {
  //         body: {
  //           userId: Joi.string(),
  //           name: Joi.string()
  //         }
  //       }
  //     }
  //   },
  //   handler: async (ctx) => {
  //     const user = await createUser(ctx.request.body);
  //     ctx.status = 201;
  //     ctx.body = user;
  //   }
  // },
  {
    method: 'get',
    path: '/test',
    handler: async (ctx) => {
        ctx.body = 'hello 444!';
    }
  }
]
account.route(routes);
module.exports = account