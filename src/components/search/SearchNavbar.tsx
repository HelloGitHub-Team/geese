import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import useFilterHandling from '@/hooks/useFilterHandling';

import { TagLinkListSkeleton } from '@/components/loading/skeleton';
import SearchTagLink from '@/components/search/SearchTagLink';

interface Props {
  middleText: string;
  endText?: string;
  t: (key: string) => string;
  i18n_lang: string;
  tid?: string;
  sortBy: string;
  rankBy: string;
}

const SearchNavbar = ({
  middleText = '',
  endText = '',
  i18n_lang,
  tid,
  sortBy,
  rankBy,
}: Props) => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length < 2) {
      router.push('/');
    } else {
      router.back();
    }
  };

  const { tagItems } = useFilterHandling(tid, sortBy, rankBy, i18n_lang);

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
        {endText ? (
          <div className='justify-end text-sm text-gray-500 dark:text-gray-400'>
            {endText}
          </div>
        ) : (
          <div className='flex w-5' />
        )}
      </div>
      {/* 移动端标签 */}
      <div className='flex border-t border-gray-100 px-3 pb-2  dark:border-gray-700 lg:hidden'>
        {tagItems.length > 0 ? (
          <SearchTagLink
            items={tagItems}
            tid={tid}
            sort_by={sortBy}
            rank_by={rankBy}
          />
        ) : (
          <TagLinkListSkeleton />
        )}
      </div>
    </div>
  );
};

export default SearchNavbar;
