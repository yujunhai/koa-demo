'use strict';

const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	name: { type: String, default: '', trim: true, maxlength: 400 },
	password: String,
	openid: String,
	updated_at: {type: Date, default: Date.now()},
	created_at: {type: Date, default: Date.now()}
})

AccountSchema.index({openid: 1});


/**
 * Validations
 */

// AccountSchema.path('name').required(true, 'Account name cannot be blank');

AccountSchema.statics = {
	CreateUserByName: async function(name, password) {
		try {
            let openid = tools.GenerateId(name);
            let tnow = Date.now();
            let user = {
                openid: openid,
                name: name,
                password: password,
                updated_at: tnow,
                created_at: tnow,
            };
            await this.create(user);
            return user;
        } catch(e) {
            console.log(e)
            throw(e);
        }
	},
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
	GetUsers: async function(limit, offset) {
        try {
            let users = await this.find().limit(limit).skip(offset).sort('-created_at');
            return users;
        } catch(e) {
            throw(e);
        }
	},
	
	UpdatePassword: async (openid, password)=> {
        try {
            let user = await this.update(
                {openid: openid},
                {$set: {password: password,updated_at:Date.now()}}
            );
            return user;
        } catch(e) {
            throw(e);
        }
    },

}

mongoose.model('Account', AccountSchema);