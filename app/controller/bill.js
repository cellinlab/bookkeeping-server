'use strict';

const moment = require('moment');

const Controller = require('egg').Controller;

class BillController extends Controller {
  async add () {
    const { ctx, app } = this;

    const {
      amount,
      type_id,
      type_name,
      pay_type,
      date,
      remark = '',
    } = ctx.request.body;

    if (!amount || !type_id || !type_name || !pay_type || !date) {
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

      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        pay_type,
        date: new Date(date),
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '添加账单成功',
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

    const {
      date,
      page = 1,
      page_size = 10,
      type_id = 'all',
    } = ctx.request.body;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      if (!decode) return;
      user_id = decode.id;

      const params = {
        user_id,
      };
      if (type_id !== 'all') {
        params.type_id = type_id;
      }
      const list = await ctx.service.bill.list(params);
      const _list = list.filter(item => {
        return moment(item.date).format('YYYY-MM') === date;
      });

      const listMap = _list.reduce((curr, item) => {
        const date = moment(item.date).format('YYYY-MM-DD');
        if (curr && curr.length && curr.findIndex(i => i.date == date) > -1) {
          const index = curr.findIndex(i => i.date == date);
          curr[index].list.push(item);
        }
        if (curr && curr.length && curr.findIndex(i => i.date == date) == -1) {
          curr.push({
            date,
            list: [item],
          });
        }
        if (!curr || !curr.length) {
          curr.push({
            date,
            list: [item],
          });
        }
        return curr;
      }, [])
      .sort((a, b) => moment(b.date) - moment(a.date));

      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      const __list = list.filter(item => {
        return moment(item.date).format('YYYY-MM') === date;
      });

      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += item.amount;
        }
        return curr;
      }, 0);

      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += item.amount;
        }
        return curr;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '获取账单列表成功',
        data: {
          list: filterListMap || [],
          total: Math.ceil(listMap.length / page_size),
          totalExpense,
          totalIncome,
        },
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

  async detail () {
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

      const result = await ctx.service.bill.detail({
        id,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '获取账单详情成功',
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

  async update () {
    const { ctx, app } = this;

    const {
      id,
      amount,
      type_id,
      type_name,
      pay_type,
      date,
      remark = '',
    } = ctx.request.body;

    if (!id || !amount || !type_id || !type_name || !pay_type || !date) {
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

      const result = await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        pay_type,
        date: new Date(date),
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '更新账单成功',
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

      const result = await ctx.service.bill.delete({
        id,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '删除账单成功',
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

  async statistics () {
    const { ctx, app } = this;

    const { date } = ctx.request.body;

    if (!date) {
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

      const params = {
        user_id,
        start_date: moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        end_date: moment(date).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
      };
      const list = await ctx.service.bill.statistics(params);

      const totalExpense = list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += item.amount;
        }
        return curr;
      }, 0);

      const totalIncome = list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += item.amount;
        }
        return curr;
      }, 0);

      let totalData = list.reduce((arr, item) => {
        const index = arr.findIndex((i) => i.type_id === item.type_id);
        
        if (index === -1) {
          arr.push({
            type_id: item.type_id,
            type_name: item.type_name,
            pay_type: item.pay_type,
            amount: item.amount,
          });
        }

        if (index > -1) {
          arr[index].amount += item.amount;
        }
        return arr;
      }, []);

      totalData = totalData.map((item) => {
        item.amount = item.amount.toFixed(2);
        return item;
      });


      ctx.body = {
        code: 200,
        msg: '获取统计数据成功',
        data: {
          total_expense: totalExpense,
          total_income: totalIncome,
          total_data: totalData,
        },
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

module.exports = BillController;
