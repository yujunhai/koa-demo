const redis = require("redis");
const { settingConfig } = require(ROOT + "/src/config/index.js");
const define = require(ROOT + "/src/common/define.js");

global.redisCli = redis.createClient(settingConfig.redis.options);
redisCli.on("error", function(error) {
  console.log(error);
});

const { promisify } = require("util");

let getSync = promisify(redisCli.get).bind(redisCli),
  setSync = promisify(redisCli.set).bind(redisCli),
  delSync = promisify(redisCli.del).bind(redisCli),
  expireSync = promisify(redisCli.expire).bind(redisCli),
  hgetSync = promisify(redisCli.hget).bind(redisCli),
  hsetSync = promisify(redisCli.hset).bind(redisCli),
  hdelSync = promisify(redisCli.hdel).bind(redisCli);

module.exports = {
  getSync: getSync,
  setSync: setSync,
  delSync: delSync,
  expireSync: expireSync,
  hgetSync: hgetSync,
  hsetSync: hsetSync,
  hdelSync: hdelSync,
  /****************************************/
  saveUserAccessToken: async function(openid, accessToken) {
    if (!openid || !accessToken) throw 'error_code.E_REDIS_NULL_PARAM';
    await setSync(
      define.redisPrefix.ACCESS_TOKEN_KEY_PREFIX + openid,
      accessToken,
      "EX",
      settingConfig.redis.accessTokenExpireIn
    );
  },

  getUserAccessToken: async function(openid) {
    if (!openid) throw 'error_code.E_REDIS_NULL_PARAM';
    return await getSync(define.redisPrefix.ACCESS_TOKEN_KEY_PREFIX + openid);
  },

  delUserAccessToken: async openid => {
    if (!openid) throw 'error_code.E_REDIS_NULL_PARAM';
    await delSync(define.redisPrefix.ACCESS_TOKEN_KEY_PREFIX + openid);
  }
};
