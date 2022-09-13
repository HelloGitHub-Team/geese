export interface RankDataItem {
  name: string;
  position: number;
  rating: string;
  change: null | number;
  star: string;
}
export interface RankData {
  success: boolean;
  month: number;
  year: number;
  month_list: number[];
  data: RankDataItem[];
}
