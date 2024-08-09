import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import ReactECharts from 'echarts-for-react';
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
import { BsBookmark, BsPersonCheck } from 'react-icons/bs';
import { GoComment, GoLinkExternal, GoVerified } from 'react-icons/go';

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
import { CustomLink, NoPrefetchLink } from '../links/CustomLink';
import Message from '../message';

import { Repository, RepositoryProps } from '@/types/repository';

interface URLoptionProps {
  repo: Repository;
  t: (key: string, total?: any) => string;
}

type URLoption = {
  url: string;
  key: string;
  name: string;
};

// Icon map for URL options
const iconMap: { [key: string]: JSX.Element } = {
  source: <AiOutlineGithub />,
  home: <AiOutlineHome />,
  document: <AiOutlineFileText />,
  online: <AiOutlineGlobal />,
  download: <AiOutlineCloudDownload />,
};

// Custom hook to handle URL options logic
const useURLOptions = ({ repo, t }: URLoptionProps) => {
  const [urlOptions, setURLOptions] = useState<URLoption[]>([]);

  useEffect(() => {
    const options: URLoption[] = [];
    if (repo.homepage)
      options.push({ key: 'home', name: t('url.home'), url: repo.homepage });
    if (repo.document)
      options.push({
        key: 'document',
        name: t('url.document'),
        url: repo.document,
      });
    if (repo.online)
      options.push({ key: 'online', name: t('url.online'), url: repo.online });
    if (repo.download)
      options.push({
        key: 'download',
        name: t('url.download'),
        url: repo.download,
      });

    if (options.length > 0) {
      options.unshift({ key: 'source', name: t('url.source'), url: repo.url });
      setURLOptions(options);
    } else {
      setURLOptions([]);
    }
  }, [repo]);

  return urlOptions;
};

const Info = ({ repo, t, i18n_lang }: RepositoryProps) => {
  const { isLogin, login } = useLoginContext();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [voteTotal, setVoteTotal] = useState<number>(repo.votes);
  const [isCollected, setIsCollected] = useState<boolean>(false);
  const [collectTotal, setCollectTotal] = useState<number>(repo.collect_total);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [favoriteOptions, setFavoriteOptions] = useState<option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<any>();

  const urlOptions = useURLOptions({ repo, t });

  useEffect(() => {
    const fetchUserRepoStatus = async () => {
      const res = await userRepoStatus(repo.rid);
      if (res.success) {
        setIsVoted(res.is_voted);
        setIsCollected(res.is_collected);
      }
    };
    fetchUserRepoStatus();
  }, [repo.rid]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleURLOptionsToggle = () => setShowDropdown(!showDropdown);

  const handleVote = async () => {
    if (!isLogin) return login();
    const res = isVoted
      ? await cancelVoteRepo(repo.rid)
      : await voteRepo(repo.rid);
    if (res.success) {
      setIsVoted(!isVoted);
      setVoteTotal((prev) => (isVoted ? prev - 1 : prev + 1));
    }
  };

  const handleCollect = async () => {
    if (!isLogin) return login();

    if (isCollected) {
      const res = await cancelCollectRepo(repo.rid);
      if (res.success) {
        setIsCollected(false);
        setCollectTotal((prev) => prev - 1);
        Message.success(t('favorite.cancel'));
      }
    } else {
      const res = await getFavoriteOptions();
      if (res.success) {
        setFavoriteOptions(
          res.data?.map((item: { fid: any; name: any }) => ({
            key: item.fid,
            value: item.name,
          })) || [{ key: '', value: t('favorite.default') }]
        );
        setOpenModal(true);
      }
    }
  };

  const VoteButton = () => {
    const voteClassName = classNames('', {
      'text-xl text-blue-500': isVoted,
      'text-lg': !isVoted,
    });
    return (
      <div className='w-40 py-3 px-6 text-sm font-medium'>
        <div className='flex flex-1 items-center justify-center'>
          <AiFillCaretUp className={voteClassName} />
          <div className='pl-2'>
            {isVoted ? t('info.voted') : t('info.vote')} {voteTotal}
          </div>
        </div>
      </div>
    );
  };

  const handleCopy = () => {
    const text = `${repo.name}：${repo.title.trim()}。\n\n${t(
      'info.copy_desc'
    )}https://hellogithub.com/repository/${repo.rid}`;
    copy(text)
      ? Message.success(t('info.copy_success'))
      : Message.error(t('info.copy_fail'));
  };

  const handleSaveFavorite = async () => {
    const fid = dropdownRef.current?.activeOption.key;
    const res = await collectRepo({ rid: repo.rid, fid });
    if (res.success) {
      setIsCollected(true);
      setCollectTotal(res.data.total);
      setOpenModal(false);
      Message.success(t('favorite.success'));
    } else {
      Message.error(res.message || t('favorite.fail'));
    }
  };

  const handleClickLink = (clickType: string, item_id: string) => {
    redirectRecord('', item_id, clickType);
  };

  const jumpComment = () => {
    const { offsetTop } = document.querySelector('#comment') as HTMLElement;
    window.scrollTo({ top: offsetTop });
  };

  const renderDropdownMenu = () => (
    <div
      className={`absolute ${
        showDropdown ? 'block' : 'hidden'
      } lg:group-hover:block`}
    >
      <div className='relative z-10 mt-1 w-max origin-top-right rounded-md border border-gray-100 bg-white shadow-lg'>
        {urlOptions.map((item) => (
          <CustomLink
            key={item.key}
            href={item.url}
            onClick={() => handleClickLink(item.key, repo.rid)}
          >
            <div className='py-2 px-1'>
              <div className='flex flex-row items-center rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                {iconMap[item.key]}
                <div className='pl-1'>{item.name}</div>
              </div>
            </div>
          </CustomLink>
        ))}
      </div>
    </div>
  );
  const chartOptions = repo.star_history && {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: repo.star_history.x,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      type: 'value',
      min: repo.star_history.min,
      max:
        repo.star_history.increment > 10
          ? repo.star_history.max
          : repo.star_history.min + 10,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        data: repo.star_history.y,
        type: 'line',
        areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
        showSymbol: false,
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter(params: any[]) {
        let result = `${params[0].name}<br>`;
        params.forEach(
          (item) =>
            (result += `${item.marker} Star：${numFormat(item.value, 1)}<br>`)
        );
        return result;
      },
      backgroundColor: 'rgba(32, 33, 36,.7)',
      borderColor: 'rgba(32, 33, 36,0.20)',
      borderWidth: 1,
      axisPointer: { type: 'none' },
      textStyle: { color: '#fff', fontSize: '12' },
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
            <div className='relative'>
              <img
                className='rounded border border-gray-100 bg-white dark:border-gray-800'
                src={repo.author_avatar}
                width='72'
                height='72'
                alt='repo_avatar'
              />
            </div>
          </div>

          <div className='ml-3 hidden max-w-[440px] flex-col gap-y-2 md:flex'>
            <div className='flex flex-row items-center '>
              <CustomLink
                href={repo.url}
                onClick={() => handleClickLink('source', repo.rid)}
              >
                <h1 className='max-w-[400px] cursor-pointer truncate text-ellipsis text-3xl font-semibold hover:text-blue-500'>
                  {repo.full_name.length >= 20 ? repo.name : repo.full_name}
                </h1>
              </CustomLink>
              {repo.is_claimed && (
                <div className=' group relative ml-0.5 flex cursor-pointer items-center'>
                  <GoVerified className='ml-0.5 text-xl text-blue-500 group-hover:text-blue-600' />
                  <div className='absolute hidden flex-row transition-opacity duration-300 group-hover:flex'>
                    <div className='relative left-6 w-0 rounded-md bg-gray-300 p-1 text-xs font-medium text-white group-hover:w-max dark:bg-gray-700 dark:text-gray-200'>
                      {t('info.claimed')}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='truncate text-ellipsis text-xl font-normal text-gray-500'>
              {i18n_lang == 'en' ? repo.title_en || repo.title : repo.title}
            </div>
          </div>

          <div className='flex flex-1 justify-end'>
            <Score repo={repo} t={t} />
          </div>
        </div>
        <div className='flex flex-1 flex-row flex-wrap justify-between'>
          <div className='mb-2 flex w-full flex-col gap-y-2 md:hidden'>
            <div className='flex flex-row items-center '>
              <CustomLink
                href={repo.url}
                onClick={() => handleClickLink('source', repo.rid)}
              >
                <h1 className='max-w-[320px] truncate text-ellipsis text-3xl font-semibold'>
                  {repo.full_name.length >= 20 ? repo.name : repo.full_name}
                </h1>
              </CustomLink>
              {repo.is_claimed && (
                <GoVerified className='ml-0.5 text-xl text-blue-500 group-hover:text-blue-600' />
              )}
            </div>
            <span className='text-ellipsis whitespace-pre-wrap text-xl font-normal text-gray-500'>
              {i18n_lang == 'en' ? repo.title_en || repo.title : repo.title}
            </span>
          </div>
          <div className='hidden md:flex'>
            {repo.star_history ? (
              <div className='flex flex-col items-center'>
                <ReactECharts
                  option={chartOptions}
                  style={{ height: 54, width: 320 }}
                  opts={{ renderer: 'svg' }}
                />
                <div className='text-xs text-gray-500'>
                  {t('history.past_day_desc', {
                    days: repo.star_history.x.length,
                  })}
                  {t('history.total_desc', {
                    total: numFormat(repo.star_history.increment, 1),
                  })}
                </div>
              </div>
            ) : (
              <div className='flex flex-col justify-end px-1 pb-1 text-xs text-gray-500'>
                <div>{t('history.fail_desc')}</div>
              </div>
            )}
          </div>
          <div className='flex h-[72px] w-full flex-row items-end gap-x-2 md:mt-0 md:w-64 lg:w-72'>
            <div className='group relative lg:block'>
              <div className='hidden lg:block'>
                <CustomLink
                  href={repo.url}
                  onClick={() => handleClickLink('source', repo.rid)}
                >
                  <Button
                    variant='white-outline'
                    className='origin-top scale-95 transition duration-200 ease-in-out hover:scale-100'
                  >
                    {urlOptions.length > 0 ? (
                      <div className='flex flex-row items-center py-3 px-1'>
                        <div className='px-1 text-sm font-medium'>
                          {t('info.vite')}
                        </div>
                        <AiOutlineDown size={10} />
                      </div>
                    ) : (
                      <div className='p-3 text-sm font-medium'>
                        {t('info.vite')}
                      </div>
                    )}
                  </Button>
                </CustomLink>
              </div>

              <div className='block lg:hidden' ref={dropdownRef}>
                <Button
                  variant='white-outline'
                  className='origin-top scale-95 transition duration-200 ease-in-out hover:scale-100'
                  onClick={handleURLOptionsToggle} // 添加点击事件处理器
                >
                  {urlOptions.length > 0 ? (
                    <div className='flex flex-row items-center py-3 px-1'>
                      <div className='px-1 text-sm font-medium'>
                        {t('info.vite')}
                      </div>
                      <AiOutlineDown size={10} />
                    </div>
                  ) : (
                    <CustomLink
                      href={repo.url}
                      onClick={() => handleClickLink('source', repo.rid)}
                    >
                      <div className='p-3 text-sm font-medium'>
                        {t('info.vite')}
                      </div>
                    </CustomLink>
                  )}
                </Button>
              </div>
              {renderDropdownMenu()}
            </div>
            <Button
              variant={isVoted ? 'blue-outline' : 'gradient'}
              className='flex-1 origin-top scale-95 justify-center transition duration-200 ease-in-out hover:scale-100'
              onClick={handleVote}
            >
              <VoteButton />
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
                  <span>{t('info.opensource')}</span>
                  <span className='mx-0.5 md:mx-1.5'>•</span>
                  <NoPrefetchLink href={`/license/${repo.license_lid}`}>
                    <span className='cursor-pointer text-blue-500'>
                      {repo.license}
                    </span>
                  </NoPrefetchLink>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-row gap-x-4 text-sm'>
            {!repo.is_claimed && (
              <NoPrefetchLink href={`/repository/${repo.rid}/embed`}>
                <div className='flex cursor-pointer items-center justify-center text-blue-500 hover:text-current active:text-gray-400 md:hover:text-blue-600'>
                  <BsPersonCheck className='mr-2' size={16} />
                  {t('info.unclaim')}
                </div>
              </NoPrefetchLink>
            )}

            <div
              onClick={jumpComment}
              className='hidden cursor-pointer items-center justify-center hover:text-blue-500 active:text-gray-400 md:flex'
            >
              <GoComment className='mr-2' size={16} />
              {t('info.discuss')}
            </div>
            <div
              className={isCollected ? 'text-blue-500' : ''}
              onClick={handleCollect}
            >
              <div className='flex cursor-pointer items-center justify-center hover:text-blue-500 active:text-gray-400 md:hover:text-blue-500'>
                <BsBookmark className='mr-2' size={16} />
                {isCollected ? numFormat(collectTotal, 1) : t('info.collect')}
              </div>
            </div>
            <div
              className='flex cursor-pointer items-center justify-center hover:text-current active:text-gray-400 md:hover:text-blue-500'
              onClick={handleCopy}
            >
              <GoLinkExternal className='mr-2' size={16} />
              {t('info.share')}
            </div>
          </div>
        </div>
      </div>
      <MoreInfo repo={repo} t={t} />

      {/* 选择收藏夹的弹窗 */}
      <BasicDialog
        className='w-5/6 max-w-sm rounded-lg p-6'
        visible={openModal}
        maskClosable={false}
        title={
          <>
            {t('favorite.title')}
            <p className='mt-3 text-xs text-gray-500'>{t('favorite.desc')}</p>
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
          <AddCollection onFinish={getFavoriteOptions} />
          <Button
            className='py-0 px-3'
            variant='gradient'
            onClick={handleSaveFavorite}
          >
            {t('favorite.save')}
          </Button>
        </div>
      </BasicDialog>
    </div>
  );
};

export default Info;
