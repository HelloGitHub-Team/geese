import copy from 'copy-to-clipboard';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { MdOutlineFileCopy } from 'react-icons/md';

import { FeedbackModal } from '@/components/dialog/Feedback';
import Message from '@/components/message';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import Tooltip from '@/components/tooltip/Tooltip';

import { getLicenseDetail } from '@/services/license';
import { getClientIP, isMobile } from '@/utils/util';

import { LicenseDetailData, Tag, TagListItem } from '@/types/license';

type LicenseDetailProps = {
  detail: LicenseDetailData;
};

const LicenseDetail: NextPage<LicenseDetailProps> = ({ detail }) => {
  const { t, i18n } = useTranslation('license');
  const i18n_lang = i18n.language;
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
        title: 'Permission',
        title_zh: '权限',
        key: 'permissions',
        bgColor: 'bg-green-500',
        content: detail.permissions,
      });
    }
    if (detail.conditions.length > 0) {
      list.push({
        title: 'Condition',
        title_zh: '条件',
        key: 'conditions',
        bgColor: 'bg-blue-500',
        content: detail.conditions,
      });
    }
    if (detail.limitations.length > 0) {
      list.push({
        title: 'Limit',
        title_zh: '限制',
        key: 'limitations',
        bgColor: 'bg-red-500',
        content: detail.limitations || [],
      });
    }
    if (!isMobile()) {
      list.push({
        title: 'Status',
        title_zh: '状态',
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
      setLicenseText(detail.text?.slice(0, 600) + '...');
    }
  }, [expand, detail]);

  const onCopy = () => {
    const text =
      detail.text +
      `\n\n<a href="https://hellogithub.com/license/${detail.lid}" rel="nofollow">More</a>`;
    if (copy(text)) {
      Message.success(t('copy.success'));
    } else {
      Message.error(t('copy.fail'));
    }
  };

  return (
    <>
      <Seo title={t('title', { spdx: detail.spdx_id })} />
      <div className='relative'>
        {/* 顶部标题 */}
        <Navbar middleText={detail.spdx_id} endText={t('nav')} />
        {/* 协议简介 */}
        <div className='my-2 bg-white px-4 py-3 dark:bg-gray-800 md:rounded-lg'>
          <h2 className='pb-1'>{detail.name}</h2>
          <div className='my-2 flex text-xs text-gray-500'>
            <span>{detail.spdx_id}</span>
            <span className='px-1 lg:px-2'>·</span>
            <FeedbackModal feedbackType={1}>
              <span className='cursor-pointer'>{t('feedback')}</span>
            </FeedbackModal>
          </div>
          <div className='flex flex-col'>
            <p className='items-center md:text-justify'>
              {i18n_lang == 'en' ? detail.description : detail.description_zh}
            </p>
          </div>
          <div className='mt-4 flex text-lg font-bold md:mx-3 md:text-xl'>
            {tagList.map((tag) => {
              return (
                <div className='pr-4 lg:pr-20' key={tag.key}>
                  <div className='mb-1'>
                    {i18n.language == 'en' ? tag.title : tag.title_zh}
                  </div>
                  {tag.content.map((ct) => {
                    const tipContent = (
                      <div className='w-80 border dark:border-gray-400'>
                        <div className={`${tag.bgColor} p-1`}>
                          {i18n.language == 'en' ? ct.name : ct.name_zh}
                        </div>
                        <div
                          className={`${tag.bgColor} bg-opacity-25 p-1 text-sm font-normal`}
                        >
                          <p>
                            {i18n.language == 'en'
                              ? ct.description
                              : ct.description_zh}
                          </p>
                        </div>
                      </div>
                    );
                    return (
                      <Tooltip
                        key={i18n.language == 'en' ? ct.name : ct.name_zh}
                        content={tipContent}
                      >
                        <div className='mb-2 flex items-center text-sm font-normal md:text-base lg:cursor-pointer'>
                          <div
                            className={`${tag.bgColor} mr-2 h-3 w-3 flex-shrink-0 rounded-full`}
                          />
                          <span className=' overflow-ellipsis line-clamp-1'>
                            {' '}
                            {i18n.language == 'en' ? ct.name : ct.name_zh}
                          </span>
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
              className='flex cursor-pointer items-center justify-self-end border-blue-500 text-sm hover:text-blue-500'
            >
              <MdOutlineFileCopy className='text-blue-500' />
              <span className='ml-1'>{t('copy.button')}</span>
            </div>
          </div>
          {licenseText ? (
            <div className='whitespace-pre-wrap md:text-justify'>
              {licenseText}
              <span
                className='ml-2 cursor-pointer text-sm font-medium text-blue-400'
                onClick={() => setExpand(!expand)}
              >
                {!expand ? t('expand') : t('collapse')}
              </span>
            </div>
          ) : (
            <div className='my-4'>{t('empty')}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default LicenseDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params, locale } = context;
  const ip = getClientIP(req);
  const data = await getLicenseDetail(ip, params?.lid as string);

  if (!data.success) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        detail: data.data || {},
        ...(await serverSideTranslations(locale as string, [
          'common',
          'license',
        ])),
      },
    };
  }
};
