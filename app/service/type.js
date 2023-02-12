'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async add (params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('type', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list (params) {
    const { app } = this;
    try {
      const result = await app.mysql.select('type', {
        where: params,
        orders: [['id', 'desc']],
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
      const result = await app.mysql.delete('type', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = TypeService;
