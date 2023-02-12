'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add (params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list (params) {
    const { app } = this;
    try {
      const result = await app.mysql.select('bill', {
        where: params,
        orders: [['id', 'desc']],
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async detail (params) {
    const { app } = this;
    try {
      const result = await app.mysql.get('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update (params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('bill', {
        ...params,
      }, {
        id: params.id,
        user_id: params.user_id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete (params) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('bill', {
        ...params,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async statistics (params) {
    const { app } = this;
    try {
      const result = await app.mysql.query('select * from bill where user_id = ? and date between ? and ? ',
        [
          params.user_id,
          params.start_date,
          params.end_date,
        ]
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
