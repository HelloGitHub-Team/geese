import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useMemo, useState } from 'react';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import useSWRImmutable from 'swr/immutable';

import { RepoModal } from '@/components/dialog/RepoModal';
import { PeriodicalSkeleton } from '@/components/loading/skeleton';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';

import { fetcher } from '@/services/base';
import { getVolumeBullets } from '@/services/volume';
import { makeUrl } from '@/utils/api';
import { nameMap } from '@/utils/constants';
import { numFormat } from '@/utils/util';

import {
  AllItems,
  BulletItem,
  CategroyName,
  VolumeNum,
} from '@/types/periodical';

type TabType = 'volume' | 'category';

const categoryIconMap: Record<string, string> = {
  'C 项目': 'c',
  'C# 项目': 'csharp',
  'C++ 项目': 'cplusplus',
  'CSS 项目': 'web',
  'Go 项目': 'golang',
  'Java 项目': 'java',
  'JavaScript 项目': 'javascript',
  'Kotlin 项目': 'kotlin',
  'Objective-C 项目': 'mac',
  'PHP 项目': 'php',
  'Python 项目': 'python',
  'Ruby 项目': 'ruby',
  'Rust 项目': 'rust',
  'Swift 项目': 'swift',
  'TypeScript 项目': 'typescript',
  人工智能: 'ai',
  其它: 'collection',
  开源书籍: 'book',
  机器学习: 'ai',
};

// 弹幕行配置 - 上下各两条，紧贴封面卡片边缘
const DANMAKU_ROWS = [
  { position: 'top-0', animation: 'danmaku 120s linear infinite' },
  { position: 'top-8', animation: 'danmaku-reverse 140s linear infinite' },
  {
    position: 'bottom-16 md:bottom-12',
    animation: 'danmaku 110s linear infinite',
  },
  {
    position: 'bottom-8 md:bottom-4',
    animation: 'danmaku-reverse 130s linear infinite',
  },
];

const BulletTag = ({
  item,
  isEn,
  onClick,
  onHover,
}: {
  item: BulletItem;
  isEn: boolean;
  onClick: (fullName: string) => void;
  onHover: (isHovered: boolean) => void;
}) => {
  const title = isEn
    ? item.title_en || item.title
    : item.title || item.title_en;
  if (!title) return null;

  return (
    <div
      className='danmaku-item mx-3 flex shrink-0 cursor-pointer items-center rounded-full py-1 pl-1 pr-3 opacity-40 transition-opacity duration-300 hover:opacity-75'
      style={{
        backgroundColor: item.lang_color ? `${item.lang_color}20` : '#e5e7eb',
      }}
      onClick={() => onClick(item.full_name)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt=''
          className='h-6 w-6 shrink-0 rounded-full'
        />
      )}
      <span
        className='ml-1.5 whitespace-nowrap text-xs'
        style={{ color: item.lang_color || '#6b7280' }}
      >
        {title}
      </span>
    </div>
  );
};

const DanmakuRow = ({
  bullets,
  config,
  rowIndex,
  totalRows,
  isEn,
  isPaused,
  onItemClick,
  onItemHover,
}: {
  bullets: BulletItem[];
  config: typeof DANMAKU_ROWS[0];
  rowIndex: number;
  totalRows: number;
  isEn: boolean;
  isPaused: boolean;
  onItemClick: (fullName: string) => void;
  onItemHover: (isHovered: boolean) => void;
}) => {
  const items = useMemo(() => {
    const chunkSize = Math.ceil(bullets.length / totalRows);
    const start = rowIndex * chunkSize;
    const rowBullets = bullets.slice(start, start + chunkSize);
    const finalBullets =
      rowBullets.length > 0 ? rowBullets : bullets.slice(0, chunkSize);
    return [...finalBullets, ...finalBullets, ...finalBullets, ...finalBullets];
  }, [bullets, rowIndex, totalRows]);

  if (items.length === 0) return null;

  return (
    <div
      className={`danmaku-row absolute ${config.position} flex items-center whitespace-nowrap`}
      style={{
        animation: config.animation,
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
    >
      {items.map((item, idx) => (
        <BulletTag
          key={`row${rowIndex}-${idx}`}
          item={item}
          isEn={isEn}
          onClick={onItemClick}
          onHover={onItemHover}
        />
      ))}
    </div>
  );
};

const extractMainColors = (bullets: BulletItem[]): string[] => {
  const colorCount: Record<string, number> = {};
  bullets.forEach((item) => {
    if (item.lang_color) {
      colorCount[item.lang_color] = (colorCount[item.lang_color] || 0) + 1;
    }
  });
  return Object.entries(colorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color);
};

const PeriodicalIndexPage: NextPage = () => {
  const { t, i18n } = useTranslation('periodical');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('volume');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isValidating } = useSWRImmutable<AllItems>(
    makeUrl('/periodical/'),
    fetcher
  );

  const categories = data?.success ? data.categories : [];
  const volumes = data?.success ? data.volumes : [];
  const repo_total = data?.success ? data.repo_total : 0;
  const currentVolume = volumes.length > 0 ? volumes[currentIndex]?.num : 0;

  const [bullets, setBullets] = useState<BulletItem[]>([]);
  const [isDanmakuPaused, setIsDanmakuPaused] = useState(false);

  useEffect(() => {
    const num = currentIndex === 0 ? undefined : currentVolume;
    if (currentIndex === 0 || currentVolume > 0) {
      getVolumeBullets(num).then((res) => {
        setBullets(res.success ? res.data : []);
      });
    }
  }, [currentVolume, currentIndex]);

  const mainColors = useMemo(() => extractMainColors(bullets), [bullets]);

  const categoryItems = useMemo(() => {
    return categories.map((item: CategroyName) => ({
      ...item,
      value: item.name,
      name:
        i18n.language === 'en'
          ? nameMap[item.name] || item.name.split(' ')[0]
          : item.name.replace(/ ?项目$/, ''),
    }));
  }, [categories, i18n.language]);

  const displayVolumes = useMemo(() => {
    const maxDisplay = 29;
    return volumes.length > maxDisplay + 1
      ? volumes.slice(0, maxDisplay)
      : volumes;
  }, [volumes]);

  const showEarlierButton = volumes.length > 30;

  const handlePrevVolume = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const handleNextVolume = () =>
    currentIndex < volumes.length - 1 && setCurrentIndex(currentIndex + 1);
  const handleVolumeClick = (num: number) =>
    router.push(`/periodical/volume/${num}`);
  const handleCategoryClick = (value: string) =>
    router.push(`/periodical/category/${encodeURIComponent(value)}`);
  const handleBulletClick = (fullName: string) =>
    router.push(`/repository/${fullName}`);

  const tabClassName = (tab: TabType) =>
    classNames(
      'px-4 py-2 text-sm cursor-pointer transition-colors',
      activeTab === tab
        ? 'text-blue-500 border-b-2 border-blue-500'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    );

  return (
    <>
      <Seo title={t('title')} description={t('description')} />
      <div className='relative'>
        <Navbar middleText={t('nav')} />
        <div className='my-2 bg-white dark:bg-gray-800 md:rounded-lg'>
          {isValidating ? (
            <div className='px-4 py-6'>
              <PeriodicalSkeleton />
            </div>
          ) : (
            <>
              <div className='relative z-0 overflow-hidden px-4 pb-3 pt-6'>
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/90 dark:from-gray-800/90 dark:via-gray-800/60 dark:to-gray-800/90' />

                {bullets.length > 0 && (
                  <div className='danmaku-container absolute inset-x-0 top-6 z-[5] h-48 overflow-hidden md:h-52'>
                    {DANMAKU_ROWS.map((config, idx) => (
                      <DanmakuRow
                        key={idx}
                        bullets={bullets}
                        config={config}
                        rowIndex={idx}
                        totalRows={DANMAKU_ROWS.length}
                        isEn={i18n.language === 'en'}
                        isPaused={isDanmakuPaused}
                        onItemClick={handleBulletClick}
                        onItemHover={setIsDanmakuPaused}
                      />
                    ))}
                  </div>
                )}

                <div className='pointer-events-none relative z-10 flex flex-col items-center'>
                  <div className='pointer-events-auto flex items-center gap-4'>
                    <button
                      onClick={handlePrevVolume}
                      disabled={currentIndex === 0}
                      className={classNames(
                        'flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors dark:bg-gray-800',
                        currentIndex === 0
                          ? 'cursor-not-allowed border-gray-100 text-gray-300 dark:border-gray-700 dark:text-gray-600'
                          : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400'
                      )}
                    >
                      <GoChevronLeft size={20} />
                    </button>

                    <div
                      onClick={() => handleVolumeClick(currentVolume)}
                      className='group relative cursor-pointer'
                    >
                      <div className='dark:via-gray-750 relative flex h-40 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-br from-slate-50 via-white to-gray-50 shadow-md transition-all group-hover:border-blue-400 group-hover:shadow-lg dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 md:h-48 md:w-40'>
                        <div
                          className='pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]'
                          style={{
                            backgroundImage: `
                              linear-gradient(90deg, #64748b 1px, transparent 1px),
                              linear-gradient(#64748b 1px, transparent 1px)
                            `,
                            backgroundSize: '10px 10px',
                          }}
                        />
                        <div
                          className='absolute left-0 top-0 h-full w-1.5 rounded-l-md'
                          style={{
                            background:
                              mainColors.length >= 2
                                ? `linear-gradient(to bottom, ${mainColors[0]}, ${mainColors[1]})`
                                : 'linear-gradient(to bottom, #3b82f6, #8b5cf6)',
                          }}
                        />
                        {currentIndex === 0 && (
                          <div className='absolute -right-1 -top-1 z-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm'>
                            NEW
                          </div>
                        )}
                        <div className='relative z-[1] text-5xl font-black tracking-tight text-gray-800 dark:text-gray-100 md:text-6xl'>
                          {currentVolume}
                        </div>
                        <div className='relative z-[1] mt-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                          {t('issue_label')}
                        </div>
                        {mainColors.length > 0 && (
                          <div className='relative z-[1] mt-2 flex gap-1'>
                            {mainColors.slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className='h-1.5 w-5 rounded-full shadow-sm'
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white shadow-md transition-all group-hover:bg-blue-600 group-hover:shadow-lg'>
                        {t('read_now')}
                      </div>
                    </div>

                    <button
                      onClick={handleNextVolume}
                      disabled={currentIndex === volumes.length - 1}
                      className={classNames(
                        'flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors dark:bg-gray-800',
                        currentIndex === volumes.length - 1
                          ? 'cursor-not-allowed border-gray-100 text-gray-300 dark:border-gray-700 dark:text-gray-600'
                          : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400'
                      )}
                    >
                      <GoChevronRight size={20} />
                    </button>
                  </div>

                  <h1 className='mt-5 text-xl font-bold text-gray-800 dark:text-gray-100'>
                    HelloGitHub {t('monthly')}
                  </h1>
                  <p className='mt-2 max-w-md text-center text-sm leading-6 text-gray-500 dark:text-gray-400'>
                    <Trans ns='periodical' i18nKey='p_text' />
                  </p>
                </div>
              </div>

              <div className='flex justify-center border-b border-gray-100 dark:border-gray-700'>
                {(['volume', 'category'] as TabType[]).map((tab) => (
                  <div
                    key={tab}
                    className={tabClassName(tab)}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`tab_${tab}`)}
                  </div>
                ))}
              </div>

              <div className='px-4 py-4'>
                {activeTab === 'volume' ? (
                  <div className='grid grid-cols-5 gap-2 md:grid-cols-10'>
                    {displayVolumes.map((item: VolumeNum) => (
                      <div
                        key={item.num}
                        onClick={() => handleVolumeClick(item.num)}
                        className='flex cursor-pointer items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-3 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-600'
                      >
                        <span className='text-lg font-medium text-gray-700 dark:text-gray-200'>
                          {item.num}
                        </span>
                      </div>
                    ))}
                    {showEarlierButton && (
                      <div
                        onClick={() =>
                          handleVolumeClick(volumes[volumes.length - 1].num)
                        }
                        className='flex cursor-pointer items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-3 text-sm transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-600'
                      >
                        <span className='text-gray-500 dark:text-gray-400'>
                          {t('earlier')}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='grid grid-cols-4 gap-2 md:grid-cols-6'>
                    {categoryItems.map((item: CategroyName) => (
                      <div
                        key={item.name}
                        onClick={() =>
                          handleCategoryClick(item.value || item.name)
                        }
                        className='flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 px-1 py-2.5 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-600'
                      >
                        {categoryIconMap[item.value || ''] && (
                          <i
                            className={`iconfont icon-${
                              categoryIconMap[item.value || '']
                            } text-lg text-gray-400 dark:text-gray-500`}
                          />
                        )}
                        <span className='mt-0.5 w-full truncate text-center text-xs font-medium text-gray-700 dark:text-gray-200'>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='border-t border-gray-100 px-4 py-3 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {t('project_count', { total: numFormat(repo_total, 1) })}
                  </span>
                  <RepoModal>
                    <span className='flex cursor-pointer items-center text-sm text-blue-500 hover:text-blue-600'>
                      {t('submit_project')}
                      <GoChevronRight className='ml-0.5' />
                    </span>
                  </RepoModal>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'periodical'])),
    },
  };
}

export default PeriodicalIndexPage;
