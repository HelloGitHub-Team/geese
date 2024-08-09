import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GoClippy, GoLink, GoPlay } from 'react-icons/go';

import { NoPrefetchLink } from '@/components/links/CustomLink';
import { CodeRender } from '@/components/mdRender/MDRender';
import message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getOnefileContent } from '@/services/article';
import { getClientIP, numFormat } from '@/utils/util';

import { OneFileProps, OneItem } from '@/types/article';

const OneFileDetailPage: NextPage<OneFileProps> = ({ onefile }) => {
  const { t } = useTranslation('onefile');
  const handleCopy = (onefile: OneItem) => {
    const text = onefile.source_code;
    if (copy(text)) {
      message.success(t('code.copy_success'));
    } else message.error(t('code.copy_fail'));
  };

  return (
    <>
      <Seo title={t('code.title', { name: onefile.name })} />
      <div className='relative pb-6'>
        <Navbar middleText='OneFile' endText={t('code.nav')} />

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
                    <span>{t('code.author', { author: onefile.author })}</span>
                    <span className='px-1'>·</span>
                    <span>
                      {t('code.language', { language: onefile.language })}
                    </span>
                    <span className='px-1'>·</span>
                    <span>
                      {onefile.package ? t('code.package') : t('code.package')}
                    </span>
                    <span className='px-1'>·</span>
                    {t('code.read', {
                      num: numFormat(onefile.uv_count, 1, 1000),
                    })}
                    <div className='flex gap-1 pl-2 md:hidden'>
                      {onefile.demo_url && (
                        <a
                          className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                          href={onefile.demo_url}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <GoPlay className='mr-1' size={14} />
                          {t('code.play')}
                        </a>
                      )}

                      <a
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        href={onefile.repo_url}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <GoLink className='mr-1' size={14} />
                        {t('code.vite')}
                      </a>
                      <span
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        onClick={() => handleCopy(onefile)}
                      >
                        <GoClippy className='mr-1' size={14} />
                        {t('code.copy')}
                      </span>
                    </div>
                  </div>
                  <div className='hidden gap-2 text-sm text-gray-400 md:flex'>
                    {onefile.demo_url && (
                      <NoPrefetchLink href={onefile.demo_url}>
                        <a
                          className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <GoPlay className='mr-1' size={14} />
                          {t('code.play')}
                        </a>
                      </NoPrefetchLink>
                    )}
                    <NoPrefetchLink href={onefile.repo_url}>
                      <a
                        className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <GoLink className='mr-1' size={14} />
                        {t('code.vite')}
                      </a>
                    </NoPrefetchLink>
                    <span
                      className='flex cursor-pointer items-center justify-center rounded-md border py-0.5 px-1 hover:border-blue-500 hover:text-current active:!text-gray-400 dark:border-gray-700 md:hover:text-blue-500'
                      onClick={() => handleCopy(onefile)}
                    >
                      <GoClippy className='mr-1' size={14} />
                      {t('code.copy')}
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
  locale,
}) => {
  const ip = getClientIP(req);
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
        ...(await serverSideTranslations(locale as string, [
          'common',
          'onefile',
        ])),
      },
    };
  }
};
