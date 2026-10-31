import classNames from 'classnames';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import { NoPrefetchLink } from '@/components/links/CustomLink';

type Props = {
  t: (key: string) => string;
};

const ArticleNavbar = ({ t }: Props) => {
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
      <div className='flex h-12 items-center justify-between px-4 py-2'>
        <div className='cursor-pointer' onClick={goBack}>
          <AiOutlineArrowLeft
            className='text-gray-500 hover:text-blue-400'
            size={18}
          />
        </div>
        <div className='w-3/4 truncate text-center font-bold dark:text-gray-300'>
          {t('nav.title')}
        </div>
        <div className='flex justify-end gap-2.5 text-sm text-gray-500 dark:text-gray-400'>
          <NoPrefetchLink
            href='/article?sort_by=last'
            className={linkClassName('last')}
          >
            {t('nav.last')}
          </NoPrefetchLink>
          <span className='border-r border-gray-100 dark:border-gray-700' />
          <NoPrefetchLink
            href='/article?sort_by=hot'
            className={linkClassName('hot')}
          >
            {t('nav.hot')}
          </NoPrefetchLink>
        </div>
      </div>
    </div>
  );
};

export default ArticleNavbar;
