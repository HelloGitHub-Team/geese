import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { GoClippy, GoLink, GoPlay } from 'react-icons/go';

import { CodeRender } from '@/components/mdRender/MDRender';
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
      <Seo title={`OneFile: ${onefile.name} 源码`} />
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
                    <div className='flex gap-1 pl-2  md:hidden'>
                      {onefile.demo_url ? (
                        <a
                          className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                          href={onefile.demo_url}
                          target='_blank'
                          rel='noreferrer'
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
                        target='_blank'
                        rel='noreferrer'
                      >
                        <GoLink className='mr-1' size={14} />
                        访问
                      </a>
                      <span
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        onClick={() => handleCopy(onefile)}
                      >
                        <GoClippy className='mr-1' size={14} />
                        复制
                      </span>
                    </div>
                  </div>
                  <div className='hidden gap-2 text-sm text-gray-400 md:flex'>
                    {onefile.demo_url ? (
                      <Link href={onefile.demo_url}>
                        <a
                          className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <GoPlay className='mr-1' size={14} />
                          试玩
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    <Link href={onefile.repo_url}>
                      <a
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <GoLink className='mr-1' size={14} />
                        访问
                      </a>
                    </Link>
                    <span
                      className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                      onClick={() => handleCopy(onefile)}
                    >
                      <GoClippy className='mr-1' size={14} />
                      复制
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <CodeRender
            lanuage={onefile.language.toLowerCase()}
            code={onefile.source_code}
          />
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
