import { useState } from 'react';
import useSWR from 'swr';

import Message from '@/components/message';

import { fetcher } from '@/services/base';
import { makeUrl } from '@/utils/api';

import { Page } from '@/types/help';
import { FavoriteRes } from '@/types/reppsitory';
import { CollectItem } from '@/types/user';

// 获取用户的收藏夹列表
export const useFavoriteList = (
  uid: string
): {
  data?: FavoriteRes;
  mutate: any;
} => {
  const { data, error, mutate } = useSWR<FavoriteRes>(
    makeUrl(`/user/${uid}/favorite/`),
    fetcher
  );

  if (error) {
    Message.error(error.message || '获取收藏数据失败');
  }

  // const mockData = { "success": true, "data": [{ "fid": "wvieEdgDthVX7YB", "name": "Java", "description": "一个Java项目收藏夹2222", "uid": "test", "status": 0, "pv": 0, "uv": 0, "total": 1, "featured": false, "created_at": "2022-12-07T16:21:08", "updated_at": "2022-12-14T21:07:39", "publish_at": "2022-12-12T17:34:10" }, { "fid": "3VGQrayRlSZIUC6", "name": "React", "description": "一个React项目收藏夹", "uid": "test", "status": 0, "pv": 0, "uv": 0, "total": 0, "featured": false, "created_at": "2022-12-07T15:51:51", "updated_at": "2022-12-07T16:15:24", "publish_at": null }, { "fid": "hAzitH92LojBYbD", "name": "Vue", "description": "一个Vue项目收藏夹", "uid": "test", "status": 0, "pv": 0, "uv": 0, "total": 0, "featured": false, "created_at": "2022-12-07T15:13:54", "updated_at": "2022-12-07T15:13:54", "publish_at": null }, { "fid": "9TJIStQ4GLAPbCU", "name": "后端", "description": "一个后端项目收藏夹", "uid": "test", "status": 0, "pv": 0, "uv": 0, "total": 1, "featured": false, "created_at": "2022-12-07T15:12:23", "updated_at": "2022-12-07T15:12:23", "publish_at": null }, { "fid": "6ZkejwpM3a0KfDN", "name": "前端", "description": "一个前端项目收藏夹", "uid": "test", "status": 0, "pv": 0, "uv": 0, "total": 0, "featured": false, "created_at": "2022-12-07T14:20:48", "updated_at": "2022-12-07T14:20:48", "publish_at": null }], "in_person": true }

  return { data, mutate };
};

// 获取指定收藏夹的项目列表
export const useCollectionData = (uid: string, fid: string) => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<Page<CollectItem>>(
    uid
      ? makeUrl(`/user/${uid}/favorite/${fid}/?page=${page}&pageSize=10`)
      : null,
    fetcher
  );
  if (error) {
    Message.error(error.message || '获取收藏夹数据失败');
  }

  return {
    data,
    setPage,
  };
};
