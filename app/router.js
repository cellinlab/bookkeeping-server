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
  router.get('/api/user/info', _jwt, controller.user.getUserInfo);
  router.post('/api/user/update', _jwt, controller.user.updateUserInfo);

  // upload
  router.post('/api/upload', _jwt, controller.upload.upload);

  // bill
  router.post('/api/bill/add', _jwt, controller.bill.add);
  router.post('/api/bill/list', _jwt, controller.bill.list);
  router.post('/api/bill/detail', _jwt, controller.bill.detail);
  router.post('/api/bill/update', _jwt, controller.bill.update);
  router.post('/api/bill/delete', _jwt, controller.bill.delete);
  router.post('/api/bill/statistics', _jwt, controller.bill.statistics);

  // type
  router.post('/api/type/list', _jwt, controller.type.list);
  router.post('/api/type/add', _jwt, controller.type.add);
  router.post('/api/type/delete', _jwt, controller.type.delete);
};
