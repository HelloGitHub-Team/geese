import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineAppstore, AiOutlineSetting } from 'react-icons/ai';

import { TagModal } from '@/components/dialog/TagModal';

import { getTags } from '@/services/tag';
import { isMobile } from '@/utils/util';

import { TagListSkeleton } from '../loading/skeleton';

import { Tag } from '@/types/tag';

export default function TagList() {
  const { t, i18n } = useTranslation('home');
  const defaultTag: Tag = {
    name: '综合',
    name_en: 'All',
    tid: '',
    icon_name: 'find',
  };

  const router = useRouter();
  const { tid = '', sort_by = 'featured' } = router.query;
  const [tags, setTags] = useState<Tag[]>([]);

  const initTags = useCallback(async () => {
    const res = await getTags();
    if (res.success) {
      res.data.unshift(defaultTag);
      // 判断当前语言是否为英文，如果是英文则显示英文名称
      res.data.forEach((item) => {
        if (i18n.language == 'en' && item.name_en !== null) {
          item.name = item.name_en;
        }
      });
      setTags(res.data);
    }
  }, []);

  useEffect(() => {
    if (!isMobile()) {
      initTags();
    }
  }, [i18n.language]);

  const iconClassName = (iconName: string) => `iconfont icon-${iconName} mr-1`;

  const tagClassName = (itemTid: string) =>
    classNames(
      'flex flex-row w-[115px] items-center my-1 py-2 px-3 rounded text-[14px] cursor-pointer hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700',
      {
        'text-gray-500 dark:text-gray-400': tid !== itemTid,
        'bg-gray-100 dark:bg-gray-700 text-blue-500': tid === itemTid,
      }
    );

  return (
    <div className='hidden max-w-[162px] shrink-0 lg:block lg:w-2/12 lg:grow-0'>
      <div className='fixed top-16 pl-2'>
        <div className='w-[140px] rounded-lg bg-white px-3 py-2 dark:bg-gray-800'>
          <div className='px-1 pb-1'>
            <div className='border-b border-b-gray-200 pb-2 dark:border-b-gray-600 dark:text-gray-300'>
              <div className='flex w-[104px] flex-row items-center p-1'>
                <AiOutlineAppstore size={16} />
                <div className='ml-1 font-medium'>{t('tag_side.title')}</div>
              </div>
            </div>
          </div>
          <div className='hidden-scrollbar max-h-[444px] overflow-y-auto'>
            {!tags.length && <TagListSkeleton />}
            {tags.map((item: Tag) => (
              <Link
                prefetch={false}
                key={item.tid}
                href={`/?sort_by=${sort_by}&tid=${item.tid}`}
              >
                <div className={tagClassName(item.tid)}>
                  <div className={iconClassName(item.icon_name)}></div>
                  <div className='truncate text-ellipsis'>{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
          <TagModal updateTags={setTags} t={t} i18n_lang={i18n.language}>
            <div className='flex cursor-pointer flex-row items-center border-t border-t-gray-200 px-3 pt-2 pb-1 text-gray-500 hover:text-blue-500 dark:border-t-gray-600 dark:text-gray-300 dark:hover:text-blue-500'>
              <AiOutlineSetting size={15} />
              <div className='ml-0.5 text-sm'>{t('tag_side.manage')}</div>
            </div>
          </TagModal>
        </div>
      </div>
    </div>
  );
}
