import classNames from 'classnames';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import { NoPrefetchLink } from '@/components/links/CustomLink';

type Props = {
  category: string;
  middleText: string;
  t: (key: string) => string;
};

const CategoryNavbar = ({ category, middleText, t }: Props) => {
  const router = useRouter();
  const { sort_by = 'last' } = router.query;

  const goBack = () => {
    if (window.history.length < 2) {
      router.push('/');
    } else {
      router.back();
    }
  };

  const linkClassName = (sortName: string) =>
    classNames(
      'flex items-center whitespace-nowrap rounded-lg text-xs hover:text-blue-500',
      {
        'text-gray-500 dark:text-gray-300': sort_by !== sortName,
        'text-blue-500': sort_by === sortName,
      }
    );

  return (
    <div className='relative my-2 bg-white dark:bg-gray-800 md:rounded-lg'>
      <div className='flex h-12 items-center justify-between py-2 px-4'>
        <div className='cursor-pointer' onClick={goBack}>
          <AiOutlineArrowLeft
            className='text-gray-500 hover:text-blue-400'
            size={18}
          />
        </div>
        <div className='w-3/4 truncate text-center font-bold dark:text-gray-300'>
          {middleText}
        </div>
        <div className='flex justify-end gap-2.5 text-sm text-gray-500 dark:text-gray-400'>
          <NoPrefetchLink
            href={`/periodical/category/${encodeURIComponent(
              category
            )}?sort_by=last`}
          >
            <a className={linkClassName('last')}>{t('category.nav.last')}</a>
          </NoPrefetchLink>
          <span className='border-r border-gray-100 dark:border-gray-700' />
          <NoPrefetchLink
            href={`/periodical/category/${encodeURIComponent(
              category
            )}?sort_by=active`}
          >
            <a className={linkClassName('active')}>
              {t('category.nav.active')}
            </a>
          </NoPrefetchLink>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;
