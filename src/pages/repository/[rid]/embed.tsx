import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import message from '@/components/message';
import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { claimRepo, getClaimRepoInfo } from '@/services/repository';
import { API_HOST, API_ROOT_PATH } from '@/utils/api';

const EmbedPage: NextPage = () => {
  const router = useRouter();
  const { rid } = router.query;
  const { isLogin, login, userInfo } = useLoginContext();
  const [readmeFilename, setReadmeFilename] = useState('README.md');

  const [isLoading, setIsLoading] = useState(false); // 状态：是否在提交中
  const [theme, setTheme] = useState<string>('neutral');
  const [svgFile, setSVGFile] = useState<string>('');
  useEffect(() => {
    if (rid) {
      const url = new URL(`${API_HOST}${API_ROOT_PATH}/widgets/recommend.svg`);
      url.searchParams.set('rid', rid as string);
      if (userInfo?.uid) {
        url.searchParams.set('claim_uid', userInfo.uid);
      }
      setSVGFile(url.toString());
    }
  }, [rid, userInfo]);

  const themeClassName = (themeName: string) =>
    classNames('px-2 py-1 text-xs', {
      'rounded-md': theme !== themeName,
      'text-white bg-blue-500 rounded-full': theme === themeName,
    });

  const handleTheme = (themeName: string) => {
    setTheme(themeName);
    if (svgFile) {
      const url = new URL(svgFile);
      url.searchParams.set('theme', themeName);
      setSVGFile(url.toString());
    }
  };

  const handleCopy = () => {
    if (!isLogin) {
      return login();
    }
    const pageURL = `https://hellogithub.com/repository/${rid}`;
    const text = `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>`;
    if (copy(text)) {
      message.success('代码已复制');
    } else message.error('复制失败');
  };

  // 更新输入框状态的函数
  const handleInputChange = (event: any) => {
    console.log(event.target.value);
    if (event.target.value === '') {
      setReadmeFilename('README.md');
    } else {
      setReadmeFilename(event.target.value);
    }
  };

  const handleButtonSubmit = async (rid: string) => {
    if (!isLogin) {
      return login();
    }
    if (!readmeFilename.toLowerCase().includes('readme')) {
      return Message.error('请输入正确的 README 文件名！');
    }
    const info_res = await getClaimRepoInfo(rid);
    if (!info_res.success) {
      return Message.error('该项目还未被收录，请先提交项目。');
    }
    if (info_res.data.is_claimed) {
      return Message.error('该仓库已被认领！');
    }
    const urlToCheck = `https://api.github.com/repos/${info_res.data.full_name}/contents/${readmeFilename}`;
    setIsLoading(true); // 设置加载状态为 true，禁用按钮
    // 发送GET请求到URL
    fetch(urlToCheck)
      .then((response) => response.json())
      .then(async (data) => {
        const base64EncodedString = data.content;
        const decodedString = Buffer.from(
          base64EncodedString,
          'base64'
        ).toString('utf8');
        // 检查响应的字段
        if (
          decodedString.includes('Featured｜HelloGitHub') &&
          decodedString.includes(`https://hellogithub.com/repository/${rid}`) &&
          decodedString.includes(userInfo?.uid as string)
        ) {
          // 如果响应包含字段，发送POST请求到后台
          const res = await claimRepo(rid, readmeFilename);
          if (res.success) {
            return Message.success('恭喜你！已提交成功，请等待社区确认。');
          } else {
            return Message.error(res.message as string);
          }
        } else {
          return Message.error('认证失败！请确认 README 文件名和代码完整性。');
        }
      })
      .catch(() => {
        return Message.error('认证失败！请检查网络和 README 文件名。');
      })
      .finally(() => {
        setIsLoading(false); // 设置加载状态为 false，启用按钮
      });
  };

  return (
    <>
      <Seo title='HelloGitHub 徽章计划: 帮助推广和运营开源项目' />
      <div className='relative pb-6'>
        <Navbar middleText='HelloGitHub 徽章' />
        <div className='my-2 bg-white px-4 py-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='mt-2'>
            <h2 className='mb-4 text-center text-2xl font-semibold'>
              加入 HelloGitHub 徽章计划
            </h2>
            <p className='mb-4 text-gray-700 dark:text-gray-200'>
              作为开源社区的一份子，你的开源项目正影响着世界。现在，通过佩戴
              HelloGitHub 徽章，向世界展示项目得到的社区认可和推荐，
              <strong>彰显开源项目荣耀</strong>。同时，
              <strong>认领你的开源项目</strong>，享受社区带来的更多推荐和权益。
            </p>
            <div className='mb-4 flex flex-col rounded-lg bg-gray-100 dark:bg-gray-700'>
              <div className='flex rounded-t-lg bg-gray-200 dark:bg-slate-900'>
                <div className='p-2'>
                  <div className='flex cursor-pointer rounded-full bg-gray-50 dark:bg-gray-600'>
                    <div
                      className={themeClassName('neutral')}
                      onClick={() => handleTheme('neutral')}
                    >
                      普通
                    </div>
                    <div
                      className={themeClassName('dark')}
                      onClick={() => handleTheme('dark')}
                    >
                      暗黑
                    </div>
                  </div>
                </div>
                <div className='shrink grow'></div>
                <div className='p-2'>
                  <div
                    onClick={handleCopy}
                    className='cursor-pointer rounded-md bg-gray-50 px-2 py-1 text-xs font-medium dark:bg-gray-600'
                  >
                    复制代码
                  </div>
                </div>
              </div>

              <div className='my-8 flex justify-center'>
                {svgFile && (
                  <img className='w-max-full items-center' src={svgFile} />
                )}
              </div>
            </div>
            <div className='mx-auto mb-6 max-w-4xl text-left'>
              <ul className='ml-6 list-disc'>
                <li className='mb-2'>
                  <strong>社区认可：</strong> 徽章代表你的项目已通过 HelloGitHub
                  社区的严格筛选，并获得推荐。
                </li>
                <li className='mb-2'>
                  <strong>增加曝光：</strong>
                  完成认领（佩戴徽章）将获得更多推荐流量，吸引潜在用户和贡献者的目光。
                </li>
                <li className='mb-2'>
                  <strong>互动机会：</strong>
                  用户可通过徽章快速了解项目，并通过点赞、评论、收藏，增强社区互动。
                </li>
                <li className='mb-2'>
                  <strong>反馈积累：</strong>
                  收集来自广大用户的真实反馈，持续优化你的项目。
                </li>
                <li className='mb-2'>
                  <strong>作者标识：</strong>
                  认证后发布评论将显示醒目的标识，并获得评论置顶。
                </li>
              </ul>
            </div>
            <div className='mx-auto mb-6 max-w-4xl text-left'>
              <h3 className='mb-4 text-lg font-medium'>如何认领开源项目</h3>
              <ol className='ml-6 list-decimal'>
                <li className='mb-4'>
                  <div className='flex flex-wrap items-center'>
                    <span>确认您的项目已被 HelloGitHub 社区收录，点击</span>
                    <div
                      onClick={handleCopy}
                      className='cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-sm font-medium dark:bg-gray-700 dark:text-white md:mx-2'
                    >
                      复制代码
                    </div>
                    <span>按钮。</span>
                  </div>
                </li>
                <li className='mb-4'>
                  在您项目 README 文件中找到合适的位置，
                  <strong>粘贴</strong>已复制的代码，并提交更改。
                </li>
                <li className='mb-4'>
                  <div className='flex items-center'>
                    <div className='w-fit'>
                      <span>完成徽章佩戴，输入您的项目 README 文件名：</span>
                      <input
                        onChange={handleInputChange}
                        type='text'
                        className='ml-2 mt-1 max-w-[140px] flex-grow rounded-md border border-gray-300 bg-white px-2 py-1 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 dark:text-gray-500 md:mt-0 md:px-3 md:py-1 md:text-base'
                        placeholder='README.md'
                      />
                      <Button
                        onClick={() => handleButtonSubmit(rid as string)}
                        className='ml-2 py-1'
                        disabled={isLoading}
                      >
                        {isLoading ? '正在提交...' : '提交'}
                      </Button>
                    </div>
                  </div>
                </li>
                <li>等待社区认证后，您将享受社区带来更多推荐和权益。</li>
              </ol>
            </div>
            <div className='mx-auto max-w-4xl text-left'>
              <h3 className='mb-4 text-lg font-medium'>可能遇到的问题</h3>
              <ul className='ml-6 list-disc space-y-2'>
                <li>
                  <strong>认证权限：</strong>
                  仅限于项目作者或拥有修改权限的成员。请确保您有足够的权限进行认领。
                </li>
                <li>
                  <strong>认证失败：</strong>
                  仅限社区已收录的项目。如果您的项目尚未被收录，请先提交您的项目。
                </li>
                <li>
                  <strong>每个项目只能认领一次：</strong>
                  认证后项目的认领者不可修改。请在操作前仔细检查所有信息。
                </li>
                <li>
                  <strong>需要帮助：</strong>
                  可通过微信联系我：xueweihan（备注：认领）。
                </li>
              </ul>
            </div>
          </div>
          <div className='h-4'></div>
        </div>
      </div>
    </>
  );
};

export default EmbedPage;
