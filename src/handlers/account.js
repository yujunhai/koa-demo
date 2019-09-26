"use strict";
const mongoose = require("mongoose");
const AccountModel = mongoose.model("Account");
const redis = require(ROOT + "/src/database/redis/index.js");

class AccountHandler {
  // 注册
  static async register(ctx, next) {
    const { name, password, confirmPassword } = ctx.request.body;

    try {
      if (password !== confirmPassword) {
        ctx.body = {
          status: 400,
          msg: "两次输入密码不一致"
        };
        return;
      }
      const account = await AccountModel.GetUserByName(name);
      if (!account) {
        const md5Pwd = tools.md5sum(password);
        const res = await AccountModel.CreateUserByName(name, md5Pwd);
        console.log(res);
        ctx.body = {
          status: 200,
          msg: "注册成功",
          data: res
        };
      } else {
        ctx.body = {
          status: 200,
          msg: "此账户名已经被注册,请换一个进行申请"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 登录
  static async login(ctx, next) {
    const { name, password } = ctx.request.body;

    try {
      const account = await AccountModel.GetUserByName(name);
      if (!account) {
        ctx.body = {
          status: 400,
          msg: "没有此用户信息"
        };
      } else {
        const md5Pwd = tools.md5sum(password);
        if (password !== account.password && md5Pwd !== account.password) {
          ctx.body = {
            status: 400,
            msg: "登录信息密码不对"
          };
        } else {
          // 先去查找redis 根据openid 有没有token
          let token = await redis.getUserAccessToken(account.openid);
          if (!token) {
            token = tools.GenerateAccessToken(account);
          }
          ctx.body = {
            status: 200,
            msg: "login success",
            data: {
              ...account,
              access_token: token
            }
          };
        }
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 更新密码
  static async UpdatePassword(ctx, next) {
    const {
      openid,
      oldPassword,
      newPassword,
      confirmPassword
    } = ctx.request.body;

    try {
      if (newPassword !== confirmPassword) {
        ctx.body = {
          status: 400,
          msg: "输入新密码和确认密码不一致"
        };
        return;
      }
      const account = await AccountModel.GetUserByOpenid(openid);
      if (!account) {
        ctx.body = {
          status: 400,
          msg: "没有此用户信息"
        };
      } else {
        const md5Pwd = tools.md5sum(oldPassword);
        if (oldPassword !== account.password && md5Pwd !== account.password) {
          ctx.body = {
            status: 400,
            msg: "输入旧密码不对"
          };
        } else {
          const result = AccountModel.UpdatePassword(openid, newPassword);
          if (result) {
            ctx.body = {
              status: 200,
              success: "成功修改密码",
              data: result
            };
          }
        }
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 更新y用户type
  static async UpdateType(ctx, next) {
    const { openid, userOpenId } = ctx.request.body;

    try {
      const account = await AccountModel.GetUserByOpenid(openid);
      if (!account) {
        ctx.body = {
          status: 400,
          msg: "传入openid有误"
        };
      } else {
        if (account.type === "super") {
          const res = await AccountModel.UpdateType(userOpenId);
          if (res) {
            ctx.body = {
              status: 200,
              success: "修改权限成功",
              data: res
            };
          }
        } else {
          ctx.body = {
            status: 400,
            msg: "您的权限不够"
          };
        }
      }
      return next();
    } catch (e) {
      throw e;
    }
  }

  // 获取所有用户
  static async GetAllUser(ctx, next) {
    const { openid, limit, offset } = ctx.request.query;

    try {
      const account = await AccountModel.GetUserByOpenid(openid);
      if (account) {
        if (account.type === "super" || account.type === "admin") {
          const res = await AccountModel.GetUsers(limit, offset);
          ctx.body = {
            status: 200,
            msg: "查询所有用户成功",
            datas: res
          };
        } else {
          ctx.body = {
            status: 400,
            msg: "您无权获取所有用户"
          };
        }
      } else {
        ctx.body = {
          status: 400,
          msg: "openid不存在"
        };
      }
      return next();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = AccountHandler;
