'use strict';

module.exports = (secret) => {
  return async function jwtValidate (ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;
    if (token != 'null' && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret);
        await next();
      } catch (e) {
        console.log('err', e);
        ctx.status = 200;
        ctx.body = {
          code: 401,
          msg: 'token 失效，请重新登录',
          data: null,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
        data: null,
      };
      return;
    }
  };
};
