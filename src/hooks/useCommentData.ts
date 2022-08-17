import { useEffect, useState } from 'react';

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const defaultValue = {
    comment: '',
    isUsed: false,
    score: 0,
    // 输入框高度
    height: 58,
  };
  const [commentData, setCommentData] = useState(defaultValue);

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
