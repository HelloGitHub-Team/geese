export interface RankDataItem {
  name: string;
  position: number;
  rating: string;
  change: null | number;
  star?: string;
  total?: number;
}

export interface RankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  data: RankDataItem[];
}

export interface RankPageProps {
  month: number;
  year: number;
  monthList: number[];
  list: string[];
}
