import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

import ImageWithPreview from '../ImageWithPreview';
import { MDRender } from '../mdRender/MDRender';

import { RepositoryProps } from '@/types/repository';

const Tabs = ({ repo, t }: RepositoryProps) => {
  const [selectTab, setSelectTab] = useState<string>('summary');

  const tabClassName = (tabName: string) =>
    classNames('px-4 border-b cursor-pointer hover:text-blue-500', {
      'border-transparent': selectTab !== tabName,
      'border-current text-blue-500': selectTab === tabName,
    });

  const tabContent = () => {
    if (selectTab === 'summary') {
      return (
        <>
          {repo.image_url && (
            <div className='flex cursor-zoom-in justify-center pt-2'>
              <ImageWithPreview
                src={repo?.image_url}
                className='rounded-lg border border-gray-200 dark:border-none'
                alt='图片'
              />
            </div>
          )}
          <div className='w-full p-2 leading-8'>
            <MDRender>{repo.summary}</MDRender>
          </div>

          <div className='flex flex-row flex-wrap items-center pt-1'>
            {repo.volume_name && (
              <>
                <div className='mb-1 px-2 text-sm font-medium'>
                  {t('content.volume_label')}
                </div>
                <Link href={`/periodical/volume/${Number(repo.volume_name)}`}>
                  <a>
                    <div className='mb-1 mr-1 flex h-5 cursor-pointer items-center rounded-xl bg-blue-100 px-2.5 text-xs text-blue-500 hover:bg-blue-200 dark:bg-blue-500 dark:text-gray-100 dark:hover:bg-blue-700 lg:mr-2'>
                      {t('content.volume', { volume: repo.volume_name })}
                    </div>
                  </a>
                </Link>
              </>
            )}
            {repo.tags.length > 0 && (
              <>
                <div className='mb-1 px-2 text-sm font-medium'>
                  {t('content.tag_label')}
                </div>
                {repo.tags.map((item) => (
                  <Link href={`/tags/${item.tid}/`} key={item.tid}>
                    <a>
                      <div className='mb-1 mr-1 flex h-5 cursor-pointer items-center rounded-xl bg-blue-100 px-2.5 text-xs text-blue-500 hover:bg-blue-200 dark:bg-blue-500 dark:text-gray-100 dark:hover:bg-blue-700 lg:mr-2'>
                        {item.name}
                      </div>
                    </a>
                  </Link>
                ))}
              </>
            )}
          </div>
        </>
      );
    } else if (selectTab === 'code') {
      return (
        <div className='text-md w-full p-2 leading-7 subpixel-antialiased lg:text-lg'>
          <MDRender>{repo.code}</MDRender>
        </div>
      );
    }
  };

  return (
    <>
      <nav className='flex border-b border-gray-100 text-base font-medium leading-10 dark:border-gray-700 dark:text-gray-300'>
        <span
          className={tabClassName('summary')}
          onClick={() => setSelectTab('summary')}
        >
          {t('content.desc_tab')}
        </span>
        {repo.code && (
          <span
            className={tabClassName('code')}
            onClick={() => setSelectTab('code')}
          >
            {t('content.code_tab')}
          </span>
        )}
      </nav>
      {tabContent()}
    </>
  );
};

export default Tabs;
