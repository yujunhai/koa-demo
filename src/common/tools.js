'use strict';
import  *  as  jwt  from  'jsonwebtoken';
const crypto = require('crypto');

const { settingConfig } = require(ROOT + "/src/config/index.js");
const redis = require(ROOT + "/src/database/redis/index.js");

const tools = {
    md5sum: function (text) {
        return crypto.createHash('md5').update(text).digest('hex');
    },
    GenerateId: function (name) {
        return this.md5sum(name + Date.now().toString() + Math.random().toString());
    },
    GenerateAccessToken: function(user) {
        console.log(user)
      const token = jwt.sign(user.toJSON(), settingConfig.secret.sign, { expiresIn:  settingConfig.redis.accessTokenExpireIn});
      redis.saveUserAccessToken(user.openid, token)
      return token;
    }
}

module.exports = tools