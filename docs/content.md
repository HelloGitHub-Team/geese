## 开发前

首先，项目用的是 yarn 安装可自行搜索，安装完成后通过 `yarn set version v1.22.19` 命令设置版本号。

然后，要把「Geese」项目在本地跑起来，详细步骤如下：

1. 克隆项目：`git clone git@github.com:HelloGitHub-Team/geese.git`
2. 安装依赖：`yarn install`
3. 运行项目：`yarn dev`
4. 浏览器访问：`http://localhost:3000/`

启动后可能会遇到的问题：

1. 跨域问题：请检查前端服务启动端口为：`3000`、host 为 `localhost`、`127.0.0.1`
2. 图片无法展示：在本地 hosts 文件末尾添加一行 `127.0.0.1 dev.hg.com`，随后访问 `http://dev.hg.com:3000/`
3. 登陆状态：找 @521xueweihan 拿到测试环境登陆的 token 后，手动修改浏览器 LocalStorage 的 item 添加 Authorization: token
4. 如果 build 时机器卡死，可以通过 yarn 设置并发数来解决：`yarn config set cloneConcurrency 1`

**技术栈**

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/zh-CN)
- 脚手架：[ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter)
- 组件样式：[hyperui](https://github.com/markmead/hyperui)

最后，附上接口文档：https://hg-api.lcl101.cn/docs#

将项目跑起来后，可以在本地把玩一番，觉得有意思的话就[点击](https://github.com/orgs/HelloGitHub-Team/projects/1/views/1)查看待认领的需求，找到自己感兴趣的功能、Bug、待优化后，在对应的 issues 下告知 @521xueweihan 「认领任务」再进行开发，**防止重复开发**。

## 开发中

因为是协同开发，所以 `main` 分支可能一直在更新，每次开发前需要拉取最新的代码，以保证是基于最新的 `main` 分支开发。

在开发具体的需求时，要将代码拆分到对应的目录中：

- 组件：`components` 目录
- 页面：`page` 目录
- 定义数据：`types` 目录
- 请求：`services` 目录

在完成 功能开发/Bug 修复后，需要进行自测、检查代风格、提高代码复用等。

最后，在本地执行下述命令，并尝试解决力所能及的**告警**。：

- `yarn lint:fix`
- `yarn lint`
- `yarn typecheck`

## 开发后

获取最新的 `main` 分支代码，在本地解决冲突。

第一次提交代码，需要通过 PR 方式提交代码。

你的代码成功合并后，@521xueweihan 会邀请您成为「Geese」项目成员，请注意查收 GitHub 的通知邮件。

后面提交代码，可以「自行创建分支」或者在「认领需求时自动创建的分支」进行开发。

提交完代码后，请注意查收本项目的 **issues** 和 **pr** 通知，因为我会查看提交的代码后，进行问题反馈和优化建议。

## 最后

很开心和您一起构建「Geese」，希望您在贡献代码过程中也有所收获。
