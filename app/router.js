'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/', controller.home.index);

  const _jwt = middleware.jwtValidate(app.config.jwt.secret);

  // user
  router.post('/api/user/signin', controller.user.signIn);
  router.post('/api/user/login', controller.user.logIn);
  router.get('/api/user/tkcheck', _jwt, controller.user.tokenCheck);
};
