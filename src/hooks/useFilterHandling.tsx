import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { getTags } from '@/services/home';
import { constructURL, isMobile } from '@/utils/util';

import { RankItem } from '@/types/home';
import { Tag } from '@/types/tag';

const useFilterHandling = (
  tid: string | undefined,
  sort_by: string,
  rank_by: string,
  i18n_lang: string,
  year?: number,
  month?: number
) => {
  const router = useRouter();
  const [tagLabelStatus, setTagLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [featuredURL, setFeaturedURL] = useState<string>('/?sort_by=featured');
  const [allURL, setAllURL] = useState<string>('/?sort_by=all');
  const [monthlyURL, setMonthlyURL] = useState<string>('/?rank_by=montly');
  const [yearlyURL, setYearlyURL] = useState<string>('/?rank_by=yearly');
  const [rankItems, setRankItems] = useState<RankItem[]>([]);

  const generateRankItems = (mode: 'yearly' | 'monthly'): RankItem[] => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const rankItems: RankItem[] = [];

    for (let year = currentYear; year >= 2016; year--) {
      if (mode === 'yearly' && year < currentYear) {
        if (rankItems.length < 10) {
          rankItems.push({
            key: year.toString(),
            name: year.toString(),
            name_en: year.toString(),
            year,
          });
        }
      } else if (mode === 'monthly') {
        const startMonth = year === currentYear ? currentMonth - 1 : 12; // 如果是当前年份，从上个月开始
        const endMonth =
          year === currentYear
            ? 1
            : year === currentYear - 1
            ? currentMonth
            : 1;

        for (let month = startMonth; month >= endMonth; month--) {
          if (rankItems.length < 12) {
            rankItems.push({
              key: `${year}.${month}`,
              name: `${year}.${month}`,
              name_en: `${year}.${month}`,
              year,
              month,
            });
          } else {
            break; // 如果已经有 12 个项目了，就退出循环
          }
        }

        if (rankItems.length >= 12) {
          break; // 如果已经有 12 个项目了，就退出年份循环
        }
      }
    }
    return rankItems;
  };

  const handleRankButton = (rankName: string) => {
    if (rankName === 'monthly') {
      setRankItems(generateRankItems(rankName));
    } else if (rankName === 'yearly') {
      setRankItems(generateRankItems(rankName));
    } else {
      setRankItems([]);
    }
  };

  const handleTags = useCallback(async () => {
    const defaultTag = {
      name: '综合',
      tid: 'all',
      icon_name: 'find',
      name_en: 'All',
    };
    try {
      if (tagItems.length === 0) {
        const data = await getTags('rank');
        if (data?.data) {
          data.data.unshift(defaultTag);
          // 判断当前语言是否为英文，如果是英文则显示英文名称
          data.data.forEach((item) => {
            if (i18n_lang == 'en' && item.name_en !== null) {
              item.name = item.name_en;
            }
          });
          setTagItems(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, [tagItems, setTagItems]);

  const handleTagButton = () => {
    setTagLabelStatus(!tagLabelStatus);
    if (!tagLabelStatus && sort_by === 'all') {
      router.push('/?sort_by=all');
    } else if (!tagLabelStatus) {
      router.push('/');
    }
  };

  useEffect(() => {
    if (isMobile()) {
      handleTags();
    }
    setFeaturedURL(
      constructURL({ sort_by: 'featured', rank_by, tid, year, month })
    );
    setAllURL(constructURL({ sort_by: 'all', rank_by, tid, year, month }));
    setMonthlyURL(constructURL({ sort_by, rank_by: 'monthly', tid }));
    setYearlyURL(constructURL({ sort_by, rank_by: 'yearly', tid }));
    setTagLabelStatus(Boolean(tid));
    handleRankButton(rank_by);
  }, [tid, sort_by, rank_by, month, year, handleTags]);

  return {
    tagLabelStatus,
    setTagLabelStatus,
    tagItems,
    featuredURL,
    allURL,
    handleTagButton,
    monthlyURL,
    yearlyURL,
    rankItems,
  };
};

export default useFilterHandling;
