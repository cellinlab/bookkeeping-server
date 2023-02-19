'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async add () {
    const { ctx, app } = this;

    const { name, pay_type } = ctx.request.body;

    if (!name || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      const result = await ctx.service.type.add({
        name,
        pay_type,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '添加消费类型成功',
        data: null,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '服务器错误',
        data: null,
      };
    }
  }

  async list () {
    const { ctx, app } = this;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      const result = await app.mysql.query(`SELECT * FROM \`type\` WHERE \`user_id\` = 0 OR  \`user_id\` = ${user_id}`);

      ctx.body = {
        code: 200,
        msg: '获取消费类型列表成功',
        data: result,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '服务器错误',
        data: null,
      };
    }
  }

  async delete () {
    const { ctx, app } = this;

    const { id } = ctx.request.body;

    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      const result = await ctx.service.type.delete({id, user_id});

      ctx.body = {
        code: 200,
        msg: '删除消费类型成功',
        data: null,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '服务器错误',
        data: null,
      };
    }
  }
}

module.exports = TypeController;
