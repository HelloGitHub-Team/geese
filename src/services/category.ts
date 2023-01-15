import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { Category } from '@/types/periodical';

export const getCategory = async (
  ip: string,
  name: string,
  page: number
): Promise<Category> => {
  const req: RequestInit = {};
  req.headers = { 'x-real-ip': ip, 'x-forwarded-for': ip };

  try {
    let url;
    if (page > 1) {
      url = makeUrl(`/periodical/category/${name}?page=${page}`);
    } else {
      url = makeUrl(`/periodical/category/${name}`);
    }
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
