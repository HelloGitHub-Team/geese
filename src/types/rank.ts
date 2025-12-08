export interface RankDataItem {
  [key: string]: string | number | boolean | undefined;
  name: string;
  position: number;
  rating: string | number;
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

// 大模型榜单
export interface LMArenaRankDataItem extends RankDataItem {
  model_id: string;
  organization: string;
}

export interface LMArenaRankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  category: string;
  category_list: string[];
  data: LMArenaRankDataItem[];
}

export interface LMArenaRankPageProps {
  month: number;
  year: number;
  monthList: number[];
  category: string;
  categoryList: string[];
  list: LMArenaRankDataItem[];
}
