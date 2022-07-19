export interface PeriodicalPageProps {
  volume: VolumeType;
}

export interface VolumeType {
  pre_num: number;
  next_num: number;
  current_num: number;
  publish_at: string;
  data: VolumeCategory[];
}

export interface VolumeCategory {
  category_id: number;
  category_name: string;
  items: VolumeItem[];
}

export interface VolumeItem {
  rid: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  watch: number;
  image_url: string;
}
