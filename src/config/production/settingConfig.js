'use strict';

module.exports = {
    server: {
        port: 3033,
        host: '0.0.0.0'
    },
    secret: {
        sign: 'shared-secret'
    },
    redis: {
        options: {
            host: '0.0.0.0',
            port: '6379',
        },
        //access token's alive time
        accessTokenExpireIn: 60 * 100/*second*/
    },
}