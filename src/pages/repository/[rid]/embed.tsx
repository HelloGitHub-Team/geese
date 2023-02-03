import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { API_HOST, API_ROOT_PATH } from '@/utils/api';

const EmbedPage: NextPage = () => {
  const router = useRouter();
  const { rid } = router.query;

  const [theme, setTheme] = useState<string>('neutral');
  const [svgFile, setSVGFile] = useState<string>('');
  useEffect(() => {
    if (rid) {
      setSVGFile(`${API_HOST}${API_ROOT_PATH}/widgets/featured.svg?rid=${rid}`);
    }
  }, [rid]);

  const themeClassName = (themeName: string) =>
    classNames('px-2 py-1 text-xs', {
      'rounded-md': theme !== themeName,
      'text-white bg-blue-500 rounded-full': theme === themeName,
    });

  const handleTheme = (themeName: string) => {
    setTheme(themeName);
    setSVGFile(
      `${API_HOST}${API_ROOT_PATH}/widgets/featured.svg?rid=${rid}&theme=${themeName}`
    );
  };

  const handleCopy = () => {
    const pageURL = `https://hellogithub.com/repository/${rid}`;
    const text = `<a href="${pageURL}" target="_blank"><img src="${svgFile}" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>`;
    if (copy(text)) {
      message.success('代码已复制');
    } else message.error('复制失败');
  };

  return (
    <>
      <Seo title='HelloGitHub｜网站挂件' />
      <div className='relative pb-6'>
        <Navbar middleText='HelloGitHub 徽章'></Navbar>
        <div className='my-2 bg-white px-4 py-2 dark:bg-gray-800 md:rounded-lg'>
          <div className='my-4 text-xl font-bold '>星星之火</div>
          <div>
            <p className='my-4 '>
              使用 HelloGitHub 网站徽章不仅可以
              <strong>帮助宣传 HelloGitHub 社区</strong>还能为
              <strong>开源项目拉票</strong>，
              徽章不仅可以实时展示开源项目的点赞数，点击后还可以直达项目详情页进行点赞、评论、收藏等操作。
              重点是<strong>一键复制代码就能嵌入网页或开源项目首页</strong>
              ，无需额外的开发工作十分方便。
            </p>
            <div className='flex flex-col rounded-lg bg-gray-100 dark:bg-gray-700'>
              <div className='flex rounded-t-lg bg-gray-200 dark:bg-slate-900'>
                <div className='p-2'>
                  <div className='spac-x-3 flex cursor-pointer rounded-full bg-gray-50 dark:bg-gray-600'>
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
                {svgFile ? (
                  <img className='w-max-full items-center' src={svgFile} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className='h-4'></div>
        </div>
      </div>
    </>
  );
};

export default EmbedPage;
