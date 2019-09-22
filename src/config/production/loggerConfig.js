'use strict';

var koaBunyanLogger = require('koa-bunyan-logger');
var bunyan = koaBunyanLogger.bunyan;

module.exports = {
    name: 'myapp',
    level: 'debug',
    serializers: bunyan.stdSerializers,
    streams: [
      {
          type: 'file',
          // path: path.join('/usr/src/app/', 'logs/log-%Y-%m-%d.log'),
          path: `${process.cwd()}/logs/log-${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}.log`,
          period: '1d',          // daily rotation
          totalFiles: 100,       // keep 10 back copies
          rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
          threshold: '100m',     // Rotate log files larger than 10 megabytes
          totalSize: '200m',     // Don't keep more than 20mb of archived log files
          gzip: false            // Compress the archive log files to save space
      }]
  };