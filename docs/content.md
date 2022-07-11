## 项目结构

```
src
├── components // 组件目录
├── pages // 页面目录
│   ├── 404.tsx // 404 异常
│   ├── index.tsx // 首页
│   ├── repository // 开源项目
│   │   └── [rid].tsx // 项目详情
│   ├── search // 搜索结果
│   │   └── result.tsx // 搜索结果展示页
│   └── user // 用户
│   └── login.tsx // 登录
├── services // 请求接口的函数
│   ├── base.ts // 基础函数
│   ├── home.ts // 请求首页
│   ├── login.ts // 请求登录
│   └── repository.ts // 请求项目详情
├── styles // 自定义全局样式（不用）
├── typing // 数据类型
└── utils // 工具函数
├── api.ts // 生成请求 URL
├── day.ts // 处理时间
├── qs-stringify.ts // 处理请求参数
└── util.ts // 其它
```

## 开发前

接口文档：https://local.api.hellogithub.com/docs#/

具体需求开发时建议将代码，拆分放到对应的目录中：

- 组件：`components` 目录
- 页面：`page` 目录
- 定义数据：`typing` 目录
- 请求：`services` 目录

## 开发成

在完成功能的前提下，进行自测。

需要检查代码格式，并尝试解决力所能及的**告警**。在本地执行命令：

- `yarn lint:fix`
- `yarn lint`
- `yarn typecheck`

## 提交代码

第一次提交代码，需要通过 PR 方式提交。成功合并后 @521xueweihan 邀请您成为「Geese」项目成员，请注意查收 GitHub 的通知邮件。

后面提交代码，可以「自行创建分支」或者在「认领需求时自动的创建的分支」进行开发。

## 提交代码后

请注意 **issues** 和 **pr** 状态更新，我会及时认证检查代码后合并分支、反馈问题和优化建议。

## 最后

很开心和您一起构建「Geese」希望您因为**热爱**贡献代码，并有所收获。
