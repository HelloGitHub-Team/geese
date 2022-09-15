import { useEffect, useState } from 'react';

import { DEFAULT_INITITAL_COMMENT_DATA } from '@/utils/constants';

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const [commentData, setCommentData] = useState(DEFAULT_INITITAL_COMMENT_DATA);

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) {
      setCommentData(JSON.parse(data));
    }
  }, []);

  const storeCommentData = (data: {
    comment: string;
    isUsed: boolean;
    score: number;
    height?: number;
  }) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setCommentData({ height: 58, ...data });
  };

  return {
    commentData,
    setCommentData: storeCommentData,
  };
}

export default useCommentData;
