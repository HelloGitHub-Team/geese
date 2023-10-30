import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { BaseType } from '@/types/repository';
import { PortalTagGroup, SelectTagItems, TagItems, TagPage } from '@/types/tag';

export const getTagPageItems = async (
  ip: string,
  tid: string
): Promise<TagPage> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  const data = await fetcher<TagPage>(makeUrl(`/tag/${tid}`), req);
  return data;
};

// 获取首页展示的标签
export const getTags = async (): Promise<TagItems> => {
  const result = await fetcher<TagItems>(makeUrl('/tag/'));
  return result;
};

// 获取所有标签并包含选择状态
export const getSelectTags = async (): Promise<SelectTagItems> => {
  const result = await fetcher<SelectTagItems>(makeUrl('/tag/select/'));
  return result;
};

export const saveSelectTags = async (tids: any) => {
  const result = await fetcher<BaseType>(makeUrl('/tag/select/save'), {
    method: 'POST',
    body: JSON.stringify({ tids: tids }),
  });
  return result;
};

export const getPortalTagGroups = async (): Promise<PortalTagGroup[]> => {
  const virtualGetGroups = () =>
    new Promise<PortalTagGroup[]>((resolve) => {
      setTimeout(() => {
        const virtualData: PortalTagGroup[] = [
          {
            groupName: '应用',
            tags: [
              {
                name: 'AI',
                tid: 'juBLV86qa5',
                icon_name: 'ai',
              },
              {
                name: '算法',
                tid: 'op63PzUDMg',
                icon_name: 'algo',
              },
              {
                name: '游戏',
                tid: 'WxuLqCrUNF',
                icon_name: 'game',
              },
              {
                name: '测试',
                tid: 'zL2XCsjtaT',
                icon_name: 'test',
              },
              {
                name: '桌面应用',
                tid: 'dFA60uKLgr',
                icon_name: 'desktop',
              },

              {
                name: '爬虫',
                tid: 'VEStDvRymX',
                icon_name: 'spider',
              },
              {
                name: '安全',
                tid: 'O0WvqsDoQn',
                icon_name: 'safe',
              },
              {
                name: 'Android',
                tid: 'K6zi0nOJrt',
                icon_name: 'android',
              },
              {
                name: 'CLI',
                tid: 'WTbsu5GAfC',
                icon_name: 'terminal',
              },
              {
                name: '数据库',
                tid: 'TLdxMp1KUR',
                icon_name: 'database',
              },
              {
                name: 'Web 应用',
                tid: '4lpGK0sUyk',
                icon_name: 'web',
              },
            ],
          },
          {
            groupName: '编程语言',
            tags: [
              {
                name: 'Python',
                tid: 'Z8PipJsHCX',
                icon_name: 'python',
              },
              {
                name: 'Java',
                tid: 'YgDkvUzLAC',
                icon_name: 'java',
              },
              {
                name: 'C++',
                tid: 'yrZkGsUC9M',
                icon_name: 'cplusplus',
              },
              {
                name: 'JavaScript',
                tid: 'x3YH09wlKN',
                icon_name: 'javascript',
              },
              {
                name: 'Rust',
                tid: 'D4JBAUo967',
                icon_name: 'rust',
              },
              {
                name: 'Go',
                tid: 'rBc3FpsHhv',
                icon_name: 'golang',
              },
              {
                name: 'Linux',
                tid: 'CSREdui59W',
                icon_name: 'linux',
              },
              {
                name: 'Swift',
                tid: '6M5awPVbZ2',
                icon_name: 'swift',
              },

              {
                name: 'TypeScript',
                tid: 'IhK7Wm1AFE',
                icon_name: 'typescript',
              },
              {
                name: 'C#',
                tid: 'vgsjNFZCU9',
                icon_name: 'csharp',
              },

              {
                name: 'C',
                tid: 'YQHn0gERoi',
                icon_name: 'c',
              },
              {
                name: 'Kotlin',
                tid: '1FtnlAX0ag',
                icon_name: 'kotlin',
              },
            ],
          },
          {
            groupName: '其他',
            tags: [
              {
                name: '教程',
                tid: '0LByh3tjUO',
                icon_name: 'tutorial',
              },
              {
                name: '书籍',
                tid: 'HtYZoqApyV',
                icon_name: 'book',
              },
              {
                name: '效率工具',
                tid: '0nLs6AVopy',
                icon_name: 'tool',
              },
              {
                name: '集合',
                tid: 'ZiPGhjYzSN',
                icon_name: 'collection',
              },
            ],
          },
        ];
        resolve(virtualData);
      }, 50);
    });
  return await virtualGetGroups();
};

export const getEffectedTags = async (): Promise<string[]> => {
  const virtualGetTagIdList = () =>
    new Promise<string[]>((resolve) => {
      setTimeout(() => {
        const virtualIdList: string[] = [
          'YgDkvUzLAC',
          'x3YH09wlKN',
          'IhK7Wm1AFE',
          'WxuLqCrUNF',
        ];
        resolve(virtualIdList);
      }, 50);
    });
  return await virtualGetTagIdList();
};
