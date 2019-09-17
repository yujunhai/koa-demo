const mongoose = require("mongoose");
const { mongoConfig } = require("../../config");
const util = require("util");
mongoose.Promise = global.Promise;
const db = mongoose.connection;

var connStr = "";
if (!mongoConfig.auth.username) {
  connStr = util.format(
    "%s:%d/%s",
    mongoConfig.host,
    mongoConfig.port,
    mongoConfig.database
  );
} else {
  connStr = util.format(
    "%s:%s@%s:%d/%s/%s",
    mongoConfig.auth.username,
    mongoConfig.auth.password,
    mongoConfig.host,
    mongoConfig.port,
    mongoConfig.database
  );
}

console.log(connStr)

/**
 * 连接
 */
mongoose.connect("mongodb://" + connStr, mongoConfig.options);

/**
 * 连接成功
 */
db.on("connected", function() {
  console.log("Mongoose connection success to " + mongoConfig.host);
});

/**
 * 连接异常
 */
db.on("error", function(err) {
  console.log("Mongoose connection error: " + err);
});

/**
 * 连接断开
 */
db.on("disconnected", function() {
  console.log("Mongoose connection disconnected");
});

module.exports = mongoose;
