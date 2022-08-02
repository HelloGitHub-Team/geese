import { useEffect, useState } from 'react';

function useCommentData() {
  const storageKey = 'COMMENT_DATA';
  const [commentData, setCommentData] = useState({
    comment: '',
    isUsed: false,
    score: 0,
  });

  useEffect(() => {
    setCommentData(JSON.parse(localStorage.getItem(storageKey) || '{}'));
  }, []);

  const storeCommentData = (data: {
    comment: string;
    isUsed: boolean;
    score: number;
  }) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setCommentData(data);
  };

  return {
    commentData,
    setCommentData: storeCommentData,
  };
}

export default useCommentData;
