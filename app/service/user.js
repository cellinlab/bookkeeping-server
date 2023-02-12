'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName (username) {
    const { app } = this;
    try {
      const user = await app.mysql.get('user', { username });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addUser (params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser (params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', {
        ...params,
      }, {
        id: params.id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
