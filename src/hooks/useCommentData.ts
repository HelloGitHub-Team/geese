import { useEffect, useState } from 'react';

import { DEFAULT_INITITAL_COMMENT_DATA } from '@/utils/constants';

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const [commentData, setCommentData] = useState(DEFAULT_INITITAL_COMMENT_DATA);

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const cacheData = JSON.parse(data);
      if (cacheData.comment) {
        // 只缓存评论内容和匹配高度，其它值为默认
        setCommentData({
          isUsed: false,
          score: 5,
          comment: cacheData.comment,
          height: cacheData.height,
        });
      }
    }
  }, []);

  const storeCommentData = (data: {
    comment: string;
    isUsed: boolean;
    score: number;
    height?: number;
  }) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        comment: data.comment,
        height: data.height ? data.height : 58,
      })
    );
    setCommentData({ height: 58, ...data });
  };

  return {
    commentData,
    setCommentData: storeCommentData,
  };
}

export default useCommentData;
