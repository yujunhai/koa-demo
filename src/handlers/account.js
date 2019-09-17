'use strict';
const mongoose = require('mongoose');
const AccountModel = mongoose.model('Account');
const redis = require(ROOT + "/src/database/redis/index.js");

class AccountHandler {
    // 注册
    static async register(ctx, next) {
        const {
            name,
            password
        } = ctx.request.body;

        try {
            const account = await AccountModel.GetUserByName(name)
            if(!account) {
               const md5Pwd = tools.md5sum(password);
               const res = await AccountModel.CreateUserByName(name, md5Pwd)
               console.log(res)
                ctx.body = {
                    status: 1,
                    success: '注册成功',
                    open_id: res.openid,
                    name: res.name
                }
            } else {
                ctx.body = {
                    status: 0,
				    success: '账号已经存在',
                }
            }
            return next();
        } catch (e) {
            throw e;
        }
    }

    // 登录
    static async login(ctx, next) {
        const {
            name,
            password
        } = ctx.request.body;

        try {
            const account = await AccountModel.GetUserByName(name)
            if(!account) {
                ctx.body = {
                    status: 0,
                    success: '没有此用户信息'
                }
            } else {
                const md5Pwd = tools.md5sum(password);
                if(password !== account.password && md5Pwd !== account.password) {
                    ctx.body = {
                        status: 2,
                        success: '登录信息密码不对'
                    }
                } else {
                    // 先去查找redis 根据openid 有没有token
                    let token = await redis.getUserAccessToken(account.openid)
                    if(!token) {
                        token = tools.GenerateAccessToken(account)
                    }
                    ctx.body = {
                        status: 1,
                        success: 'login success',
                        data: {
                            access_token: token,
                            name: account.name,
                            openid: account.openid
                          }
                    }
                }
            }
            return next();
        } catch (e) {
            throw e;
        }
    }
}

module.exports = AccountHandler;