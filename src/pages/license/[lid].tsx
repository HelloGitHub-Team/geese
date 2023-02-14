import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { MdOutlineFeedback } from 'react-icons/md';

import Drawer from '@/components/drawer/Drawer';
import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import Tooltip from '@/components/tooltip/Tooltip';

import { getLicenseDetail } from '@/services/license';
import { formatDate, isMobile } from '@/utils/util';

import { LicenseDetailData, Tag, TagListItem } from '@/types/license';

type LicenseDetailProps = {
  detail: LicenseDetailData;
};

const LicenseDetail: NextPage<LicenseDetailProps> = ({ detail }) => {
  const router = useRouter();
  // console.log({ detail, router });
  const [licenseText, setLicenseText] = useState<string>();
  const [expand, setExpand] = useState(false);
  const [tagList, setTagList] = useState<TagListItem[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [tagInfo, setTagInfo] = useState<{
    title: string;
    desc: string;
    desc_zh: string;
  }>({ title: '', desc: '', desc_zh: '' });

  useEffect(() => {
    const others: Tag[] = [];
    if (detail.is_fsf)
      others.push({
        tid: 'FSF',
        name: 'FSF',
        name_zh: 'FSF',
        description: 'FSF',
        description_zh: 'FSF',
      });
    if (detail.is_osi)
      others.push({
        tid: 'OSI',
        name: 'OSI',
        name_zh: 'OSI',
        description: 'OSI',
        description_zh: 'OSI',
      });
    if (detail.is_deprecate)
      others.push({
        tid: 'disable',
        name: 'disable',
        name_zh: '弃用',
        description: 'the license is disabled',
        description_zh: '该协议已经启用',
      });
    // 协议的权限等标签数据
    const list: TagListItem[] = [
      {
        title: '权限',
        key: 'permissions',
        bgColor: 'bg-green-500',
        content: detail.permissions || [],
      },
      {
        title: '条件',
        key: 'conditions',
        bgColor: 'bg-blue-500',
        content: detail.conditions || [],
      },
      {
        title: '限制',
        key: 'limitations',
        bgColor: 'bg-red-500',
        content: detail.limitations || [],
      },
      {
        title: '其他',
        key: 'others',
        bgColor: 'bg-yellow-500',
        content: others,
      },
    ];

    setTagList(list);
  }, [detail]);

  useEffect(() => {
    if (expand) {
      setLicenseText(detail.text);
    } else {
      setLicenseText(detail.text?.slice(0, 1200) + '...');
    }
  }, [expand, detail]);

  const onTagClick = (ct: Tag) => {
    if (isMobile()) {
      setTagInfo({
        title: ct.name_zh,
        desc: ct.description,
        desc_zh: ct.description_zh,
      });
      setDrawerVisible(true);
    }
  };

  const onShare = () => {
    const text = `<a href="https://hellogithub.com/license/${detail.lid}?spdx=${detail.spdx_id}" rel="nofollow">${detail.name}</a>`;
    if (copy(text)) {
      Message.success('协议信息已复制，快去分享吧！');
    } else {
      Message.error('复制失败');
    }
  };

  return (
    <>
      <Seo title='HelloGitHub｜开源协议' />
      <div className='relative'>
        {/* 顶部标题 */}
        <Navbar middleText={detail.spdx_id}></Navbar>
        {/* 协议简介 */}
        <div className='my-4 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
          <h2>{detail.name}</h2>
          <div className='mt-1 mb-2 text-xs text-gray-500'>
            <span>{detail.spdx_id}</span>
            <span className='ml-2'>
              更新于 {formatDate(new Date(detail.updated_at))}
            </span>
            <a
              target='_blank'
              className='ml-2 cursor-pointer hover:text-blue-500'
              href='https://hellogithub.yuque.com/forms/share/d268c0c0-283f-482a-9ac8-939aa8027dfb'
              rel='noreferrer'
            >
              <MdOutlineFeedback className='inline align-middle' />
              <span>建议反馈</span>
            </a>
          </div>
          <div>{detail.description}</div>
          <div className='mt-4 flex justify-between text-lg font-bold'>
            {tagList.map((tag) => {
              return (
                <div key={tag.key}>
                  <div className='mb-1'>{tag.title}</div>
                  {tag.content.map((ct) => {
                    const tipContent = (
                      <div className='w-80 border'>
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
                        <div
                          onClick={() => onTagClick(ct)}
                          className='mb-2 flex cursor-pointer items-center text-sm font-normal'
                        >
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
        <div className='my-4 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='mb-2 flex items-center justify-between'>
            <div></div>
            <div
              onClick={onShare}
              className='flex cursor-pointer items-center hover:text-blue-500'
            >
              <AiOutlineShareAlt className='text-blue-500' />
              <span className='ml-1'>一键分享</span>
            </div>
          </div>
          <div className='text-left'>
            {licenseText ? (
              <div>
                {licenseText}
                <span
                  className='ml-2 cursor-pointer text-blue-400'
                  onClick={() => setExpand(!expand)}
                >
                  {!expand ? '查看更多' : '收起'}
                </span>
              </div>
            ) : (
              <div className='my-4'>暂无内容</div>
            )}
          </div>
        </div>
        {/* 移动端展示协议标签信息的抽屉 */}
        <Drawer
          title={tagInfo.title}
          visible={drawerVisible}
          placement='bottom'
          onClose={() => setDrawerVisible(false)}
        >
          <div className=' h-full dark:bg-gray-800'>
            <p>{tagInfo.desc}</p>
            <p>{tagInfo.desc_zh}</p>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default LicenseDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params = {} } = context;

  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const data = await getLicenseDetail(ip, params['lid'] as string);

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
