import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import ReactECharts from 'echarts-for-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AiFillCaretUp,
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
import { redirectRecord } from '@/services/home';
import {
  cancelCollectRepo,
  cancelVoteRepo,
  collectRepo,
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
  const { isLogin, login } = useLoginContext();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [voteTotal, setVoteTotal] = useState<number>(0);
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [collectTotal, setCollectTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favoriteOptions, setFavoriteOptions] = useState<option[]>([]);
  const [urlOptions, setURLOptions] = useState<URLoption[]>([]);

  const dropdownRef = useRef<any>();

  const getUserRepoStatus = async (rid: string) => {
    // 调用接口查看项目是否点赞
    const res = await userRepoStatus(rid);
    if (res.success) {
      setIsVoted(res.is_voted);
      setIsCollected(res.is_collected);
    }
  };

  const onClickLink = (clickType: string, item_id: string) => {
    redirectRecord('', item_id, clickType);
  };

  const voteClassName = () =>
    classNames('', {
      'text-xl text-blue-500': isVoted,
      'text-lg': !isVoted,
    });

  const onClickVote = async (rid: string) => {
    if (!isLogin) {
      return login();
    }
    if (!isVoted) {
      const res = await voteRepo(rid);
      if (res.success) {
        setVoteTotal(res.data.total);
        setIsVoted(true);
      } else {
        Message.error(res.message as string);
      }
    } else {
      const res = await cancelVoteRepo(rid);
      if (res.success) {
        setIsVoted(false);
        setVoteTotal(voteTotal - 1);
      }
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

  const onClickCollect = async (rid: string) => {
    if (!isLogin) {
      return login();
    }

    if (!isCollected) {
      getUserFavoriteOptions();
      setOpenModal(true);
    } else {
      const res = await cancelCollectRepo(rid);
      if (res.success) {
        setIsCollected(false);
        setCollectTotal(collectTotal - 1);
        Message.success('取消收藏');
      }
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'source':
        return <AiOutlineGithub />;
      case 'home':
        return <AiOutlineHome />;
      case 'document':
        return <AiOutlineFileText />;
      case 'online':
        return <AiOutlineGlobal />;
      case 'download':
        return <AiOutlineCloudDownload />;
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
      options.unshift({ key: 'source', name: '源码', url: repo.url });
      setURLOptions(options);
    } else {
      setURLOptions([]);
    }
  };

  useEffect(() => {
    getUserRepoStatus(repo.rid);
    setVoteTotal(repo.votes);
    setCollectTotal(repo.collect_total);
    handleURLOptions(repo);
  }, [repo]);

  const option = repo.star_history && {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: repo.star_history.x,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      min: repo.star_history.min,
      max:
        repo.star_history.increment > 10
          ? repo.star_history.max
          : repo.star_history.min + 10,
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        data: repo.star_history.y,
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246,.8)' },
              { offset: 0.5, color: 'rgba(59, 130, 246,.6)' },
              { offset: 0.8, color: 'rgba(59, 130, 246,.4)' },
              { offset: 0.9, color: 'rgba(59, 130, 246,.2)' },
              { offset: 0.95, color: 'rgba(59, 130, 246,.1)' },
              { offset: 0.98, color: 'rgba(59, 130, 246,.05)' },
              { offset: 0.99, color: 'rgba(59, 130, 246,.01)' },
              { offset: 1, color: 'rgba(59, 130, 246,.01)' },
            ],
          },
        },
        showSymbol: false,
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any[]) {
        let result = params[0].name + '<br>';
        params.forEach(function (item) {
          result += item.marker + ' Star：' + numFormat(item.value, 1) + '<br>';
        });
        return result;
      },
      backgroundColor: 'rgba(32, 33, 36,.7)',
      borderColor: 'rgba(32, 33, 36,0.20)',
      borderWidth: 1,
      axisPointer: {
        type: 'none',
      },
      textStyle: {
        color: '#fff',
        fontSize: '12',
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      top: '20%',
      bottom: '10%',
    },
  };

  return (
    <div className='p-1'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex flex-row'>
          <div className='flex min-w-[72px] items-center'>
            <img
              className='rounded border border-gray-100 bg-white dark:border-gray-800'
              src={repo.author_avatar}
              width='72'
              height='72'
              alt='repo_avatar'
            />
          </div>
          <div className='ml-3 hidden max-w-[440px] flex-col gap-y-2 md:flex'>
            <CustomLink
              href={repo.url}
              onClick={() => onClickLink('source', repo.rid)}
            >
              <div className='cursor-pointer truncate text-ellipsis text-3xl font-semibold hover:text-blue-500'>
                {repo.full_name}
              </div>
            </CustomLink>

            <div className='truncate text-ellipsis text-xl font-normal text-gray-500'>
              {repo.title}
            </div>
          </div>

          <div className='flex flex-1 justify-end'>
            <Score repo={repo} />
          </div>
        </div>
        <div className='flex flex-1 flex-row flex-wrap justify-between'>
          <div className='mb-2 flex w-full flex-col gap-y-2 md:hidden'>
            <CustomLink
              href={repo.url}
              onClick={() => onClickLink('source', repo.rid)}
            >
              <div className='truncate text-ellipsis text-3xl font-semibold'>
                {repo.full_name.length >= 20 ? repo.name : repo.full_name}
              </div>
            </CustomLink>
            <span className='text-ellipsis whitespace-pre-wrap text-xl font-normal text-gray-500'>
              {repo.title}
            </span>
          </div>
          <div className='hidden md:flex'>
            {repo.star_history ? (
              <div className='flex flex-col items-center'>
                <ReactECharts
                  option={option}
                  style={{ height: 54, width: 320 }}
                  opts={{ renderer: 'svg' }}
                />
                <div className='text-xs text-gray-500'>{`过去 ${
                  repo.star_history.x.length
                } 天共收获 ${numFormat(
                  repo.star_history.increment,
                  1
                )} 颗 Star ✨`}</div>
              </div>
            ) : (
              <div className='flex flex-col justify-end px-1 pb-1 text-xs text-gray-500'>
                <div>暂无 Star 历史数据</div>
              </div>
            )}
          </div>
          <div className='flex h-[72px] w-full flex-row items-end gap-x-2 md:mt-0 md:w-64 lg:w-72'>
            <div className='group hidden lg:block'>
              <CustomLink
                href={repo.url}
                onClick={() => onClickLink('source', repo.rid)}
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
              {urlOptions.length > 0 && (
                <div className='absolute hidden group-hover:block'>
                  <div className='relative z-10 mt-1 w-fit origin-top-right rounded-md border border-gray-100 bg-white shadow-lg'>
                    {urlOptions.map((item) => (
                      <CustomLink
                        href={item.url}
                        key={item.key}
                        onClick={() => onClickLink(item.key, repo.rid)}
                      >
                        <div className='py-2 px-1'>
                          <div className='flex flex-row items-center rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                            {getIcon(item.key)}
                            <div className='pl-1'>{item.name}</div>
                          </div>
                        </div>
                      </CustomLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='block lg:hidden'>
              <CustomLink
                href={repo.url}
                onClick={() => onClickLink('source', repo.rid)}
              >
                <Button
                  variant='white-outline'
                  className='origin-top scale-95 transition duration-200 ease-in-out hover:scale-100'
                >
                  <div className='p-3 text-sm font-medium'>访问</div>
                </Button>
              </CustomLink>
            </div>

            <Button
              variant={isVoted ? 'blue-outline' : 'gradient'}
              className='flex-1 origin-top scale-95 justify-center transition duration-200 ease-in-out hover:scale-100'
              onClick={() => onClickVote(repo.rid)}
            >
              <div className='w-40 py-3 px-6 text-sm font-medium'>
                <div className='flex flex-1 items-center justify-center'>
                  <AiFillCaretUp className={voteClassName()} />
                  <div className='pl-2'>
                    {isVoted ? '已赞' : '点赞'} {voteTotal}
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className='my-6 mb-4 flex flex-col'>
        <div className='flex flex-row justify-between align-middle'>
          <div className='flex flex-row gap-x-1'>
            <div className='flex items-center justify-center text-sm text-gray-500'>
              {repo.license_lid && (
                <div className='flex-row items-center md:flex'>
                  <span>开源</span>
                  <span className='mx-0.5 md:mx-1.5'>•</span>
                  <Link href={`/license/${repo.license_lid}`}>
                    <span className='cursor-pointer text-blue-500'>
                      {repo.license}
                    </span>
                  </Link>
                </div>
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

            <div
              className={isCollected ? 'text-blue-500' : ''}
              onClick={() => onClickCollect(repo.rid)}
            >
              <div className='flex cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:hover:text-blue-500'>
                <BsBookmark className='mr-2' size={16} />
                {isCollected ? numFormat(collectTotal, 1) : '收藏'}
              </div>
            </div>

            <Link href={`/repository/${repo.rid}/embed`}>
              <div className='hidden cursor-pointer items-center justify-center hover:text-current active:!text-gray-400 md:flex md:hover:text-blue-500'>
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
