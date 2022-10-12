import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { GoClippy, GoLink, GoPlay } from 'react-icons/go';

import MDRender from '@/components/mdRender/MDRender';
import message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getOnefileContent } from '@/services/article';
import { numFormat } from '@/utils/util';

import { OneFileProps, OneItem } from '@/types/article';

const OneFileDetailPage: NextPage<OneFileProps> = ({ onefile }) => {
  const handleCopy = (onefile: OneItem) => {
    const text = onefile.source_code;
    if (copy(text)) {
      message.success('源码已复制，粘贴到文件中即可运行！');
    } else message.error('复制失败');
  };

  return (
    <>
      <Seo title='HelloGitHub 一个文件的开源项目' />
      <div className='relative pb-6'>
        <Navbar middleText='OneFile' endText='源码'></Navbar>

        <div className='my-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
          <div className='text-normal mb-4  dark:bg-gray-800 dark:text-gray-300'>
            <div className='whitespace-pre-wrap rounded-lg border bg-white p-2 font-normal leading-8 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
              <article className='py-2 px-3'>
                <div className='text-color-primary leading-snug dark:text-gray-300'>
                  {onefile.name}：{onefile.suggestions}
                </div>

                <div className='truncate pt-1 text-sm text-gray-400'></div>
                <div className='flex items-center pt-2'>
                  <div className='flex shrink grow flex-wrap items-center overflow-x-hidden text-sm text-gray-400'>
                    <span>作者 {onefile.author}</span>
                    <span className='px-1'>·</span>
                    <span>主语言 {onefile.language}</span>
                    <span className='px-1'>·</span>
                    {onefile.package ? (
                      <span>有依赖</span>
                    ) : (
                      <span>无依赖</span>
                    )}
                    <span className='px-1'>·</span>
                    {numFormat(onefile.uv_count, 1, 1000)} 次查看
                    <div className='flex pl-2 md:hidden'>
                      {onefile.demo_url ? (
                        <a
                          className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                          href={onefile.repo_url}
                          target='__blank'
                        >
                          <GoPlay className='mr-1' size={14} />
                          试玩
                        </a>
                      ) : (
                        <></>
                      )}

                      <a
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        href={onefile.repo_url}
                        target='__blank'
                      >
                        <GoLink className='mr-1' size={14} />
                        访问
                      </a>
                      <a
                        className='ml-1 flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        onClick={() => handleCopy(onefile)}
                        target='__blank'
                      >
                        <GoClippy className='mr-1' size={14} />
                        复制
                      </a>
                    </div>
                  </div>
                  <div className='hidden text-sm text-gray-400 md:flex'>
                    {onefile.demo_url ? (
                      <a
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        href={onefile.repo_url}
                        target='__blank'
                      >
                        <GoPlay className='mr-1' size={14} />
                        试玩
                      </a>
                    ) : (
                      <></>
                    )}
                    <a
                      className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                      href={onefile.repo_url}
                      target='__blank'
                    >
                      <GoLink className='mr-1' size={14} />
                      访问
                    </a>
                    <a
                      className='ml-1 flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                      onClick={() => handleCopy(onefile)}
                      target='__blank'
                    >
                      <GoClippy className='mr-1' size={14} />
                      复制
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <MDRender className='markdown-body'>
            {`\`\`\`${onefile.language.toLowerCase()}\n${
              onefile.source_code
            }\n\`\`\``}
          </MDRender>
        </div>
      </div>
      <ToTop />
    </>
  );
};

export default OneFileDetailPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const oid = query['oid'] as string;
  const data = await getOnefileContent(ip, oid);
  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        onefile: data.data,
      },
    };
  }
};
