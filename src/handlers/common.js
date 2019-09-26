const fs = require("fs");
const define = require(ROOT + "/src/common/define.js");
class CommonHandler {
  // 上传文件--单个
  static async uplodFile(ctx, next) {
    try {
      const file = ctx.request.files[""]; // 获取上传文件
      // 创建可读流
      const reader = fs.createReadStream(file.path);
      let filePath = `${ROOT}/src/public/files/${file.name}`;
      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      const stream = reader.pipe(upStream);
      //   stream.on("finish", function(data) {
      //     ctx.body = "上传成功！";
      //   });
      ctx.body = {
        status: 200,
        msg: "上传成功",
        data: {
          url: `${define.serverIp}/${file.name}`
        }
      };
      return next();
    } catch (e) {
      throw e;
    }
  }

  static async uplodFiles(ctx, next) {
    try {
      const files = ctx.request.files[""]; // 获取上传文件
      let datas = []
      for (let file of files) {
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = `${ROOT}/src/public/files/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        const stream = reader.pipe(upStream);
        datas.push(`${define.serverIp}/${file.name}`)
      }
      ctx.body = {
        status: 200,
        msg: "上传成功",
        datas: datas
      };
      return next();
    } catch (e) {
      throw e;
    }
  }
}

module.exports = CommonHandler;
