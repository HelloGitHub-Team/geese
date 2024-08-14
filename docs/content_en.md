## Before Development

Firstly, the project utilizes yarn for package installation, which you can search for and install on your own. After installation is complete, set the version number with the command `yarn set version v1.22.19`.

Next, to get the 'Geese' project running locally, follow these detailed steps:

1. Clone the project: `git clone git@github.com:HelloGitHub-Team/geese.git`
2. Install dependencies: `yarn install`
3. Run the project: `yarn dev`
4. Access in the browser: `http://localhost:3000/`

Potential issues you may encounter after starting up:

1. CORS issue: Please check that the front-end service is started on port `3000` with the host as `localhost` or `127.0.0.1`.
2. Images not displaying: Add `127.0.0.1 dev.hg.com` to the end of your local hosts file, then access `http://dev.hg.com:3000/`.
3. Login status: Obtain a test environment login token from @521xueweihan, then manually add an Authorization: token item to the browser's LocalStorage.
4. If the machine freezes during build, you can resolve this by setting the concurrency number with yarn: `yarn config set cloneConcurrency 1`.

**Tech Stack**

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/zh-CN)
- Scaffold: [ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter)
- Component styles: [hyperui](https://github.com/markmead/hyperui)

Finally, find the API documentation here: [API Docs](https://frp.hellogithub.com/docs#)

After getting the project running, you can play around with it locally. If you find it interesting, [click here](https://github.com/orgs/HelloGitHub-Team/projects/1/views/1) to check out the unclaimed requirements, find a feature, bug, or optimization that interests you, and then let @521xueweihan know 'claim the task' under the corresponding issues before starting development to **prevent duplicate development**.

## During Development

Since this is collaborative development, the `main` branch may be continuously updated. Before each development session, you need to pull the latest code to ensure you are developing based on the most recent `main` branch.

When developing specific requirements, split the code into corresponding directories:

- Components: `components` directory
- Pages: `pages` directory
- Define data: `types` directory
- Requests: `services` directory

After completing feature development/bug fixes, you need to perform self-testing, check code style, and improve code reusability.

Finally, execute the following commands locally and try to resolve any **warnings** you can:

- `yarn lint:fix`
- `yarn lint`
- `yarn typecheck`

## After Development

Get the latest `main` branch code and resolve conflicts locally.

For your first code submission, you need to submit it via a PR (Pull Request).

After your code is successfully merged, @521xueweihan will invite you to become a member of the 'Geese' project. Please check your GitHub notification emails.

For subsequent code submissions, you can develop in a 'self-created branch' or a branch automatically created when 'claiming a requirement.'

After submitting your code, please pay attention to the project's **issues** and **prs** notifications because I will provide feedback and optimization suggestions after reviewing the submitted code.

## Finally

I am very happy to build 'Geese' with you and hope that you also gain something from the process of contributing code.
