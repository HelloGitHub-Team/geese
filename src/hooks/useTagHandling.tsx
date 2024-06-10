import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { getTags } from '@/services/home';
import { isMobile } from '@/utils/util';

import { Tag } from '@/types/tag';

const useTagHandling = (tid: string, sort_by: string) => {
  const router = useRouter();
  const [labelStatus, setLabelStatus] = useState(false);
  const [tagItems, setTagItems] = useState<Tag[]>([]);
  const [featuredURL, setFeaturedURL] = useState<string>('/?sort_by=featured');
  const [allURL, setAllURL] = useState<string>('/?sort_by=all');

  const handleTags = useCallback(async () => {
    try {
      if (tagItems.length === 0) {
        const data = await getTags('rank');
        if (data?.data) {
          data.data.unshift({
            name: 'All',
            tid: '',
            icon_name: '',
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
