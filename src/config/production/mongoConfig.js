'use strict';

module.exports = {
    host: '127.0.0.1',
    port: 27017,
    database: '',
    auth: {
        username: '',
        password: ''
    },
    options: {
        auto_reconnect: true,
        poolSize: 100,
        useNewUrlParser: true,
        // disable auto create indexes
        autoIndex: false,
        server: { 
            socketOptions: { 
                keepAlive: 1, 
                connectTimeoutMS: 30000 
            } ,
            reconnectTries:30,
            reconnectInterval:3000
        }, 
        replset: { 
            socketOptions: { 
                keepAlive: 1, 
                connectTimeoutMS: 30000 
            } 
        } 
    }
};