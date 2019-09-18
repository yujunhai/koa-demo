"use strict";
const mongoose = require("mongoose");
const PathModel = mongoose.model("Path");
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
          status: 1,
          success: "创建路径成功",
          data: {
            pathName: res.pathName,
            openid: res.openid
          }
        };
      } else {
        ctx.body = {
          status: 0,
          success: "路径已经存在"
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
          status: 1,
          success: "修改路径成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 0,
          success: "传入id 不存在，错误"
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
        ctx.body = {
          status: 1,
          success: "删除路径成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 0,
          success: "传入id 不存在，错误"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 查询某个用户下的所有路径
  static async pathsInfoByOpenId(ctx, next) {
    const { openid } = ctx.request.query;

    try {
      const paths = await PathModel.GetPathInfoByOpenId(openid);
      console.log(paths);
      if (paths.length) {
        ctx.body = {
          status: 1,
          success: "查询路径成功",
          datas: paths
        };
      } else {
        ctx.body = {
          status: 0,
          success: "暂无创建的路径"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = ArticleHandler;
