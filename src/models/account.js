'use strict';

const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	name: { type: String, default: '', trim: true, maxlength: 400 },
	password: String,
	openid: String,
	updated_at: {type: Date, default: Date.now()},
    created_at: {type: Date, default: Date.now()},
    type: {type: String, default: 'normal'}   // 超级管理员super （默认只有一个就是Catherine）  管理员admin   新注册的用户都是normal
})

AccountSchema.index({openid: 1});


/**
 * Validations
 */

// AccountSchema.path('name').required(true, 'Account name cannot be blank');

AccountSchema.statics = {
    // 创建用户  注册用户
	CreateUserByName: async function(name, password) {
		try {
            let openid = tools.GenerateId(name);
            let user = {
                openid: openid,
                name: name,
                password: password
            };
            if(name === 'Catherine') {
                user.type = 'super'
            }
           const result =  await this.create(user);
            return result;
        } catch(e) {
            console.log(e)
            throw(e);
        }
    },
    // 通过用户名查找用户
	GetUserByName: async function(name) {
        try {
            let user = await this.findOne({
                name: name
            });

            return user;
        } catch(e) {
            throw(e);
        }
    },
    // 通过openid 查找用户
	GetUserByOpenid: async function(openid) {
        try {
            let user = await this.findOne({
                openid: openid
            });

            return user;
        } catch(e) {
            throw(e);
        }
    },
    // 获取所有用户 需要是super权限,admin 权限
	GetUsers: async function(limit, offset) {
        try {
            let users = await this.find().limit(limit).skip(offset).sort('-created_at');
            return users;
        } catch(e) {
            throw(e);
        }
    },
    
    // 权限修改  需要是super 权限
    UpdateType: async function(openid){
        try {
            let user = await this.update(
                {openid: openid},
                {$set: {type: 'admin',updated_at:Date.now()}}
            );
            return user;
        } catch(e) {
            throw(e);
        }
    },

	// 更新密码
	UpdatePassword: async function(openid, password) {
        try {
            let user = await this.updateOne(
                {openid: openid},
                {$set: {password: password,updated_at:Date.now()}}
            );
            console.log(user)
            return user;
        } catch(e) {
            throw(e);
        }
    }

}

mongoose.model('Account', AccountSchema);