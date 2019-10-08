const router = require("koa-joi-router");
const ArticleHandler = require("../handlers/article");
const Joi = router.Joi;
const article = router();
article.prefix("/article");
const routes = [
  // 创建路径
  {
    method: "post",
    path: "/createPath",
    validate: {
      body: {
        pathName: Joi.string()
          .max(100)
          .required(),
        openid: Joi.string()
          .max(100)
          .required(),
        author: Joi.string()
          .max(100)
          .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.createPath
  },
  // 路径名字修改
  {
    method: "post",
    path: "/renamePath",
    validate: {
      body: {
        pathName: Joi.string()
          .max(100)
          .required(),
        openid: Joi.string()
          .max(100)
          .required(),
        id: Joi.string()
          .max(100)
          .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.renamePath
  },
  // 删除路径名字
  {
    method: "post",
    path: "/deletePath",
    validate: {
      body: {
        id: Joi.string()
          .max(100)
          .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.deletePath
  },
  // 查询所有路径
  {
    method: "get",
    path: "/pathsInfoByOpenId",
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
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.pathsInfoByOpenId
  },
  // 创建文章
  {
    method: "post",
    path: "/CreateArticle",
    validate: {
      body: {
        // pathId, title, content, pictureUrl, openid
        pathId: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string(),
        pictureUrl: Joi.string(),
        openid: Joi.string()
          .max(100)
          .required(),
        author: Joi.string()
          .max(100)
          .required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.CreateArticle
  },
  // 修改文章
  {
    method: "put",
    path: "/UpdateArticleInfoById",
    validate: {
      body: {
        // id, title, content, pictureUrl
        id: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
        pictureUrl: Joi.string().required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.UpdateArticleInfoById
  },
  // 查询路径下的文章
  {
    method: "get",
    path: "/GetArticlesByPath",
    validate: {
      query: {
        pathId: Joi.string().required(),
        status: Joi.number().optional(),
        limit: Joi.number(),
        offset: Joi.number()
      },
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.GetArticlesByPath
  },
  // 查询发布的文章
  {
    method: "get",
    path: "/GetPublishArticles",
    validate: {
      query: {
        limit: Joi.number(),
        offset: Joi.number()
      },
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.GetPublishArticles
  },
  //  删除一篇文章
  {
    method: "delete",
    path: "/DeleteArticleById",
    validate: {
      query: {
        id: Joi.string().required()
      },
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.DeleteArticleById
  },
  // 发布取消发布文章
  {
    method: "put",
    path: "/UpdateArticleStatusById",
    validate: {
      body: {
        id: Joi.string().required(),
        status: Joi.number().required()
      },
      type: "form",
      output: {
        200: {
          body: {
            status: Joi.number().required(),
            msg: Joi.string().required(),
            data: Joi.object().optional()
          }
        }
      }
    },
    handler: ArticleHandler.UpdateArticleStatusById
  }
];
article.route(routes);
module.exports = article;
