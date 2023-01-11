import copy from 'copy-to-clipboard';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineGithub,
  AiOutlineHeart,
  AiOutlineStar,
} from 'react-icons/ai';
import { GoLinkExternal } from 'react-icons/go';

import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';
import AddCollection from '@/components/collection/AddCollection';
import BasicDialog from '@/components/dialog/BasicDialog';
import Dropdown, { option } from '@/components/dropdown/Dropdown';
import CustomLink from '@/components/links/CustomLink';
import Message from '@/components/message';

import { getFavoriteOptions } from '@/services/favorite';
import {
  cancelCollectRepo,
  cancelVoteRepo,
  collectRepo,
  recordGoGithub,
  userRepoStatus,
  voteRepo,
} from '@/services/repository';
import { numFormat } from '@/utils/util';

import message from '../message';

import { Repository } from '@/types/reppsitory';

interface Props {
  repo: Repository;
}

const ButtonGroup: NextPage<Props> = ({ repo }) => {
  const commonStyle =
    'flex flex-1 items-center justify-center cursor-pointer leading-10 hover:text-current md:hover:text-blue-500 active:!text-gray-400';
  const iconStyle = 'mr-1';

  const { isLogin } = useLoginContext();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [likesTotal, setLikesTotal] = useState<number>(0);
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [collectTotal, setCollectTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favoriteOptions, setFavoriteOptions] = useState<option[]>([]);
  const dropdownRef = useRef<any>();

  const onClickLink = (rid: string) => {
    // 调用接口记录链接点击信息
    recordGoGithub(rid);
  };

  // 获取用户收藏夹列表
  const getUserFavoriteOptions = async () => {
    const res = await getFavoriteOptions();
    if (res.success) {
      let options: option[] = [{ key: '', value: '默认收藏夹' }];
      if (res.data?.length) {
        options = res.data?.map((item) => {
          return { key: item.fid, value: item.name };
        });
      }
      setFavoriteOptions(options);
    }
  };

  const getUserRepoStatus = async (rid: string) => {
    // 调用接口查看项目是否点赞
    const res = await userRepoStatus(rid);
    if (res.success) {
      setIsVoted(res.is_voted);
      setIsCollected(res.is_collected);
    }
  };

  const onClickVote = async (rid: string) => {
    if (!isLogin) {
      Message.error('请先登录~');
      return;
    }
    const res = await voteRepo(rid);
    if (res.success) {
      setLikesTotal(res.data.total);
      setIsVoted(true);
    } else {
      Message.error(res.message as string);
    }
  };

  const onClickCollect = () => {
    if (isLogin) {
      setOpenModal(true);
    } else {
      Message.error('请先登录~');
    }
  };

  const onCancelVote = async (rid: string) => {
    const res = await cancelVoteRepo(rid);
    if (res.success) {
      setIsVoted(false);
      setLikesTotal(likesTotal - 1);
    }
  };

  const onCancelCollect = async (rid: string) => {
    const res = await cancelCollectRepo(rid);
    if (res.success) {
      setIsCollected(false);
      setCollectTotal(likesTotal - 1);
      message.success('取消收藏');
    }
  };

  const handleCopy = (repo: Repository) => {
    const text = `${
      repo.name
    }：${repo.title.trim()}。\n点击查看详情：https://hellogithub.com/repository/${
      repo.rid
    }`;
    if (copy(text)) {
      message.success('项目信息已复制，快去分享吧！');
    } else message.error('复制失败');
  };

  // 收藏-确定
  const onFavoriteSave = async (rid: string) => {
    const fid = dropdownRef.current?.activeOption.key;
    const res = await collectRepo({ rid, fid });
    if (res.success) {
      message.success('收藏成功~');
      setOpenModal(false);
      setCollectTotal(res.data.total);
      setIsCollected(true);
    } else {
      message.error(res.message || '收藏失败');
    }
  };

  useEffect(() => {
    getUserRepoStatus(repo.rid);
    setLikesTotal(repo.likes);
    setCollectTotal(repo.collect_total);
    getUserFavoriteOptions();
  }, [repo]);

  return (
    <>
      <div className='flex border-t border-solid bg-white text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 md:rounded-b-lg'>
        {isVoted ? (
          <div className={commonStyle} onClick={() => onCancelVote(repo.rid)}>
            <AiFillHeart className='mr-1 text-blue-500' size={16} />
            <span className='text-sm text-inherit text-blue-500'>
              {numFormat(likesTotal, 1)}
            </span>
          </div>
        ) : (
          <div className={commonStyle} onClick={() => onClickVote(repo.rid)}>
            <AiOutlineHeart className={iconStyle} size={16} />
            点赞
          </div>
        )}

        {isCollected ? (
          <div
            className={commonStyle}
            onClick={() => onCancelCollect(repo.rid)}
          >
            <AiFillStar className='mr-1 text-blue-500' size={16} />
            <span className='text-sm text-inherit text-blue-500'>
              {numFormat(collectTotal, 1)}
            </span>
          </div>
        ) : (
          <div className={commonStyle} onClick={onClickCollect}>
            <AiOutlineStar className={iconStyle} size={16} />
            收藏
          </div>
        )}

        <div className={commonStyle} onClick={() => handleCopy(repo)}>
          <GoLinkExternal className={iconStyle} size={16} />
          分享
        </div>
        <CustomLink
          href={repo.url}
          className={commonStyle}
          onClick={() => onClickLink(repo.rid)}
        >
          <AiOutlineGithub className={iconStyle} size={16} />
          访问
        </CustomLink>
      </div>
      {/* 选择收藏夹的弹窗 */}
      <BasicDialog
        className='max-w-sm w-5/6 rounded-lg p-6'
        visible={openModal}
        maskClosable={false}
        title={
          <>
            选择收藏夹
            <p className='mt-3 text-xs text-gray-500'>
              选择或创建你想添加的收藏夹
            </p>
          </>
        }
        onClose={() => setOpenModal(false)}
      >
        <div className='my-4 text-center'>
          <Dropdown
            ref={dropdownRef}
            width={220}
            trigger='click'
            options={favoriteOptions}
          />
        </div>
        {/* footer */}
        <div className='flex justify-between'>
          <AddCollection
            onFinish={() => {
              // 刷新收藏夹下拉列表
              getFavoriteOptions();
            }}
          />
          <Button
            className='py-0 px-3'
            variant='primary'
            onClick={() => onFavoriteSave(repo.rid)}
          >
            确定
          </Button>
        </div>
      </BasicDialog>
    </>
  );
};

export default ButtonGroup;
