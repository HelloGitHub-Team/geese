import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { CategoryType } from '@/types/periodical';

export const getCategory = async (
  name: string,
  page: number
): Promise<CategoryType> => {
  try {
    let url;
    if (page > 1) {
      url = makeUrl(`/periodical/category/${name}?page=${page}`);
    } else {
      url = makeUrl(`/periodical/category/${name}`);
    }
    const data = await fetcher<CategoryType>(url);
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
