import classNames from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { MdOutlineFeedback } from 'react-icons/md';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { getLicenseDetail } from '@/services/license';
import { formatDate } from '@/utils/util';

import { LicenseDetailData, TagListItem } from '@/types/license';

type LicenseDetailProps = {
  detail: LicenseDetailData;
};

const LicenseDetail: NextPage<LicenseDetailProps> = ({ detail }) => {
  const router = useRouter();
  console.log({ detail, router });
  const [licenseText, setLicenseText] = useState();
  const [expand, setExpand] = useState(false);
  const [tagList, setTagList] = useState<TagListItem[]>([]);

  useEffect(() => {
    const others = [];
    if (detail.is_fsf) others.push({ name_zh: 'FSF' });
    if (detail.is_osi) others.push({ name_zh: 'OSI' });
    if (detail.is_deprecate) others.push({ name_zh: '弃用' });
    // 协议的权限等标签数据
    const list: TagListItem[] = [
      {
        title: '权限',
        key: 'permissions',
        color: 'bg-green-400',
        content: detail.permissions || [],
      },
      {
        title: '条件',
        key: 'conditions',
        color: 'bg-blue-400',
        content: detail.conditions || [],
      },
      {
        title: '限制',
        key: 'limitations',
        color: 'bg-red-400',
        content: detail.limitations || [],
      },
      {
        title: '其他',
        key: 'others',
        color: 'bg-yellow-400',
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
                    return (
                      <div
                        className='flex cursor-pointer items-center text-sm font-normal'
                        key={ct.name}
                      >
                        <div
                          className={classNames(
                            `mr-2 h-3 w-3 rounded-full`,
                            tag.color
                          )}
                        ></div>
                        {ct['name_zh']}
                      </div>
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
            <div className='flex cursor-pointer items-center hover:text-blue-500'>
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
      </div>
    </>
  );
};

export default LicenseDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  console.log(params);

  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  // const data = await getLicenseDetail(ip, params['lid'] as string);
  const data = await getLicenseDetail(ip, 'be22da96170c4ce4b15c8f5f22761e4c');

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
