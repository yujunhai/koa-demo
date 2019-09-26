__注：此项目纯属个人瞎搞，不用于任何商业用途。__

to run this project,mongo and redis should be installed first, then open three terminal and input:
mongod
redis-server
redis-cli (config set protected-mode no)

## 后台技术栈
koa + mongodb + mongoose + nodejs + redis


## 目标功能


- [x] import and export support （babel-register 和.babelrc）-- ok
- [x] 登录、注册 -- ok
- [x] 文章新增,修改发布查询,发布 业务逻辑-- ok
- [x] 修改密码 -- ok
- [x] 用户信息,管理员权限验证,超级管理员 -- ok
- [x] 上传图片 -- ok
- [x] 日志输出 -- ok
- [x] 部署上线 -- ok
- [x] 跨域问题 -- ok
- [x] 返回字段的优化 -- ok  统一返回 status:200 data: msg:  data  status 400 代表传递参数有问题