'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // user
  router.post('/api/user/signin', controller.user.signIn);
  router.post('/api/user/login', controller.user.logIn);
  router.get('/api/user/tkcheck', controller.user.tokenCheck);
};
