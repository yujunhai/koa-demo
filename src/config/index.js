'use strict';
const env = process.env.NODE_ENV || 'development';
module.exports = {
    settingConfig: require(`./${env}/settingConfig`),
    loggerConfig: require(`./${env}/loggerConfig`),
    mongoConfig: require(`./${env}/mongoConfig`),
}

