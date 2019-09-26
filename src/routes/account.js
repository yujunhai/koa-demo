const router = require("koa-joi-router");
const AccountHandler = require("../handlers/account");
const Joi = router.Joi;
const account = router();
account.prefix("/account");
const routes = [
  // 注册
  {
    method: "post",
    path: "/register",
    validate: {
      body: {
        name: Joi.string()
          .max(100)
          .required(),
        password: Joi.string()
          .max(100)
          .required(),
        confirmPassword: Joi.string()
        .max(100)
        .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional().default({})
          }
        }
      }
    },
    handler: AccountHandler.register
  },
  // 登录
  {
    method: "post",
    path: "/login",
    validate: {
      body: {
        name: Joi.string()
          .max(100)
          .required()
          .error(new Error("name错误")),
        password: Joi.string()
          .max(100)
          .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object()
              .optional()
              .default({})
          }
        }
      }
    },
    handler: AccountHandler.login
  },
  // 修改密码
  {
    method: "post",
    path: "/UpdatePassword",
    validate: {
      body: {
        openid: Joi.string()
          .max(100)
          .required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object()
              .optional()
              .default({})
          }
        }
      }
    },
    handler: AccountHandler.UpdatePassword
  },
  // 修改用户类型
  {
    method: "post",
    path: "/UpdateType",
    validate: {
      body: {
        openid: Joi.string()
          .max(100)
          .required(),
        userOpenId: Joi.string()
        .max(100)
        .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object()
              .optional()
              .default({})
          }
        }
      }
    },
    handler: AccountHandler.UpdateType
  },
  // 获取所有用户
  {
    method: "get",
    path: "/GetAllUser",
    validate: {
      query: {
        openid: Joi.string()
          .max(100)
          .required(),
        limit: Joi.number(),
        offset: Joi.number()
      },
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            datas: Joi.array()
          }
        }
      }
    },
    handler: AccountHandler.GetAllUser
  },
  {
    method: "get",
    path: "/test",
    handler: async ctx => {
      ctx.body = "hello 444!";
    },
    pre: async (ctx, next) => {
      // await checkAuth(ctx);
      // return next();
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
];
account.route(routes);
module.exports = account;
