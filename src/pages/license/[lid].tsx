import classNames from 'classnames';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillCopy } from 'react-icons/ai';

import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { getLicenseDetail } from '@/services/license';
import { formatDate } from '@/utils/util';

import { LicenseDetailData } from '@/types/license';

type LicenseDetailProps = {
  detail: LicenseDetailData;
};

const LicenseDetail: NextPage<LicenseDetailProps> = ({ detail }) => {
  const router = useRouter();
  console.log({ detail, router });
  const [languageBtn, setLanguageBtn] = useState<'en' | 'zh'>('en');
  const [licenseText, setLicenseText] = useState(detail.html);
  useEffect(() => {
    setLicenseText(languageBtn === 'en' ? detail.html : detail.text_zh);
  }, [languageBtn, setLicenseText, detail]);

  return (
    <>
      <Seo title='HelloGitHub｜开源协议' />
      <div className='relative'>
        {/* 顶部标题 */}
        <Navbar middleText={detail.spdx_id} endText='由xxx翻译'></Navbar>
        {/* 协议简介 */}
        <div className='my-4 bg-white px-6 py-4 dark:bg-gray-800 md:rounded-lg'>
          <h2>{detail.name}</h2>
          <div className='mt-1 mb-2 text-xs text-gray-500'>
            <span>{detail.spdx_id}</span>
            <span className='ml-1'>
              更新于 {formatDate(new Date(detail.updated_at))}
            </span>
          </div>
          <div>{detail.header_text}</div>
          <div className='mt-2 flex justify-between text-lg font-bold'>
            <div>权限</div>
            <div>条件</div>
            <div>限制</div>
            <div>XX</div>
          </div>
        </div>
        {/* 内容翻译 */}
        <div className='my-4 bg-white p-4 dark:bg-gray-800 md:rounded-lg'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex cursor-pointer items-center hover:text-blue-500'>
              <AiFillCopy className='text-blue-500' />
              <span className='ml-1'>一键复制</span>
            </div>
            <div className='inline-flex rounded-md shadow-sm'>
              <button
                type='button'
                onClick={() => setLanguageBtn('en')}
                className={classNames(
                  '-ml-px inline-flex items-center justify-center gap-2 border bg-white py-2 px-4 align-middle text-sm font-medium transition-all first:ml-0 first:rounded-l-lg last:rounded-r-lg  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800',
                  {
                    'bg-blue-400': languageBtn === 'en',
                  }
                )}
              >
                英文
              </button>
              <button
                type='button'
                onClick={() => setLanguageBtn('zh')}
                className={classNames(
                  '-ml-px inline-flex items-center justify-center gap-2 border bg-white py-2 px-4 align-middle text-sm font-medium transition-all first:ml-0 first:rounded-l-lg last:rounded-r-lg  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800',
                  {
                    'bg-blue-400': languageBtn === 'zh',
                  }
                )}
              >
                中文
              </button>
            </div>
          </div>
          <div className='text-center'>
            {licenseText ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: licenseText,
                }}
              ></div>
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
