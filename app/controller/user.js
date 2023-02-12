'use strict';

const Controller = require('egg').Controller;

const defaultAvatar = 'https://p3-passport.byteimg.com/img/user-avatar/69eb877a7c7492fd3c1c237c9eb5345c~100x100.awebp';

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

  async logIn () {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    const userInfo = await ctx.service.user.getUserByName(username);

    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }

    if (userInfo && userInfo.password !== password) {
      ctx.body = {
        code: 500,
        msg: '密码错误',
        data: null,
      };
      return;
    }

    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    }, app.config.jwt.secret);

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }

  async tokenCheck () {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;

    const decode = await app.jwt.verify(token, app.config.jwt.secret);

    ctx.body = {
      code: 200,
      msg: 'token校验成功',
      data: {
        ...decode,
      },
    };
  }

  async getUserInfo () {
    const { ctx, app } = this;

    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);

    const userInfo = await ctx.service.user.getUserByName(decode.username);

    ctx.body = {
      code: 200,
      msg: '获取用户信息成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar || defaultAvatar,
        slogan: userInfo.slogan,
      },
    };
  }

  async updateUserInfo () {
    const { ctx, app } = this;
    const {
      slogan = '',
      avatar = '',
    } = ctx.request.body;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      const userInfo = await ctx.service.user.getUserByName(decode.username);

      const result = await ctx.service.user.updateUser({
        ...userInfo,
        slogan,
        avatar,
      });

      ctx.body = {
        code: 200,
        msg: '更新用户信息成功',
        data: {
          id: user_id,
          slogan,
          username: userInfo.username,
          avatar,
        }
      };
    } catch (e) {
      console.log('err', e);
      ctx.body = {
        code: 500,
        msg: '更新用户信息失败',
        data: null,
      };
    }
  }
}

module.exports = UserController;
