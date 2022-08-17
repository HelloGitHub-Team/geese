import { useEffect, useState } from 'react';

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const [commentData, setCommentData] = useState({
    comment: '',
    isUsed: false,
    score: 0,
    // 输入框高度
    height: 58,
  });

  useEffect(() => {
    setCommentData(JSON.parse(localStorage.getItem(storageKey) || '{}'));
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
