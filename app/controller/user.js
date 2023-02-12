'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async signIn () {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '用户名或密码不能为空',
        data: null,
      };
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);

    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '用户名已存在',
        data: null,
      };
      return;
    }

    const defaultAvatar = 'https://p3-passport.byteimg.com/img/user-avatar/69eb877a7c7492fd3c1c237c9eb5345c~100x100.awebp';
    const result = await ctx.service.user.addUser({
      username,
      password,
      avatar: defaultAvatar,
      slogan: 'Love and peace.',
      create_time: new Date(),
    });

    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }
}

module.exports = UserController;
