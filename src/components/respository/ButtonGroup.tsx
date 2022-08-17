import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { GoLink, GoLinkExternal, GoStar } from 'react-icons/go';
import { IoMdThumbsUp } from 'react-icons/io';

import {
  cancelVoteRepo,
  recordGoGithub,
  voteRepo,
  voteRepoStatus,
} from '@/services/repository';

import { RepositoryProps } from '@/types/reppsitory';

const ButtonGroup: NextPage<RepositoryProps> = ({ repo }) => {
  const commonStyle =
    'flex flex-1 items-center justify-center leading-10 hover:text-blue-500 active:text-gray-400';
  const iconStyle = 'mr-1';

  const [isVoted, setIsVoted] = useState(false);
  const [likesTotal, setLikesTotal] = useState<number>(0);

  const onClickLink = (rid: string) => {
    // 调用接口记录链接点击信息
    recordGoGithub(rid);
  };

  const getRepoVoteStatus = async (rid: string) => {
    // 调用接口查看项目是否点赞
    const data = await voteRepoStatus(rid);
    setIsVoted(data.is_voted);
  };

  const onClickVote = async (rid: string) => {
    const data = await voteRepo(rid);
    if (data?.data) {
      setLikesTotal(data.data.total);
      setIsVoted(true);
    }
  };

  const onCancelVote = async (rid: string) => {
    const data = await cancelVoteRepo(rid);
    if (data?.success) {
      setIsVoted(false);
      setLikesTotal(likesTotal - 1);
    }
  };

  useEffect(() => {
    getRepoVoteStatus(repo.rid);
    setLikesTotal(repo.likes);
  }, [repo]);

  return (
    <div className='flex cursor-pointer border-t border-solid bg-white text-center text-xs text-gray-600'>
      {isVoted ? (
        <div className={commonStyle} onClick={() => onCancelVote(repo.rid)}>
          <IoMdThumbsUp className='mr-1 text-blue-500' size={14} />
          <span className='text-xs text-inherit text-blue-500'>
            {likesTotal}
          </span>
        </div>
      ) : (
        <div className={commonStyle} onClick={() => onClickVote(repo.rid)}>
          {' '}
          <IoMdThumbsUp className={iconStyle} size={14} />
          点赞
        </div>
      )}

      <div className={commonStyle}>
        <GoStar className={iconStyle} size={14} />
        收藏
      </div>
      <div className={commonStyle}>
        <GoLinkExternal className={iconStyle} size={14} />
        分享
      </div>
      <a
        className={commonStyle}
        href={repo.url}
        onClick={() => onClickLink(repo.rid)}
        target='__blank'
      >
        <GoLink className={iconStyle} size={14} />
        访问
      </a>
    </div>
  );
};

export default ButtonGroup;
