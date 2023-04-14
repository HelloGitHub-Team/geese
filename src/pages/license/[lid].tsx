import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { MdOutlineFileCopy } from 'react-icons/md';

import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import Tooltip from '@/components/tooltip/Tooltip';

import { getLicenseDetail } from '@/services/license';
import { isMobile } from '@/utils/util';

import { LicenseDetailData, Tag, TagListItem } from '@/types/license';

type LicenseDetailProps = {
  detail: LicenseDetailData;
};

const LicenseDetail: NextPage<LicenseDetailProps> = ({ detail }) => {
  const [licenseText, setLicenseText] = useState<string>();
  const [expand, setExpand] = useState(false);
  const [tagList, setTagList] = useState<TagListItem[]>([]);

  useEffect(() => {
    const status: Tag[] = [];
    if (detail.is_fsf)
      status.push({
        tid: 'fsf',
        name: 'FSF',
        name_zh: 'FSF',
        description:
          'This license is certified by the Free Software Foundation (FSF).',
        description_zh: '该许可通过了自由软件基金会(FSF)认证。',
      });
    if (detail.is_osi)
      status.push({
        tid: 'osi',
        name: 'OSI',
        name_zh: 'OSI',
        description:
          'This license is certified by the Open Source Initiative (OSI).',
        description_zh: '该许可通过了开放源代码促进会(OSI)认证。',
      });
    if (detail.is_deprecate)
      status.push({
        tid: 'disable',
        name: 'disable',
        name_zh: '弃用',
        description: 'This license is disabled.',
        description_zh: '该许可已经被弃用。',
      });
    // 协议的权限等标签数据
    const list: TagListItem[] = [];
    if (detail.permissions.length > 0) {
      list.push({
        title: '权限',
        key: 'permissions',
        bgColor: 'bg-green-500',
        content: detail.permissions,
      });
    }
    if (detail.conditions.length > 0) {
      list.push({
        title: '条件',
        key: 'conditions',
        bgColor: 'bg-blue-500',
        content: detail.conditions,
      });
    }
    if (detail.limitations.length > 0) {
      list.push({
        title: '限制',
        key: 'limitations',
        bgColor: 'bg-red-500',
        content: detail.limitations || [],
      });
    }
    if (!isMobile()) {
      list.push({
        title: '状态',
        key: 'status',
        bgColor: 'bg-yellow-500',
        content: status,
      });
    }
    setTagList(list);
  }, [detail]);

  useEffect(() => {
    if (expand) {
      setLicenseText(detail.text);
    } else {
      setLicenseText(detail.text?.slice(0, 500) + '...');
    }
  }, [expand, detail]);

  const onCopy = () => {
    const text =
      detail.text +
      `\n\n<a href="https://hellogithub.com/license/${detail.lid}" rel="nofollow">More</a>`;
    if (copy(text)) {
      Message.success('开源协议内容已复制');
    } else {
      Message.error('复制失败');
    }
  };

  return (
    <>
      <Seo title='HelloGitHub｜开源协议' />
      <div className='relative'>
        {/* 顶部标题 */}
        <Navbar middleText={detail.spdx_id} endText='协议' />
        {/* 协议简介 */}
        <div className='my-2 bg-white px-4 py-3 dark:bg-gray-800 md:rounded-lg'>
          <h2 className='pb-1'>{detail.name}</h2>
          <div className='my-2 text-xs text-gray-500'>
            <span>{detail.spdx_id}</span>
            <span className='px-1 lg:px-2'>·</span>
            <a
              target='_blank'
              className='cursor-pointer hover:text-blue-500'
              href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
              rel='noreferrer'
            >
              <span>反馈问题</span>
            </a>
          </div>
          <div className='flex flex-col'>{detail.description}</div>
          <div className='mt-4 flex text-lg font-bold md:mx-3 md:text-xl'>
            {tagList.map((tag) => {
              return (
                <div className='pr-4 lg:pr-20' key={tag.key}>
                  <div className='mb-1'>{tag.title}</div>
                  {tag.content.map((ct) => {
                    const tipContent = (
                      <div className='w-80 border dark:border-gray-400'>
                        <div className={`${tag.bgColor} p-1`}>{ct.name_zh}</div>
                        <div
                          className={`${tag.bgColor} bg-opacity-25 p-1 text-sm font-normal`}
                        >
                          <p>{ct.description}</p>
                          <p>{ct.description_zh}</p>
                        </div>
                      </div>
                    );
                    return (
                      <Tooltip key={ct.name_zh} content={tipContent}>
                        <div className='mb-2 flex cursor-pointer items-center text-sm font-normal md:text-base'>
                          <div
                            className={`${tag.bgColor} mr-2 h-3 w-3 rounded-full`}
                          ></div>
                          {ct.name_zh}
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {/* 协议内容 */}
        <div className='my-2 bg-white p-5 dark:bg-gray-800 md:rounded-lg'>
          <div className='mb-1 flex flex-row items-center'>
            <div className='shrink grow'></div>
            <div
              onClick={onCopy}
              className='hover: flex cursor-pointer items-center justify-self-end border-blue-500 text-sm hover:text-blue-500'
            >
              <MdOutlineFileCopy className='text-blue-500' />
              <span className='ml-1'>复制</span>
            </div>
          </div>
          {licenseText ? (
            <div className='whitespace-pre-wrap text-left'>
              {licenseText}
              <span
                className='ml-2 cursor-pointer text-sm font-medium text-blue-400'
                onClick={() => setExpand(!expand)}
              >
                {!expand ? '展开' : '收起'}
              </span>
            </div>
          ) : (
            <div className='my-4'>暂无内容</div>
          )}
        </div>
      </div>
    </>
  );
};

export default LicenseDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;

  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getLicenseDetail(ip, params?.lid as string);

  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        detail: data.data || {},
      },
    };
  }
};
