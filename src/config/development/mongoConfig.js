'use strict';

module.exports = {
    host: '127.0.0.1',
    port: 27017,
    database: 'test',
    auth: {
        username: '',
        password: ''
    },
    options: {
        auto_reconnect: true,
        poolSize: 100,
        useNewUrlParser: true,
        // disable auto create indexes
        autoIndex: false
    }
};