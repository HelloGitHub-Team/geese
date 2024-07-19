import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { getTags } from '@/services/home';
import { isMobile } from '@/utils/util';

import { Tag } from '@/types/tag';

const useTagHandling = (tid: string, sort_by: string, i18n_lang: string) => {
  const router = useRouter();
  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [featuredURL, setFeaturedURL] = useState<string>('/?sort_by=featured');
  const [allURL, setAllURL] = useState<string>('/?sort_by=all');

  const handleTags = useCallback(async () => {
    const defaultTag = {
      name: '综合',
      tid: '',
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

  useEffect(() => {
    if (isMobile()) {
      handleTags();
    }
    if (tid) {
      setFeaturedURL(`/?sort_by=featured&tid=${tid}`);
      setAllURL(`/?sort_by=all&tid=${tid}`);
      setLabelStatus(true);
    } else {
      setFeaturedURL('/?sort_by=featured');
      setAllURL('/?sort_by=all');
      setLabelStatus(false);
    }
  }, [tid, handleTags]);

  return {
    labelStatus,
    setLabelStatus,
    tagItems,
    featuredURL,
    allURL,
    handleTagButton: () => {
      setLabelStatus((prev) => !prev);
      if (!labelStatus && sort_by === 'all') {
        router.push('/?sort_by=all');
      } else if (!labelStatus) {
        router.push('/');
      }
    },
  };
};

export default useTagHandling;
