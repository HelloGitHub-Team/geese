export interface RankDataItem {
  [key: string]: string | number | undefined;
  name: string;
  position: number;
  rating: string;
  change: number;
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
  list: RankDataItem[];
}
