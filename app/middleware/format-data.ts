export default () => {
    return async function formatData(ctx, next) {
        await next();
        switch (Object.prototype.toString.call(ctx.body)) {
            case '[object Object]':
                ctx.body = {
                    data: Object.assign({}, ctx.body),
                    success: true,
                    msg: 'OK'
                };
                break;

            case '[object Array]':
                ctx.body = {
                    data: Object.assign([], ctx.body),
                    success: true,
                    msg: 'OK'
                };
                break;

            case '[object String]':
                ctx.body = {
                    msg: ctx.body,
                    success: false
                };
                break;

            default:
                break;
        }
    };
};
