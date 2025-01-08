import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { Category } from '@/types/periodical';

export const getCategory = async (
  ip: string,
  name: string,
  page: number,
  sortBy: string | null
): Promise<Category> => {
  const req: RequestInit = {
    headers: {
      'x-real-ip': ip,
      'x-forwarded-for': ip,
    },
  };

  try {
    const url = makeUrl(`/periodical/category/${encodeURIComponent(name)}`, {
      page: page > 1 ? page : null, // 仅当 page > 1 时添加该参数
      sort_by: sortBy ? sortBy : null,
    });
    const data = await fetcher<Category>(url, req);
    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
      category_name: '',
      page_total: 0,
      current_page: 0,
      total: 0,
    };
  }
};
