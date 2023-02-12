'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mkdir = require('mkdir');

const Controller = require('egg').Controller;

class UploadController extends Controller {
  async upload () {
    const { ctx } = this;

    const file = ctx.request.files[0];

    let uploadDir = '';

    try {
      let f = fs.readFileSync(file.filepath);

      const day = moment(new Date()).format('YYYYMMDD');
      const dir = path.join(this.config.uploadDir, day);
      const time_stamp = moment(new Date()).format('YYYYMMDDHHmmss');

      mkdir.mkdirsSync(dir);
      uploadDir = path.join(dir, time_stamp + path.extname(file.filename));
      
      fs.writeFileSync(uploadDir, f);
    } catch (e) {
      console.log(e);
    } finally {
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: {
        url: uploadDir.replace(/app/g, '').replace(/\\/g, '/'),
      },
    };
  }
}

module.exports = UploadController;
