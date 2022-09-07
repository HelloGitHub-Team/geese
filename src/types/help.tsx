export interface HelpPageProps {
  content: string;
}

export interface Page<T> {
  /** 第几页 */
  page: number;
  /** 每页返回的个数 */
  pageSize: number;
  /** 是否还有下一页 */
  has_more: boolean;
  /** 总共的页数 */
  page_total: number;
  /** 总共有多少数据 */
  total: number;
  /** 每一条数据详情 */
  data: T[];
}
