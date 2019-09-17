const router = require('koa-joi-router');
const AccountHandler  = require('../handlers/account');
const Joi = router.Joi;
const account = router();
account.prefix('/account')
const routes = [
  // 注册
  {
    method: 'post',
    path: '/register',
    validate: {
      body: {
        name: Joi.string().max(100).required(),
        password: Joi.string().max(100).required()
      },
      type: 'form',
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            success: Joi.string().required(),
            open_id: Joi.string().optional(),
            name: Joi.string().optional()
          }
        }
      }
    },
    handler: AccountHandler.register
  },
   // 登录
    {
      method: 'post',
      path: '/login',
      validate: {
        body: {
          name: Joi.string().max(100).required().error(new Error('name错误')),
          password: Joi.string().max(100).required()
        },
        type: 'form',
        output: {
          200: {
            body: {
              status: Joi.number().required(),
              success: Joi.string().required()
              // data: Joi.object({
              //   access_token: String,
              //   name: String,
              //   openid: String
              // }).optional().default({})
            }
          }
        }
      },
      handler: AccountHandler.login
    },
  {
    method: 'get',
    path: '/test',
    handler: async (ctx) => {
        ctx.body = 'hello 444!';
    },
    pre: async (ctx, next) => {
      await checkAuth(ctx);
      return next();
    }
    // validate: {
    //   header: Joi.Object(),
    //   query: Joi.Object(),
    //   params: Joi.Object(),
    //   body: Joi.Object(),
    //   maxBody: '64kb',
    //   output: { '400-600': { body: Joi.Object() } },
    //   type: 'form',
    //   failure: 400,
    //   continueOnError: false
    // }
  }
]
account.route(routes);
module.exports = account