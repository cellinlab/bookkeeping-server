'use strict'

exports.mysql = {
  // 单数据库信息配置
  client: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'password',
    database: 'mysql',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
