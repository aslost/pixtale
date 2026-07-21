<!-- BEGIN:nextjs-agent-rules -->
# 项目说明

这是一个web相册

# 注释规范

每个方法都要写是干什么的, 后端每个文件里面在 import 导包区域结尾换行后 写注释说明这个模块的作用, 一些复杂的代码，代码块也要写上注释

# 开发规范

代码包括变量组件名要尽量简短易读，保证可读性，不要过于冗余，做过多不必要的抽取封装，防御性判断降低代码可读性

# 后端规范
后端使用mvc分层, service返回类型必须显示的标记
当前用户id由context.js取出, 从api层传入service层, userId单独一个入参放最后一个，
入参类型放到entity/bo 结果类型放entity/vo 

# 前端规范
request里面接口入参返回使用后端的类型导入
非必要禁止乱封装组件
组件里面每一个state ref 等这些变量都写清楚用途


# 数据库位置

在 data/album.sqlite

<!-- END:nextjs-agent-rules -->
