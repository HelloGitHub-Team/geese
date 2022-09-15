import classNames from 'classnames';
import { NextPage } from 'next';
import * as React from 'react';
import { useState } from 'react';

import MDRender from '../mdRender/MDRender';

import { RepositoryProps } from '@/types/reppsitory';

const Tabs: NextPage<RepositoryProps> = ({ repo }) => {
  const [selectTab, setSelectTab] = useState<string>('summary');

  const tabClassName = (tabName: string) =>
    classNames('p-4 -mb-px border-b cursor-pointer hover:text-blue-500', {
      'border-transparent': selectTab !== tabName,
      'border-current text-blue-500': selectTab === tabName,
    });

  const tabContent = () => {
    if (selectTab === 'summary') {
      return (
        <div className='text-md w-full p-2 leading-7 lg:text-lg'>
          <MDRender>{repo.summary}</MDRender>
        </div>
      );
    } else if (selectTab === 'code') {
      return (
        <div className='text-md w-full p-2 leading-7 lg:text-lg'>
          <MDRender>{repo.code}</MDRender>
        </div>
      );
    }
  };

  return (
    <>
      <nav className='flex border-b border-gray-100 text-base font-medium dark:border-gray-700'>
        <span
          className={tabClassName('summary')}
          onClick={() => setSelectTab('summary')}
        >
          项目介绍
        </span>
        {repo.code ? (
          <span
            className={tabClassName('code')}
            onClick={() => setSelectTab('code')}
          >
            代码示例
          </span>
        ) : (
          <></>
        )}
      </nav>
      {tabContent()}
    </>
  );
};

export default Tabs;
