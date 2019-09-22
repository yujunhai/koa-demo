'use strict';

module.exports = function () {
    return async function (ctx, next) {
        if (ctx.req.method === 'POST' || ctx.req.method === 'PUT') {
            if (typeof(ctx.request.body) === 'object') {
                ctx.args = ctx.request.body;
            } else {
                try {
                    ctx.args = JSON.parse(ctx.request.body);
                }
                catch (error) {

                }
            }
        }
        else {
            ctx.args = ctx.query;
        }

        ctx.log.info('incoming request, url:'+ctx.request.url + ', params:' + JSON.stringify(ctx.args));

        // console.log('incoming request, reqid:' + ctx.request.reqid + ', url:'+ctx.request.url + ', params:' + JSON.stringify(ctx.args));


        await next();
    }
};
