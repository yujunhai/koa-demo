"use strict";
const mongoose = require("mongoose");
const PathModel = mongoose.model("Path");
const ArticleModel = mongoose.model("Article");
const redis = require(ROOT + "/src/database/redis/index.js");

class ArticleHandler {
  // 创建路径
  static async createPath(ctx, next) {
    const { pathName, openid } = ctx.request.body;

    try {
      const path = await PathModel.GetPathInfoByName(pathName, openid);
      console.log(path);
      if (!path) {
        const res = await PathModel.CreatePath(pathName, openid);
        console.log(res);
        ctx.body = {
          status: 200,
          msg: "创建路径成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "路径已经存在"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 修改路径名称
  static async renamePath(ctx, next) {
    const { id, pathName } = ctx.request.body;

    try {
      const path = await PathModel.GetPathInfoByID(id);
      console.log(path);
      if (path) {
        const res = await PathModel.UpdatePathNameByID(id, pathName);
        console.log(res);
        ctx.body = {
          status: 200,
          msg: "修改路径成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "传入id 不存在，错误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 删除路径名称
  static async deletePath(ctx, next) {
    const { id } = ctx.request.body;

    try {
      const path = await PathModel.GetPathInfoByID(id);
      console.log(path);
      if (path) {
        const res = await PathModel.DeletePathInfoByID(id);
        console.log(res);
        if (res) {
          //删除成功之后也得把相应的文章删除
          const result = await ArticleModel.DeleteArticleByPathId(id);
          console.log(result);
          if (result) {
            ctx.body = {
              status: 200,
              msg: "删除路径成功",
              data: result
            };
          }
        }
      } else {
        ctx.body = {
          status: 400,
          msg: "传入id 不存在，错误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 查询某个用户下的所有路径
  static async pathsInfoByOpenId(ctx, next) {
    const { openid, limit, offset } = ctx.request.query;

    try {
      const obj = await PathModel.GetPathInfoByOpenId(openid, limit, offset);
      console.log(obj);
      if (obj.paths.length) {
        ctx.body = {
          status: 200,
          msg: "查询路径成功",
          data: { datas: obj.paths, page: { total: obj.total, limit, offset } }
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "暂无创建的路径"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 创建文章
  static async CreateArticle(ctx, next) {
    const { pathId, title, content, pictureUrl, openid } = ctx.request.body;

    try {
      const path = await PathModel.GetPathInfoByID(pathId);
      if (path) {
        const res = await ArticleModel.CreateArticle(
          pathId,
          title,
          content,
          pictureUrl,
          openid
        );
        console.log("------");
        console.log(res);
        ctx.body = {
          status: 200,
          msg: "创建文章成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "pathId不存在"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 更新文章
  static async UpdateArticleInfoById(ctx, next) {
    const { id, title, content, pictureUrl, abstract } = ctx.request.body;

    try {
      const path = await ArticleModel.GetArticleById(id);
      if (path) {
        const res = await ArticleModel.UpdateArticleInfoById(
          id,
          title,
          content,
          pictureUrl,
          abstract
        );
        console.log(res);
        ctx.body = {
          status: 200,
          msg: "更新文章成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "文章Id不存在"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 查询某个路径下的所有文章
  static async GetArticlesByPath(ctx, next) {
    const { pathId, status, limit, offset } = ctx.request.query;

    try {
      const path = await PathModel.GetPathInfoByID(pathId);
      if (path) {
        const obj = await ArticleModel.GetArticlesByPath(
          pathId,
          status,
          limit,
          offset
        );
        ctx.body = {
          status: 200,
          msg: "查询路径成功",
          data: {
            datas: obj.article,
            page: {
              total: obj.total,
              limit,
              offset
            }
          }
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "传入pathId有误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

    // 查询某个id下的文章
    static async GetArticlesById(ctx, next) {
      const { id } = ctx.request.query;
  
      try {
          const obj = await ArticleModel.GetArticleById(
            id
          );
          if(obj) {
            ctx.body = {
              status: 200,
              msg: "查询文章成功",
              data: obj
            };
          } else {
            ctx.body = {
              status: 400,
              msg: "传入id有误"
            };
          }
        return next();
      } catch (e) {
        throw e;
      }
    }

  // 查询发布文章
  static async GetPublishArticles(ctx, next) {
    const { limit, offset } = ctx.request.query;
    try {
      const obj = await ArticleModel.GetPublishArticles(limit, offset);
      ctx.body = {
        status: 200,
        msg: "查询发布文章成功",
        data: {
          datas: obj.article,
          page: {
            limit,
            offset,
            total: obj.total
          }
        }
      };
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 删除某一篇文章
  static async DeleteArticleById(ctx, next) {
    const { id } = ctx.request.query;

    try {
      const article = await ArticleModel.GetArticleById(id);
      if (article) {
        const res = await ArticleModel.DeleteArticleById(id);
        ctx.body = {
          status: 200,
          msg: "成功删除文章",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "传入文章id 不存在，错误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 发布取消发布文章
  static async UpdateArticleStatusById(ctx, next) {
    const { id, status } = ctx.request.body;

    try {
      console.log(id);
      const article = await ArticleModel.GetArticleById(id);
      console.log(article);
      if (article) {
        const res = await ArticleModel.UpdateArticleStatusById(id, status);
        ctx.body = {
          status: 200,
          msg: "更新发布状态成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 400,
          msg: "传入文章id 不存在，错误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = ArticleHandler;
