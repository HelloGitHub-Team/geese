import { GoLink, GoLinkExternal, GoStar, GoThumbsup } from 'react-icons/go';

import { RepositoryProps } from '@/types/reppsitory';

const ButtonGroup = (props: RepositoryProps) => {
  const commonStyle =
    'flex flex-1 items-center justify-center leading-10 hover:text-gray-900 active:text-gray-400';
  const iconStyle = 'mr-1';

  return (
    <div className='flex cursor-pointer border-t border-solid bg-white text-center text-xs text-gray-600'>
      <div className={commonStyle}>
        <GoThumbsup className={iconStyle} size={14} />
        点赞
      </div>
      <div className={commonStyle}>
        <GoStar className={iconStyle} size={14} />
        收藏
      </div>
      <div className={commonStyle}>
        <GoLinkExternal className={iconStyle} size={14} />
        分享
      </div>
      <a className={commonStyle} href={props.repo.url} target='__blank'>
        <GoLink className={iconStyle} size={14} />
        访问
      </a>
    </div>
  );
};

export default ButtonGroup;
