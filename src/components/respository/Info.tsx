import copy from 'copy-to-clipboard';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AiFillCaretUp,
  AiOutlineCaretUp,
  AiOutlineCloudDownload,
  AiOutlineDown,
  AiOutlineFileText,
  AiOutlineGithub,
  AiOutlineGlobal,
  AiOutlineHome,
} from 'react-icons/ai';
import { BsBookmark, BsFileEarmarkCode } from 'react-icons/bs';
import { GoComment, GoLinkExternal } from 'react-icons/go';

import { useLoginContext } from '@/hooks/useLoginContext';

import Score from '@/components/respository/Score';

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

import MoreInfo from './MoreInfo';
import Button from '../buttons/Button';
import AddCollection from '../collection/AddCollection';
import BasicDialog from '../dialog/BasicDialog';
import Dropdown, { option } from '../dropdown/Dropdown';
import CustomLink from '../links/CustomLink';
import Message from '../message';

import { Repository, RepositoryProps } from '@/types/reppsitory';

type URLoption = {
  url: string;
  key: string;
  name: string;
};

const Info: NextPage<RepositoryProps> = ({ repo }) => {
  const { isLogin } = useLoginContext();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [voteTotal, setVoteTotal] = useState<number>(0);
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [collectTotal, setCollectTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favoriteOptions, setFavoriteOptions] = useState<option[]>([]);
  const [urlOptions, setURLOptions] = useState<URLoption[]>([]);

  const dropdownRef = useRef<any>();

  const onClickLink = (clickType: string, rid: string) => {
    if (clickType == 'github') {
      recordGoGithub(rid);
    }
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
      setVoteTotal(res.data.total);
      setIsVoted(true);
    } else {
      Message.error(res.message as string);
    }
  };

  const onClickCollect = () => {
    if (isLogin) {
      getUserFavoriteOptions();
      setOpenModal(true);
    } else {
      Message.error('请先登录~');
    }
  };

  const onCancelVote = async (rid: string) => {
    const res = await cancelVoteRepo(rid);
    if (res.success) {
      setIsVoted(false);
      setVoteTotal(voteTotal - 1);
    }
  };

  const onCancelCollect = async (rid: string) => {
    const res = await cancelCollectRepo(rid);
    if (res.success) {
      setIsCollected(false);
      setCollectTotal(collectTotal - 1);
      Message.success('取消收藏');
    }
  };

  const handleCopy = (repo: Repository) => {
    const text = `${
      repo.name
    }：${repo.title.trim()}。\n\n更多详情尽在：https://hellogithub.com/repository/${
      repo.rid
    }`;
    if (copy(text)) {
      Message.success('项目信息已复制，快去分享吧！');
    } else Message.error('复制失败');
  };

  // 收藏-确定
  const onFavoriteSave = async (rid: string) => {
    const fid = dropdownRef.current?.activeOption.key;
    const res = await collectRepo({ rid, fid });
    if (res.success) {
      Message.success('收藏成功~');
      setOpenModal(false);
      setCollectTotal(res.data.total);
      setIsCollected(true);
    } else {
      Message.error(res.message || '收藏失败');
    }
  };

  const jumpComment = () => {
    const { offsetTop } = document.querySelector('#comment') as HTMLElement;
    // 根据 offsetTop 滚动到指定位置
    window.scrollTo({
      top: offsetTop,
    });
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'github':
        return (
          <>
            <AiOutlineGithub />
            <div className='pl-1'>源码</div>
          </>
        );
      case 'home':
        return (
          <>
            <AiOutlineHome />
            <div className='pl-1'>官网</div>
          </>
        );
      case 'document':
        return (
          <>
            <AiOutlineFileText />
            <div className='pl-1'>文档</div>
          </>
        );
      case 'online':
        return (
          <>
            <AiOutlineGlobal />
            <div className='pl-1'>演示</div>
          </>
        );
      case 'download':
        return (
          <>
            <AiOutlineCloudDownload />
            <div className='pl-1'>下载</div>
          </>
        );
    }
  };

  const handleURLOptions = (repo: Repository) => {
    const options: URLoption[] = [];
    if (repo.homepage != null && repo.homepage.length > 0) {
      options.push({ key: 'home', name: '官网', url: repo.homepage });
    }
    if (repo.document != null && repo.document.length > 0) {
      options.push({ key: 'document', name: '文档', url: repo.document });
    }
    if (repo.online != null && repo.online.length > 0) {
      options.push({ key: 'online', name: '演示', url: repo.online });
    }
    if (repo.download != null && repo.download.length > 0) {
      options.push({ key: 'download', name: '下载', url: repo.download });
    }
    if (options.length > 0) {
      options.unshift({ key: 'github', name: 'GitHub', url: repo.url });
      setURLOptions(options);
    }
  };

  useEffect(() => {
    getUserRepoStatus(repo.rid);
    setVoteTotal(repo.votes);
    setCollectTotal(repo.collect_total);
    handleURLOptions(repo);
  }, [repo]);

  return (
    <div className='p-1'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row'>
          <div className='flex items-center'>
            <a>
              <img
                className='rounded-sm border border-gray-100 bg-white dark:border-gray-800'
                src={repo.author_avatar}
                width='72'
                height='72'
                alt='repo_avatar'
              />
            </a>
          </div>
          <div className='flex flex-1 justify-end'>
            <Score repo={repo}></Score>
          </div>
        </div>
        <div className='flex flex-1 flex-row flex-wrap justify-between'>
          <div className='flex w-full flex-col gap-y-2 md:w-6/12 lg:w-7/12'>
            <h1 className='truncate text-ellipsis text-3xl font-semibold'>
              {repo.name}
            </h1>
            <h2 className='truncate text-ellipsis whitespace-pre-wrap text-xl font-normal text-gray-500'>
              {repo.title}
            </h2>
          </div>
          <div className='mt-4 flex w-full flex-row items-end gap-x-2 md:mt-0 md:w-64 lg:w-72'>
            <div className='group hidden lg:block'>
              <CustomLink
                href={repo.url}
                onClick={() => onClickLink('github', repo.rid)}
              >
                <Button
                  variant='white-outline'
                  className='origin-top scale-95 transition duration-200 ease-in-out hover:scale-100'
                >
                  {urlOptions.length > 0 ? (
                    <div className='flex flex-row items-center py-3 px-1'>
                      <div className='px-1 text-sm font-medium'>访问</div>
                      <AiOutlineDown size={10} />
                    </div>
                  ) : (
                    <div className='p-3 text-sm font-medium'>访问</div>
                  )}
                </Button>
              </CustomLink>
              {urlOptions.length > 0 ? (
                <div className='absolute hidden group-hover:block'>
                  <div className='relative z-10 mt-2 w-fit origin-top-right rounded-md border border-gray-100 bg-white shadow-lg'>
                    {urlOptions.map((item) => (
                      <CustomLink
                        href={item.url}
                        key={item.key}
                        onClick={() => onClickLink(item.key, repo.rid)}
                      >
                        <div className='py-2 px-1'>
                          <div className='flex flex-row items-center rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                            {getIcon(item.key)}
                          </div>
                        </div>
                      </CustomLink>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className='block lg:hidden'>
              <CustomLink
                href={repo.url}
                onClick={() => onClickLink('github', repo.rid)}
              >
                <Button
                  variant='white-outline'
                  className='origin-top scale-95 transition duration-200 ease-in-out hover:scale-100'
                >
                  <div className='p-3 text-sm font-medium'>访问</div>
                </Button>
              </CustomLink>
            </div>

            {isVoted ? (
              <Button
                variant='blue-outline'
                className='flex-1 origin-top scale-95 justify-center transition duration-200 ease-in-out hover:scale-100'
                onClick={() => onCancelVote(repo.rid)}
              >
                <div className='w-40 py-3 px-6 text-sm font-medium'>
                  <div className='flex flex-1 items-center justify-center'>
                    <AiFillCaretUp className='text-xl text-blue-500' />
                    <div className='pl-2'>点赞 {voteTotal}</div>
                  </div>
                </div>
              </Button>
            ) : (
              <Button
                variant='gradient'
                className='flex-1 origin-top scale-95 justify-center transition duration-200 ease-in-out hover:scale-100'
                onClick={() => onClickVote(repo.rid)}
              >
                <div className='w-40 py-3 px-6 text-sm font-medium'>
                  <div className='flex flex-1 items-center justify-center'>
                    <AiOutlineCaretUp className='text-lg' />
                    <div className='pl-2'>点赞 {voteTotal}</div>
                  </div>
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='mt-6 flex flex-col pb-4'>
        <div className='flex flex-row justify-between align-middle'>
          <div className='flex flex-row gap-x-1'>
            <div className='flex items-center  justify-center text-sm text-gray-500'>
              {repo.license_lid ? (
                <div className='hidden md:block'>
                  开源<span className='mx-1.5'>•</span>
                  {repo.license}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className='flex flex-row gap-x-4 text-sm'>
            <div onClick={jumpComment}>
              <div className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'>
                <GoComment className='mr-2' size={16} />
                讨论
              </div>
            </div>
            {isCollected ? (
              <div
                className='text-blue-500'
                onClick={() => onCancelCollect(repo.rid)}
              >
                <div className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'>
                  <BsBookmark className='mr-2' size={16} />
                  {numFormat(collectTotal, 1)}
                </div>
              </div>
            ) : (
              <div onClick={onClickCollect}>
                <div className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'>
                  <BsBookmark className='mr-2' size={16} />
                  收藏
                </div>
              </div>
            )}
            <Link href={`/repository/${repo.rid}/embed`}>
              <div className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'>
                <BsFileEarmarkCode className='mr-2' size={16} />
                嵌入
              </div>
            </Link>
            <div
              className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'
              onClick={() => handleCopy(repo)}
            >
              <GoLinkExternal className='mr-2' size={16} />
              分享
            </div>
          </div>
        </div>
      </div>
      <MoreInfo repo={repo} />

      {/* 选择收藏夹的弹窗 */}
      <BasicDialog
        className='w-5/6 max-w-sm rounded-lg p-6'
        visible={openModal}
        maskClosable={false}
        title={
          <>
            选择收藏夹
            <p className='mt-3 text-xs text-gray-500'>
              收藏的项目在「我的主页」可以找到
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
              getUserFavoriteOptions();
            }}
          />
          <Button
            className='py-0 px-3'
            variant='gradient'
            onClick={() => onFavoriteSave(repo.rid)}
          >
            确定
          </Button>
        </div>
      </BasicDialog>
    </div>
  );
};

export default Info;
