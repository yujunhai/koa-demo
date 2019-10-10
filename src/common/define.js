"use strict";

const env = process.env.NODE_ENV || 'development';
module.exports = {
  redisPrefix: {
    ACCESS_TOKEN_KEY_PREFIX: "AT:"
  },
  serverIp: env === 'development' ? 'http://192.168.0.50:3030' : 'http://yrbing.com.cn:3030'
};
