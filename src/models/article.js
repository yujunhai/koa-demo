"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  pathId: {
    type: String,
    default: "",
    trim: true,
    maxlength: 400,
    ref: "Path"
  },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now() },
  posted_at: { type: Date },
  title: String,
  content: String,
  abstract: String,
  pictureUrl: String,
  status: Number, // 0 待发布 1 已发布
  published_at: Date,
  openid: {
    type: String,
    default: "",
    trim: true,
    maxlength: 400,
    ref: "Account"
  },
  author: String
});

ArticleSchema.index({ openid: 1 });

/**
 * Validations
 */

// ArticleSchema.path('name').required(true, 'Account name cannot be blank');

ArticleSchema.statics = {
  // 创建文章
  CreateArticle: async function(
    pathId,
    title,
    content,
    pictureUrl,
    openid,
    author,
  ) {
    try {
      let tnow = Date.now();
      let article = {
        pathId: pathId,
        openid: openid,
        updated_at: tnow,
        created_at: tnow,
        title,
        content,
        pictureUrl,
        author: author,
        status: 0
      };
      const result = await this.create(article);
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 更新文章
  UpdateArticleInfoById: async function(id, title, content, pictureUrl, abstract) {
    try {
      let article = await this.updateOne(
        { _id: id },
        {
          $set: {
            title: title,
            pictureUrl: pictureUrl,
            content: content,
            updated_at: Date.now(),
            abstract: abstract
          }
        }
      );
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 通过id 删除一篇文章
  DeleteArticleById: async function(id) {
    try {
      let article = await this.deleteOne({ _id: id });

      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 通过path 删除某个路径下的文章
  DeleteArticleByPathId: async function(pathId) {
    try {
      let result = await this.deleteMany({ pathId: pathId });

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 通过id 获取文章
  GetArticleById: async function(id) {
    try {
      let article = await this.findOne({
        _id: id
      });
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  // 通过pathId 获取所有文章
  GetArticlesByPath: async function(pathId, status, limit, offset) {
    try {
      let article;
      let total;
      if (status) {
        article = await this.find({ pathId: pathId, status: status })
          .limit(limit)
          .skip(offset)
          .sort({ updated_at: -1 });
        total = await this.find({ pathId: pathId, status: status }).count;
      } else {
        article = await this.find({ pathId: pathId })
          .limit(limit)
          .skip(offset)
          .sort({ updated_at: -1 });
        total = await this.find({ pathId: pathId }).count;
      }
      return { article, total };
    } catch (e) {
      throw e;
    }
  },

  // 获取发布文章
  GetPublishArticles: async function(limit, offset) {
    try {
      let article = await this.find({ status: 1 })
        .limit(limit)
        .skip(offset)
        .sort({ updated_at: -1 });
      let total = await this.find({ status: 1 }).count();
      return { article, total };
    } catch (e) {
      throw e;
    }
  },

    // 获取某个用户的发布文章
    GetPublishArticlesByOpenId: async function(openid, limit, offset) {
      try {
        let article = await this.find({ status: 1, openid })
          .limit(limit)
          .skip(offset)
          .sort({ updated_at: -1 });
        let total = await this.find({ status: 1, openid }).count();
        return { article, total };
      } catch (e) {
        throw e;
      }
    },

  // 发布取消发布文章

  UpdateArticleStatusById: async function(id, status) {
    try {
      let article;
      if (status === 1) {
        article = await this.updateOne(
          { _id: id },
          {
            $set: {
              status: status,
              updated_at: Date.now(),
              posted_at: Date.now()
            }
          }
        );
      } else {
        article = await this.updateOne(
          { _id: id },
          { $set: { status: status, updated_at: Date.now() } }
        );
      }
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
};

mongoose.model("Article", ArticleSchema);
