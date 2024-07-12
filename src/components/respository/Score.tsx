import Rating from './Rating';

import { RepositoryProps } from '@/types/repository';

const Score = ({ t, repo }: RepositoryProps) => {
  const jumpComment = () => {
    const { offsetTop } = document.querySelector('#comment') as HTMLElement;
    // 根据 offsetTop 滚动到指定位置
    window.scrollTo({
      top: offsetTop,
    });
  };

  return (
    <div className='w-34 relative p-1'>
      <div className='border-l border-gray-300 pl-3'>
        <div className='flex flex-row text-sm text-gray-500'>
          {t('info.socre_desc')}
        </div>
        <div className='mt-1 flex flex-row items-center'>
          {repo.score ? (
            <div className='mr-2 text-3xl font-medium'>{repo.score_str}</div>
          ) : (
            <></>
          )}
          <div className='w-2/3'>
            <div className='h-1/2'>
              <Rating value={repo.score / 2} size={15} />
            </div>
            <div
              className='h-1/2 cursor-pointer py-1 text-xs text-blue-500'
              onClick={jumpComment}
            >
              {t('info.socre_user_desc', { count: repo.comment_total })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
