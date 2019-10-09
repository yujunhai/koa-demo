"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PathSchema = new Schema({
  pathName: {
    type: String,
    default: "",
    trim: true,
    maxlength: 400,
    ref: "Article"
  },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now() },
  openid: {
    type: String,
    default: "",
    trim: true,
    maxlength: 400,
    ref: "Account"
  },
  author: String
});

PathSchema.index({ openid: 1 });

/**
 * Validations
 */

// PathSchema.path('name').required(true, 'Account name cannot be blank');

PathSchema.statics = {
  // 创建路径
  CreatePath: async function(pathName, openid, author) {
    try {
      let tnow = Date.now();
      let path = {
        pathName: pathName,
        openid: openid,
        updated_at: tnow,
        created_at: tnow,
        author: author
      };
      const result = await this.create(path);
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // 删除路径
  DeletePathInfoByID: async function(id) {
    try {
      let path = await this.deleteOne({ _id: id });
      return path;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // 修改路径名称
  UpdatePathNameByID: async function(id, pathName) {
    try {
      let path = await this.updateOne(
        { _id: id },
        { $set: { pathName: pathName, updated_at: Date.now() } }
      );
      return path;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // 获取路径  所有的在首页展示的
  GetPathInfos: async function(path_name_condition, limit, offset) {
    try {
      let paths;
      let total;
      if (!path_name_condition) {
        paths = await this.find()
          .limit(limit)
          .skip(offset)
          .sort({ updated_at: -1 });
        total = await this.find().count()
      } else {
        paths = await this.find({
          pathName: { $regex: `${path_name_condition}` }
        })
          .limit(limit)
          .skip(offset)
          .sort({ updated_at: -1 });
        total = await this.find({
          pathName: { $regex: `${path_name_condition}` }
        }).count()
      }
      return {paths, total};
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // 通过id 获取路径
  GetPathInfoByID: async function(id) {
    try {
      let path = await this.findOne({
        _id: id
      });
      return path;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  // 获取某个用户的路径
  GetPathInfoByOpenId: async function(openid,limit, offset) {
    try {
      let paths = await this.find({
        openid: openid
      }).limit(limit)
      .skip(offset)
      .sort({ updated_at: -1 });
      let total = await this.find({
        openid: openid
      }).count()
      return {paths, total};
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
    // 获取某个用户的路径
    GetPathInfoByName: async function(pathName,openid) {
      try {
        let path = await this.findOne({
          pathName:pathName,
          openid: openid
        });
        return path;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
};

mongoose.model("Path", PathSchema);
