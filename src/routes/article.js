const router = require('koa-joi-router');
const ArticleHandler  = require('../handlers/article');
const Joi = router.Joi;
const article = router();
article.prefix('/article')
const routes = [
  // 创建路径
  {
    method: 'post',
    path: '/createPath',
    validate: {
      body: {
        pathName: Joi.string().max(100).required(),
        openid: Joi.string().max(100).required()
      },
      type: 'form',
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            success: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.createPath
  },
   // 路径名字修改
   {
    method: 'post',
    path: '/renamePath',
    validate: {
      body: {
        pathName: Joi.string().max(100).required(),
        openid: Joi.string().max(100).required(),
        id: Joi.string().max(100).required()
      },
      type: 'form',
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            success: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.renamePath
  },
     // 删除路径名字
     {
        method: 'post',
        path: '/deletePath',
        validate: {
          body: {
            id: Joi.string().max(100).required()
          },
          type: 'form',
          output: {
            200: {
              body: {
                status: Joi.number().required(),
                success: Joi.string().required(),
                data: Joi.object().optional()
              }
            }
          }
        },
        handler: ArticleHandler.deletePath
      },
   // 查询所有路径
   {
    method: 'get',
    path: '/pathsInfoByOpenId',
    validate: {
        query: {
        openid: Joi.string().max(100).required()
      },
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            success: Joi.string().required(),
            datas: Joi.array().optional()
          }
        }
      }
    },
    handler: ArticleHandler.pathsInfoByOpenId
  }
]
article.route(routes);
module.exports = article