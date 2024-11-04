export interface RankDataItem {
  [key: string]: string | number | boolean | undefined;
  name: string;
  position: number;
  rating: string;
  change: number;
  star?: string;
  percent?: boolean;
  total?: number;
  avatar?: string;
  uid?: string;
}

export interface RankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  data: RankDataItem[];
}

export interface NetcraftRankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  all_data: RankDataItem[];
  active_data: RankDataItem[];
}

export interface RankPageProps {
  month: number;
  year: number;
  monthList: number[];
  list: RankDataItem[];
}

export interface NetcraftRankPageProps {
  month: number;
  year: number;
  monthList: number[];
  all_list: RankDataItem[];
  active_list: RankDataItem[];
}
